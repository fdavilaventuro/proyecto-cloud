"use client"

import MenuTabs from "./menu-tabs"
import { useEffect, useState } from "react"

export default function MenuContent() {
  const [activeTab, setActiveTab] = useState("mega-futbolero")

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-section]")
      const scrollPosition = window.scrollY + 200

      sections.forEach((section) => {
        const sectionId = section.getAttribute("data-section")
        const sectionTop = (section as HTMLElement).offsetTop
        const sectionBottom = sectionTop + (section as HTMLElement).offsetHeight

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          setActiveTab(sectionId || "")
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <MenuTabs />

      {/* Mega Futbolero Section */}
      <section id="mega-futbolero" data-section="mega-futbolero" className="px-4 md:px-6 py-12">
        <h2 className="text-2xl font-bold mb-8">Mega Futbolero</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Products grid will go here */}
          <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-500">Productos Mega Futbolero</div>
        </div>
      </section>

      {/* Promos Section */}
      <section id="promos" data-section="promos" className="px-4 md:px-6 py-12 bg-gray-50">
        <h2 className="text-2xl font-bold mb-8">Promos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-500">Productos Promos</div>
        </div>
      </section>

      {/* Megas Section */}
      <section id="megas" data-section="megas" className="px-4 md:px-6 py-12">
        <h2 className="text-2xl font-bold mb-8">Megas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-500">Productos Megas</div>
        </div>
      </section>

      {/* Para 2 Section */}
      <section id="para-2" data-section="para-2" className="px-4 md:px-6 py-12 bg-gray-50">
        <h2 className="text-2xl font-bold mb-8">Para 2</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-500">Productos Para 2</div>
        </div>
      </section>

      {/* Sándwiches Section */}
      <section id="sandwiches" data-section="sandwiches" className="px-4 md:px-6 py-12">
        <h2 className="text-2xl font-bold mb-8">Sándwiches & Twister XL</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-500">Productos Sándwiches</div>
        </div>
      </section>

      {/* Big Box Section */}
      <section id="big-box" data-section="big-box" className="px-4 md:px-6 py-12 bg-gray-50">
        <h2 className="text-2xl font-bold mb-8">Big Box</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-500">Productos Big Box</div>
        </div>
      </section>

      {/* Combos Section */}
      <section id="combos" data-section="combos" className="px-4 md:px-6 py-12">
        <h2 className="text-2xl font-bold mb-8">Combos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-500">Productos Combos</div>
        </div>
      </section>

      {/* Complementos Section */}
      <section id="complementos" data-section="complementos" className="px-4 md:px-6 py-12 bg-gray-50">
        <h2 className="text-2xl font-bold mb-8">Complementos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-500">Productos Complementos</div>
        </div>
      </section>

      {/* Postres Section */}
      <section id="postres" data-section="postres" className="px-4 md:px-6 py-12">
        <h2 className="text-2xl font-bold mb-8">Postres</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-500">Productos Postres</div>
        </div>
      </section>

      {/* Bebidas Section */}
      <section id="bebidas" data-section="bebidas" className="px-4 md:px-6 py-12 bg-gray-50">
        <h2 className="text-2xl font-bold mb-8">Bebidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-500">Productos Bebidas</div>
        </div>
      </section>
    </div>
  )
}
