"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import LocationModal from "@/components/location-modal"
import { createOrder, isAuthenticated } from "@/lib/api/orders"
import { MapPin, User, Phone, Mail, CreditCard, Banknote } from "lucide-react"

interface CartItem {
    id: number
    name: string
    price: number
    quantity: number
    image: string
}

export default function CheckoutPage() {
    const router = useRouter()
    const [showLocation, setShowLocation] = useState(false)
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        paymentMethod: "cash" // cash or card
    })

    useEffect(() => {
        // Check authentication
        if (!isAuthenticated()) {
            router.push("/login?redirect=/checkout")
            return
        }

        // Pre-fill user data
        const savedName = localStorage.getItem("userName")
        const savedEmail = localStorage.getItem("userEmail")

        setFormData(prev => ({
            ...prev,
            name: savedName || prev.name,
            email: savedEmail || prev.email
        }))

        // Load cart
        const savedCart = localStorage.getItem("kfc-cart")
        if (savedCart) {
            try {
                const items = JSON.parse(savedCart)
                const grouped = items.reduce((acc: CartItem[], item: any) => {
                    const existing = acc.find((i: CartItem) => i.id === item.id)
                    if (existing) {
                        existing.quantity += 1
                    } else {
                        acc.push({ ...item, quantity: 1 })
                    }
                    return acc
                }, [])
                setCartItems(grouped)
            } catch (e) {
                console.error("Error loading cart:", e)
            }
        }

        // If cart is empty, redirect to menu
        if (!savedCart || JSON.parse(savedCart).length === 0) {
            router.push("/menu")
        }
    }, [router])

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const deliveryFee = 5.00
    const total = subtotal + deliveryFee

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            // Validate form
            if (!formData.name || !formData.phone || !formData.email || !formData.address) {
                setError("Por favor completa todos los campos")
                setLoading(false)
                return
            }

            // Create order
            const orderData = {
                storeId: "STORE-001",
                client: {
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email
                },
                address: formData.address,
                total: total,
                items: cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                }))
            }

            const response = await createOrder(orderData)

            // Clear cart
            localStorage.removeItem("kfc-cart")

            // Redirect to order confirmation
            router.push(`/order/${response.orderId}`)
        } catch (err: any) {
            console.error("Error creating order:", err)
            setError(err.message || "Error al crear el pedido. Por favor intenta de nuevo.")
            setLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <main className="bg-gray-50 min-h-screen">
            <Header onLocationClick={() => setShowLocation(true)} />
            {showLocation && <LocationModal onClose={() => setShowLocation(false)} />}

            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Finalizar Pedido</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Section */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Customer Information */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <User size={24} className="text-red-600" />
                                    Información del Cliente
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Nombre Completo *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="Juan Pérez"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Teléfono *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="987 654 321"
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-2">Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="juan@ejemplo.com"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <MapPin size={24} className="text-red-600" />
                                    Dirección de Entrega
                                </h2>

                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    rows={3}
                                    placeholder="Calle, número, distrito, referencia..."
                                    required
                                />
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <CreditCard size={24} className="text-red-600" />
                                    Método de Pago
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${formData.paymentMethod === "cash" ? "border-red-600 bg-red-50" : "border-gray-200"
                                        }`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cash"
                                            checked={formData.paymentMethod === "cash"}
                                            onChange={handleInputChange}
                                            className="text-red-600"
                                        />
                                        <Banknote size={24} />
                                        <span className="font-medium">Efectivo</span>
                                    </label>

                                    <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${formData.paymentMethod === "card" ? "border-red-600 bg-red-50" : "border-gray-200"
                                        }`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="card"
                                            checked={formData.paymentMethod === "card"}
                                            onChange={handleInputChange}
                                            className="text-red-600"
                                        />
                                        <CreditCard size={24} />
                                        <span className="font-medium">Tarjeta (Simulado)</span>
                                    </label>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                                <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>

                                {/* Items */}
                                <div className="space-y-3 mb-4 pb-4 border-b max-h-60 overflow-y-auto">
                                    {cartItems.map((item, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span className="flex-1">
                                                {item.quantity}x {item.name}
                                            </span>
                                            <span className="font-semibold">S/{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="space-y-2 mb-4 pb-4 border-b">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
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

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 active:bg-red-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                                >
                                    {loading ? "Procesando..." : "Realizar Pedido"}
                                </button>

                                <p className="text-xs text-gray-500 text-center mt-4">
                                    Al realizar el pedido, aceptas nuestros términos y condiciones
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    )
}
