"use client"
import { useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import Link from "next/link"

const products = [
  {
    id: 1,
    name: "Mega Salseo",
    description: "6 piezas de pollo, 6 Hot Wings o Nuggets...",
    discount: "-34%",
    originalPrice: "S/.76.20",
    price: "S/.49.90",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fmega-salseo-202509151007465309.jpg&w=384&q=75",
  },
  {
    id: 2,
    name: "Big Box Salseo",
    description: "3 piezas de pollo, 3 Hot Wings o Nuggets...",
    discount: "-36%",
    originalPrice: "S/.47.15",
    price: "S/.29.90",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fbig-box-salseo-202509151007452232.jpg&w=384&q=75",
  },
  {
    id: 3,
    name: "Mega Mix: 8 Piezas",
    description: "8 Piezas de Pollo, 6 Nuggets o Hot Wings...",
    discount: "-32%",
    originalPrice: "S/.103.00",
    price: "S/.69.90",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fmega-mix-8-piezas-202506160431521944.jpg&w=384&q=75",
  },
  {
    id: 4,
    name: "Combo Chick'N Share 18 Nuggets",
    description: "18 Nuggets, 2 complementos regulares...",
    discount: "-34%",
    originalPrice: "S/.67.40",
    price: "S/.43.90",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fcombo-chick-n-share-18-nuggets-202507251623300783.jpg&w=384&q=75",
  },
  {
    id: 5,
    name: "Combo 8 Hot Wings",
    description: "8 Hot Wings, 1 Complemento Regular...",
    discount: "-25%",
    originalPrice: "S/.33.60",
    price: "S/.24.90",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fcombo-8-hot-wings-202506160431470733.jpg&w=384&q=75",
  },
]

export default function TopProducts() {
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
    <div className="relative px-4 md:px-6">
      <button
        onClick={() => scroll("left")}
        className="absolute -left-2 md:left-0 top-1/3 -translate-y-1/2 z-10 bg-[#e4002b] hover:bg-red-700 text-white p-2 rounded-full hidden md:flex items-center justify-center"
      >
        <ChevronLeft size={20} />
      </button>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 scroll-smooth pb-4"
        style={{ scrollBehavior: "smooth" }}
      >
        {products.map((product) => (
          <Link href={`/product/${product.id}`} key={product.id}>
            <div className="flex-shrink-0 w-48 bg-[#e4002b] rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative h-40 bg-gray-300">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>
              <div className="p-3 text-white">
                <h3 className="font-bold text-sm line-clamp-2">{product.name}</h3>
                <p className="text-xs opacity-90 line-clamp-2 mb-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs opacity-75 line-through">{product.originalPrice}</span>
                    <div className="font-bold">{product.price}</div>
                    <span className="text-xs font-bold text-yellow-300">{product.discount}</span>
                  </div>
                  <button className="bg-white text-[#e4002b] p-2 rounded hover:bg-gray-100">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute -right-2 md:right-0 top-1/3 -translate-y-1/2 z-10 bg-[#e4002b] hover:bg-red-700 text-white p-2 rounded-full hidden md:flex items-center justify-center"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
