"use client"

const categories = [
  {
    id: 1,
    name: "Combos & Bandejas",
    items: 5,
    icon: "🍗",
  },
  {
    id: 2,
    name: "Sándwiches",
    items: 8,
    icon: "🥪",
  },
  {
    id: 3,
    name: "Bebidas",
    items: 12,
    icon: "🥤",
  },
  {
    id: 4,
    name: "Postres",
    items: 6,
    icon: "🍰",
  },
]

export default function MenuShowcase() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nuestro Menú</h2>
          <p className="text-lg text-gray-600">Explora todas nuestras deliciosas opciones</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <button
              key={category.id}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-brand-red hover:shadow-md transition hover:bg-red-50"
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1 text-left">{category.name}</h3>
              <p className="text-sm text-gray-600 text-left">{category.items} productos</p>
            </button>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-brand-red text-white font-bold rounded-lg hover:bg-red-700 transition">
            Ver Menú Completo
          </button>
        </div>
      </div>
    </section>
  )
}
