"use client"
import { useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import Link from "next/link"

const promos = [
  {
    id: 1,
    name: "Mega Delivery - 6 Piezas",
    description: "6 Piezas de Pollo y 1 Papa Familiar",
    originalPrice: 59.3,
    price: 39.9,
    discount: "-32%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fmega-delivery-6-piezas-202506191742004920.jpg&w=3840&q=75",
  },
  {
    id: 2,
    name: "Wings & Krunch: 18 Hot Wings",
    description: "18 Hot Wings y 1 Complemento Familiar",
    originalPrice: 63.2,
    price: 37.9,
    discount: "-40%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fwings-krunch-18-hot-wings-202506161431540070.jpg&w=3840&q=75",
  },
  {
    id: 3,
    name: "Dúo Twister XL con Papas",
    description: "2 Twisters XL Tradicionales y 2 Complementos",
    originalPrice: 55.6,
    price: 38.9,
    discount: "-30%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fduo-twister-xl-con-papas-202506161431480487.jpg&w=3840&q=75",
  },
  {
    id: 4,
    name: "Mega Promo - 8 Piezas",
    description: "8 Piezas de Pollo y 1 Papa Familiar",
    originalPrice: 75.1,
    price: 49.9,
    discount: "-33%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fmega-promo-8-piezas-202506161431545326.jpg&w=3840&q=75",
  },
  {
    id: 5,
    name: "Mega Promo - 10 Piezas",
    description: "10 Piezas de Pollo, 1 Complemento Familiar",
    originalPrice: 100.0,
    price: 64.9,
    discount: "-35%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fmega-promo-10-piezas-202506191742037381.jpg&w=3840&q=75",
  },
  {
    id: 6,
    name: "Mega Promo - 7 Piezas",
    description: "7 Piezas de Pollo, 1 Complemento",
    originalPrice: 65.0,
    price: 42.9,
    discount: "-34%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fmega-promo-7-piezas-202511062042267516.jpg&w=3840&q=75",
  },
]

export default function PromoCards() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300
      if (direction === "left") {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      } else {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
      }
    }
  }

  return (
    <div className="relative w-full overflow-x-auto hide-scrollbar -mx-4 px-4">
      <button
        onClick={() => scroll("left")}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full hidden md:flex items-center justify-center"
      >
        <ChevronLeft size={20} />
      </button>

      <div ref={scrollRef} className="flex gap-4 pb-2 min-w-min">
        {promos.map((promo) => (
          <Link href={`/product/${promo.id}`} key={promo.id}>
            <div className="flex-shrink-0 w-72 bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow group cursor-pointer border border-gray-100">
              <div className="relative h-48 w-full overflow-hidden bg-red-100">
                <Image
                  src={promo.image || "/placeholder.svg"}
                  alt={promo.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute bottom-3 right-3 bg-white rounded-lg p-2 hover:bg-gray-100 transition-colors shadow-md">
                  <Plus size={20} className="text-gray-700" />
                </button>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-sm mb-1 text-gray-900">{promo.name}</h3>
                <p className="text-xs text-gray-600 mb-3">{promo.description}</p>

                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-[#e4002b]">S/{promo.price}</span>
                  <span className="text-xs text-gray-400 line-through">S/{promo.originalPrice}</span>
                  <span className="text-xs font-bold text-[#007a33]">{promo.discount}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full hidden md:flex items-center justify-center"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
