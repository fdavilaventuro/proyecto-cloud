"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { setToken, setUserName } from "@/lib/auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Error al iniciar sesión")
      }

      setToken(data.token)
      if (data.name) {
        setUserName(data.name)
      }
      // Save email for order history fetching
      localStorage.setItem("userEmail", email)

      // Dispatch storage event to update header immediately
      window.dispatchEvent(new Event("storage"))

      // Redirect to intended page or home
      const redirect = searchParams.get("redirect") || "/"
      router.push(redirect)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image
              src="https://www.kfc.com.pe/images/kfc/logo.svg"
              alt="KFC Peru"
              width={80}
              height={80}
              className="h-20 w-auto"
            />
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">Inicia sesión</h1>
        <p className="text-center text-gray-600 mb-8">Ingresa tus credenciales para continuar.</p>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition disabled:bg-gray-400"
          >
            {loading ? "Iniciando sesión..." : "Ingresar"}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center space-y-4">
          <Link href="/register" className="block text-red-600 font-bold hover:underline">
            ¿No tienes cuenta? Regístrate aquí
          </Link>
          <button className="text-gray-500 text-sm hover:text-gray-700 transition">
            Recuperar contraseña
          </button>
        </div>
      </div>
    </div>
  )
}
