import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import BottomTabBar from "./components/BottomTabBar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StyleAI - Your AI Fashion Stylist",
  description: "Discover your perfect style with AI-powered fashion recommendations",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white overflow-x-hidden`}>
        <div className="min-h-screen max-w-[480px] mx-auto relative">
          {children}
          <BottomTabBar />
        </div>
      </body>
    </html>
  )
}
