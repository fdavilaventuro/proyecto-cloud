"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Header from "@/components/header"
import LocationModal from "@/components/location-modal"
import { getOrderStatus, OrderStatusResponse } from "@/lib/api/orders"
import { CheckCircle, Clock, ChefHat, Bike, MapPin, AlertCircle, Package } from "lucide-react"
import Link from "next/link"

const STATUS_STEPS = [
    { id: "PENDING", label: "Pendiente", icon: Clock, description: "Tu pedido ha sido recibido" },
    { id: "PROCESSING", label: "Procesando", icon: Clock, description: "Procesando tu pago" },
    { id: "PAID", label: "Confirmado", icon: CheckCircle, description: "Pago verificado correctamente" },
    { id: "PREPARING", label: "En Cocina", icon: ChefHat, description: "Estamos preparando tu pedido" },
    { id: "READY", label: "Listo", icon: Package, description: "Tu pedido está listo para entrega" },
    { id: "ON_DELIVERY", label: "En Reparto", icon: Bike, description: "Tu pedido está en camino" },
    { id: "DELIVERED", label: "Entregado", icon: MapPin, description: "¡Disfruta tu pedido!" },
]

export default function OrderTrackingPage() {
    const params = useParams()
    const [showLocation, setShowLocation] = useState(false)
    const [order, setOrder] = useState<OrderStatusResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await getOrderStatus(params.id as string)
                setOrder(data)
                setLoading(false)
            } catch (err) {
                console.error("Error fetching order:", err)
                setError("No pudimos encontrar tu pedido. Por favor verifica el ID.")
                setLoading(false)
            }
        }

        fetchOrder()

        // Poll every 5 seconds for updates
        const interval = setInterval(fetchOrder, 5000)
        return () => clearInterval(interval)
    }, [params.id])

    const getCurrentStepIndex = () => {
        if (!order) return 0
        // Map backend statuses to frontend steps
        const statusMap: Record<string, string> = {
            "PENDING": "PENDING",
            "PROCESSING": "PROCESSING",
            "PAID": "PAID",
            "IN_KITCHEN": "PREPARING",
            "KITCHEN_READY": "PREPARING",
            "PACKED": "READY", // Fix: Map PACKED to READY (Listo)
            "READY": "READY",
            "ON_DELIVERY": "ON_DELIVERY",
            "DELIVERED": "DELIVERED"
        }

        const mappedStatus = statusMap[order.status] || order.status
        return STATUS_STEPS.findIndex(step => step.id === mappedStatus)
    }

    const currentStepIndex = getCurrentStepIndex()

    return (
        <main className="bg-gray-50 min-h-screen">
            <Header onLocationClick={() => setShowLocation(true)} />
            {showLocation && <LocationModal onClose={() => setShowLocation(false)} />}

            <div className="max-w-4xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Link
                            href="/menu"
                            className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                        >
                            Volver al Menú
                        </Link>
                    </div>
                ) : order ? (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Pedido #{order.orderId.split('-')[1]}</h1>
                                    <p className="text-gray-500 text-sm">Realizado el {new Date(order.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="bg-red-50 text-red-700 px-4 py-2 rounded-full font-bold text-sm">
                                    {STATUS_STEPS.find(s => s.id === order.status)?.label || order.status}
                                </div>
                            </div>
                        </div>

                        {/* Status Timeline */}
                        <div className="bg-white rounded-lg shadow-sm p-8">
                            <div className="relative">
                                {/* Progress Bar Background */}
                                <div className="absolute top-8 left-0 w-full h-1 bg-gray-200 rounded-full hidden md:block"></div>

                                {/* Active Progress Bar */}
                                <div
                                    className="absolute top-8 left-0 h-1 bg-red-600 rounded-full transition-all duration-500 hidden md:block"
                                    style={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                                ></div>

                                <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0 relative">
                                    {STATUS_STEPS.map((step, index) => {
                                        const Icon = step.icon
                                        const isActive = index <= currentStepIndex
                                        const isCurrent = index === currentStepIndex

                                        return (
                                            <div key={step.id} className="flex md:flex-col items-center gap-4 md:gap-2 z-10">
                                                <div className={`
                          w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300
                          ${isActive
                                                        ? "bg-red-600 border-red-600 text-white shadow-lg scale-110"
                                                        : "bg-white border-gray-200 text-gray-300"}
                        `}>
                                                    <Icon size={24} />
                                                </div>
                                                <div className="md:text-center">
                                                    <p className={`font-bold ${isActive ? "text-gray-900" : "text-gray-400"}`}>
                                                        {step.label}
                                                    </p>
                                                    <p className="text-xs text-gray-500 hidden md:block max-w-[120px]">
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Order Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-bold mb-4">Detalles de Entrega</h2>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <p className="text-gray-500">Cliente</p>
                                        <p className="font-medium">{order.client.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Dirección</p>
                                        <p className="font-medium">{order.address || "No especificada"}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Teléfono</p>
                                        <p className="font-medium">{order.client.phone}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-lg font-bold mb-4">Resumen</h2>
                                <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span>{item.quantity}x {item.name}</span>
                                            <span className="font-medium">S/{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-red-600">S/{order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center pt-4">
                            <Link href="/" className="text-red-600 hover:text-red-700 font-semibold">
                                Volver al Inicio
                            </Link>
                        </div>
                    </div>
                ) : null}
            </div>
        </main>
    )
}
