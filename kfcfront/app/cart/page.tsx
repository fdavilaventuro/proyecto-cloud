"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import LocationModal from "@/components/location-modal"
import Link from "next/link"
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react"

interface CartItem {
    id: number
    name: string
    price: number
    image: string
    quantity: number
    description?: string
}

export default function CartPage() {
    const [showLocation, setShowLocation] = useState(false)
    const [cartItems, setCartItems] = useState<CartItem[]>([])

    useEffect(() => {
        // Load from kfc-cart (same key as menu page)
        const savedCart = localStorage.getItem("kfc-cart")
        if (savedCart) {
            try {
                const items = JSON.parse(savedCart)
                // Group duplicate items by id and sum quantities
                const grouped = items.reduce((acc: CartItem[], item: any) => {
                    const existing = acc.find(i => i.id === item.id)
                    if (existing) {
                        existing.quantity += 1
                    } else {
                        acc.push({ ...item, quantity: 1 })
                    }
                    return acc
                }, [])
                setCartItems(grouped)
            } catch (e) {
                console.error("Error parsing cart:", e)
            }
        }
    }, [])

    const updateQuantity = (index: number, delta: number) => {
        const newCart = [...cartItems]
        newCart[index].quantity += delta

        if (newCart[index].quantity <= 0) {
            newCart.splice(index, 1)
        }

        setCartItems(newCart)
        saveCart(newCart)
    }

    const removeItem = (index: number) => {
        const newCart = cartItems.filter((_, i) => i !== index)
        setCartItems(newCart)
        saveCart(newCart)
    }

    const saveCart = (items: CartItem[]) => {
        // Save as flat array (same format as when adding from menu)
        const flatCart = items.flatMap(item =>
            Array(item.quantity).fill({ ...item, quantity: 1 })
        )
        localStorage.setItem("kfc-cart", JSON.stringify(flatCart))
    }

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const deliveryFee = 5.00
    const total = subtotal + deliveryFee

    return (
        <main className="bg-gray-50 min-h-screen">
            <Header onLocationClick={() => setShowLocation(true)} />
            {showLocation && <LocationModal onClose={() => setShowLocation(false)} />}

            <div className="max-w-7xl mx-auto px-4 py-8">
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
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm divide-y">
                                {cartItems.map((item, index) => (
                                    <div key={index} className="p-4 flex items-center gap-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-24 h-24 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg">{item.name}</h3>
                                            {item.description && (
                                                <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                                            )}
                                            <p className="text-red-600 font-bold mt-1">S/{item.price.toFixed(2)}</p>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(index, -1)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(index, 1)}
                                                className="p-2 hover:bg-gray-100 rounded-lg transition"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <p className="text-lg font-bold w-20 text-right">
                                                S/{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                            <button
                                                onClick={() => removeItem(index)}
                                                className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href="/menu"
                                className="mt-4 inline-block text-red-600 hover:text-red-700 font-semibold"
                            >
                                ← Seguir comprando
                            </Link>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                                <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>

                                <div className="space-y-2 mb-4 pb-4 border-b">
                                    <div className="flex justify-between">
                                        <span>Subtotal ({cartItems.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                                        <span>S/{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Delivery</span>
                                        <span>S/{deliveryFee.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between font-bold text-lg mb-6">
                                    <span>Total</span>
                                    <span className="text-red-600">S/{total.toFixed(2)}</span>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="block w-full bg-red-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-red-700 active:bg-red-800 transition"
                                >
                                    Proceder al pago
                                </Link>

                                <p className="text-xs text-gray-500 text-center mt-4">
                                    Tiempo estimado de entrega: 30-45 min
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}
