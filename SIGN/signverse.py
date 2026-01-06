# stable_asl_detector_final.py  # Final Balanced-Strict ASL detector (10 gestures)
import cv2
import mediapipe as mp
import time
import os
from collections import deque, defaultdict
import math

# ---------------- CONFIG ----------------
AUDIO_FOLDER = "."          # <<<<< FIXED HERE
MOV_BUF_LEN = 28
VOTE_LEN = 12
CONFIRM_SECONDS = 0.9
OVERLAY_SHOW = 2.0
SMOOTH_ALPHA = 0.42

THUMB_INDEX_CLOSE = 0.12
TIP_TO_TIP_CLOSE = 0.09
PALM_WIDTH_STOP = 0.18
HELLO_WAVE_AMPL = 0.09
YES_NOD_THRESH = 0.02
HELP_WRIST_DIST = 0.20
CROSS_TIP_CLOSE = 0.035
TWO_HAND_STOP_WRIST_DIST = 0.40

FACE_SCALE_NORM = 0.9  # used to scale ear proximity threshold

GESTURE_AUDIO = {
    "HELLO": "hello.mp3",
    "THANK_YOU": "thankyou.mp3",
    "PLEASE": "please.mp3",
    "SORRY": "sorry.mp3",
    "I_LOVE_YOU": "love.mp3",
    "YES": "yes.mp3",
    "NO": "no.mp3",
    "STOP": "stop.mp3",
    "HELP": "help.mp3",
    "GOOD_LUCK": "goodluck.mp3"
}

# ---------------- init mediapipe ----------------
mp_hands = mp.solutions.hands
mp_face = mp.solutions.face_mesh
mp_drawing = mp.solutions.drawing_utils

hands = mp_hands.Hands(
    max_num_hands=2,
    min_detection_confidence=0.65,
    min_tracking_confidence=0.5
)

try:
    face_mesh = mp_face.FaceMesh(
        max_num_faces=1,
        min_detection_confidence=0.6,
        min_tracking_confidence=0.5
    )
    print("FaceMesh initialized.")
except:
    face_mesh = None
    print("FaceMesh not available.")

# Optional audio
try:
    import pygame
    pygame.mixer.init()
    AUDIO_AVAILABLE = True
except:
    AUDIO_AVAILABLE = False
    print("Audio not available.")

def play_sound_file(path):
    """Low-level: play audio file path if available."""
    if not AUDIO_AVAILABLE:
        return
    if os.path.exists(path):
        try:
            pygame.mixer.music.load(path)
            pygame.mixer.music.play()
        except:
            pass

# ---------------- helpers ----------------
def dist_xy(a, b):
    return math.hypot(a.x - b.x, a.y - b.y)

def finger_up(lm, tip, pip):
    return lm[tip].y < lm[pip].y

def palm_width_est(lm):
    xs = [lm[8].x, lm[12].x, lm[20].x]
    return max(xs) - min(xs)

def is_palm_open(lm):
    return (finger_up(lm, 8, 6) and finger_up(lm, 12, 10) and
            finger_up(lm, 16, 14) and finger_up(lm, 20, 18))

def is_fist(lm):
    return ((not finger_up(lm, 8, 6)) and (not finger_up(lm, 12, 10)) and
            (not finger_up(lm, 16, 14)) and (not finger_up(lm, 20, 18)))

def thumb_up(lm):
    other_folded = ((not finger_up(lm, 8, 6)) and (not finger_up(lm, 12, 10)) and
                    (not finger_up(lm, 16, 14)) and (not finger_up(lm, 20, 18)))
    try:
        return other_folded and (lm[4].y < lm[3].y)
    except:
        return other_folded

def thumb_down(lm):
    other_folded = ((not finger_up(lm, 8, 6)) and (not finger_up(lm, 12, 10)) and
                    (not finger_up(lm, 16, 14)) and (not finger_up(lm, 20, 18)))
    try:
        return other_folded and (lm[4].y > lm[3].y)
    except:
        return other_folded

# ---------------- buffers ----------------
movement_bufs = defaultdict(lambda: deque(maxlen=MOV_BUF_LEN))
smoothed_wrist = {}
global_vote_buf = deque(maxlen=VOTE_LEN)

# overlay state
confirmed = None
overlay_text = ""
overlay_until = 0
last_confirm_time = 0

last_seen = None
last_seen_time = 0

# track last audio played to avoid repeats
last_audio_played = None

# ---------------- simple text drawer ----------------
def draw_text(frame, text, pos, color, size):
    cv2.putText(frame, text, pos, cv2.FONT_HERSHEY_SIMPLEX,
                size / 40, color, 2)
    return frame

# ---------------- gesture detection core ----------------
def fingers_state_quick(lm):
    state = {}
    try:
        state["thumb"] = lm[4].x < lm[3].x
    except:
        state["thumb"] = lm[4].y < lm[3].y
    state["index"] = finger_up(lm, 8, 6)
    state["middle"] = finger_up(lm, 12, 10)
    state["ring"]   = finger_up(lm, 16, 14)
    state["pinky"]  = finger_up(lm, 20, 18)
    return state

def detect_final_gesture(multi_hands, handedness, face_lms):
    if not multi_hands:
        return None

    hand_infos = []
    for i, hl in enumerate(multi_hands):
        label = None
        if handedness and i < len(handedness):
            try:
                label = handedness[i].classification[0].label
            except:
                label = None

        key = f"{label}{i}" if label else f"hand{i}"
        lm = hl.landmark

        # wrist smoothing
        wx, wy = lm[0].x, lm[0].y
        if key in smoothed_wrist:
            sx, sy = smoothed_wrist[key]
            sx = SMOOTH_ALPHA * wx + (1 - SMOOTH_ALPHA) * sx
            sy = SMOOTH_ALPHA * wy + (1 - SMOOTH_ALPHA) * sy
            smoothed_wrist[key] = (sx, sy)
        else:
            smoothed_wrist[key] = (wx, wy)
            sx, sy = wx, wy

        movement_bufs[key].append((sx, sy))
        hand_infos.append({"key": key, "lm": lm, "label": label})

    candidates = []

    # ---------------- TWO-HAND PRIORITY ----------------
    if len(hand_infos) >= 2:
        la = hand_infos[0]["lm"]
        lb = hand_infos[1]["lm"]

        # STOP (two open palms near each other)
        if is_palm_open(la) and is_palm_open(lb):
            d = dist_xy(la[0], lb[0])
            if d < TWO_HAND_STOP_WRIST_DIST and abs(la[0].y - lb[0].y) < 0.08:
                return "STOP"

        # HELP (one fist + one palm open near)
        for a in hand_infos:
            for b in hand_infos:
                if a["key"] == b["key"]:
                    continue
                la_h = a["lm"]; lb_h = b["lm"]
                if is_fist(la_h) and is_palm_open(lb_h):
                    if dist_xy(la_h[0], lb_h[0]) < HELP_WRIST_DIST * 1.6:
                        return "HELP"
                if is_fist(lb_h) and is_palm_open(la_h):
                    if dist_xy(la_h[0], lb_h[0]) < HELP_WRIST_DIST * 1.6:
                        return "HELP"

        # --------- UPDATED SORRY DETECTION (both fists near ears) ---------
        def hands_both_fists():
            return is_fist(la) and is_fist(lb)

        sorry_detected = False

        if face_lms:
            try:
                left_eye = face_lms.landmark[33]
                right_eye = face_lms.landmark[263]
                left_ear = face_lms.landmark[234]
                right_ear = face_lms.landmark[454]
                face_scale = dist_xy(left_eye, right_eye)
                if face_scale <= 0:
                    face_scale = 0.06
                ear_threshold = FACE_SCALE_NORM * face_scale * 1.6
                wrist1 = la[0]
                wrist2 = lb[0]
                d1 = min(dist_xy(wrist1, left_ear), dist_xy(wrist1, right_ear))
                d2 = min(dist_xy(wrist2, left_ear), dist_xy(wrist2, right_ear))
                if hands_both_fists() and (d1 < ear_threshold and d2 < ear_threshold):
                    sorry_detected = True
            except Exception:
                sorry_detected = False

        if not sorry_detected:
            try:
                if hands_both_fists():
                    cond1 = la[0].y < 0.45 and lb[0].y < 0.45
                    cond2 = abs(la[0].x - lb[0].x) > 0.05 and abs(la[0].x - lb[0].x) < 0.5
                    cond3 = 0.05 < la[0].x < 0.95 and 0.05 < lb[0].x < 0.95
                    if cond1 and cond2 and cond3:
                        sorry_detected = True
            except:
                sorry_detected = False

        if sorry_detected:
            return "SORRY"

        return None

    # ---------------- SINGLE HAND DETECTION ----------------
    h = hand_infos[0]
    lm = h["lm"]
    key = h["key"]
    s = fingers_state_quick(lm)
    buf = movement_bufs[key]
    xs = [p[0] for p in buf]
    ys = [p[1] for p in buf]

    # I_LOVE_YOU
    if s["thumb"] and s["index"] and not s["middle"] and not s["ring"] and s["pinky"]:
        if dist_xy(lm[8], lm[20]) > 0.05:
            candidates.append("I_LOVE_YOU")

    # GOOD_LUCK
    try:
        idx = lm[8]; mid = lm[12]
        pip_idx = lm[6]; pip_mid = lm[10]
        tips_close = abs(idx.x - mid.x) < CROSS_TIP_CLOSE and abs(idx.y - mid.y) < 0.06
        cross_hint = ((idx.x - pip_idx.x) * (mid.x - pip_mid.x) < 0)
        if tips_close and cross_hint:
            candidates.append("GOOD_LUCK")
    except:
        pass

    # THANK YOU
    if s["index"] and s["middle"]:
        mouth_near = False
        if face_lms:
            try:
                mouth = face_lms.landmark[13]
                if dist_xy(lm[8], mouth) < 0.12:
                    mouth_near = True
            except:
                pass
        else:
            if lm[0].y < 0.45:
                mouth_near = True
        if mouth_near:
            candidates.append("THANK_YOU")

    # PLEASE
    if is_palm_open(lm):
        chest_near = False
        if face_lms:
            try:
                chest_y = (face_lms.landmark[152].y + face_lms.landmark[1].y)/2
                if lm[0].y > chest_y + 0.05:
                    chest_near = True
            except:
                pass
        else:
            if lm[0].y > 0.45:
                chest_near = True

        if chest_near:
            buf_y = [p[1] for p in movement_bufs[key]]
            if buf_y and (max(buf_y) - min(buf_y)) > 0.02:
                candidates.append("PLEASE")

    # HELLO
    if is_palm_open(lm):
        if len(buf) >= MOV_BUF_LEN and (max(xs) - min(xs)) > HELLO_WAVE_AMPL:
            candidates.append("HELLO")

    # YES
    if thumb_up(lm):
        candidates.append("YES")

    # NO
    if thumb_down(lm):
        candidates.append("NO")

    # priority selection
    priority = [
        "SORRY",  # highest priority
        "I_LOVE_YOU", "GOOD_LUCK", "THANK_YOU", "PLEASE",
        "HELLO", "YES", "NO"
    ]
    for p in priority:
        if p in candidates:
            return p

    return None

# ---------------- main loop ----------------
cap = cv2.VideoCapture(0)
print("ASL detector running.")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # face
    face_lms = None
    if face_mesh:
        try:
            fres = face_mesh.process(rgb)
            if fres.multi_face_landmarks:
                face_lms = fres.multi_face_landmarks[0]
        except:
            pass

    # hands
    res = hands.process(rgb)
    multi_hands = res.multi_hand_landmarks or []
    multi_handedness = res.multi_handedness or []

    # draw debug
    for hl in multi_hands:
        mp_drawing.draw_landmarks(
            frame, hl, mp_hands.HAND_CONNECTIONS,
            mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=1, circle_radius=2),
            mp_drawing.DrawingSpec(color=(255, 0, 0), thickness=1)
        )

    # detect
    cand = detect_final_gesture(multi_hands, multi_handedness, face_lms)

    now = time.time()

    # ------------- SPECIAL: NO HANDS = CLEAR UI -------------
    if cand is None and len(multi_hands) == 0:
        confirmed = None
        overlay_text = ""
        overlay_until = 0
        last_seen = None
        last_seen_time = 0
        global_vote_buf.clear()
        last_audio_played = None

        cv2.rectangle(frame, (6, 6), (540, 46), (0, 0, 0), -1)
        cv2.putText(frame, "", (12, 34), cv2.FONT_HERSHEY_SIMPLEX, 0.9,
                    (255, 255, 255), 2)

        cv2.imshow("ASL Detector (final)", frame)

        k = cv2.waitKey(1) & 0xFF
        if k == ord('q') or k == 27:
            break
        continue
    # --------------------------------------------------------

    # voting buffer
    global_vote_buf.append(cand)
    votes = [v for v in global_vote_buf if v is not None]
    candidate_confirmed = None

    if votes:
        counts = {}
        for v in votes:
            counts[v] = counts.get(v, 0) + 1
        voted, topcount = max(counts.items(), key=lambda x: x[1])
        if topcount >= (VOTE_LEN // 2 + 1):
            candidate_confirmed = voted

    # stable confirmation logic
    if confirmed is None:
        if candidate_confirmed and candidate_confirmed == last_seen:
            if last_seen_time == 0:
                last_seen_time = now
            elif (now - last_seen_time) >= CONFIRM_SECONDS:
                confirmed = candidate_confirmed
                overlay_text = confirmed
                overlay_until = now + OVERLAY_SHOW
                print("Detected:", confirmed)
                if confirmed and confirmed != last_audio_played:
                    p = os.path.join(AUDIO_FOLDER, GESTURE_AUDIO.get(confirmed, ""))
                    play_sound_file(p)
                    last_audio_played = confirmed
        else:
            if candidate_confirmed != last_seen:
                last_seen = candidate_confirmed
                last_seen_time = now
    else:
        if candidate_confirmed and candidate_confirmed != confirmed:
            if candidate_confirmed == last_seen:
                if last_seen_time == 0:
                    last_seen_time = now
                elif (now - last_seen_time) >= CONFIRM_SECONDS:
                    confirmed = candidate_confirmed
                    overlay_text = confirmed
                    overlay_until = now + OVERLAY_SHOW
                    print("Switched:", confirmed)
                    if confirmed and confirmed != last_audio_played:
                        p = os.path.join(AUDIO_FOLDER, GESTURE_AUDIO.get(confirmed, ""))
                        play_sound_file(p)
                        last_audio_played = confirmed
                    global_vote_buf.clear()
            else:
                last_seen = candidate_confirmed
                last_seen_time = now

    # overlay
    if overlay_text and time.time() <= overlay_until:
        text = overlay_text
    else:
        text = confirmed if confirmed else (f"Detecting: {last_seen}" if last_seen else "")

    # draw banner
    cv2.rectangle(frame, (6, 6), (540, 46), (0, 0, 0), -1)
    cv2.putText(frame, text, (12, 34), cv2.FONT_HERSHEY_SIMPLEX,
                0.9, (255, 255, 255), 2)

    cv2.imshow("ASL Detector (final)", frame)

    k = cv2.waitKey(1) & 0xFF
    if k == ord('q') or k == 27:
        break

cap.release()
cv2.destroyAllWindows()
