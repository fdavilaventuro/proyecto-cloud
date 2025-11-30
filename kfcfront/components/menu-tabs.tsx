"use client"

import { useState, useRef } from "react"

interface Category {
  id: string
  label: string
  price?: string
}

const categories: Category[] = [
  { id: "mega-futbolero", label: "Mega Futbolero", price: "$33.80" },
  { id: "promos", label: "Promos", price: "$16.90" },
  { id: "megas", label: "Megas", price: "$29.90" },
  { id: "para-2", label: "Para 2", price: "$25.90" },
  { id: "sandwiches", label: "Sándwiches & Twister XL", price: "$109.90" },
  { id: "big-box", label: "Big Box", price: "$27.90" },
  { id: "combos", label: "Combos", price: "$32.90" },
  { id: "complementos", label: "Complementos", price: "$21.90" },
  { id: "postres", label: "Postres" },
  { id: "bebidas", label: "Bebidas" },
]

export default function MenuTabs() {
  const [activeTab, setActiveTab] = useState("mega-futbolero")
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="sticky top-16 bg-white border-b border-gray-200 z-40">
      <div className="overflow-x-auto" ref={scrollContainerRef}>
        <div className="flex gap-8 px-4 md:px-6 min-w-max">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => scrollToSection(category.id)}
              className={`py-4 whitespace-nowrap font-medium transition-all border-b-2 ${
                activeTab === category.id
                  ? "border-red-600 text-black"
                  : "border-transparent text-gray-600 hover:text-black"
              }`}
            >
              <div>{category.label}</div>
              {category.price && <div className="text-sm text-gray-500">{category.price}</div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
