import Image from "next/image"
import Link from "next/link"

const categories = [
  {
    id: 1,
    name: "Para compartir",
    image: "https://delosi-pidelo.s3.amazonaws.com/kfc/promotions-strip/para-compartir.jpg",
    slug: "megas", // Megas es para compartir
  },
  {
    id: 2,
    name: "Para 2",
    image: "https://delosi-pidelo.s3.amazonaws.com/kfc/promotions-strip/para-dos.jpg",
    slug: "para-2",
  },
  {
    id: 3,
    name: "Para ti",
    image: "https://delosi-pidelo.s3.amazonaws.com/kfc/promotions-strip/para-ti.jpg",
    slug: "combos", // Combos es para ti (individual)
  },
  {
    id: 4,
    name: "Sandwich y Twister XL",
    image: "https://delosi-pidelo.s3.amazonaws.com/kfc/promotions-strip/sandwich.jpg",
    slug: "sandwich-twister",
  },
]

export default function CategoryCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-6">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/menu#${cat.slug}`}
          className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-200 flex items-center gap-3"
        >
          <div className="relative h-16 w-16 flex-shrink-0 bg-gray-100 rounded">
            <Image src={cat.image || "/placeholder.svg"} alt={cat.name} fill className="object-contain" />
          </div>
          <p className="font-semibold text-gray-900 text-sm">{cat.name}</p>
        </Link>
      ))}
    </div>
  )
}
