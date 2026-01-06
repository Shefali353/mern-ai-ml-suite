# Save this as virtual_mouse_with_eye_capture_fix.py
import cv2
import mediapipe as mp
import pyautogui
import math
from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume
from ctypes import cast, POINTER
import comtypes
import time
import numpy as np
from datetime import datetime
import os
import winsound   # Windows system sound

# NEW imports for voice
import speech_recognition as sr
import webbrowser
import threading
import sys
import urllib.parse
import subprocess
import pyttsx3  # TTS for Jarvis replies

# -------- CONFIG ----------
SMOOTHING = 0.2
PINCH_THRESHOLD = 0.04
VOL_STEP = 0.05
OVERLAY_DURATION = 1.2
OVERLAY_WIDTH = 320
OVERLAY_HEIGHT = 55

# Eye blink config
EYE_AR_THRESH = 0.18       # EAR below this => eye closed (tune if needed)
EYE_CLOSE_TIME = 2.0       # seconds eyes must stay closed to trigger capture
CAPTURE_SHOW = 1.8         # seconds to show "Captured" overlay (unused now)

# UI tuning
MODE_BOX_ALPHA = 0.9
MODE_BOX_COLOR = (20, 20, 20)
MODE_TEXT_COLOR_ON = (0, 220, 100)
MODE_TEXT_COLOR_OFF = (200, 200, 200)

CLICK_TEXT_POS = (12, 440)
NO_HAND_POS = (12, 460)
MODE_BOX_Y = 60
# --------------------------

pyautogui.FAILSAFE = False
screen_w, screen_h = pyautogui.size()

# ---- Audio Setup (unchanged) ----
devices = AudioUtilities.GetSpeakers()
interface = devices.Activate(IAudioEndpointVolume._iid_, comtypes.CLSCTX_ALL, None)
volume = cast(interface, POINTER(IAudioEndpointVolume))

try:
    current_vol = volume.GetMasterVolumeLevelScalar()
except Exception:
    lvl = volume.GetMasterVolumeLevel()
    current_vol = min(max((lvl + 65) / 65.0, 0.0), 1.0)

# MediaPipe setup
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False,
                       max_num_hands=1,
                       min_detection_confidence=0.6,
                       min_tracking_confidence=0.6)
mp_draw = mp.solutions.drawing_utils

mp_face = mp.solutions.face_mesh
face_mesh = mp_face.FaceMesh(static_image_mode=False,
                             max_num_faces=1,
                             refine_landmarks=True,
                             min_detection_confidence=0.5,
                             min_tracking_confidence=0.5)

cap = cv2.VideoCapture(0)
prev_x, prev_y = 0, 0
last_vol_change_time = 0.0
show_overlay = False
volume_mode = False
mode_text_time = 0.0
mode_last = None  # remembers whether last toggle was 'v' or 'e' or 'j'

# Eye mode variables
eye_mode = False
eye_closed_start = None
last_capture_time = 0.0
last_saved_path = None

# Voice mode variables
voice_mode = False
voice_thread = None
voice_stop_event = None

# Initialize TTS engine (pyttsx3)
try:
    tts_engine = pyttsx3.init()
    # mild rate adjustment (optional)
    rate = tts_engine.getProperty('rate')
    tts_engine.setProperty('rate', max(120, rate - 10))
except Exception:
    tts_engine = None

def speak_text(s):
    """Speak using pyttsx3 if available, else just print."""
    if tts_engine:
        try:
            tts_engine.say(s)
            tts_engine.runAndWait()
        except Exception:
            try:
                print("Jarvis:", s)
            except:
                pass
    else:
        print("Jarvis:", s)

# Helper UI funcs
def draw_rounded_rect(img, top_left, bottom_right, color, radius=12, thickness=-1):
    x1, y1 = top_left; x2, y2 = bottom_right
    cv2.rectangle(img, (x1+radius, y1), (x2-radius, y2), color, thickness)
    cv2.rectangle(img, (x1, y1+radius), (x2, y2-radius), color, thickness)
    cv2.circle(img, (x1+radius, y1+radius), radius, color, thickness)
    cv2.circle(img, (x2-radius, y1+radius), radius, color, thickness)
    cv2.circle(img, (x1+radius, y2-radius), radius, color, thickness)
    cv2.circle(img, (x2-radius, y2-radius), radius, color, thickness)

def show_volume_overlay(frame, scalar_vol, kind_text="Volume"):
    h, w, _ = frame.shape
    ow, oh = OVERLAY_WIDTH, OVERLAY_HEIGHT
    x = int((w - ow) / 2)
    y = int(h - oh - 90)
    overlay = frame.copy()
    draw_rounded_rect(overlay, (x, y), (x+ow, y+oh), (30,30,30), radius=12)
    bar_x1 = x + 55; bar_x2 = x + ow - 70; bar_y = y + 18; bar_h = 14
    cv2.rectangle(overlay, (bar_x1, bar_y), (bar_x2, bar_y + bar_h), (150,150,150), 1)
    fill_w = int((bar_x2 - bar_x1 - 4) * float(scalar_vol))
    cv2.rectangle(overlay, (bar_x1+2, bar_y+2), (bar_x1+2+fill_w, bar_y+bar_h-2), (240,240,240), -1)
    percent = int(scalar_vol * 100)
    cv2.putText(overlay, f"{percent}%", (x + ow - 75, y + 35), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255,255,255), 3)
    cv2.addWeighted(overlay, 0.92, frame, 1 - 0.92, 0, frame)

def draw_mode_box(frame, text, on=True):
    h, w, _ = frame.shape
    box_w, box_h = 480, 34
    x = int((w - box_w) / 2); y = MODE_BOX_Y
    overlay = frame.copy()
    draw_rounded_rect(overlay, (x, y), (x+box_w, y+box_h), MODE_BOX_COLOR, radius=10)
    cv2.addWeighted(overlay, MODE_BOX_ALPHA, frame, 1 - MODE_BOX_ALPHA, 0, frame)
    col = MODE_TEXT_COLOR_ON if on else MODE_TEXT_COLOR_OFF
    cv2.putText(frame, text, (x+14, y+22), cv2.FONT_HERSHEY_SIMPLEX, 0.65, col, 2)

# EAR indices (MediaPipe)
RIGHT_EYE_IDX = [33, 160, 158, 133, 153, 144]
LEFT_EYE_IDX  = [362, 385, 387, 263, 373, 380]

def eye_aspect_ratio(landmarks, eye_idx, img_w, img_h):
    p1 = np.array([landmarks[eye_idx[0]].x * img_w, landmarks[eye_idx[0]].y * img_h])
    p2 = np.array([landmarks[eye_idx[1]].x * img_w, landmarks[eye_idx[1]].y * img_h])
    p3 = np.array([landmarks[eye_idx[2]].x * img_w, landmarks[eye_idx[2]].y * img_h])
    p4 = np.array([landmarks[eye_idx[3]].x * img_w, landmarks[eye_idx[3]].y * img_h])
    p5 = np.array([landmarks[eye_idx[4]].x * img_w, landmarks[eye_idx[4]].y * img_h])
    p6 = np.array([landmarks[eye_idx[5]].x * img_w, landmarks[eye_idx[5]].y * img_h])
    vert1 = np.linalg.norm(p2 - p6)
    vert2 = np.linalg.norm(p3 - p5)
    horiz = np.linalg.norm(p1 - p4)
    if horiz == 0:
        return 0.0
    ear = (vert1 + vert2) / (2.0 * horiz)
    return ear

# Function to save screenshot to Desktop (or cwd fallback) and beep
def save_screenshot_and_beep():
    global last_saved_path
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    fname = f"screenshot_{timestamp}.png"
    # try Desktop first
    try:
        desk = os.path.join(os.path.expanduser("~"), "Desktop")
        if not os.path.isdir(desk):
            raise Exception("No Desktop")
        path = os.path.join(desk, fname)
    except Exception:
        path = os.path.join(os.getcwd(), fname)
    # save
    try:
        img = pyautogui.screenshot()
        img.save(path)
        print("Saved screenshot:", path)
        last_saved_path = path
        # beep
        try:
            winsound.MessageBeep(winsound.MB_OK)
        except Exception:
            try:
                winsound.Beep(1000, 150)
            except:
                pass
        return path
    except Exception as e:
        print("Failed saving screenshot:", e)
        return None

# ----------------- VOICE HANDLER (IMPROVED MATCHING + TTS REPLIES) -----------------
def process_voice_command(text):
    txt = text.lower().strip()
    print("[VOICE HEARD]", txt)

    if "jarvis" not in txt:
        return

    parts = txt.split("jarvis", 1)
    remainder = parts[1].strip() if len(parts) > 1 else ""

    def open_url(url):
        try:
            webbrowser.open(url)
            return
        except Exception as e:
            print("webbrowser.open failed:", e)
        if os.name == 'nt':
            possible = [
                r"C:\Program Files\Google\Chrome\Application\chrome.exe",
                r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
            ]
            for p in possible:
                if os.path.isfile(p):
                    try:
                        subprocess.Popen([p, url])
                        return
                    except Exception:
                        pass
        try:
            os.startfile(url)
        except Exception:
            pass

    # NEW: Added facebook, github, and file explorer commands
    # Functional commands (keywords anywhere)
    if "open" in remainder and "chrome" in remainder:
        print("COMMAND -> open chrome (opening default browser to google)")
        open_url("https://www.google.com")
    elif "open" in remainder and "youtube" in remainder:
        print("COMMAND -> open youtube")
        open_url("https://www.youtube.com")
    elif "open" in remainder and "whatsapp" in remainder:
        print("COMMAND -> open whatsapp web")
        open_url("https://web.whatsapp.com")
    elif "open" in remainder and "gmail" in remainder:
        print("COMMAND -> open gmail")
        open_url("https://mail.google.com")
    elif "open" in remainder and "facebook" in remainder:
        print("COMMAND -> open facebook")
        open_url("https://www.facebook.com")
    elif "open" in remainder and "github" in remainder:
        print("COMMAND -> open github")
        open_url("https://www.github.com")
    elif "open" in remainder and "file explorer" in remainder:
        print("COMMAND -> open file explorer")
        try:
            if os.name == 'nt':
                os.startfile("explorer.exe")
            else:
                subprocess.Popen(["xdg-open", os.path.expanduser("~")])
            speak_text("Opening File Explorer")
        except Exception as e:
            print("Failed to open file explorer:", e)
            speak_text("Failed to open File Explorer")
    elif remainder.startswith("search ") or ("search" in remainder and len(remainder.split())>1):
        idx = remainder.find("search")
        query = remainder[idx+len("search"):].strip()
        if query:
            q = urllib.parse.quote_plus(query)
            print("COMMAND -> search:", query)
            open_url(f"https://www.google.com/search?q={q}")
    elif remainder.startswith("play ") or ("play" in remainder and len(remainder.split())>1):
        idx = remainder.find("play")
        query = remainder[idx+len("play"):].strip()
        if query:
            q = urllib.parse.quote_plus(query)
            print("COMMAND -> play (YouTube search):", query)
            open_url(f"https://www.youtube.com/results?search_query={q}")
    # support both "shutdown" and "shut down"
    elif ("shutdown" in remainder and "system" in remainder) or ("shut down" in remainder and "system" in remainder):
        print("COMMAND -> shutdown system")
        try:
            if os.name == 'nt':
                os.system("shutdown /s /t 1")
            else:
                os.system("shutdown -h now")
        except Exception as e:
            print("Failed to shutdown:", e)

def voice_listener_loop(stop_event):
    r = sr.Recognizer()
    r.dynamic_energy_threshold = True
    r.pause_threshold = 0.6
    r.operation_timeout = None

    try:
        with sr.Microphone() as source:
            try:
                print("Adjusting for ambient noise... please be quiet for 1s")
                r.adjust_for_ambient_noise(source, duration=1.0)
            except Exception:
                pass
    except Exception as e:
        print("Microphone not available (start):", e)
        return

    print("Voice listener started — listening for 'Jarvis' commands.")
    while not stop_event.is_set():
        try:
            with sr.Microphone() as source:
                try:
                    audio = r.listen(source, timeout=4, phrase_time_limit=6)
                except sr.WaitTimeoutError:
                    continue
                if audio is None:
                    continue
                try:
                    text = r.recognize_google(audio)
                    process_voice_command(text)
                except sr.UnknownValueError:
                    continue
                except sr.RequestError as e:
                    print("Speech recognition request failed:", e)
                    time.sleep(0.5)
                    continue
        except Exception as e:
            print("Voice listener error (loop):", e)
            time.sleep(0.5)
    print("Voice listener stopped.")

def start_voice_listener():
    global voice_thread, voice_stop_event
    if voice_thread and voice_thread.is_alive():
        return
    voice_stop_event = threading.Event()
    voice_thread = threading.Thread(target=voice_listener_loop, args=(voice_stop_event,), daemon=True)
    voice_thread.start()
    time.sleep(0.1)

def stop_voice_listener():
    global voice_thread, voice_stop_event
    if voice_stop_event:
        voice_stop_event.set()
    if voice_thread:
        voice_thread.join(timeout=2.0)
    voice_thread = None
    voice_stop_event = None

# -------------------------------------------------

print("Starting. Toggle volume with 'v', eye-blink mode with 'e', voice (Jarvis) with 'j', quit with 'q' or ESC.")

# MAIN LOOP
while True:
    ret, frame = cap.read()
    if not ret:
        break
    frame = cv2.flip(frame, 1)
    frame_h, frame_w, _ = frame.shape
    img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    face_results = face_mesh.process(img_rgb)
    hand_results = None
    if not eye_mode and not voice_mode:
        hand_results = hands.process(img_rgb)

    k = cv2.waitKey(1) & 0xFF
    if k == ord('q') or k == 27:
        break
    if k == ord('v'):
        if not voice_mode:
            volume_mode = not volume_mode
            mode_text_time = time.time()
            mode_last = 'v'
    if k == ord('e'):
        if not voice_mode:
            eye_mode = not eye_mode
            mode_text_time = time.time()
            mode_last = 'e'
            eye_closed_start = None

    if k == ord('j'):
        voice_mode = not voice_mode
        mode_text_time = time.time()
        mode_last = 'j'
        if voice_mode:
            eye_mode = False
            volume_mode = False
            eye_closed_start = None
            try:
                start_voice_listener()
            except Exception as e:
                print("Failed to start voice listener:", e)
                voice_mode = False
        else:
            stop_voice_listener()

    # EYE MODE: detect long close -> save screenshot (no on-screen overlay)
    if eye_mode and not voice_mode:
        if (time.time() - mode_text_time) < 2.5:
            # show only the centered mode box, not the extra top-left text
            draw_mode_box(frame, "EYE MODE: ON  (press 'e' to toggle)", on=True)
        if face_results.multi_face_landmarks:
            face_landmarks = face_results.multi_face_landmarks[0].landmark
            left_ear = eye_aspect_ratio(face_landmarks, LEFT_EYE_IDX, frame_w, frame_h)
            right_ear = eye_aspect_ratio(face_landmarks, RIGHT_EYE_IDX, frame_w, frame_h)
            ear = (left_ear + right_ear) / 2.0
            if ear < EYE_AR_THRESH:
                if eye_closed_start is None:
                    eye_closed_start = time.time()
                else:
                    elapsed = time.time() - eye_closed_start
                    if elapsed >= EYE_CLOSE_TIME and (time.time() - last_capture_time) > (CAPTURE_SHOW + 0.5):
                        save_screenshot_and_beep()
                        last_capture_time = time.time()
            else:
                eye_closed_start = None

        # show face mesh lightly
        if face_results.multi_face_landmarks:
            mp_draw.draw_landmarks(frame, face_results.multi_face_landmarks[0], mp_face.FACEMESH_TESSELATION,
                                   landmark_drawing_spec=None,
                                   connection_drawing_spec=mp_draw.DrawingSpec(color=(80,80,80), thickness=1, circle_radius=0))
        cv2.imshow("Virtual Mouse + Volume", frame)
        continue

    # Normal non-eye and non-voice mode: hands + gestures
    if not voice_mode:
        if hand_results and hand_results.multi_hand_landmarks:
            lm = hand_results.multi_hand_landmarks[0].landmark
            ix_norm, iy_norm = lm[8].x, lm[8].y
            target_x = screen_w * ix_norm
            target_y = screen_h * iy_norm
            curr_x = prev_x + (target_x - prev_x) * SMOOTHING
            curr_y = prev_y + (target_y - prev_y) * SMOOTHING
            prev_x, prev_y = curr_x, curr_y
            try:
                pyautogui.moveTo(int(curr_x), int(curr_y), _pause=False)
            except:
                pass

            ix_px, iy_px = int(ix_norm * frame_w), int(iy_norm * frame_h)
            tx = int(lm[4].x * frame_w); ty = int(lm[4].y * frame_h)
            dist = math.hypot(ix_px - tx, iy_px - ty)
            pinch_now = dist < (frame_w * PINCH_THRESHOLD)

            if pinch_now and not volume_mode:
                pyautogui.click()
                cv2.putText(frame, "Click (Pinch)", CLICK_TEXT_POS, cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,255,0), 2)
                volume_handled = True
            else:
                volume_handled = False

            if volume_mode and not volume_handled:
                fingers = []
                tip_ids = [4, 8, 12, 16, 20]
                for fid in range(1, 5):
                    fingers.append(1 if lm[tip_ids[fid]].y < lm[tip_ids[fid]-2].y else 0)
                now = time.time()
                if fingers.count(1) >= 4:
                    new_vol = min(1.0, current_vol + VOL_STEP)
                    try:
                        volume.SetMasterVolumeLevelScalar(new_vol, None)
                    except:
                        pass
                    current_vol = new_vol; show_overlay = True; last_vol_change_time = now
                if fingers.count(1) == 0:
                    new_vol = max(0.0, current_vol - VOL_STEP)
                    try:
                        volume.SetMasterVolumeLevelScalar(new_vol, None)
                    except:
                        pass
                    current_vol = new_vol; show_overlay = True; last_vol_change_time = now

            mp_draw.draw_landmarks(frame, hand_results.multi_hand_landmarks[0], mp_hands.HAND_CONNECTIONS)
        else:
            cv2.putText(frame, "No hand detected", NO_HAND_POS, cv2.FONT_HERSHEY_SIMPLEX, 0.85, (0,0,255), 2)
    else:
        # voice_mode active -> show a small listening hint if desired (we only show the top mode box)
        pass

    # volume popup
    if show_overlay and (time.time() - last_vol_change_time) < OVERLAY_DURATION:
        show_volume_overlay(frame, current_vol)
    else:
        show_overlay = False

    # --- MODE TEXT: show recent toggle message for volume/eye/voice toggles ---
    if (time.time() - mode_text_time) < 2.5 and mode_last is not None:
        if mode_last == 'v':
            txt_v = "VOLUME MODE: ON  (press 'v')" if volume_mode else "VOLUME MODE: OFF (press 'v')"
            draw_mode_box(frame, txt_v, on=volume_mode)
        elif mode_last == 'e':
            txt_e = "EYE MODE: ON  (press 'e' to toggle)" if eye_mode else "EYE MODE: OFF (press 'e' to toggle)"
            draw_mode_box(frame, txt_e, on=eye_mode)
        elif mode_last == 'j':
            txt_j = "VOICE MODE: ON  (press 'j' to toggle)" if voice_mode else "VOICE MODE: OFF (press 'j' to toggle)"
            draw_mode_box(frame, txt_j, on=voice_mode)

    cv2.imshow("Virtual Mouse + Volume", frame)

cap.release()
if voice_mode:
    stop_voice_listener()
cv2.destroyAllWindows()