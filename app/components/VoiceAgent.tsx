"use client"

import { useState } from "react"
import { Mic, MicOff } from "lucide-react"

export default function VoiceAgent() {
  const [isListening, setIsListening] = useState(false)
  const [showTooltip, setShowTooltip] = useState(true)

  return (
    <div className="fixed top-6 left-6 z-40">
      <div className="relative">
        <button
          onClick={() => setIsListening(!isListening)}
          className={`w-16 h-16 rounded-full glass-card flex items-center justify-center transition-all duration-300 ${
            isListening ? "pulse-glow scale-110" : "hover:scale-105"
          }`}
          aria-label="Voice Assistant"
        >
          {isListening ? <Mic className="w-6 h-6 text-purple-400" /> : <MicOff className="w-6 h-6 text-gray-400" />}
        </button>

        {showTooltip && (
          <div className="absolute top-20 left-0 w-64 glass-card rounded-2xl p-4 animate-in slide-in-from-top-2">
            <div className="text-sm text-gray-200">
              <p className="font-semibold text-purple-400 mb-2">Hi! I'm your AI stylist.</p>
              <p>Try saying:</p>
              <p className="text-purple-300 italic">"Analyze my color tone"</p>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              aria-label="Close tooltip"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
