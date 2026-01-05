import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import { Package, Plus, Trash2, Edit2, Save, X, Search } from "lucide-react";
import Navbar from "./Navbar";

export default function InventoryManager() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", price: "", quantity: "" });

    // New product form state
    const [isAdding, setIsAdding] = useState(false);
    const [newProduct, setNewProduct] = useState({ barcode: "", name: "", price: "", quantity: "" });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            const productsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsList);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            // Use barcode as document ID for easy lookup
            await setDoc(doc(db, "products", newProduct.barcode), {
                barcode: newProduct.barcode,
                name: newProduct.name,
                price: parseFloat(newProduct.price),
                quantity: parseInt(newProduct.quantity)
            });

            setNewProduct({ barcode: "", name: "", price: "", quantity: "" });
            setIsAdding(false);
            fetchProducts();
            alert("Product added successfully!");
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to add product");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteDoc(doc(db, "products", id));
                fetchProducts();
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    const startEdit = (product) => {
        setEditingId(product.id);
        setEditForm({
            name: product.name,
            price: product.price,
            quantity: product.quantity || 0
        });
    };

    const saveEdit = async (id) => {
        try {
            await updateDoc(doc(db, "products", id), {
                name: editForm.name,
                price: parseFloat(editForm.price),
                quantity: parseInt(editForm.quantity)
            });
            setEditingId(null);
            fetchProducts();
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode.includes(searchTerm)
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Package className="h-8 w-8 text-blue-600" />
                            Inventory Management
                        </h1>
                        <p className="text-gray-500 mt-1">Manage prodcuts, prices, and stock levels</p>
                    </div>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
                    >
                        {isAdding ? <><X className="h-5 w-5" /> Cancel</> : <><Plus className="h-5 w-5" /> Add Product</>}
                    </button>
                </div>

                {/* Add Product Form */}
                {isAdding && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 animate-fade-in">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">New Product Details</h3>
                        <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Barcode</label>
                                <input
                                    required
                                    value={newProduct.barcode}
                                    onChange={e => setNewProduct({ ...newProduct, barcode: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Scan or type..."
                                />
                            </div>
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    required
                                    value={newProduct.name}
                                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Product name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                <input
                                    required type="number" step="0.01"
                                    value={newProduct.price}
                                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                                <input
                                    required type="number"
                                    value={newProduct.quantity}
                                    onChange={e => setNewProduct({ ...newProduct, quantity: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                />
                            </div>
                            <button type="submit" className="lg:col-span-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium w-full flex justify-center gap-2">
                                <Save className="h-5 w-5" /> Save
                            </button>
                        </form>
                    </div>
                )}

                {/* Search & List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="text-sm text-gray-500">
                            {filteredProducts.length} Products Found
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Barcode</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Stock</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading inventory...</td></tr>
                                ) : filteredProducts.length === 0 ? (
                                    <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No products found. Add one above!</td></tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4 font-mono text-gray-500">{product.barcode}</td>

                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {editingId === product.id ? (
                                                    <input
                                                        value={editForm.name}
                                                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                        className="w-full px-2 py-1 border rounded"
                                                    />
                                                ) : product.name}
                                            </td>

                                            <td className="px-6 py-4 text-gray-600">
                                                {editingId === product.id ? (
                                                    <input
                                                        type="number" step="0.01"
                                                        value={editForm.price}
                                                        onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                                                        className="w-24 px-2 py-1 border rounded"
                                                    />
                                                ) : `$${product.price ? product.price.toFixed(2) : '0.00'}`}
                                            </td>

                                            <td className="px-6 py-4">
                                                {editingId === product.id ? (
                                                    <input
                                                        type="number"
                                                        value={editForm.quantity}
                                                        onChange={e => setEditForm({ ...editForm, quantity: e.target.value })}
                                                        className="w-20 px-2 py-1 border rounded"
                                                    />
                                                ) : (
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${(product.quantity || 0) < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                                        }`}>
                                                        {product.quantity || 0} units
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                {editingId === product.id ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => saveEdit(product.id)} className="text-green-600 hover:bg-green-50 p-1 rounded"><Save className="h-4 w-4" /></button>
                                                        <button onClick={() => setEditingId(null)} className="text-gray-400 hover:bg-gray-100 p-1 rounded"><X className="h-4 w-4" /></button>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => startEdit(product)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit2 className="h-4 w-4" /></button>
                                                        <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 className="h-4 w-4" /></button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
