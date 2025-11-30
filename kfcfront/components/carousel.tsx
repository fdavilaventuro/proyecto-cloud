"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

const banners = [
  {
    id: 1,
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fbanners%2Flibertadores-202511031200000000.jpg&w=3840&q=90",
    alt: "Banner Libertadores",
  },
  {
    id: 2,
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fbanners%2FWEB_MEGA_1824x400.jpg&w=3840&q=90",
    alt: "Banner Mega Salseo",
  },
]

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  return (
    <div className="relative w-full bg-gray-100 overflow-hidden mx-auto px-4">
      <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-lg overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={banner.image || "/placeholder.svg"}
              alt={banner.alt}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-[#e4002b] text-white p-2 rounded hover:bg-[#c70027] transition-colors"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-[#e4002b] text-white p-2 rounded hover:bg-[#c70027] transition-colors"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? "bg-[#e4002b]" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
