import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ProductScanner from "./components/ProductScanner";
import Cart from "./components/Cart";
import BillSummary from "./components/BillSummary";
import AddProductModal from "./components/AddProductModal";

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleScan = async (barcode) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://127.0.0.1:8000/product/${barcode}`);
      if (!response.ok) {
        throw new Error("Product not found");
      }
      const product = await response.json();
      setItems([...items, { ...product, barcode }]);
    } catch (err) {
      setError(`"${barcode}": ${err.message}`);
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handlePrint = () => {
    setProcessing(true);
    // Simulate API call for billing
    setTimeout(() => {
      setProcessing(false);
      alert("Bill printed successfully!");
      setItems([]);
    }, 1500);
  };

  const handleAddProduct = async (productData) => {
    const response = await fetch("http://127.0.0.1:8000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    if (!response.ok) throw new Error("Failed to add product");

    const newProduct = await response.json();
    setItems([...items, newProduct]); // Automatically add to cart
    setIsAddModalOpen(false);
    setError(""); // Clear any previous errors
    alert(`Product "${newProduct.name}" added successfully!`);
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
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="text-sm bg-white border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors font-medium text-red-700"
                >
                  Add Product
                </button>
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

export default App;
