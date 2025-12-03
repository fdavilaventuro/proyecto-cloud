"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { API_BASE, getToken, authFetch } from "@/lib/auth"

export default function PedirPage() {
    const [client, setClient] = useState("")
    const [address, setAddress] = useState("")
    const [status, setStatus] = useState<string | null>(null)
    const [orderId, setOrderId] = useState<string | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const token = getToken()
        if (!token) {
            setStatus("error: No estás autenticado. Redirigiendo al login...")
            setTimeout(() => router.push("/login"), 2000)
        } else {
            setIsAuthenticated(true)
        }
    }, [router])

    async function submitOrder(e: React.FormEvent) {
        e.preventDefault()

        if (!isAuthenticated) {
            setStatus("error: Debes iniciar sesión primero")
            return
        }

        setStatus("creating")

        const body = {
            storeId: "S1",
            client,
            address,
            total: 10.0,
            items: [{ productId: "P1", qty: 1, price: 10.0 }]
        }

        try {
            const res = await authFetch(`${API_BASE}/order`, {
                method: "POST",
                body: JSON.stringify(body)
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || data.message || 'Error creating order')
            }

            const data = await res.json()
            setOrderId(data.orderId)
            setStatus("created")
        } catch (err: any) {
            setStatus("error: " + (err.message || String(err)))
        }
    }

    if (!isAuthenticated && status?.includes("autenticado")) {
        return (
            <main className="p-8 max-w-2xl mx-auto">
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                    <p className="text-yellow-800">{status}</p>
                </div>
            </main>
        )
    }

    return (
        <main className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Pedir Online (Demo)</h1>
            <form onSubmit={submitOrder} className="flex flex-col gap-3">
                <input placeholder="Nombre" value={client} onChange={e => setClient(e.target.value)} className="p-2 border rounded" />
                <input placeholder="Dirección" value={address} onChange={e => setAddress(e.target.value)} className="p-2 border rounded" />
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-red-600 text-white rounded" type="submit">Enviar pedido</button>
                </div>
            </form>

            <div className="mt-6">
                <strong>API:</strong> <span className="font-mono">{API_BASE}</span>
            </div>

            <div className="mt-4">
                <strong>Estado:</strong> <span className="font-mono">{status}</span>
            </div>

            {orderId && (
                <div className="mt-4">
                    <strong>OrderId:</strong> <span className="font-mono">{orderId}</span>
                    <div className="mt-2">
                        Puedes consultar: <code>{API_BASE}/status?orderId={orderId}</code>
                    </div>
                </div>
            )}
        </main>
    )
}
