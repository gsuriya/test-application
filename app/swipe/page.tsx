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

interface SustainabilityInfo {
  store: string
  material: string
  sustainable: boolean
}

interface EnrichedProduct extends Product {
  sustainability: SustainabilityInfo
}

interface Outfit {
  id: string
  image: string
  items: { brand: string; item: string; price: string }[]
  tags: string[]
  totalPrice: string
  occasion: string
  vibe: string
  store: string
  material: string
  sustainable: boolean
}

interface FilterState {
  store: string
  material: string
  sustainableOnly: boolean
}

export default function SwipePage() {
  const [products, setProducts] = useState<EnrichedProduct[]>([])
  const [filteredProducts, setFilteredProducts] = useState<EnrichedProduct[]>([])
  const [currentOutfit, setCurrentOutfit] = useState<Outfit | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    store: "All",
    material: "All",
    sustainableOnly: false
  })

  // Sustainability metadata with balanced distribution
  const generateSustainabilityMap = (productIds: string[]): Record<string, SustainabilityInfo> => {
    const stores = ["Patagonia", "Zara", "H&M", "ASOS", "Urban Outfitters", "Reformation", "Uniqlo", "Everlane"]
    const materials = ["Recycled Cotton", "Organic Cotton", "Polyester", "Wool", "Linen", "Tencel", "Hemp", "Bamboo"]
    
    const sustainabilityMap: Record<string, SustainabilityInfo> = {}
    
    productIds.forEach((id, index) => {
      // Ensure 50% are sustainable for balanced distribution
      const sustainable = index % 2 === 0
      
      // Distribute stores evenly
      const store = stores[index % stores.length]
      
      // Distribute materials evenly, with sustainable materials more likely for sustainable items
      let material: string
      if (sustainable) {
        const sustainableMaterials = ["Recycled Cotton", "Organic Cotton", "Tencel", "Hemp", "Bamboo", "Linen"]
        material = sustainableMaterials[index % sustainableMaterials.length]
      } else {
        material = materials[index % materials.length]
      }
      
      sustainabilityMap[id] = {
        store,
        material,
        sustainable
      }
    })
    
    return sustainabilityMap
  }

  // Apply filters to products
  const applyFilters = (products: EnrichedProduct[], filterState: FilterState): EnrichedProduct[] => {
    return products.filter(product => {
      // Store filter
      if (filterState.store !== "All" && product.sustainability.store !== filterState.store) {
        return false
      }
      
      // Material filter
      if (filterState.material !== "All" && product.sustainability.material !== filterState.material) {
        return false
      }
      
      // Sustainability filter
      if (filterState.sustainableOnly && !product.sustainability.sustainable) {
        return false
      }
      
      return true
    })
  }

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
        
        // Generate sustainability metadata
        const sustainabilityMap = generateSustainabilityMap(productDetails.map((p: Product) => p.id))
        
        // Enrich products with sustainability data
        const enrichedProducts: EnrichedProduct[] = productDetails.map((product: Product) => ({
          ...product,
          sustainability: sustainabilityMap[product.id]
        }))
        
        setProducts(enrichedProducts)
        setFilteredProducts(enrichedProducts) // Initially show all products
        
        // Set initial random product
        if (enrichedProducts.length > 0) {
          setCurrentOutfit(convertProductToOutfit(getRandomProduct(enrichedProducts)))
        }
      } catch (err) {
        console.error("Failed to load products:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Apply filters whenever filter state changes
  useEffect(() => {
    const filtered = applyFilters(products, filters)
    setFilteredProducts(filtered)
    
    // Update current outfit if it doesn't match current filters
    if (filtered.length > 0) {
      const currentProductStillValid = filtered.some(p => p.id === currentOutfit?.id)
      if (!currentProductStillValid) {
        setCurrentOutfit(convertProductToOutfit(getRandomProduct(filtered)))
      }
    }
  }, [filters, products])

  // Helper function to get random product from filtered list
  const getRandomProduct = (productList: EnrichedProduct[]) => {
    const randomIndex = Math.floor(Math.random() * productList.length)
    return productList[randomIndex]
  }

  // Convert product data to outfit format for existing UI
  const convertProductToOutfit = (product: EnrichedProduct): Outfit => {
    return {
      id: product.id,
      image: product.image,
      items: [{ 
        brand: product.sustainability.store, 
        item: product.description, 
        price: product.price 
      }],
      tags: [
        product.type, 
        product.sustainability.material, 
        product.sustainability.sustainable ? "Sustainable" : "Regular",
        product.color
      ].filter(Boolean),
      totalPrice: product.price,
      occasion: product.type,
      vibe: product.color,
      store: product.sustainability.store,
      material: product.sustainability.material,
      sustainable: product.sustainability.sustainable
    }
  }

  const handleSwipe = (direction: "left" | "right") => {
    setSwipeDirection(direction)
    setTimeout(() => {
      // Randomly pick a new product from filtered products
      if (filteredProducts.length > 0) {
        const newProduct = getRandomProduct(filteredProducts)
        setCurrentOutfit(convertProductToOutfit(newProduct))
      }
      setSwipeDirection(null)
    }, 300)
  }

  // Get unique values for filter options
  const getUniqueStores = () => {
    const stores = [...new Set(products.map(p => p.sustainability.store))].sort()
    return ["All", ...stores]
  }

  const getUniqueMaterials = () => {
    const materials = [...new Set(products.map(p => p.sustainability.material))].sort()
    return ["All", ...materials]
  }

  // Handle filter changes
  const handleStoreFilter = (store: string) => {
    setFilters(prev => ({ ...prev, store }))
  }

  const handleMaterialFilter = (material: string) => {
    setFilters(prev => ({ ...prev, material }))
  }

  const handleSustainabilityFilter = () => {
    setFilters(prev => ({ ...prev, sustainableOnly: !prev.sustainableOnly }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 relative flex items-center justify-center">
        <AnimatedBackground />
        <div className="text-white text-xl">Loading outfits...</div>
      </div>
    )
  }

  if (!currentOutfit || filteredProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 relative flex items-center justify-center">
        <AnimatedBackground />
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">No outfits match your filters</div>
          <button 
            onClick={() => setFilters({ store: "All", material: "All", sustainableOnly: false })}
            className="px-6 py-3 rounded-2xl gradient-bg text-white font-semibold"
          >
            Reset Filters
          </button>
        </div>
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

        {/* Filter Status Indicator */}
        {(filters.store !== "All" || filters.material !== "All" || filters.sustainableOnly) && (
          <div className="mb-4 px-4 py-2 glass-card rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">
                Showing {filteredProducts.length} of {products.length} items
              </span>
              <button 
                onClick={() => setFilters({ store: "All", material: "All", sustainableOnly: false })}
                className="text-xs text-purple-400 hover:text-purple-300"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

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
                {currentOutfit.sustainable && (
                  <span className="px-3 py-1 rounded-full bg-green-500/80 text-xs text-white">♻️ Eco</span>
                )}
              </div>

              <div className="p-4 h-1/3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{currentOutfit.totalPrice}</h3>
                    <button className="text-purple-400 text-sm">View Details</button>
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
                  {getUniqueStores().map((store) => (
                    <button 
                      key={store} 
                      onClick={() => handleStoreFilter(store)}
                      className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                        filters.store === store 
                          ? "bg-purple-500 text-white" 
                          : "glass-card hover:bg-purple-500/20"
                      }`}
                    >
                      {store}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Materials</h3>
                <div className="flex flex-wrap gap-2">
                  {getUniqueMaterials().map((material) => (
                    <button 
                      key={material} 
                      onClick={() => handleMaterialFilter(material)}
                      className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                        filters.material === material 
                          ? "bg-purple-500 text-white" 
                          : "glass-card hover:bg-purple-500/20"
                      }`}
                    >
                      {material}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Sustainability</h3>
                <button 
                  onClick={handleSustainabilityFilter}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                    filters.sustainableOnly 
                      ? "bg-green-500 text-white" 
                      : "glass-card hover:bg-green-500/20"
                  }`}
                >
                  ♻️ Sustainable Only
                </button>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <div className="text-sm text-gray-400 mb-2">
                  {filteredProducts.length} items match your filters
                </div>
                <div className="text-xs text-gray-500">
                  {Math.round((filteredProducts.filter(p => p.sustainability.sustainable).length / filteredProducts.length) * 100)}% are sustainable
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
