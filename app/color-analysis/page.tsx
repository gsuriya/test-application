"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import AnimatedBackground from "../components/AnimatedBackground"

export default function ColorAnalysisPage() {
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (step === 2) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setStep(3)
            return 100
          }
          return prev + 2
        })
      }, 50)
      return () => clearInterval(timer)
    }
  }, [step])

  const colorPalette = ["#8B5CF6", "#EC4899", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#6366F1", "#14B8A6"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 relative">
      <AnimatedBackground />

      <div className="relative z-10 p-6 pb-24">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="w-10 h-10 rounded-full glass-card flex items-center justify-center">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold">Color Analysis</h1>
          <div className="w-10" />
        </div>

        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-64 h-64 mx-auto rounded-3xl glass-card flex items-center justify-center mb-6">
                <div className="text-center text-gray-400">
                  <div className="w-32 h-32 rounded-full border-4 border-dashed border-purple-400 mx-auto mb-4 flex items-center justify-center">
                    <div className="text-4xl">👤</div>
                  </div>
                  <p>Position your face in the circle</p>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">Face Alignment Guide</h2>
                <ul className="text-sm text-gray-300 space-y-2 text-left">
                  <li>• Ensure good lighting</li>
                  <li>• Remove makeup if possible</li>
                  <li>• Look directly at camera</li>
                  <li>• Keep face centered</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-4 rounded-2xl gradient-bg text-white font-semibold text-lg hover:scale-105 transition-all duration-300"
            >
              Start Analysis
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center space-y-8">
            <div className="w-32 h-32 mx-auto">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-purple-500 animate-spin">
                  <div className="absolute top-0 left-1/2 w-4 h-4 bg-purple-500 rounded-full transform -translate-x-1/2 -translate-y-2"></div>
                </div>
                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-purple-400" />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Finding your color season...</h2>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full gradient-bg transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-gray-400">{progress}% complete</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center glass-card rounded-3xl p-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full gradient-bg flex items-center justify-center">
                <span className="text-3xl">🍂</span>
              </div>

              <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg mb-4">
                Warm Autumn
              </div>

              <p className="text-gray-300 mb-6">
                You have warm undertones that pair beautifully with rich, earthy colors.
              </p>

              <div className="flex justify-center space-x-2 mb-6">
                {colorPalette.map((color, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full border-2 border-white/20"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <button className="w-full py-3 rounded-2xl glass-card text-purple-400 font-semibold hover:bg-white/20 transition-all duration-300">
              View Full Report
            </button>

            <Link href="/swipe">
              <button className="w-full py-4 rounded-2xl gradient-bg text-white font-semibold text-lg hover:scale-105 transition-all duration-300">
                Start Browsing Outfits
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
