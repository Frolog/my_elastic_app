import requests
import time
import random
from datetime import datetime

# כתובת שרת ה-Node.js שלך
url = "http://localhost:3000/add"

print("Starting Virtual Sensor... Sending data to Node.js every 5 seconds.")

while True:
    # מדמה טמפרטורה בין 20.0 ל-30.0 מעלות
    temp = round(random.uniform(20.0, 30.0), 2)
    
    # המבנה שהגדרנו בשרת (Node.js)
    payload = {
        "name": "Living_Room_Sensor",
        "value": temp
    }
    
    try:
        response = requests.post(url, json=payload)
        current_time = datetime.now().strftime("%H:%M:%S")
        if response.status_code == 200:
            print(f"[{current_time}] Sent: {temp}°C | Status: Success ✅")
        else:
            print(f"[{current_time}] Error: {response.status_code} ❌")
    except Exception as e:
        print(f"Connection Error: {e}")
    
    time.sleep(5) # המתנה של 5 שניות
