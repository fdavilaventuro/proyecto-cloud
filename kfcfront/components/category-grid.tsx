import Link from "next/link"
import Image from "next/image"

const categories = [
    {
        id: "promos",
        name: "Promos",
        image: "https://delosi-pidelo.s3.amazonaws.com/kfc/sections/promos-202512021629407547.jpg",
    },
    {
        id: "megas",
        name: "Megas",
        image: "https://delosi-pidelo.s3.amazonaws.com/kfc/sections/megas-202512021629406775.jpg",
    },
    {
        id: "para-2",
        name: "Para 2",
        image: "https://delosi-pidelo.s3.amazonaws.com/kfc/sections/para-2-202512021629410417.jpg",
    },
    {
        id: "sandwich-twister",
        name: "Sándwich & Twister XL",
        image: "https://delosi-pidelo.s3.amazonaws.com/kfc/sections/sandwiches-twister-xl-202512021629404097.jpg",
    },
    {
        id: "big-box",
        name: "Big Box",
        image: "https://delosi-pidelo.s3.amazonaws.com/kfc/sections/big-box-202512021629411403.jpg",
    },
    {
        id: "combos",
        name: "Combos",
        image: "https://delosi-pidelo.s3.amazonaws.com/kfc/sections/combos-202512021629408822.jpg",
    },
    {
        id: "complementos",
        name: "Complementos",
        image: "https://delosi-pidelo.s3.amazonaws.com/kfc/sections/complementos-202512021629401284.jpg",
    },
    {
        id: "postres",
        name: "Postres",
        image: "https://delosi-pidelo.s3.amazonaws.com/kfc/sections/postres-202512021629405511.jpg",
    },
    {
        id: "bebidas",
        name: "Bebidas",
        image: "https://delosi-pidelo.s3.amazonaws.com/kfc/sections/bebidas-202512021629406074.jpg",
    },
]

export default function CategoryGrid() {
    return (
        <div className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-8">Nuestro Menú</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/menu#${category.id}`}
                            className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="aspect-square relative">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="text-white text-xl font-bold text-center">{category.name}</h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
