import cv2
import requests
from pyzbar.pyzbar import decode

BACKEND_URL = "http://127.0.0.1:8000/product/"

cap = cv2.VideoCapture(0)

bill_total = 0
scanned_items = set()  # avoid duplicate scan

print("Supermarket Scanner Started")
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

        response = requests.get(BACKEND_URL + barcode_data)

        if response.status_code == 200:
            product = response.json()
            name = product["name"]
            price = product["price"]

            bill_total += price
            scanned_items.add(barcode_data)

            print(f"Added: {name} - ₹{price}")
            print(f"Current Total: ₹{bill_total}")
        else:
            print("Product not found for barcode:", barcode_data)

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
