import { Receipt, Check } from "lucide-react";

export default function BillSummary({ total, onPrint, processing }) {
    const tax = total * 0.1; // Assuming 10% tax for demo
    const finalTotal = total + tax;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24">
            <div className="flex items-center gap-2 mb-6">
                <Receipt className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">Bill Summary</h2>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-dashed border-gray-200 my-4 pt-4 flex justify-between items-end">
                    <span className="text-gray-900 font-medium">Total Amount</span>
                    <span className="text-3xl font-bold text-blue-600">${finalTotal.toFixed(2)}</span>
                </div>
            </div>

            <button
                onClick={onPrint}
                disabled={processing || total === 0}
                className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 focus:ring-4 focus:ring-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
            >
                {processing ? (
                    <>processing...</>
                ) : (
                    <>
                        <Check className="h-4 w-4" />
                        Complete & Print Bill
                    </>
                )}
            </button>
        </div>
    );
}
