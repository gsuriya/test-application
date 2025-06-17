"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, Mic, MicOff, Volume2, VolumeX, Circle } from "lucide-react"
import AnimatedBackground from "./components/AnimatedBackground"
import VoiceAgent from "./components/VoiceAgent"
import Link from "next/link"

export default function HomePage() {
  const [isMicOn, setIsMicOn] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    async function enableCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        // Optionally handle error (e.g., show a message)
      }
    }
    enableCamera()
    // Cleanup: stop camera when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
      <AnimatedBackground />

      {/* Camera Preview */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Camera Feed as Background */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ background: '#111' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 z-10" />

        {/* Voice Agent */}
        <VoiceAgent />

        {/* Center Analyze Button */}
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <Link href="/color-analysis">
            <button className="w-32 h-32 rounded-full gradient-bg pulse-glow flex items-center justify-center text-white font-bold text-lg shadow-2xl hover:scale-110 transition-all duration-300 float-animation">
              <div className="text-center">
                <div className="text-2xl mb-1">✨</div>
                <div>Analyze</div>
              </div>
            </button>
          </Link>
        </div>

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
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
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
