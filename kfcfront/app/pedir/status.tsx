"use client"

import { useState } from "react"

export default function StatusPage() {
    const [orderId, setOrderId] = useState("")
    const [status, setStatus] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

    async function fetchStatus() {
        if (!orderId) return
        setLoading(true)
        try {
            const res = await fetch(`${apiBase}/status?orderId=${encodeURIComponent(orderId)}`)
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Error fetching status')
            setStatus(data)
        } catch (err: any) {
            setStatus({ error: err.message || String(err) })
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Consultar Estado de Pedido</h1>

            <div className="flex gap-2">
                <input value={orderId} onChange={e => setOrderId(e.target.value)} placeholder="ORD-XXXX" className="p-2 border rounded flex-1" />
                <button onClick={fetchStatus} className="px-4 py-2 bg-red-600 text-white rounded">Consultar</button>
            </div>

            <div className="mt-6">
                {loading && <div>Cargando...</div>}
                {status && !status.error && (
                    <div>
                        <div><strong>ID:</strong> <span className="font-mono">{status.id}</span></div>
                        <div><strong>Estado actual:</strong> <span className="font-mono">{status.currentStatus}</span></div>
                        <div className="mt-2"><strong>Historial:</strong>
                            <ul className="list-disc pl-6 mt-2">
                                {(status.statusHistory || []).map((h: any, i: number) => (
                                    <li key={i}>{h.status} — {h.timestamp}</li>
                                ))}
                            </ul>
                        </div>
                        <pre className="mt-4 bg-gray-100 p-3 overflow-auto">{JSON.stringify(status, null, 2)}</pre>
                    </div>
                )}
                {status && status.error && (
                    <div className="text-red-600">Error: {status.error}</div>
                )}
            </div>

        </main>
    )
}
