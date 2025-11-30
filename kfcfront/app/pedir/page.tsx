"use client"

import { useState } from "react"

export default function PedirPage() {
    const [client, setClient] = useState("")
    const [address, setAddress] = useState("")
    const [status, setStatus] = useState<string | null>(null)
    const [orderId, setOrderId] = useState<string | null>(null)

    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

    async function submitOrder(e: React.FormEvent) {
        e.preventDefault()
        setStatus("creating")

        const body = {
            storeId: "S1",
            client,
            address,
            total: 10.0,
            items: [{ productId: "P1", qty: 1, price: 10.0 }]
        }

        try {
            const res = await fetch(`${apiBase}/order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Error creating order')
            setOrderId(data.orderId)
            setStatus("created")
        } catch (err: any) {
            setStatus("error: " + (err.message || String(err)))
        }
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
                <strong>API:</strong> <span className="font-mono">{apiBase}</span>
            </div>

            <div className="mt-4">
                <strong>Estado:</strong> <span className="font-mono">{status}</span>
            </div>

            {orderId && (
                <div className="mt-4">
                    <strong>OrderId:</strong> <span className="font-mono">{orderId}</span>
                    <div className="mt-2">
                        Puedes consultar: <code>{apiBase}/status?orderId={orderId}</code>
                    </div>
                </div>
            )}
        </main>
    )
}
