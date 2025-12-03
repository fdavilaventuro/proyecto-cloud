"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

const menuItems = [
  { label: "Mega Futbolero", href: "/menu#mega-futbolero" },
  { label: "Promos", href: "/menu#promos" },
  { label: "Megas", href: "/menu#megas" },
  { label: "Para 2", href: "/menu#para-2" },
  { label: "Sándwiches & Twister XL", href: "/menu#sandwich-twister" },
  { label: "Big Box", href: "/menu#big-box" },
  { label: "Combos", href: "/menu#combos" },
  { label: "Complementos", href: "/menu#complementos" },
  { label: "Postres", href: "/menu#postres" },
  { label: "Bebidas", href: "/menu#bebidas" },
]

export default function SideMenu({ onClose }: { onClose?: () => void }) {
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    const name = localStorage.getItem("userName")
    setUserName(name)
  }, [])

  const handleNavigation = () => {
    onClose?.()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={handleNavigation}>
      <div
        className="absolute left-0 top-0 bottom-0 w-64 bg-red-600 text-white overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Link href={userName ? "/account" : "/login"} onClick={handleNavigation} className="flex items-center gap-2 mb-4 pb-4 border-b border-red-700 hover:bg-red-700 p-2 rounded -mx-2 transition">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-red-600 font-bold">👤</span>
          </div>
          <span className="font-bold">{userName ? `Hola, ${userName}` : "Iniciar sesión / Registrarse"}</span>
        </Link>

        <div className="space-y-2">
          <Link
            href="/"
            onClick={handleNavigation}
            className="flex items-center gap-2 hover:bg-red-700 p-2 rounded transition"
          >
            <span>🏠</span>
            <span>Inicio</span>
          </Link>
          <Link
            href="/ventas-corporativas"
            onClick={handleNavigation}
            className="flex items-center gap-2 hover:bg-red-700 p-2 rounded transition"
          >
            <span>🏢</span>
            <span>Ventas Corporativas</span>
          </Link>
        </div>


        <div className="p-4">
          <h3 className="font-bold mb-3 text-sm">Menu</h3>
          <div className="space-y-2">
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                onClick={handleNavigation}
                className="flex items-center justify-between hover:bg-red-700 p-2 rounded cursor-pointer transition"
              >
                <span>{item.label}</span>
                <span>›</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
