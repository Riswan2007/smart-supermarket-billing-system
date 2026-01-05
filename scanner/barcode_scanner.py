import cv2
import requests
from pyzbar.pyzbar import decode
import urllib.parse

# Firebase Configuration
PROJECT_ID = "smartbillingsystem-9b3ad"
API_KEY = "AIzaSyBVCbDOR1Kg2xfNbatv9fhjPpOYBIaj-U4"
FIRESTORE_URL = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/products/"

cap = cv2.VideoCapture(0)

bill_total = 0
scanned_items = set()  # avoid duplicate scan

print("Supermarket Scanner Started (Firebase Mode)")
print("Press 'q' to quit")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    barcodes = decode(frame)

    for barcode in barcodes:
        barcode_data = barcode.data.decode("utf-8")

        # avoid scanning same product again & again
        if barcode_data in scanned_items:
            continue

        # Fetch from Firestore REST API
        try:
            url = f"{FIRESTORE_URL}{urllib.parse.quote(barcode_data)}?key={API_KEY}"
            response = requests.get(url)

            if response.status_code == 200:
                data = response.json()
                fields = data.get("fields", {})
                
                # Firestore returns data in a specific format like { "stringValue": "..." }
                name = fields.get("name", {}).get("stringValue", "Unknown")
                price = float(fields.get("price", {}).get("doubleValue", 0.0) or fields.get("price", {}).get("integerValue", 0))

                bill_total += price
                scanned_items.add(barcode_data)

                print(f"Added: {name} - ₹{price}")
                print(f"Current Total: ₹{bill_total}")
            else:
                print("Product not found in Firebase for barcode:", barcode_data)
        except Exception as e:
            print(f"Error fetching product: {e}")

        x, y, w, h = barcode.rect
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
        cv2.putText(
            frame,
            barcode_data,
            (x, y - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (0, 255, 0),
            2
        )

    cv2.imshow("Supermarket Billing Scanner", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

print("\nFINAL BILL")
print("-----------")
print(f"Total Amount: ₹{bill_total}")
