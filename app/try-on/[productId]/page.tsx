"use client"

import { useState } from "react"
import { ArrowLeft, ShoppingCart, Camera, Mic, MicOff, Volume2, VolumeX, Circle } from "lucide-react"
import Link from "next/link"
import AnimatedBackground from "../../components/AnimatedBackground"

export default function TryOnPage({ params }: { params: { productId: string } }) {
  const [selectedSize, setSelectedSize] = useState("M")
  const [showAddToCart, setShowAddToCart] = useState(false)
  const [isMicOn, setIsMicOn] = useState(false)
  const [isSpeakerOn, setSpeakerOn] = useState(true)

  const sizes = ["XS", "S", "M", "L", "XL"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 relative">
      <AnimatedBackground />

      {/* Camera Preview with Overlay */}
      <div className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 z-10" />

        {/* Simulated camera feed */}
        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <Camera size={64} className="mx-auto mb-4 opacity-50" />
            <p>Virtual Try-On Camera</p>
            <p className="text-sm">Outfit overlay will appear here</p>
          </div>
        </div>

        {/* Outfit Overlay Simulation */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="w-48 h-64 border-2 border-dashed border-purple-400 rounded-lg flex items-center justify-center">
            <span className="text-purple-400 text-sm">Outfit Preview</span>
          </div>
        </div>

        {/* Header */}
        <div className="absolute top-6 left-4 right-4 flex items-center justify-between z-30">
          <Link href="/swipe" className="w-10 h-10 rounded-full glass-card flex items-center justify-center">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-lg font-bold">Virtual Try-On</h1>
          <div className="w-10" />
        </div>

        {/* Size Selector */}
        <div className="absolute top-24 left-4 right-4 z-30">
          <div className="glass-card rounded-2xl p-4">
            <h3 className="text-sm font-semibold mb-3">Select Size</h3>
            <div className="flex space-x-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size)
                    setShowAddToCart(true)
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    selectedSize === size
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "glass-card text-gray-300 hover:text-white"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Add to Cart FAB */}
        {showAddToCart && (
          <div className="absolute bottom-32 right-6 z-30 animate-in slide-in-from-right-4">
            <button className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-all duration-300 pulse-glow">
              <ShoppingCart size={24} />
            </button>
          </div>
        )}

        {/* Bottom Control Bar */}
        <div className="absolute bottom-24 left-4 right-4 z-30">
          <div className="glass-card rounded-3xl px-6 py-4">
            <div className="flex justify-around items-center">
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isMicOn ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" : "bg-gray-700 text-gray-400"
                }`}
                aria-label="Toggle microphone"
              >
                {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
              </button>

              <button
                onClick={() => setSpeakerOn(!isSpeakerOn)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isSpeakerOn ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white" : "bg-gray-700 text-gray-400"
                }`}
                aria-label="Toggle speaker"
              >
                {isSpeakerOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>

              <button
                className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300"
                aria-label="Capture photo"
              >
                <Circle size={24} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
