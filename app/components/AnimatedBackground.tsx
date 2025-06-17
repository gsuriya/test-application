"use client"

import { useEffect, useState } from "react"

interface Bubble {
  id: number
  size: number
  left: number
  duration: number
  delay: number
  color: string
}

export default function AnimatedBackground() {
  const [bubbles, setBubbles] = useState<Bubble[]>([])

  useEffect(() => {
    const colors = [
      "rgba(139, 92, 246, 0.3)", // purple
      "rgba(236, 72, 153, 0.3)", // pink
      "rgba(59, 130, 246, 0.3)", // blue
      "rgba(16, 185, 129, 0.3)", // emerald
      "rgba(245, 158, 11, 0.3)", // amber
      "rgba(239, 68, 68, 0.3)", // red
    ]

    const newBubbles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 60 + 20,
      left: Math.random() * 100,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))

    setBubbles(newBubbles)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full bubble opacity-60"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            backgroundColor: bubble.color,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  )
}
