"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Share } from "lucide-react"
import Link from "next/link"
import AnimatedBackground from "../components/AnimatedBackground"

const slides = [
  {
    id: 1,
    title: "Your 2025 Style Wrapped",
    subtitle: "Let's see what made you shine this year ✨",
    content: (
      <div className="text-center">
        <div className="text-8xl mb-4">🎬</div>
        <div className="text-2xl font-bold gradient-bg bg-clip-text text-transparent">Ready for the reveal?</div>
      </div>
    ),
  },
  {
    id: 2,
    title: "Your Top Brands",
    subtitle: "These were your go-to fashion destinations",
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">👑</div>
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-4">
              <div className="text-2xl font-bold text-purple-400">#1 Zara</div>
              <div className="text-sm text-gray-400">23 items purchased</div>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <div className="text-xl font-bold text-pink-400">#2 H&M</div>
              <div className="text-sm text-gray-400">18 items purchased</div>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <div className="text-lg font-bold text-blue-400">#3 ASOS</div>
              <div className="text-sm text-gray-400">12 items purchased</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "Your Signature Color",
    subtitle: "This color dominated your wardrobe",
    content: (
      <div className="text-center">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mx-auto mb-6 animate-pulse"></div>
        <div className="text-3xl font-bold mb-2">Purple Passion</div>
        <div className="text-gray-400 mb-4">Worn in 34% of your outfits</div>
        <div className="glass-card rounded-2xl p-4">
          <div className="text-sm text-gray-300">
            You gravitated towards rich, vibrant purples that perfectly complement your warm undertones!
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: "Your Style Journey",
    subtitle: "Look at all you accomplished!",
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-green-400">127</div>
            <div className="text-sm text-gray-400">Outfits Tried</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-blue-400">89</div>
            <div className="text-sm text-gray-400">AR Try-Ons</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">45</div>
            <div className="text-sm text-gray-400">Closet Items</div>
          </div>
          <div className="glass-card rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-pink-400">23</div>
            <div className="text-sm text-gray-400">Posts Shared</div>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400 mb-2">Style Influencer</div>
          <div className="text-sm text-gray-400">Your posts earned $234 in rewards!</div>
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: "Share Your Style Story",
    subtitle: "Show the world your fashion journey",
    content: (
      <div className="text-center space-y-6">
        <div className="text-6xl mb-4">📤</div>
        <div className="text-2xl font-bold mb-4">Ready to share?</div>
        <div className="glass-card rounded-2xl p-6">
          <div className="text-sm text-gray-300 mb-4">Your 2025 Style Wrapped is ready to inspire others!</div>
          <button className="w-full py-3 rounded-xl gradient-bg text-white font-semibold hover:scale-105 transition-all duration-300">
            Share to Social Media
          </button>
        </div>
      </div>
    ),
  },
]

export default function WrappedPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (isAutoPlaying && currentSlide < slides.length - 1) {
      const timer = setTimeout(() => {
        setCurrentSlide((prev) => prev + 1)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [currentSlide, isAutoPlaying])

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1)
      setIsAutoPlaying(false)
    }
  }

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1)
      setIsAutoPlaying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <Link href="/" className="w-10 h-10 rounded-full glass-card flex items-center justify-center">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex space-x-1">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
          <button className="w-10 h-10 rounded-full glass-card flex items-center justify-center">
            <Share size={20} />
          </button>
        </div>

        {/* Slide Content */}
        <div className="flex-1 flex items-center justify-center p-6" onClick={handleNext}>
          <div className="w-full max-w-sm text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            <h1 className="text-3xl font-bold mb-2">{slides[currentSlide].title}</h1>
            <p className="text-gray-400 mb-8">{slides[currentSlide].subtitle}</p>

            <div className="min-h-[300px] flex items-center justify-center">{slides[currentSlide].content}</div>
          </div>
        </div>

        {/* Navigation Hint */}
        <div className="p-6 text-center">
          <p className="text-sm text-gray-400">
            {currentSlide < slides.length - 1 ? "Tap to continue" : "Tap to share"}
          </p>
        </div>
      </div>
    </div>
  )
}
