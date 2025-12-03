"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import { getUserName, removeToken } from "@/lib/auth"
import { getMyOrders, OrderStatusResponse } from "@/lib/api/orders"
import Link from "next/link"
import { Clock, CheckCircle, ChefHat, Bike, MapPin, ChevronRight } from "lucide-react"

export default function AccountPage() {
    const [name, setName] = useState<string | null>(null)
    const [orders, setOrders] = useState<OrderStatusResponse[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token')
        const userName = getUserName()

        if (!token) {
            router.push('/login')
            return
        }

        setName(userName)

        // It saves token and userName.
        // We should update login to save email too, or decode it.
        // For now, let's try to fetch with the userName as a fallback or just empty string and hope backend handles it (it won't).
        // Let's assume the user's email is stored in localStorage "userEmail" for now, I'll add that to login page next.
        const email = localStorage.getItem("userEmail")
        if (email) {
            getMyOrders(email)
                .then(setOrders)
                .catch(console.error)
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [router])

    const handleLogout = () => {
        removeToken()
        window.dispatchEvent(new Event("storage"))
        router.push("/")
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Mi Cuenta</h1>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-3xl">
                            👤
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Hola, {name}</h2>
                            <p className="text-gray-600">Bienvenido a tu perfil</p>
                        </div>
                    </div>

                    {/* Orders Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-bold mb-4">Mis Pedidos</h3>
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                <p className="text-gray-500">No tienes pedidos recientes</p>
                                <Link href="/menu" className="text-red-600 font-bold hover:underline mt-2 inline-block">
                                    Ir al Menú
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <Link
                                        key={order.orderId}
                                        href={`/order/${order.orderId}`}
                                        className="block bg-white border rounded-lg p-4 hover:shadow-md transition group"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-lg">#{order.orderId.split('-')[1]}</span>
                                                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                            order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="font-bold text-red-600">S/{order.total.toFixed(2)}</span>
                                                <ChevronRight className="text-gray-400 group-hover:text-red-600 transition" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        {/* <button
                            onClick={() => router.push('/empleado/pedidos')}
                            className="w-full text-left p-4 border rounded hover:bg-gray-50 flex justify-between items-center"
                        >
                            <span className="font-medium">Mis Pedidos (Vista Empleado)</span>
                            <span>›</span>
                        </button> */}

                        <button
                            onClick={handleLogout}
                            className="w-full text-left p-4 border rounded border-red-200 text-red-600 hover:bg-red-50 flex justify-between items-center font-bold"
                        >
                            <span>Cerrar Sesión</span>
                            <span>›</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
