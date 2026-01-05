import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import Navbar from "./components/Navbar";
import ProductScanner from "./components/ProductScanner";
import Cart from "./components/Cart";
import BillSummary from "./components/BillSummary";
import AddProductModal from "./components/AddProductModal";
import InventoryManager from "./components/InventoryManager";

function BillingApp() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleScan = async (barcode) => {
    setLoading(true);
    setError("");
    try {
      const docRef = doc(db, "products", barcode);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const product = docSnap.data();
        if (product.quantity && product.quantity < 1) {
          throw new Error("Product out of stock!");
        }
        setItems([...items, { ...product, barcode }]);
      } else {
        throw new Error("Product not found");
      }
    } catch (err) {
      if (err.message.includes("Missing or insufficient permissions")) {
        setError("Database Locked: Go to Firebase Console -> Firestore Endpoint -> Rules -> Change 'false' to 'true'");
      } else {
        setError(`"${barcode}": ${err.message}`);
      }
      setTimeout(() => setError(""), 8000);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handlePrint = async () => {
    setProcessing(true);
    try {
      // Deduct quantities from stock (optional enhancement)
      for (const item of items) {
        if (item.barcode) {
          const docRef = doc(db, "products", item.barcode);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const currentQty = docSnap.data().quantity || 0;
            if (currentQty > 0) {
              await updateDoc(docRef, { quantity: currentQty - 1 });
            }
          }
        }
      }
      alert("Bill printed successfully! Inventory updated.");
      setItems([]);
    } catch (error) {
      console.error("Error processing bill:", error);
      alert("Error processing bill");
    } finally {
      setProcessing(false);
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      // Use barcode as ID
      await setDoc(doc(db, "products", productData.barcode), productData);

      setItems([...items, productData]);
      setIsAddModalOpen(false);
      setError("");
      alert(`Product "${productData.name}" added successfully!`);
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Failed to save product to Firebase.");
    }
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <ProductScanner onScan={handleScan} loading={loading} />

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Error:</span> {error}
                </div>
                {!error.includes("stock") && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="text-sm bg-white border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors font-medium text-red-700"
                  >
                    Add Product
                  </button>
                )}
              </div>
            )}

            <Cart items={items} onRemove={handleRemove} />
          </div>

          <div className="lg:col-span-4">
            <BillSummary
              total={total}
              onPrint={handlePrint}
              processing={processing}
            />
          </div>
        </div>

        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddProduct}
          initialBarcode={error.split('"')[1] || ""}
        />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BillingApp />} />
        <Route path="/inventory" element={<InventoryManager />} />
      </Routes>
    </BrowserRouter>
  );
}
