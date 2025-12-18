from database import SessionLocal, engine
from models import Product, Base

Base.metadata.create_all(bind=engine)

db = SessionLocal()

products = [
    Product(barcode="6001253010178", name="Dairy Milk", price=40),
    Product(barcode="7613269831105", name="Maggi Noodles", price=15),
]

db.add_all(products)
db.commit()
db.close()

print("Products added successfully")
