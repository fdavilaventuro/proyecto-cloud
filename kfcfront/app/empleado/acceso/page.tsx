"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const EMPLOYEE_CODE = "KFC-EMP-2024";
const EMPLOYEE_FLAG_KEY = "isEmployee";

export default function AccesoEmpleadoPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Si ya está "logueado" como empleado, redirige directo al panel
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isEmployee = localStorage.getItem(EMPLOYEE_FLAG_KEY) === "true";
    if (isEmployee) {
      router.replace("/empleado");
    }
  }, [router]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const trimmed = code.trim();

    if (!trimmed) {
      setError("Ingresa el código de acceso.");
      return;
    }

    if (trimmed === EMPLOYEE_CODE) {
      if (typeof window !== "undefined") {
        localStorage.setItem(EMPLOYEE_FLAG_KEY, "true");
      }
      router.push("/empleado");
    } else {
      setError("Código incorrecto. Consulta con el administrador del local.");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-red-700 mb-2 text-center">
          Acceso para empleados
        </h1>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Esta sección es exclusiva para el personal del restaurante. Ingresa el
          código de acceso proporcionado por la administración.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="employee-code"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Código de empleado
            </label>
            <input
              id="employee-code"
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ej: KFC-EMP-2024"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors"
          >
            Entrar al panel
          </button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <p className="mt-6 text-xs text-gray-400 text-center">
          Demo académica: en un sistema real este acceso estaría integrado con
          autenticación de empleados.
        </p>
      </div>
    </main>
  );
}
