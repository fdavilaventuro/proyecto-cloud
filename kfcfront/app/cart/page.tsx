"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import LocationModal from "@/components/location-modal"
import Link from "next/link"
import { ShoppingCart, Trash2 } from "lucide-react"

export default function CartPage() {
    const [showLocation, setShowLocation] = useState(false)
    const [cartItems, setCartItems] = useState<any[]>([])

    useEffect(() => {
        // TODO: Load cart items from localStorage or state management
        // For now, showing empty cart
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
            setCartItems(JSON.parse(savedCart))
        }
    }, [])

    const removeItem = (index: number) => {
        const newCart = cartItems.filter((_, i) => i !== index)
        setCartItems(newCart)
        localStorage.setItem("cart", JSON.stringify(newCart))
    }

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    return (
        <main className="bg-gray-50 min-h-screen">
            <Header onLocationClick={() => setShowLocation(true)} />
            {showLocation && <LocationModal onClose={() => setShowLocation(false)} />}

            <div className="max-w-5xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Tu Carrito</h1>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">Tu carrito está vacío</h2>
                        <p className="text-gray-500 mb-6">Agrega productos del menú para comenzar tu pedido</p>
                        <Link
                            href="/menu"
                            className="inline-block bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                        >
                            Ver Menú
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm divide-y">
                                {cartItems.map((item, index) => (
                                    <div key={index} className="p-4 flex items-center gap-4">
                                        <img
                                            src={item.image || "/placeholder.svg"}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-bold">{item.name}</h3>
                                            <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                                            <p className="text-red-600 font-bold">S/{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                        <button
                                            onClick={() => removeItem(index)}
                                            className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                                <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>
                                <div className="space-y-2 mb-4 pb-4 border-b">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>S/{total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Delivery</span>
                                        <span>S/5.00</span>
                                    </div>
                                </div>
                                <div className="flex justify-between font-bold text-lg mb-6">
                                    <span>Total</span>
                                    <span>S/{(total + 5).toFixed(2)}</span>
                                </div>
                                <Link
                                    href="/pedir"
                                    className="block w-full bg-red-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                                >
                                    Proceder al pago
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
