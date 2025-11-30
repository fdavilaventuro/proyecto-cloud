"use client"
import { useState } from "react"
import type React from "react"

import Link from "next/link"
import Header from "@/components/header"
import LocationModal from "@/components/location-modal"
import { ChevronLeft } from "lucide-react"

export default function VentasCorporativasPage() {
  const [showLocation, setShowLocation] = useState(false)
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    celular: "",
    tipoDocumento: "DNI",
    numeroDocumento: "",
    informacionAdicional: "",
    aceptaPolitica: false,
    autorizaUso: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    alert("Gracias por tu interés. Nos contactaremos pronto.")
  }

  return (
    <main className="bg-white min-h-screen">
      <Header onLocationClick={() => setShowLocation(true)} />
      {showLocation && <LocationModal onClose={() => setShowLocation(false)} />}

      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-red-600">
          <ChevronLeft size={20} />
          <span>Volver</span>
        </Link>
      </div>

      <div className="bg-gradient-to-r from-red-700 to-red-900 text-white px-4 md:px-6 py-12 mb-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">VENTAS CORPORATIVAS</h1>
          <p className="text-lg opacity-90">Get Hungry Leaders</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8">
        <h2 className="text-3xl font-bold mb-2">Contacta a nuestro equipo de Ventas Corporativas</h2>
        <p className="text-gray-600 mb-8">Déjanos tus datos y un asesor se pondrá en contacto</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="nombres"
              placeholder="Ingresar nombres"
              value={formData.nombres}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600"
              required
            />
            <input
              type="text"
              name="apellidos"
              placeholder="Ingresar apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600"
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Ingresar correo electrónico"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600"
            required
          />

          <input
            type="tel"
            name="celular"
            placeholder="Ingresar celular"
            value={formData.celular}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="tipoDocumento"
              value={formData.tipoDocumento}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600"
            >
              <option>DNI</option>
              <option>RUC</option>
              <option>Pasaporte</option>
            </select>
            <input
              type="text"
              name="numeroDocumento"
              placeholder="Ingresar documento"
              value={formData.numeroDocumento}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600"
              required
            />
          </div>

          <textarea
            name="informacionAdicional"
            placeholder="Ingresar comentarios"
            value={formData.informacionAdicional}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600"
          />

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="aceptaPolitica"
                checked={formData.aceptaPolitica}
                onChange={handleChange}
                required
                className="w-5 h-5 border border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">
                Acepto la{" "}
                <a href="#" className="text-red-600 font-semibold hover:underline">
                  Política de Privacidad
                </a>
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="autorizaUso"
                checked={formData.autorizaUso}
                onChange={handleChange}
                className="w-5 h-5 border border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">
                Autorizo el tratamiento de mis datos para fines de prospección y promoción comercial por parte de{" "}
                <a href="#" className="text-red-600 font-semibold hover:underline">
                  KFC y sus Empresas Vinculadas
                </a>
              </span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-8 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Solicitar información
            </button>
            <button
              type="button"
              className="px-8 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Configuración
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
