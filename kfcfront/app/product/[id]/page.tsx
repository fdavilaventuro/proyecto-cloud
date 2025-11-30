"use client"
import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { ChevronUp, ChevronDown, Minus, Plus } from "lucide-react"
import Header from "@/components/header"

const productDatabase = {
  1: {
    name: "Mega Salseo",
    description: "6 piezas de pollo, 6 Hot Wings o Nuggets Bañados (BBQ o Miel)...",
    price: 49.9,
    originalPrice: 76.2,
    discount: "-34%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fmega-salseo-202509151007465309.jpg&w=3840&q=75",
  },
  2: {
    name: "Big Box Salseo",
    description: "3 piezas de pollo, 3 Hot Wings o Nuggets Bañados (BBQ o Miel)...",
    price: 29.9,
    originalPrice: 47.15,
    discount: "-36%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fbig-box-salseo-202509151007452232.jpg&w=3840&q=75",
  },
  3: {
    name: "Mega Mix: 8 Piezas",
    description: "8 Piezas de Pollo, 6 Nuggets o Hot Wings, 1 Complemento Familiar y 1...",
    price: 69.9,
    originalPrice: 103.0,
    discount: "-32%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fmega-mix-8-piezas-202506160431521944.jpg&w=3840&q=75",
  },
  4: {
    name: "Combo Chick'N Share 18 Nuggets",
    description: "18 Nuggets, 2 complementos regulares y 1 Gaseosa 1L",
    price: 43.9,
    originalPrice: 67.4,
    discount: "-34%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fcombo-chick-n-share-18-nuggets-202507251623300783.jpg&w=3840&q=75",
  },
  5: {
    name: "Combo 8 Hot Wings",
    description: "8 Hot Wings, 1 Complemento Regular y 1 Bebida Personal",
    price: 24.9,
    originalPrice: 33.6,
    discount: "-25%",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fcombo-8-hot-wings-202506160431470733.jpg&w=3840&q=75",
  },
}

const recipes = [
  {
    id: "original",
    name: "Receta Original",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Freceta-original-202511112047059783.jpg&w=3840&q=75",
  },
  {
    id: "crispy",
    name: "Crispy",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fcrispy-202511112047060949.jpg&w=3840&q=75",
  },
  {
    id: "spicy",
    name: "Picante",
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fpicante-202511112047061828.jpg&w=3840&q=75",
  },
]

const complements = [
  {
    id: "papa-familiar",
    name: "Papa Familiar",
    price: 0,
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fpapa-familiar-202511112047062691.jpg&w=3840&q=75",
  },
  {
    id: "papa-super",
    name: "Papa Super Familiar",
    price: 6.9,
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fpapa-super-familiar-202511112047063795.jpg&w=3840&q=75",
  },
  {
    id: "ensalada",
    name: "Ensalada Familiar",
    price: 0,
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fensalada-familiar-202511112047064725.jpg&w=3840&q=75",
  },
  {
    id: "pure",
    name: "Puré Familiar",
    price: 0,
    image:
      "https://www.kfc.com.pe/_next/image?url=https%3A%2F%2Fdelosi-pidelo.s3.amazonaws.com%2Fkfc%2Fproducts%2Fpure-familiar-202511112047065545.jpg&w=3840&q=75",
  },
]

export default function ProductDetail() {
  const params = useParams()
  const productId = Number.parseInt(params.id as string)
  const product = productDatabase[productId as keyof typeof productDatabase]
  const [quantity, setQuantity] = useState(1)
  const [selectedRecipe, setSelectedRecipe] = useState("original")
  const [selectedComplement, setSelectedComplement] = useState("papa-familiar")
  const [expandedRecipe, setExpandedRecipe] = useState(true)
  const [expandedComplement, setExpandedComplement] = useState(true)

  if (!product) {
    return <div>Producto no encontrado</div>
  }

  return (
    <main className="bg-white min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Product Image and Info */}
          <div className="flex flex-col">
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="relative h-64 md:h-80 w-full">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain" />
              </div>
            </div>

            <div className="mt-6">
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-600 text-sm mt-2">{product.description}</p>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#e4002b]">S/.{product.price}</span>
                <span className="text-sm text-gray-400 line-through">S/.{product.originalPrice}</span>
                <span className="text-sm font-bold text-[#007a33]">{product.discount}</span>
              </div>

              {/* Quantity Selector */}
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-100">
                    <Minus size={18} />
                  </button>
                  <span className="px-6 font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-100">
                    <Plus size={18} />
                  </button>
                </div>
                <button className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400">
                  Agregar (S/.{(product.price * quantity).toFixed(2)})
                </button>
              </div>
            </div>
          </div>

          {/* Right: Customization */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Personaliza tu pedido</h2>

            {/* Recipe Selection */}
            <div className="border rounded-lg mb-4">
              <button
                onClick={() => setExpandedRecipe(!expandedRecipe)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">Elige la Receta</h3>
                  <p className="text-sm text-gray-600">6x {recipes.find((r) => r.id === selectedRecipe)?.name}</p>
                </div>
                {expandedRecipe ? <ChevronUp className="text-gray-600" /> : <ChevronDown className="text-gray-600" />}
              </button>

              {expandedRecipe && (
                <div className="border-t p-4 bg-gray-50">
                  <div className="space-y-3">
                    {recipes.map((recipe) => (
                      <label
                        key={recipe.id}
                        className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-white transition"
                      >
                        <input
                          type="radio"
                          name="recipe"
                          value={recipe.id}
                          checked={selectedRecipe === recipe.id}
                          onChange={(e) => setSelectedRecipe(e.target.value)}
                          className="w-4 h-4"
                        />
                        <div className="relative h-12 w-12 flex-shrink-0">
                          <Image
                            src={recipe.image || "/placeholder.svg"}
                            alt={recipe.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span className="font-medium text-sm text-gray-900">{recipe.name}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-4 bg-green-100 text-green-800 text-sm px-3 py-2 rounded border border-green-300">
                    Completado
                  </div>
                </div>
              )}
            </div>

            {/* Complement Selection */}
            <div className="border rounded-lg">
              <button
                onClick={() => setExpandedComplement(!expandedComplement)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">Elige tu complemento</h3>
                  <p className="text-sm text-gray-600">Elige 1 opción</p>
                </div>
                {expandedComplement ? (
                  <ChevronUp className="text-gray-600" />
                ) : (
                  <ChevronDown className="text-gray-600" />
                )}
              </button>

              {expandedComplement && (
                <div className="border-t p-4 bg-gray-50">
                  <div className="space-y-3">
                    {complements.map((complement) => (
                      <label
                        key={complement.id}
                        className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-white transition"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <input
                            type="radio"
                            name="complement"
                            value={complement.id}
                            checked={selectedComplement === complement.id}
                            onChange={(e) => setSelectedComplement(e.target.value)}
                            className="w-4 h-4"
                          />
                          <div className="relative h-10 w-10 flex-shrink-0">
                            <Image
                              src={complement.image || "/placeholder.svg"}
                              alt={complement.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span className="font-medium text-sm text-gray-900">{complement.name}</span>
                        </div>
                        {complement.price > 0 && (
                          <span className="text-sm font-semibold text-gray-900">
                            + S/.{complement.price.toFixed(2)}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                  <div className="mt-4 bg-yellow-50 text-yellow-800 text-sm px-3 py-2 rounded border border-yellow-300">
                    Requerido
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
