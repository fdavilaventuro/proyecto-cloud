"use client"
import { useState } from "react"
import Header from "@/components/header"
import HomeContent from "@/components/home-content"
import LocationModal from "@/components/location-modal"

export default function Home() {
  const [showLocation, setShowLocation] = useState(false)

  return (
    <main className="bg-white min-h-screen">
      <Header onLocationClick={() => setShowLocation(true)} />
      {showLocation && <LocationModal onClose={() => setShowLocation(false)} />}
      <HomeContent />
    </main>
  )
}
