import { useState, useEffect, useRef } from "react";
import { Scan, Search, Camera, X } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function ProductScanner({ onScan, loading }) {
    const [barcode, setBarcode] = useState("");
    const [showCamera, setShowCamera] = useState(false);
    const scannerRef = useRef(null);

    useEffect(() => {
        let scanner = null;
        if (showCamera) {
            scanner = new Html5QrcodeScanner(
                "reader",
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0
                },
                /* verbose= */ false
            );

            scanner.render(onScanSuccess, onScanFailure);
            scannerRef.current = scanner;
        }

        return () => {
            if (scanner) {
                scanner.clear().catch(error => {
                    console.error("Failed to clear html5-qrcode scanner. ", error);
                });
            }
        };
    }, [showCamera]);

    const onScanSuccess = (decodedText, decodedResult) => {
        onScan(decodedText);
        setShowCamera(false);
    };

    const onScanFailure = (error) => {
        // handle scan failure, usually better to ignore and keep scanning.
        // console.warn(`Code scan error = ${error}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (barcode.trim()) {
            onScan(barcode);
            setBarcode("");
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Scan className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-800">Scan Product</h2>
                </div>
                <button
                    onClick={() => setShowCamera(!showCamera)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${showCamera ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                >
                    {showCamera ? (
                        <>
                            <X className="h-4 w-4" />
                            Close Camera
                        </>
                    ) : (
                        <>
                            <Camera className="h-4 w-4" />
                            Open Camera
                        </>
                    )}
                </button>
            </div>

            {showCamera && (
                <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-black">
                    <div id="reader" className="w-full"></div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="Enter barcode or scan..."
                    disabled={loading}
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50 text-gray-800 placeholder-gray-400"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <button
                    type="submit"
                    disabled={!barcode.trim() || loading}
                    className="absolute right-2 top-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? "Scanning..." : "Add"}
                </button>
            </form>
            <p className="mt-2 text-xs text-gray-500">
                Press "Open Camera" to scan with your device, or enter barcode manually.
            </p>
        </div>
    );
}
