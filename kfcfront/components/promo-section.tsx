"use client"

const promos = [
  {
    id: 1,
    title: "Dúo Twister XL con Papas",
    price: "S/.38.90",
    image: "/twister-sandwich-meal.jpg",
    badge: "Oferta Limitada",
  },
  {
    id: 2,
    title: "Mega Delivery - 6 Piezas",
    price: "S/.39.90",
    image: "/fried-chicken-6-pieces.jpg",
    badge: "Popular",
  },
  {
    id: 3,
    title: "Mega Promo - 8 Piezas",
    price: "S/.49.90",
    image: "/fried-chicken-8-pieces.jpg",
    badge: "Mejor Valor",
  },
  {
    id: 4,
    title: "Mega Promo - 10 Piezas",
    price: "S/.64.90",
    image: "/fried-chicken-10-pieces.jpg",
    badge: "Favorito",
  },
]

export default function PromoSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ofertas por Tiempo Limitado</h2>
          <p className="text-lg text-gray-600">Aprovecha nuestras promociones especiales hoy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-brand-red transition group cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                  src={promo.image || "/placeholder.svg"}
                  alt={promo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute top-3 right-3 bg-brand-red text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {promo.badge}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">{promo.title}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-brand-red">{promo.price}</span>
                  <button className="bg-brand-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold">
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
