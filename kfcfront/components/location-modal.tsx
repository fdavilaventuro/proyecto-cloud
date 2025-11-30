"use client"
import { X } from "lucide-react"

export default function LocationModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-8 max-h-96 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Dirección de entrega</h2>
          <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <button className="flex-1 bg-black text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
            <span>🚗</span>
            Delivery
          </button>
          <button className="flex-1 border-2 border-gray-300 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
            <span>🏪</span>
            Recojo en tienda
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Busca una dirección"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:border-[#e4002b] transition-colors"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 p-3 hover:bg-gray-50 rounded-lg border-2 border-gray-300 font-bold text-gray-900 transition-colors">
          <span>📍</span>
          Usar mi ubicación actual
        </button>
      </div>
    </div>
  )
}
