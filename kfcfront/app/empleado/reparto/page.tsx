"use client";

import React, { useState } from "react";
import { API_BASE, authFetch } from "@/lib/auth";

const apiBase = API_BASE;


export default function RepartoPage() {
  const [orderId, setOrderId] = useState("");
  const [deliveryPerson, setDeliveryPerson] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const trimmedId = orderId.trim();
    const trimmedName = deliveryPerson.trim();

    if (!trimmedId) {
      setError("Ingresa un ID de pedido.");
      return;
    }
    if (!trimmedName) {
      setError("Ingresa el nombre del repartidor.");
      return;
    }

    setLoading(true);
    try {
      const res = await authFetch(
        `${apiBase}/employee/order/${encodeURIComponent(trimmedId)}/deliver`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ deliveryPerson: trimmedName }),
        }
      );


      let data: any = {};
      try {
        data = await res.json();
      } catch { }

      if (!res.ok) {
        setError(
          data?.error || "No se pudo actualizar el estado del pedido a entregado."
        );
      } else {
        setMessage(
          data?.message ||
          "Pedido asignado / marcado como entregado correctamente."
        );
      }
    } catch (err) {
      setError("Error de red al contactar la API del backend.");
    } finally {
      setLoading(false);
    }
  }

  const [deliveredOrderId, setDeliveredOrderId] = useState("");

  async function handleDelivered(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const trimmedId = deliveredOrderId.trim();
    if (!trimmedId) {
      setError("Ingresa un ID de pedido para marcar como entregado.");
      return;
    }

    setLoading(true);
    try {
      const res = await authFetch(
        `${apiBase}/employee/order/${encodeURIComponent(trimmedId)}/delivered`,
        {
          method: "PUT",
        }
      );

      let data: any = {};
      try {
        data = await res.json();
      } catch { }

      if (!res.ok) {
        setError(data?.error || "No se pudo marcar el pedido como entregado.");
      } else {
        setMessage(data?.message || "Pedido marcado como entregado correctamente.");
        setDeliveredOrderId("");
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
        <h1 className="text-3xl font-bold text-red-700 mb-4">Vista Reparto</h1>
        <p className="text-gray-600 mb-6">
          Aquí el repartidor puede registrar quién atiende el pedido y marcarlo
          como{" "}
          <span className="font-mono">DELIVERED</span> cuando se complete la
          entrega al cliente.
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

          <div>
            <label
              htmlFor="deliveryPerson"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre del repartidor
            </label>
            <input
              id="deliveryPerson"
              type="text"
              value={deliveryPerson}
              onChange={(e) => setDeliveryPerson(e.target.value)}
              placeholder="Ej: Juan Pérez"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !orderId.trim() || !deliveryPerson.trim()}
            className="w-full py-2.5 rounded-lg bg-red-600 text-white font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
          >
            {loading ? "Actualizando..." : "Registrar entrega"}
          </button>
        </form>

        <hr className="my-8 border-gray-200" />

        <h2 className="text-xl font-bold text-gray-800 mb-4">Confirmar Entrega</h2>
        <p className="text-gray-600 mb-4 text-sm">
          Ingresa el ID del pedido que acabas de entregar al cliente.
        </p>

        <form onSubmit={handleDelivered} className="space-y-4">
          <div>
            <label
              htmlFor="deliveredOrderId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ID del pedido entregado
            </label>
            <input
              id="deliveredOrderId"
              type="text"
              value={deliveredOrderId}
              onChange={(e) => setDeliveredOrderId(e.target.value)}
              placeholder="Ej: ORD-1234"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !deliveredOrderId.trim()}
            className="w-full py-2.5 rounded-lg bg-green-600 text-white font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
          >
            {loading ? "Actualizando..." : "Marcar como Entregado"}
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
