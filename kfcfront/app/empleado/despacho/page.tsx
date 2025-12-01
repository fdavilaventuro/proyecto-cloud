"use client";

import React, { useState } from "react";
import { API_BASE, authFetch } from "@/lib/auth";

const apiBase = API_BASE;


export default function DespachoPage() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const trimmedId = orderId.trim();
    if (!trimmedId) {
      setError("Ingresa un ID de pedido.");
      return;
    }

    setLoading(true);
    try {
      const res = await authFetch(
  `${apiBase}/employee/order/${encodeURIComponent(trimmedId)}/packed`,
  {
    method: "PUT",
  }
);

      let data: any = {};
      try {
        data = await res.json();
      } catch {}

      if (!res.ok) {
        setError(data?.error || "No se pudo marcar el pedido como empacado.");
      } else {
        setMessage(
          data?.message || "Pedido marcado como EMPACADO correctamente."
        );
      }
    } catch (err) {
      setError("Error de red al contactar la API del backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-red-700 mb-4">Vista Despacho</h1>
        <p className="text-gray-600 mb-6">
          Aquí el personal de despacho puede marcar los pedidos como{" "}
          <span className="font-mono">PACKED</span> cuando ya están revisados y
          listos para entregar o enviar a reparto.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="orderId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ID del pedido
            </label>
            <input
              id="orderId"
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Ej: ORD-1234"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !orderId.trim()}
            className="w-full py-2.5 rounded-lg bg-red-600 text-white font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
          >
            {loading ? "Actualizando..." : "Marcar como empacado"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            {message}
          </p>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
