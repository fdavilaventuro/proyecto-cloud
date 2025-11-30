"use client"
import Carousel from "./carousel"
import PromoCards from "./promo-cards"
import CategoryCards from "./category-cards"
import TopProducts from "./top-products"
import NavLinks from "./nav-links"

export default function HomeContent() {
  return (
    <div className="min-h-screen bg-white">
      <NavLinks />

      <div className="py-6">
        <Carousel />
      </div>

      <section className="px-4 md:px-6 py-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          Promos
          <span className="text-red-600">🔥</span>
        </h2>
        <PromoCards />
      </section>

      <section className="px-4 md:px-6 py-8 bg-white">
        <h2 className="text-2xl font-bold mb-6">Ahorrar nunca fue tan rico</h2>
        <CategoryCards />
      </section>

      <section className="px-4 md:px-6 py-8 bg-white">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          Lo más top del momento
          <span className="text-red-600">🔥</span>
        </h2>
        <TopProducts />
      </section>
    </div>
  )
}
