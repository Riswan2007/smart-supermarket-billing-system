from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Product, Base

# Create a session
db = SessionLocal()

# Query all products
products = db.query(Product).all()

print(f"Total Products: {len(products)}")
print("-" * 30)
for p in products:
    print(f"ID: {p.id} | Barcode: {p.barcode} | Name: {p.name} | Price: {p.price}")
print("-" * 30)

db.close()
