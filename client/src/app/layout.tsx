import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Smart Booking Campus",
  description: "Modern, responsive platform for academic and sports space booking.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50 antialiased`}>
        <Navbar />
        <main className="max-w-7xl mx-auto py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
