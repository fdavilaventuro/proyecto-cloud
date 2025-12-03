"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { setToken, setUserName } from "@/lib/auth"

export default function RegisterPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Error al registrarse")
            }

            setToken(data.token)
            setUserName(name)

            // Dispatch storage event to update header immediately
            window.dispatchEvent(new Event("storage"))

            // Redirect to home or previous page
            router.push("/")
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
                <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">Crea tu cuenta</h1>
                <p className="text-center text-gray-600 mb-8">Únete a KFC para ordenar más rápido.</p>

                {/* Register Form */}
                <form onSubmit={handleRegister} className="space-y-4 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Juan Pérez"
                            required
                        />
                    </div>

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
                            minLength={6}
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
                        {loading ? "Creando cuenta..." : "Registrarme"}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="text-center">
                    <Link href="/login" className="text-red-600 font-bold hover:underline">
                        ¿Ya tienes cuenta? Inicia sesión aquí
                    </Link>
                </div>
            </div>
        </div>
    )
}
