"use client"

import { useState, useEffect } from "react"
import { X, Heart, Shirt, SlidersHorizontal, ArrowLeft } from "lucide-react"
import Link from "next/link"
import AnimatedBackground from "../components/AnimatedBackground"

interface Product {
  id: string
  image: string
  description: string
  type: string
  color: string
  graphic: string
  variant: string
  stock: number
  price: string
  created_at: string
  stock_status: string
}

interface Outfit {
  id: string
  image: string
  items: { brand: string; item: string; price: string }[]
  tags: string[]
  totalPrice: string
  occasion: string
  vibe: string
}

export default function SwipePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [currentOutfit, setCurrentOutfit] = useState<Outfit | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch products on component load
  useEffect(() => {
    async function fetchProducts() {
      try {
        // Fetch all products
        const res = await fetch("https://backend-879168005744.us-west1.run.app/products")
        const productList = await res.json()
        
        // Fetch display data for each product (includes base64 image)
        const productDetails = await Promise.all(
          productList.map(async (p: any) => {
            const detailRes = await fetch(`https://backend-879168005744.us-west1.run.app/products/${p.id}/display`)
            return await detailRes.json()
          })
        )
        
        setProducts(productDetails)
        // Set initial random product
        if (productDetails.length > 0) {
          setCurrentOutfit(convertProductToOutfit(getRandomProduct(productDetails)))
        }
      } catch (err) {
        console.error("Failed to load products:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Helper function to get random product
  const getRandomProduct = (productList: Product[]) => {
    const randomIndex = Math.floor(Math.random() * productList.length)
    return productList[randomIndex]
  }

  // Convert product data to outfit format for existing UI
  const convertProductToOutfit = (product: Product): Outfit => {
    return {
      id: product.id,
      image: product.image,
      items: [{ brand: "Fashion Item", item: product.description, price: product.price }],
      tags: [product.type, product.color, product.variant].filter(Boolean),
      totalPrice: product.price,
      occasion: product.type,
      vibe: product.color
    }
  }

  const handleSwipe = (direction: "left" | "right") => {
    setSwipeDirection(direction)
    setTimeout(() => {
      // Randomly pick a new product on each swipe
      if (products.length > 0) {
        const newProduct = getRandomProduct(products)
        setCurrentOutfit(convertProductToOutfit(newProduct))
      }
      setSwipeDirection(null)
    }, 300)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 relative flex items-center justify-center">
        <AnimatedBackground />
        <div className="text-white text-xl">Loading outfits...</div>
      </div>
    )
  }

  if (!currentOutfit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 relative flex items-center justify-center">
        <AnimatedBackground />
        <div className="text-red-400 text-xl">No outfits available</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 relative">
      <AnimatedBackground />

      <div className="relative z-10 p-4 pb-24">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="w-10 h-10 rounded-full glass-card flex items-center justify-center">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold">Discover Outfits</h1>
          <div className="w-10" />
        </div>

        {/* Outfit Card */}
        <div className="relative h-[70vh] mb-6">
          <div
            className={`absolute inset-0 glass-card rounded-3xl overflow-hidden transition-all duration-300 ${
              swipeDirection === "left" ? "swipe-left" : swipeDirection === "right" ? "swipe-right" : ""
            }`}
          >
            <div className="relative h-full">
              <img src={currentOutfit.image} alt="Outfit" className="w-full h-2/3 object-cover" />

              <div className="absolute top-4 right-4 flex space-x-2">
                <span className="px-3 py-1 rounded-full bg-black/50 text-xs text-white">{currentOutfit.occasion}</span>
                <span className="px-3 py-1 rounded-full bg-black/50 text-xs text-white">{currentOutfit.vibe}</span>
              </div>

              <div className="p-4 h-1/3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{currentOutfit.totalPrice}</h3>
                    <button className="text-purple-400 text-sm">View Breakdown</button>
                  </div>

                  <div className="space-y-1 mb-3">
                    {currentOutfit.items.map((item, index) => (
                      <p key={index} className="text-sm text-gray-300">
                        {item.brand} {item.item} - {item.price}
                      </p>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {currentOutfit.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 rounded-full bg-purple-500/20 text-xs text-purple-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => handleSwipe("left")}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300"
            aria-label="Pass"
          >
            <X size={24} />
          </button>

          <Link href={`/try-on/${currentOutfit.id}`}>
            <button className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300">
              <Shirt size={24} />
            </button>
          </Link>

          <button
            onClick={() => handleSwipe("right")}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300"
            aria-label="Like"
          >
            <Heart size={24} />
          </button>

          <button
            onClick={() => setShowFilters(true)}
            className="w-14 h-14 rounded-full glass-card flex items-center justify-center text-purple-400 hover:scale-110 transition-all duration-300"
            aria-label="Filters"
          >
            <SlidersHorizontal size={24} />
          </button>
        </div>
      </div>

      {/* Filter Drawer */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full max-w-[480px] mx-auto glass-card rounded-t-3xl p-6 animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Stores</h3>
                <div className="flex flex-wrap gap-2">
                  {["Zara", "H&M", "ASOS", "Urban Outfitters", "Reformation"].map((store) => (
                    <button key={store} className="px-4 py-2 rounded-full glass-card text-sm hover:bg-purple-500/20">
                      {store}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="px-4">
                  <input type="range" min="0" max="1000" className="w-full" />
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>$0</span>
                    <span>$1000+</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Occasion</h3>
                <div className="flex flex-wrap gap-2">
                  {["Work", "Party", "Travel", "Casual", "Date"].map((occasion) => (
                    <button key={occasion} className="px-4 py-2 rounded-full glass-card text-sm hover:bg-purple-500/20">
                      {occasion}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Vibe</h3>
                <div className="flex flex-wrap gap-2">
                  {["Minimalist", "Bold", "Y2K", "Monochrome", "Luxe"].map((vibe) => (
                    <button key={vibe} className="px-4 py-2 rounded-full glass-card text-sm hover:bg-purple-500/20">
                      {vibe}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFilters(false)}
              className="w-full mt-6 py-3 rounded-2xl gradient-bg text-white font-semibold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
