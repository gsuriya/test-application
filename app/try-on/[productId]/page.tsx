"use client"

import { useState, useEffect, Suspense } from "react"
import { ArrowLeft, RotateCcw, Loader2 } from "lucide-react"
import Link from "next/link"
import AnimatedBackground from "../../components/AnimatedBackground"
import CameraCapture from "../../components/CameraCapture"
import { runTryOn, pollUntilComplete } from "../../utils/fashnApi"

function TryOnContent({ params }: { params: { productId: string } }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [tryOnResult, setTryOnResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)

  useEffect(() => {
    // Get image URL from localStorage
    const storedImageUrl = localStorage.getItem('tryOnImageUrl')
    if (storedImageUrl) {
      setImageUrl(storedImageUrl)
    }
  }, [])

  const handlePhotoCapture = (imageBase64: string) => {
    setCapturedPhoto(imageBase64)
    setShowCamera(false)
  }

  const handleTryOn = async () => {
    if (!capturedPhoto || !imageUrl) {
      setError('Missing photo or garment image')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Start the try-on process
      const predictionId = await runTryOn(capturedPhoto, imageUrl)
      
      // Poll for completion
      const results = await pollUntilComplete(predictionId)
      
      if (results && results.length > 0) {
        setTryOnResult(results[0])
      } else {
        setError('No result generated')
      }
    } catch (err) {
      console.error('Try-on error:', err)
      setError(err instanceof Error ? err.message : 'Try-on failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const resetState = () => {
    setCapturedPhoto(null)
    setTryOnResult(null)
    setError(null)
    setShowCamera(true)
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
      <AnimatedBackground />

      <div className="relative z-10 p-4 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/swipe" className="w-10 h-10 rounded-full glass-card flex items-center justify-center">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold">Virtual Try-On</h1>
          <button
            onClick={resetState}
            className="w-10 h-10 rounded-full glass-card flex items-center justify-center"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Garment Image */}
        {imageUrl && (
          <div className="mb-6">
            <div className="glass-card rounded-2xl p-4">
              <h3 className="text-sm font-semibold mb-3">Garment to Try On</h3>
              <img 
                src={imageUrl} 
                alt="Garment" 
                className="w-full h-32 object-cover rounded-xl"
              />
            </div>
          </div>
        )}

        {/* Camera Section */}
        {showCamera && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Take Your Photo</h3>
            <CameraCapture 
              onCapture={handlePhotoCapture} 
              isCapturing={isProcessing}
            />
          </div>
        )}

        {/* Captured Photo */}
        {capturedPhoto && !showCamera && (
          <div className="mb-6">
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Your Photo</h3>
                <button
                  onClick={() => setShowCamera(true)}
                  className="text-xs text-purple-400 hover:text-purple-300"
                >
                  Retake
                </button>
              </div>
              <img 
                src={capturedPhoto} 
                alt="Captured" 
                className="w-full h-48 object-cover rounded-xl"
              />
            </div>
          </div>
        )}

        {/* Try-On Button */}
        {capturedPhoto && !isProcessing && !tryOnResult && (
          <div className="mb-6">
            <button
              onClick={handleTryOn}
              className="w-full py-4 rounded-2xl gradient-bg text-white font-semibold text-lg hover:scale-105 transition-all duration-300"
            >
              Generate Try-On
            </button>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="mb-6">
            <div className="glass-card rounded-2xl p-6 text-center">
              <Loader2 size={32} className="animate-spin mx-auto mb-4 text-purple-400" />
              <h3 className="text-lg font-semibold mb-2">Generating Your Try-On</h3>
              <p className="text-gray-400 text-sm">This may take up to 40 seconds...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6">
            <div className="glass-card rounded-2xl p-4 border border-red-500/20">
              <div className="text-red-400 mb-2">⚠️ Error</div>
              <p className="text-gray-300 text-sm mb-4">{error}</p>
              <button
                onClick={resetState}
                className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Try-On Result */}
        {tryOnResult && (
          <div className="mb-6">
            <div className="glass-card rounded-2xl p-4">
              <h3 className="text-lg font-semibold mb-4">Your Virtual Try-On Result</h3>
              <img 
                src={tryOnResult} 
                alt="Try-on result" 
                className="w-full rounded-xl shadow-lg"
              />
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={resetState}
                  className="flex-1 py-3 rounded-xl glass-card text-purple-400 font-semibold"
                >
                  Try Another
                </button>
                <button className="flex-1 py-3 rounded-xl gradient-bg text-white font-semibold">
                  Save Result
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!capturedPhoto && !showCamera && (
          <div className="text-center">
            <button
              onClick={() => setShowCamera(true)}
              className="w-full py-4 rounded-2xl gradient-bg text-white font-semibold text-lg hover:scale-105 transition-all duration-300"
            >
              Take Photo to Start
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TryOnPage({ params }: { params: { productId: string } }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-white" />
      </div>
    }>
      <TryOnContent params={params} />
    </Suspense>
  )
}
