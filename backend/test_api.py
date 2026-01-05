import requests
import json

url = "http://127.0.0.1:8000/products"
payload = {
    "barcode": "TEST12345",
    "name": "Test Product",
    "price": 99.99
}

try:
    print(f"Sending POST request to {url}...")
    response = requests.post(url, json=payload)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("SUCCESS: Product added API works.")
    else:
        print("FAILURE: API returned error.")

except Exception as e:
    print(f"ERROR: Could not connect to API. {e}")
