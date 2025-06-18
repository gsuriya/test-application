"use client"

import { useRef, useEffect, useState } from "react"
import { Camera, RotateCcw } from "lucide-react"

interface CameraCaptureProps {
  onCapture: (imageBase64: string) => void
  isCapturing?: boolean
}

export default function CameraCapture({ onCapture, isCapturing = false }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsReady(true)
        setError(null)
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('Unable to access camera. Please check permissions.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsReady(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !isReady) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to base64 with proper prefix
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.8)
    
    // Pass the base64 string to parent component
    onCapture(imageBase64)
  }

  const retryCamera = () => {
    stopCamera()
    startCamera()
  }

  if (error) {
    return (
      <div className="glass-card rounded-3xl p-6 text-center">
        <div className="text-red-400 mb-4">⚠️ Camera Error</div>
        <p className="text-gray-300 mb-4">{error}</p>
        <button
          onClick={retryCamera}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold flex items-center gap-2 mx-auto"
        >
          <RotateCcw size={16} />
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-3xl overflow-hidden">
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-64 object-cover bg-gray-800"
          style={{ transform: 'scaleX(-1)' }} // Mirror effect for selfie
        />
        
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="text-white">Starting camera...</div>
          </div>
        )}
      </div>

      <div className="p-4 text-center">
        <button
          onClick={capturePhoto}
          disabled={!isReady || isCapturing}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 mx-auto ${
            isReady && !isCapturing
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-110 shadow-lg'
              : 'bg-gray-600 cursor-not-allowed'
          }`}
        >
          <Camera size={24} />
        </button>
        <p className="text-sm text-gray-400 mt-2">
          {isCapturing ? 'Processing...' : 'Tap to capture'}
        </p>
      </div>

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
} 