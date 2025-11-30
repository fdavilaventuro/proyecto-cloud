import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "KFC Perú - Fried Chicken delivered",
  description: "KFC Perú - Ordena tu comida favorita online",
  icons: {
    icon: "https://www.kfc.com.pe/images/kfc/logo.svg",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased bg-white">{children}</body>
    </html>
  )
}
