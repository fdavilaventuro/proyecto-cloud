"use client"

import { Smartphone, Apple } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="https://www.kfc.com.pe/images/kfc/logo.svg"
            alt="KFC Peru"
            width={80}
            height={80}
            className="h-20 w-auto"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">Crea una cuenta o inicia sesión</h1>
        <p className="text-center text-gray-600 mb-8">Ingresa o crea tu cuenta en simples pasos.</p>

        {/* Auth Buttons */}
        <div className="space-y-4 mb-8">
          <button className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 font-bold text-gray-900 hover:bg-gray-50 transition flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <image
                href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath fill='%2334A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/%3E%3Cpath fill='%23FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/%3E%3Cpath fill='%23EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/%3E%3C/svg%3E"
                x="0"
                y="0"
                width="20"
                height="20"
              />
            </svg>
            Continuar con Google
          </button>

          <button className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 font-bold text-gray-900 hover:bg-gray-50 transition flex items-center justify-center gap-3">
            <Smartphone size={20} className="text-gray-900" />
            Continuar con celular
          </button>

          <button className="w-full border-2 border-gray-300 rounded-lg py-3 px-4 font-bold text-gray-900 hover:bg-gray-50 transition flex items-center justify-center gap-3">
            <Apple size={20} className="text-gray-900" />
            Continuar con Apple
          </button>
        </div>

        {/* Footer Link */}
        <div className="text-center">
          <button className="text-gray-900 hover:text-[#e4002b] font-bold transition">Recuperar contraseña</button>
        </div>
      </div>
    </div>
  )
}
