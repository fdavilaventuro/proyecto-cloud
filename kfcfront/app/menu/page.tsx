"use client"
import { useState, useEffect, useRef } from "react"
import Header from "@/components/header"
import LocationModal from "@/components/location-modal"
import Link from "next/link"

const categories = [
  { id: "promos", name: "Promos" },
  { id: "megas", name: "Megas" },
  { id: "para-2", name: "Para 2" },
  { id: "sandwich-twister", name: "Sándwiches & Twister XL" },
  { id: "big-box", name: "Big Box" },
  { id: "combos", name: "Combos" },
  { id: "complementos", name: "Complementos" },
  { id: "postres", name: "Postres" },
  { id: "bebidas", name: "Bebidas" },
]

const products = [
  // Promos
  {
    id: 4,
    category: "promos",
    name: "Mega Delivery - 6 Piezas",
    description: "6 Piezas de Pollo y 1 Papa Familiar",
    price: 39.9,
    originalPrice: 59.3,
    discount: "-32%",
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fmega-delivery-6-piezas-202506191742003730.jpg&w=3840&q=75",
  },
  {
    id: 5,
    category: "promos",
    name: "Wings & Krunch: 18 Hot Wings",
    description: "18 Hot Wings y 1 Complemento Familiar",
    price: 37.9,
    originalPrice: 63.2,
    discount: "-40%",
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fwings-krunch-18-hot-wings-202506161431538399.jpg&w=3840&q=75",
  },
  {
    id: 6,
    category: "promos",
    name: "Dúo Twister XL con Papas",
    description: "2 Twisters XL Tradicionales y 2 Complementos",
    price: 38.9,
    originalPrice: 55.6,
    discount: "-30%",
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fduo-twister-xl-con-papas-202506161431478822.jpg&w=3840&q=75",
  },
  {
    id: 7,
    category: "promos",
    name: "Mega Promo - 8 Piezas",
    description: "8 Piezas de Pollo y 1 Papa Familiar",
    price: 49.9,
    originalPrice: 75.1,
    discount: "-33%",
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fmega-promo-8-piezas-202506161431542561.jpg&w=3840&q=75",
  },
  {
    id: 8,
    category: "promos",
    name: "Mega Promo - 10 Piezas",
    description: "10 Piezas de Pollo, 1 Complemento Familiar",
    price: 64.9,
    originalPrice: 100,
    discount: "-35%",
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fmega-promo-10-piezas-202506191742036452.jpg&w=3840&q=75",
  },
  {
    id: 9,
    category: "promos",
    name: "Krunchy Dúo",
    description: "2 Krunchys y 1 Complemento Familiar",
    price: 24.9,
    originalPrice: 33.7,
    discount: "-26%",
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fkrunchy-duo-202506161431472213.jpg&w=3840&q=75",
  },
  // Megas
  {
    id: 10,
    category: "megas",
    name: "Mega Navidad",
    description: "6 Piezas de Pollo, 6 Hot Wings o Nuggets, 1 Complemento Familiar",
    price: 49.9,
    originalPrice: 80.1,
    discount: "-38%",
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fmega-navidad-202511201432508045.jpg&w=384&q=75",
  },
  {
    id: 11,
    category: "megas",
    name: "Mega Mix: 8 Piezas",
    description: "8 Piezas de Pollo, 6 Nuggets o Hot Wings",
    price: 69.9,
    originalPrice: 103,
    discount: "-32%",
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fmega-mix-8-piezas-202506160431521944.jpg&w=384&q=75",
  },
  {
    id: 12,
    category: "megas",
    name: "Super Mega: 10 Piezas",
    description: "10 Piezas de Pollo, 8 Nuggets o Hot Wings",
    price: 79.9,
    originalPrice: 122.5,
    discount: "-35%",
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fsuper-mega-10-piezas-202506160431531124.jpg&w=384&q=75",
  },
  {
    id: 13,
    category: "megas",
    name: "Mega XL: 12 Piezas",
    description: "12 Piezas de Pollo, 6 Nuggets o Hot Wings",
    price: 89.9,
    originalPrice: 138.6,
    discount: "-35%",
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fmega-xl-12-piezas-202506160431492821.jpg&w=384&q=75",
  },
  // Para 2
  {
    id: 15,
    category: "para-2",
    name: "Combo Chick'N Share 18 Nuggets",
    description: "18 Nuggets, 2 complementos regulares",
    price: 43.9,
    originalPrice: 67.4,
    discount: "-35%",
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fcombo-chick-n-share-18-nuggets-202507251623300783.jpg&w=384&q=75",
  },
  {
    id: 16,
    category: "para-2",
    name: "Chick'N Share 3 Piezas + Snacks",
    description: "3 Piezas de Pollo, 6 Nuggets o Hot Wings",
    price: 37.9,
    originalPrice: 51.6,
    discount: "-27%",
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fchick-n-share-3-piezas-snacks-202506161431517860.jpg&w=384&q=75",
  },
  {
    id: 17,
    category: "para-2",
    name: "Popcorn para 2",
    description: "2 PopCorn Chicken y 2 Complementos Regulares",
    price: 32.9,
    originalPrice: 43.6,
    discount: "-25%",
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fpopcorn-para-2-202507101450460538.jpg&w=384&q=75",
  },
  // Sándwiches & Twister XL
  {
    id: 19,
    category: "sandwich-twister",
    name: "Combo Twister XL Tradicional",
    description: "1 Twister XL Tradicional, 1 Complemento",
    price: 27.9,
    originalPrice: 32.7,
    discount: "-15%",
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fcombo-twister-xl-tradicional-202506160431460844.jpg&w=384&q=75",
  },
  {
    id: 20,
    category: "sandwich-twister",
    name: "Combo Twister XL Americano",
    description: "1 Twister XL Americano, 1 Complemento",
    price: 28.9,
    originalPrice: 33.7,
    discount: "-14%",
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fcombo-twister-xl-americano-202506160431500330.jpg&w=384&q=75",
  },
  // Big Box
  {
    id: 22,
    category: "big-box",
    name: "Big Box Navidad",
    description: "3 piezas de pollo, 4 Nuggets",
    price: 29.9,
    originalPrice: 49.4,
    discount: "-39%",
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fbig-box-navidad-202511201432530944.jpg&w=384&q=75",
  },
  {
    id: 23,
    category: "big-box",
    name: "Big Box Wow",
    description: "2 Piezas de Pollo, 3 Nuggets o Hot Wings",
    price: 28.9,
    originalPrice: 41.15,
    discount: "-30%",
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fbig-box-wow-202506160431505385.jpg&w=384&q=75",
  },
  {
    id: 24,
    category: "big-box",
    name: "Big Box Classic",
    description: "3 Piezas de Pollo, 1 Papa Personal",
    price: 27.9,
    originalPrice: 27.9,
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fbig-box-classic-202510221536466605.jpg&w=384&q=75",
  },
  // Combos
  {
    id: 25,
    category: "combos",
    name: "Combo 8 Hot Wings",
    description: "8 Hot Wings, 1 Complemento Regular",
    price: 24.9,
    originalPrice: 33.6,
    discount: "-26%",
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fcombo-8-hot-wings-202506160431470733.jpg&w=384&q=75",
  },
  {
    id: 26,
    category: "combos",
    name: "Combo 8 Nuggets",
    description: "8 Nuggets, 1 Complemento Regular",
    price: 24.9,
    originalPrice: 32.4,
    discount: "-23%",
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fcombo-8-nuggets-202506160431467787.jpg&w=384&q=75",
  },
  {
    id: 27,
    category: "combos",
    name: "Combo Clásico: 2 Piezas",
    description: "2 Piezas de Pollo, 1 Complemento",
    price: 21.9,
    originalPrice: 26.7,
    discount: "-18%",
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fcombo-clasico-2-piezas-202506160431464846.jpg&w=384&q=75",
  },
  // Complementos
  {
    id: 30,
    category: "complementos",
    name: "Papa Familiar",
    description: "Tradicionales papas fritas (240 gr aprox.)",
    price: 11.9,
    originalPrice: 11.9,
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fpapa-familiar-202506160431489482.jpg&w=3840&q=75",
  },
  {
    id: 31,
    category: "complementos",
    name: "Papa Super Familiar",
    description: "Tradicionales papas fritas 450 gr.",
    price: 15.9,
    originalPrice: 18.1,
    discount: "-12%",
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fpapa-super-familiar-202506160431519379.jpg&w=3840&q=75",
  },
  {
    id: 32,
    category: "complementos",
    name: "Ensalada Familiar",
    description: "Nuestra tradicional ensalada de col",
    price: 11,
    originalPrice: 12.5,
    discount: "-12%",
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fensalada-familiar-202506160431528586.jpg&w=3840&q=75",
  },
  {
    id: 33,
    category: "complementos",
    name: "Puré Familiar",
    description: "Nuestro tradicional puré de papas",
    price: 11,
    originalPrice: 12.5,
    discount: "-12%",
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fpure-familiar-202506201432024958.jpg&w=3840&q=75",
  },
  // Postres
  {
    id: 34,
    category: "postres",
    name: "Pie de Manzana",
    description: "Delicioso y crocante pie relleno de manzana",
    price: 6.9,
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fpie-de-manzana-202505160431521970.jpg&w=3840&q=75",
  },
  {
    id: 35,
    category: "postres",
    name: "Mousse de Lúcuma",
    description: "Mousse de Lúcuma Personal",
    price: 5.9,
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fmousse-de-lucuma-202506161431528220.jpg&w=3840&q=75",
  },
  {
    id: 36,
    category: "postres",
    name: "Tres Leches de Chocolate",
    description: "Tres Leches de Chocolate Personal",
    price: 5.9,
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Ftres-leches-de-chocolate-202506161431469054.jpg&w=3840&q=75",
  },
  {
    id: 37,
    category: "postres",
    name: "Tres Leches de Vainilla",
    description: "Tres Leches de Vainilla Personal",
    price: 5.9,
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Ftres-leches-de-vainilla-202506161431503208.jpg&w=3840&q=75",
  },
  // Bebidas
  {
    id: 38,
    category: "bebidas",
    name: "Coca-Cola Sin Azúcar 1L",
    description: "Coca-Cola Sin Azúcar 1L",
    price: 7,
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fcoca-cola-sin-azucar-1l-202506191651291492.jpg&w=3840&q=75",
  },
  {
    id: 39,
    category: "bebidas",
    name: "Inca Kola Sin Azúcar 500ml",
    description: "Inca Cola sin azúcar Personal",
    price: 4.9,
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Finca-kola-sin-azucar-500-ml-202506191651281710.jpg&w=3840&q=75",
  },
  {
    id: 40,
    category: "bebidas",
    name: "Sprite 500ml",
    description: "Sprite Personal",
    price: 4.9,
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fsprite-500-ml-202506191651292072.jpg&w=3840&q=75",
  },
  {
    id: 41,
    category: "bebidas",
    name: "Fanta 500ml",
    description: "Fanta Personal",
    price: 4.9,
    image: "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Ffanta-500-ml-202506191651303714.jpg&w=3840&q=75",
  },
]

export default function MenuPage() {
  const [showLocation, setShowLocation] = useState(false)
  const [activeTab, setActiveTab] = useState("promos")
  const [cart, setCart] = useState<any[]>([])
  const tabsRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("kfc-cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }

    // Check for hash in URL to scroll to specific category
    const hash = window.location.hash.replace('#', '')
    if (hash && categories.find(c => c.id === hash)) {
      setActiveTab(hash)
      setTimeout(() => {
        const section = document.getElementById(hash)
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }, [])

  const addToCart = (product: any) => {
    const newCart = [...cart, product]
    setCart(newCart)
    localStorage.setItem("kfc-cart", JSON.stringify(newCart))
    alert(`${product.name} agregado al carrito`)
  }

  const filteredProducts = products.filter(p => p.category === activeTab)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Category Tabs */}
      <div className="sticky top-16 z-10 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto py-4" ref={tabsRef}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveTab(cat.id)
                  const section = document.getElementById(cat.id)
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
                className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-all ${activeTab === cat.id
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8" id={activeTab}>
        <h2 className="text-3xl font-bold mb-6 capitalize">{categories.find(c => c.id === activeTab)?.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {product.discount && (
                  <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm font-bold">
                    {product.discount}
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">S/{product.price.toFixed(2)}</p>
                    {product.originalPrice && product.originalPrice !== product.price && (
                      <p className="text-sm text-gray-400 line-through">S/{product.originalPrice.toFixed(2)}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 active:bg-red-800 transition-colors"
                >
                  Agregar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showLocation && <LocationModal onClose={() => setShowLocation(false)} />}
    </div>
  )
}
