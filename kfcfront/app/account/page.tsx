"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import { getUserName, removeToken } from "@/lib/auth"

export default function AccountPage() {
    const [name, setName] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const userName = getUserName()
        if (!userName) {
            router.push("/login")
            return
        }
        setName(userName)
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

                    <div className="space-y-4">
                        <button
                            onClick={() => router.push('/empleado/pedidos')}
                            className="w-full text-left p-4 border rounded hover:bg-gray-50 flex justify-between items-center"
                        >
                            <span className="font-medium">Mis Pedidos (Vista Empleado)</span>
                            <span>›</span>
                        </button>

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
