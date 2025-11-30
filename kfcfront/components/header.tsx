"use client"
import { useState } from "react"
import { Menu, Search, MapPin, ShoppingCart, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import SideMenu from "./side-menu"

export default function Header({ onLocationClick }: { onLocationClick?: () => void }) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <>
      <header className="bg-[#e4002b] text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4 mb-3">
            <button onClick={() => setShowMenu(!showMenu)} className="lg:hidden p-1 hover:bg-red-700 rounded">
              {showMenu ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link href="/" className="flex-shrink-0 hover:opacity-80 transition">
              <Image
                src="https://www.kfc.com.pe/images/kfc/logo.svg"
                alt="KFC Peru"
                width={60}
                height={40}
                className="h-10 w-auto"
              />
            </Link>

            <div className="flex-1 max-w-md">
              <div className="relative hidden md:flex">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Buscar &quot;Mega&quot;"
                  className="w-full pl-12 pr-4 py-3 rounded-full text-gray-800 text-sm font-medium"
                />
              </div>
              <div className="flex md:hidden">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10" size={20} />
                <input
                  type="text"
                  placeholder="Buscar"
                  className="w-full pl-12 pr-4 py-3 rounded-full text-gray-800 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4 text-sm md:text-base whitespace-nowrap">
              <button
                onClick={onLocationClick}
                className="hidden md:flex items-center gap-1 hover:bg-red-700 px-2 py-1 rounded"
              >
                <MapPin size={18} />
                <span className="hidden lg:inline">Ingresa tu ubicación</span>
              </button>
              <Link href="/login" className="text-xs md:text-sm hover:bg-red-700 px-2 py-1 rounded transition">
                <div>Hola, identifícate</div>
                <div className="flex items-center gap-1">Inicia sesión</div>
              </Link>
              <Link href="/cart" className="relative hover:bg-red-700 px-2 py-1 rounded transition">
                <ShoppingCart size={20} />
                <span className="absolute -top-2 -right-2 bg-white text-[#e4002b] w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                  0
                </span>
              </Link>
            </div>
          </div>

          <div className="md:hidden flex relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10" size={20} />
            <input
              type="text"
              placeholder="Buscar &quot;Mega&quot;"
              className="w-full pl-12 pr-4 py-3 rounded-full text-gray-800 text-sm font-medium"
            />
          </div>
        </div>
      </header>

      {showMenu && <SideMenu onClose={() => setShowMenu(false)} />}
    </>
  )
}
