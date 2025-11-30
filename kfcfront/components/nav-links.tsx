"use client"
import Link from "next/link"
import { Menu, Building2 } from "lucide-react"

export default function NavLinks() {
  return (
    <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <Link
          href="/menu"
          className="flex items-center gap-2 text-gray-800 hover:text-red-600 font-semibold transition"
        >
          <Menu size={20} />
          <span>Menú</span>
        </Link>
        <Link
          href="/ventas-corporativas"
          className="flex items-center gap-2 text-gray-800 hover:text-red-600 font-semibold transition"
        >
          <Building2 size={20} />
          <span>Ventas Corporativas</span>
        </Link>
      </div>
    </div>
  )
}
