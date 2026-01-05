import { Trash2, Package } from "lucide-react";

export default function Cart({ items, onRemove }) {
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="bg-blue-50 p-4 rounded-full mb-4">
                    <Package className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Cart is empty</h3>
                <p className="text-gray-500 mt-1">Scan items to start billing</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{items.length}</span>
                    Items in Cart
                </h2>
            </div>
            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                {items.map((item, index) => (
                    <div key={`${item.barcode}-${index}`} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 font-medium text-sm">
                                {index + 1}
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">{item.name}</h4>
                                <p className="text-sm text-gray-500 font-mono">#{item.barcode}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="font-semibold text-gray-900">${item.price.toFixed(2)}</span>
                            <button
                                onClick={() => onRemove(index)}
                                className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove item"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
