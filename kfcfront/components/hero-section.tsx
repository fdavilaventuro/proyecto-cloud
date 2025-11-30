"use client"

export default function HeroSection() {
  return (
    <section className="relative w-full h-96 md:h-screen bg-gradient-to-r from-brand-red to-red-600 flex items-center justify-center overflow-hidden">
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center mix-blend-overlay"
        style={{
          backgroundImage: "url(/placeholder.svg?height=1080&width=1920&query=delicious%20fried%20chicken)",
          opacity: 0.3,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">Delicioso Pollo Frito Peruano</h1>
        <p className="text-lg md:text-xl mb-8 text-red-100 text-pretty">
          Disfruta del mejor pollo a la brasa con nuestras irresistibles promociones
        </p>
        <button className="px-8 py-3 bg-white text-brand-red font-bold rounded-lg hover:bg-gray-100 transition">
          Pedir Ahora
        </button>
      </div>
    </section>
  )
}
