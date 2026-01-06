# server/server.py

import asyncio
import json
import time
import websockets
import cv2
import mediapipe as mp
from agent import BanditAgent

# Improved gesture detection
def get_gesture(landmarks):
    if not landmarks: 
        return None
    
    tips = [8, 12, 16, 20]  
    pips = [6, 10, 14, 18]  
    
    thumb_tip = landmarks[4]
    thumb_ip = landmarks[3]
    thumb_mcp = landmarks[2]
    
    # Count extended fingers (excluding thumb)
    extended = 0
    for tip, pip in zip(tips, pips):
        if landmarks[tip].y < landmarks[pip].y:  # Tip above PIP = extended
            extended += 1
    
    # ✅ IMPROVED: Thumb extended check - more accurate
    thumb_extended = thumb_tip.y < thumb_ip.y
    
    # ✅ IMPROVED: Fist detection - all fingers folded including thumb
    all_folded = extended == 0 and not thumb_extended
    
    # Gesture recognition
    if all_folded:
        return "fist"
    elif extended >= 4:
        return "palm"
    elif extended == 2:
        # Check if index and middle are extended (victory sign)
        index_extended = landmarks[8].y < landmarks[6].y
        middle_extended = landmarks[12].y < landmarks[10].y
        ring_folded = landmarks[16].y > landmarks[14].y
        pinky_folded = landmarks[20].y > landmarks[18].y
        
        if index_extended and middle_extended and ring_folded and pinky_folded:
            return "victory"
    elif extended == 1:
        # Check if only index finger is extended
        index_extended = landmarks[8].y < landmarks[6].y
        middle_folded = landmarks[12].y > landmarks[10].y
        ring_folded = landmarks[16].y > landmarks[14].y
        pinky_folded = landmarks[20].y > landmarks[18].y
        
        if index_extended and middle_folded and ring_folded and pinky_folded:
            return "index_up"
    
    return None

# Game data
thanos_actions = [
    {"id": "meteor", "label": "Meteor Drop", "damage": 20},
    {"id": "blast", "label": "Power Blast", "damage": 15},
    {"id": "quake", "label": "Earthquake Smash", "damage": 25},
    {"id": "snap", "label": "Snap", "damage": 30},
]

# ✅ FIXED: Agent with higher exploration rate
agent = BanditAgent(thanos_actions, eps=0.3, min_eps=0.1, decay=0.999)
clients = set()

# WebSocket handler
async def websocket_handler(websocket):
    clients.add(websocket)
    print("🎮 Client connected")
    
    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                print(f"📩 Received: {data}")
                
                if data.get("type") == "request_thanos":
                    print("🔄 Thanos turn requested")
                    action = agent.choose()
                    response = {
                        "type": "thanos_action", 
                        "action": action
                    }
                    await websocket.send(json.dumps(response))
                    print(f"🤖 Thanos used: {action['label']}")
                    
                elif data.get("type") == "reward":
                    action_id = data.get("action_id")
                    delta = data.get("delta")
                    print(f"💰 Reward: {action_id} -> {delta}")
                    agent.update(action_id, delta)
                    
                elif data.get("type") == "player_action":
                    action = data.get("action")
                    print(f"🎯 Player used: {action}")
                    
            except json.JSONDecodeError as e:
                print(f"❌ JSON error: {e}")
                
    except Exception as e:
        print(f"❌ Connection error: {e}")
    finally:
        clients.discard(websocket)
        print("🔌 Client disconnected")

# Broadcast to all clients
async def broadcast_message(message):
    if not clients:
        return
        
    data = json.dumps(message)
    disconnected_clients = []
    
    for client in clients:
        try:
            await client.send(data)
            print(f"📤 Sent: {message}")
        except:
            disconnected_clients.append(client)
    
    for client in disconnected_clients:
        clients.discard(client)

# Camera and gesture detection
async def camera_processing():
    print("📷 Starting camera...")
    
    mp_hands = mp.solutions.hands
    hands = mp_hands.Hands(
        static_image_mode=False,
        max_num_hands=1,
        min_detection_confidence=0.6,
        min_tracking_confidence=0.6
    )
    
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("❌ Camera not available")
        return
        
    print("✅ Camera ready")
    
    gesture_history = []
    last_gesture_time = 0
    gesture_cooldown = 1.2
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                await asyncio.sleep(0.1)
                continue
            
            # Process frame for hand detection
            rgb_frame = cv2.cvtColor(cv2.flip(frame, 1), cv2.COLOR_BGR2RGB)
            hand_results = hands.process(rgb_frame)
            
            current_gesture = None
            if hand_results.multi_hand_landmarks:
                landmarks = hand_results.multi_hand_landmarks[0].landmark
                current_gesture = get_gesture(landmarks)
            
            current_time = time.time()
            
            if current_gesture:
                gesture_history.append((current_gesture, current_time))
                
                # Limit buffer size
                if len(gesture_history) > 25:
                    gesture_history.pop(0)
                
                # Check for consistent gesture
                consistent_count = 0
                for i in range(len(gesture_history)-1, -1, -1):
                    if gesture_history[i][0] == current_gesture:
                        consistent_count += 1
                    else:
                        break
                
                # Send gesture if stable and cooldown passed
                if consistent_count >= 8 and (current_time - last_gesture_time) > gesture_cooldown:
                    print(f"🎯 Detected gesture: {current_gesture}")
                    await broadcast_message({
                        "type": "gesture",
                        "label": current_gesture
                    })
                    last_gesture_time = current_time
                    gesture_history.clear()
            else:
                gesture_history.clear()
            
            await asyncio.sleep(0.05)
            
    except Exception as e:
        print(f"💥 Camera error: {e}")
    finally:
        cap.release()
        cv2.destroyAllWindows()
        print("📷 Camera stopped")

# Main server function
async def main_server():
    print("🚀 Starting Gesture Battle Server...")
    
    server = await websockets.serve(
        websocket_handler,
        "0.0.0.0", 
        8765
    )
    
    print("✅ WebSocket server running at ws://0.0.0.0:8765")
    print("🎮 Game ready - Waiting for players...")
    
    # Start camera processing
    await camera_processing()

# Start the server
if __name__ == "__main__":
    try:
        asyncio.run(main_server())
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"💥 Server error: {e}")