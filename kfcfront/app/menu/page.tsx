"use client"
import { useState, useEffect, useRef } from "react"
import Header from "@/components/header"
import LocationModal from "@/components/location-modal"
import Link from "next/link"

const categories = [
  { id: "mega-futbolero", name: "Mega Futbolero", price: "$33.80" },
  { id: "promos", name: "Promos", price: "$16.90" },
  { id: "megas", name: "Megas", price: "$29.90" },
  { id: "para-2", name: "Para 2", price: "$25.90" },
  { id: "sandwich-twister", name: "Sándwiches & Twister XL", price: "$109.90" },
  { id: "big-box", name: "Big Box", price: "$27.90" },
  { id: "combos", name: "Combos", price: "$32.90" },
  { id: "complementos", name: "Complementos", price: "$21.90" },
  { id: "postres", name: "Postres" },
  { id: "bebidas", name: "Bebidas" },
]

const products = [
  // Mega Futbolero
  {
    id: 1,
    category: "mega-futbolero",
    name: "Promo Futbolera: Hot Wings",
    description: "14 Hot Wings, 2 Complementos Regulares y 1 Bebida 1L",
    price: 39.9,
    originalPrice: 58.7,
    discount: "-32%",
    image: "https://delosi-pidelo.s3.amazonaws.com/kfc/promotions-strip/para-compartir.jpg",
  },
  {
    id: 2,
    category: "mega-futbolero",
    name: "Mega Futbolero: 7 Piezas",
    description: "7 Piezas de Pollo, 1 Complemento Familiar y 1 Bebida",
    price: 49.9,
    originalPrice: 102,
    discount: "-41%",
    image: "https://delosi-pidelo.s3.amazonaws.com/kfc/promotions-strip/para-dos.jpg",
  },
  {
    id: 3,
    category: "mega-futbolero",
    name: "Mega Futbolero Full: 8 Piezas",
    description: "8 Piezas de Pollo, 6 Nuggets, 1 Complemento Familiar",
    price: 59.9,
    originalPrice: 102,
    discount: "-41%",
    image: "https://delosi-pidelo.s3.amazonaws.com/kfc/promotions-strip/para-ti.jpg",
  },
  // Promos
  {
    id: 4,
    category: "promos",
    name: "Mega Delivery - 6 Piezas",
    description: "6 Piezas de Pollo y 1 Papa Familiar",
    price: 39.9,
    originalPrice: 59.3,
    discount: "-32%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fmega-delivery-6-piezas-202506191742004920.jpg&w=3840&q=75",
  },
  {
    id: 5,
    category: "promos",
    name: "Wings & Krunch: 18 Hot Wings",
    description: "18 Hot Wings y 1 Complemento Familiar",
    price: 37.9,
    originalPrice: 63.2,
    discount: "-40%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fwings-krunch-18-hot-wings-202506161431540070.jpg&w=3840&q=75",
  },
  {
    id: 6,
    category: "promos",
    name: "Dúo Twister XL con Papas",
    description: "2 Twisters XL Tradicionales y 2 Complementos",
    price: 38.9,
    originalPrice: 55.6,
    discount: "-30%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fduo-twister-xl-con-papas-202506161431480487.jpg&w=3840&q=75",
  },
  {
    id: 7,
    category: "promos",
    name: "Mega Promo - 8 Piezas",
    description: "8 Piezas de Pollo y 1 Papa Familiar",
    price: 49.9,
    originalPrice: 75.1,
    discount: "-33%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fmega-promo-8-piezas-202506161431545326.jpg&w=3840&q=75",
  },
  {
    id: 8,
    category: "promos",
    name: "Mega Promo - 10 Piezas",
    description: "10 Piezas de Pollo, 1 Complemento Familiar",
    price: 64.9,
    originalPrice: 100,
    discount: "-35%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fmega-promo-10-piezas-202506191742037381.jpg&w=3840&q=75",
  },
  {
    id: 9,
    category: "promos",
    name: "Mega Promo - 7 Piezas",
    description: "7 Piezas de Pollo, 1 Complemento",
    price: 42.9,
    originalPrice: 65,
    discount: "-34%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fmega-promo-7-piezas-202511062042267516.jpg&w=3840&q=75",
  },
  // Megas
  {
    id: 10,
    category: "megas",
    name: "Mega Salseo",
    description: "6 piezas de pollo, 6 Hot Wings o Nuggets",
    price: 49.9,
    originalPrice: 76.2,
    discount: "-34%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fmega-salseo-202509151007465309.jpg&w=384&q=75",
  },
  {
    id: 11,
    category: "megas",
    name: "Mega Mix: 8 Piezas",
    description: "8 Piezas de Pollo, 6 Nuggets o Hot Wings",
    price: 69.9,
    originalPrice: 103,
    discount: "-32%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fmega-mix-8-piezas-202506160431521944.jpg&w=384&q=75",
  },
  {
    id: 12,
    category: "megas",
    name: "Mega XL: 12 Piezas",
    description: "12 Piezas de Pollo, 6 Nuggets o Hot Wings",
    price: 89.9,
    originalPrice: 138.6,
    discount: "-35%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fmega-xl-12-piezas-202506160431514233.jpg&w=384&q=75",
  },
  {
    id: 13,
    category: "megas",
    name: "Super Mega: 10 Piezas",
    description: "10 Piezas de Pollo, 8 Nuggets o Hot Wings",
    price: 79.9,
    originalPrice: 122.5,
    discount: "-34%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fsuper-mega-10-piezas-202506160431492923.jpg&w=384&q=75",
  },
  {
    id: 14,
    category: "megas",
    name: "Mega Clásico: 6 Piezas",
    description: "6 Piezas de Pollo, 4 Nuggets o Hot Wings",
    price: 59.9,
    originalPrice: 81.7,
    discount: "-26%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fmega-clasico-6-piezas-202506160431502345.jpg&w=384&q=75",
  },
  // Para 2
  {
    id: 15,
    category: "para-2",
    name: "Combo Chick'N Share 18 Nuggets",
    description: "18 Nuggets, 2 complementos",
    price: 43.9,
    originalPrice: 67.4,
    discount: "-34%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fcombo-chick-n-share-18-nuggets-202507251623300783.jpg&w=384&q=75",
  },
  {
    id: 16,
    category: "para-2",
    name: "Chick'N Share Salseo",
    description: "14 Nuggets o Hot Wings bañados",
    price: 34.9,
    originalPrice: 50.3,
    discount: "-30%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fchick-n-share-salseo-202506160431556123.jpg&w=384&q=75",
  },
  {
    id: 17,
    category: "para-2",
    name: "Chick'N Share 3 Piezas + Snacks",
    description: "3 Piezas de Pollo, 6 Nuggets o Hot Wings",
    price: 37.9,
    originalPrice: 51.6,
    discount: "-26%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fchick-n-share-3-piezas-snacks-202506160431548902.jpg&w=384&q=75",
  },
  {
    id: 18,
    category: "para-2",
    name: "Popcorn para 2",
    description: "2 PopCorn Chicken y 2 Complementos",
    price: 32.9,
    originalPrice: 43.6,
    discount: "-24%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fpopcorn-para-2-202506160431541234.jpg&w=384&q=75",
  },
  // Sándwiches & Twister XL
  {
    id: 19,
    category: "sandwich-twister",
    name: "Combo Twister XL Tradicional",
    description: "1 Twister XL Tradicional, 1 Complemento",
    price: 27.9,
    originalPrice: 32.7,
    discount: "-14%",
    image: "https://delosi-pidelo.s3.amazonaws.com/kfc/promotions-strip/sandwich.jpg",
  },
  {
    id: 20,
    category: "sandwich-twister",
    name: "Combo Twister XL Americano",
    description: "1 Twister XL Americano, 1 Complemento",
    price: 28.9,
    originalPrice: 33.7,
    discount: "-14%",
    image: "https://delosi-pidelo.s3.amazonaws.com/kfc/promotions-strip/sandwich.jpg",
  },
  {
    id: 21,
    category: "sandwich-twister",
    name: "Twister XL Tradicional",
    description: "Tortilla de maíz, 2 tenders 100%",
    price: 21.9,
    originalPrice: 25.5,
    discount: "-14%",
    image: "https://delosi-pidelo.s3.amazonaws.com/kfc/promotions-strip/sandwich.jpg",
  },
  // Big Box
  {
    id: 22,
    category: "big-box",
    name: "Big Box Salseo",
    description: "3 piezas de pollo, 3 Hot Wings o Nuggets",
    price: 29.9,
    originalPrice: 47.15,
    discount: "-36%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fbig-box-salseo-202509151007452232.jpg&w=384&q=75",
  },
  {
    id: 23,
    category: "big-box",
    name: "Big Box Wow",
    description: "2 Piezas de Pollo, 3 Nuggets o Hot Wings",
    price: 28.9,
    originalPrice: 41.15,
    discount: "-29%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fbig-box-wow-202506160431535678.jpg&w=384&q=75",
  },
  {
    id: 24,
    category: "big-box",
    name: "Big Box Classic",
    description: "3 Piezas de Pollo, 1 Papa Personal",
    price: 27.9,
    originalPrice: 39.9,
    discount: "-30%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fbig-box-classic-202506160431543456.jpg&w=384&q=75",
  },
  // Combos
  {
    id: 25,
    category: "combos",
    name: "Combo 8 Hot Wings",
    description: "8 Hot Wings, 1 Complemento Regular",
    price: 24.9,
    originalPrice: 33.6,
    discount: "-25%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fcombo-8-hot-wings-202506160431470733.jpg&w=384&q=75",
  },
  {
    id: 26,
    category: "combos",
    name: "Combo 8 Nuggets",
    description: "8 Nuggets, 1 Complemento Regular",
    price: 24.9,
    originalPrice: 32.4,
    discount: "-23%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fcombo-8-nuggets-202506160431523456.jpg&w=384&q=75",
  },
  {
    id: 27,
    category: "combos",
    name: "Combo Clásico: 2 Piezas",
    description: "2 Piezas de Pollo, 1 Complemento",
    price: 21.9,
    originalPrice: 26.7,
    discount: "-17%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fcombo-clasico-2-piezas-202506160431545678.jpg&w=384&q=75",
  },
  {
    id: 28,
    category: "combos",
    name: "Combo Salseo",
    description: "6 Hot Wings o Nuggets bañados",
    price: 24.9,
    originalPrice: 33,
    discount: "-24%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fcombo-salseo-202506160431567890.jpg&w=384&q=75",
  },
  {
    id: 29,
    category: "combos",
    name: "Combo Tenders",
    description: "3 Tenders, 1 Complemento",
    price: 25.9,
    originalPrice: 30.2,
    discount: "-14%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fcombo-tenders-202506160431512345.jpg&w=384&q=75",
  },
  // Complementos
  {
    id: 30,
    category: "complementos",
    name: "Papa Familiar",
    description: "Tradicionales papas fritas (240 gr aprox.)",
    price: 11.9,
    originalPrice: 13.2,
    discount: "-10%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fpapa-familiar-202511112047062691.jpg&w=3840&q=75",
  },
  {
    id: 31,
    category: "complementos",
    name: "Papa Super Familiar",
    description: "Tradicionales papas fritas 450 gr.",
    price: 15.9,
    originalPrice: 18.1,
    discount: "-12%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fpapa-super-familiar-202511112047063795.jpg&w=3840&q=75",
  },
  {
    id: 32,
    category: "complementos",
    name: "Ensalada Familiar",
    description: "Nuestra tradicional ensalada de col",
    price: 11,
    originalPrice: 12.5,
    discount: "-12%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fensalada-familiar-202511112047064725.jpg&w=3840&q=75",
  },
  {
    id: 33,
    category: "complementos",
    name: "Puré Familiar",
    description: "Nuestro tradicional puré de papas con",
    price: 11,
    originalPrice: 12.5,
    discount: "-12%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fpure-familiar-202511112047065545.jpg&w=3840&q=75",
  },
]

export default function MenuPage() {
  const [showLocation, setShowLocation] = useState(false)
  const [activeTab, setActiveTab] = useState("mega-futbolero")
  const tabsRef = useRef<HTMLDivElement>(null)

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

  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <main className="bg-white min-h-screen">
      <Header onLocationClick={() => setShowLocation(true)} />
      {showLocation && <LocationModal onClose={() => setShowLocation(false)} />}

      <div className="sticky top-16 bg-white border-b border-gray-200 z-40">
        <div className="overflow-x-auto" ref={tabsRef}>
          <div className="flex gap-8 px-4 md:px-6 min-w-max">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => scrollToSection(category.id)}
                className={`py-4 whitespace-nowrap font-medium transition-all border-b-2 flex flex-col items-start ${
                  activeTab === category.id
                    ? "border-red-600 text-black"
                    : "border-transparent text-gray-600 hover:text-black"
                }`}
              >
                <span>{category.name}</span>
                {category.price && <span className="text-xs text-gray-500 font-normal">{category.price}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {categories.map((category) => (
        <section
          key={category.id}
          id={category.id}
          data-section={category.id}
          className="px-4 md:px-6 py-12 border-b border-gray-100"
        >
          <h2 className="text-2xl font-bold mb-8">{category.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter((p) => p.category === category.id)
              .map((product) => (
                <Link href={`/product/${product.id}`} key={product.id}>
                  <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl font-bold text-red-600">S/{product.price.toFixed(2)}</span>
                        {product.originalPrice > 0 && (
                          <>
                            <span className="text-gray-400 line-through text-sm">
                              S/{product.originalPrice.toFixed(2)}
                            </span>
                            <span className="text-green-600 font-bold text-sm">{product.discount}</span>
                          </>
                        )}
                      </div>
                      <button className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition">
                        Agregar
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            {products.filter((p) => p.category === category.id).length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <p>No hay productos disponibles en esta categoría</p>
              </div>
            )}
          </div>
        </section>
      ))}
    </main>
  )
}
