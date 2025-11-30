"use client"

export default function OrderSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-red to-red-600 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para Disfrutar?</h2>
          <p className="text-lg text-red-100 mb-8 text-pretty">Pide ahora y recibe tu comida rápidamente a domicilio</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-brand-red font-bold rounded-lg hover:bg-gray-100 transition">
              Descargar Aplicación
            </button>
            <button className="px-8 py-3 bg-red-700 text-white font-bold rounded-lg hover:bg-red-800 transition border border-red-600">
              Pedir Online
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
