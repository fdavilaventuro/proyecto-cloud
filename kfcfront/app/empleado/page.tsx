"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const EMPLOYEE_FLAG_KEY = "isEmployee";

export default function EmpleadoPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isEmployee = localStorage.getItem(EMPLOYEE_FLAG_KEY) === "true";
    if (!isEmployee) {
      router.replace("/empleado/acceso");
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado de la página */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-red-700 mb-4">
            Panel de Empleados KFC
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Bienvenido al sistema de gestión del restaurante. Selecciona tu
            estación de trabajo para visualizar y actualizar el estado de los
            pedidos en tiempo real.
          </p>
          <p className="text-sm text-gray-500 mt-3">
            También puedes{" "}
            <Link
              href="/empleado/pedidos"
              className="text-red-600 font-semibold hover:underline"
            >
              ver todos los pedidos
            </Link>{" "}
            y su progreso en el flujo completo.
          </p>
        </header>

        {/* Contenedor de tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Cocina */}
          <article className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300 p-8 flex flex-col">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Cocina</h2>
              <div className="h-1 w-16 bg-red-600 rounded" />
            </div>
            <p className="text-gray-600 mb-8 flex-grow">
              Visualiza las comandas entrantes, gestiona los tiempos de
              preparación y notifica cuando los alimentos estén listos.
            </p>
            <Link
              href="/empleado/cocina"
              className="block w-full py-3 text-center text-white bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
            >
              Ir a Cocina
            </Link>
          </article>

          {/* Despacho */}
          <article className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300 p-8 flex flex-col">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Despacho
              </h2>
              <div className="h-1 w-16 bg-red-600 rounded" />
            </div>
            <p className="text-gray-600 mb-8 flex-grow">
              Empaqueta los pedidos que salen de cocina, verifica el contenido y
              entrégalos al cliente o asígnalos al repartidor.
            </p>
            <Link
              href="/empleado/despacho"
              className="block w-full py-3 text-center text-white bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
            >
              Ir a Despacho
            </Link>
          </article>

          {/* Reparto */}
          <article className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300 p-8 flex flex-col">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Reparto</h2>
              <div className="h-1 w-16 bg-red-600 rounded" />
            </div>
            <p className="text-gray-600 mb-8 flex-grow">
              Gestiona tus entregas pendientes, visualiza direcciones y confirma
              la entrega final al cliente en su domicilio.
            </p>
            <Link
              href="/empleado/reparto"
              className="block w-full py-3 text-center text-white bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
            >
              Ir a Reparto
            </Link>
          </article>

          {/* Pedidos */}
          <article className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300 p-8 flex flex-col">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedidos</h2>
              <div className="h-1 w-16 bg-red-600 rounded" />
            </div>
            <p className="text-gray-600 mb-8 flex-grow">
              Visualiza todos los pedidos del restaurante, su estado y quién los
              atendió en cada etapa del flujo.
            </p>
            <Link
              href="/empleado/pedidos"
              className="block w-full py-3 text-center text-white bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
            >
              Ver pedidos
            </Link>
          </article>
        </div>
      </div>
    </main>
  );
}
