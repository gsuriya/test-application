"use client"

import { useState } from "react"
import { Plus, Search, SlidersHorizontal, Camera, ArrowLeft } from "lucide-react"
import Link from "next/link"
import AnimatedBackground from "../components/AnimatedBackground"

interface ClosetItem {
  id: number
  image: string
  brand: string
  name: string
  type: string
  color: string
  tags: string[]
}

const closetItems: ClosetItem[] = [
  {
    id: 1,
    image: "/placeholder.svg?height=200&width=200",
    brand: "Zara",
    name: "Oversized Blazer",
    type: "Outerwear",
    color: "Black",
    tags: ["Professional", "Versatile"],
  },
  {
    id: 2,
    image: "/placeholder.svg?height=200&width=200",
    brand: "H&M",
    name: "Wide Leg Jeans",
    type: "Bottoms",
    color: "Blue",
    tags: ["Casual", "Comfortable"],
  },
  {
    id: 3,
    image: "/placeholder.svg?height=200&width=200",
    brand: "Nike",
    name: "Air Force 1",
    type: "Shoes",
    color: "White",
    tags: ["Sneakers", "Casual"],
  },
  {
    id: 4,
    image: "/placeholder.svg?height=200&width=200",
    brand: "ASOS",
    name: "Crop Top",
    type: "Tops",
    color: "Pink",
    tags: ["Summer", "Trendy"],
  },
]

export default function ClosetPage() {
  const [showAddItem, setShowAddItem] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 relative">
      <AnimatedBackground />

      <div className="relative z-10 p-4 pb-24">
        {/* Header */}
        <div className="sticky top-0 glass-card rounded-2xl p-4 mb-6 z-20">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="w-10 h-10 rounded-full glass-card flex items-center justify-center">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold">My Closet</h1>
            <button
              onClick={() => setShowAddItem(true)}
              className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search your closet..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>
            <button className="w-10 h-10 rounded-xl glass-card flex items-center justify-center">
              <SlidersHorizontal size={16} />
            </button>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm">
            <span className="text-gray-400">{closetItems.length} items</span>
            <div className="flex space-x-4">
              <button className="text-purple-400">All</button>
              <button className="text-gray-400">Tops</button>
              <button className="text-gray-400">Bottoms</button>
              <button className="text-gray-400">Shoes</button>
            </div>
          </div>
        </div>

        {/* Add Item Section */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto rounded-2xl glass-card flex items-center justify-center mb-4">
              <div className="text-center text-gray-400">
                <Camera size={32} className="mx-auto mb-2" />
                <p className="text-sm">Add New Item</p>
              </div>
            </div>
            <button className="w-full py-3 rounded-xl gradient-bg text-white font-semibold hover:scale-105 transition-all duration-300">
              Scan Garment
            </button>
          </div>
        </div>

        {/* Closet Grid */}
        <div className="grid grid-cols-2 gap-4">
          {closetItems.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300"
            >
              <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">{item.brand}</span>
                  <div
                    className="w-3 h-3 rounded-full border border-white/20"
                    style={{ backgroundColor: item.color.toLowerCase() }}
                  />
                </div>
                <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
                <p className="text-xs text-gray-400 mb-3">{item.type}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 rounded-full bg-purple-500/20 text-xs text-purple-300">
                      {tag}
                    </span>
                  ))}
                </div>

                <button className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-sm font-semibold hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300">
                  Add to Outfit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full max-w-[480px] mx-auto glass-card rounded-t-3xl p-6 animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Add New Item</h2>
              <button
                onClick={() => setShowAddItem(false)}
                className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <button className="w-full py-4 rounded-xl glass-card flex items-center justify-center space-x-3 hover:bg-white/10 transition-all duration-300">
                <Camera size={20} />
                <span>Take Photo</span>
              </button>

              <button className="w-full py-4 rounded-xl glass-card flex items-center justify-center space-x-3 hover:bg-white/10 transition-all duration-300">
                <Plus size={20} />
                <span>Upload from Gallery</span>
              </button>

              <button className="w-full py-4 rounded-xl glass-card flex items-center justify-center space-x-3 hover:bg-white/10 transition-all duration-300">
                <Search size={20} />
                <span>Search Online</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
