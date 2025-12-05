"use client";

import React, { useEffect, useState } from "react";
import { API_BASE, authFetch } from "@/lib/auth";

const apiBase = API_BASE;


type Order = {
  id: string;
  status: string;
  customerName?: string;
  createdAt?: string;
  updatedAt?: string;
  kitchenReadyAt?: string;
  packedAt?: string;
  deliveredAt?: string;
  chef?: string;
  packer?: string;
  deliveryPerson?: string;
  // cualquier otro campo que devuelva la API se ignora sin romper nada
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  IN_KITCHEN: "En cocina",
  KITCHEN_READY: "Listo en cocina",
  PACKED: "Empacado",
  ON_DELIVERY: "En reparto",
  DELIVERED: "Entregado",
};

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value; // por si viene en otro formato
  return date.toLocaleString();
}

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");

  async function fetchOrders() {
    setLoading(true);
    setError(null);

    try {
      const res = await authFetch(`${apiBase}/employee/orders`, {
        cache: "no-store",
      });


      let data: any = [];
      try {
        data = await res.json();
      } catch {
        // si no devuelve json, dejamos el array vacío
      }

      if (!res.ok) {
        setError(
          data?.error || "No se pudieron obtener los pedidos desde la API."
        );
        setOrders([]);
        return;
      }

      // Normalizamos un poco los campos esperados
      const normalized: Order[] = (data || []).map((raw: any) => ({
        id: String(raw.id ?? raw.orderId ?? ""),
        status: String(raw.status ?? "UNKNOWN"),
        customerName: raw.customerName ?? raw.customer ?? undefined,
        createdAt: raw.createdAt ?? raw.created_at ?? undefined,
        updatedAt: raw.updatedAt ?? raw.updated_at ?? undefined,
        kitchenReadyAt: raw.kitchenReadyAt ?? raw.kitchen_ready_at ?? undefined,
        packedAt: raw.packedAt ?? raw.packed_at ?? undefined,
        deliveredAt: raw.deliveredAt ?? raw.delivered_at ?? undefined,
        chef: raw.chef ?? raw.cook ?? undefined,
        packer: raw.packer ?? raw.packingEmployee ?? undefined,
        deliveryPerson:
          raw.deliveryPerson ?? raw.delivery_person ?? raw.rider ?? undefined,
      }));

      // Sort by createdAt descending (newest first)
      normalized.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });

      setOrders(normalized);
    } catch (err) {
      setError("Error de red al contactar la API del backend.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = statusFilter
    ? orders.filter((o) => o.status === statusFilter)
    : orders;

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md border border-gray-200 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-red-700 mb-1">
              Pedidos del restaurante
            </h1>
            <p className="text-gray-600 text-sm">
              Visualiza el estado actual de cada pedido y el avance en el
              flujo: cocina, despacho y reparto.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-700">
              Filtrar por estado:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Todos</option>
              <option value="PENDING">Pendiente</option>
              <option value="IN_KITCHEN">En cocina</option>
              <option value="KITCHEN_READY">Listo en cocina</option>
              <option value="PACKED">Empacado</option>
              <option value="ON_DELIVERY">En reparto</option>
              <option value="DELIVERED">Entregado</option>
            </select>

            <button
              type="button"
              onClick={fetchOrders}
              className="text-sm px-3 py-1.5 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 transition-colors"
            >
              Actualizar
            </button>
          </div>
        </div>

        {loading && (
          <p className="text-sm text-gray-600 mb-3">
            Cargando pedidos desde la API...
          </p>
        )}

        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        {!loading && !error && filteredOrders.length === 0 && (
          <p className="text-sm text-gray-500">
            No hay pedidos para mostrar en este momento.
          </p>
        )}

        {filteredOrders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">
                    Cliente
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">
                    Estado
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">
                    Creado
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">
                    Listo cocina
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">
                    Empacado
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">
                    Entregado
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">
                    Personal
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-3 py-2 font-mono text-xs">
                      {order.id || "-"}
                    </td>
                    <td className="px-3 py-2">
                      {order.customerName || "-"}
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center rounded-full bg-red-50 text-red-700 px-2 py-0.5 text-xs font-semibold">
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-3 py-2">
                      {formatDate(order.kitchenReadyAt)}
                    </td>
                    <td className="px-3 py-2">
                      {formatDate(order.packedAt)}
                    </td>
                    <td className="px-3 py-2">
                      {formatDate(order.deliveredAt)}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      <div>
                        <span className="font-semibold">Chef:</span>{" "}
                        {order.chef || "-"}
                      </div>
                      <div>
                        <span className="font-semibold">Despacho:</span>{" "}
                        {order.packer || "-"}
                      </div>
                      <div>
                        <span className="font-semibold">Reparto:</span>{" "}
                        {order.deliveryPerson || "-"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
