"use client"

import { useState } from "react"
import { Heart, MessageCircle, Share, Camera, ArrowLeft, Gift } from "lucide-react"
import Link from "next/link"
import AnimatedBackground from "../components/AnimatedBackground"

interface Post {
  id: number
  user: {
    avatar: string
    username: string
    verified: boolean
  }
  image: string
  caption: string
  items: { brand: string; item: string; price: number }[]
  likes: number
  comments: number
  timestamp: string
  reward?: {
    views: number
    buys: number
    discount: number
    brand: string
  }
}

const posts: Post[] = [
  {
    id: 1,
    user: {
      avatar: "/placeholder.svg?height=40&width=40",
      username: "styleicon_maya",
      verified: true,
    },
    image: "/placeholder.svg?height=600&width=400",
    caption: "Obsessed with this autumn vibe! 🍂✨",
    items: [
      { brand: "Zara", item: "Oversized Blazer", price: 89 },
      { brand: "H&M", item: "Wide Leg Trousers", price: 45 },
    ],
    likes: 3542,
    comments: 127,
    timestamp: "2h ago",
    reward: {
      views: 3500,
      buys: 9,
      discount: 10,
      brand: "Zara",
    },
  },
  {
    id: 2,
    user: {
      avatar: "/placeholder.svg?height=40&width=40",
      username: "fashionista_alex",
      verified: false,
    },
    image: "/placeholder.svg?height=600&width=400",
    caption: "Y2K vibes are back and I'm here for it! 💫",
    items: [
      { brand: "ASOS", item: "Crop Top", price: 25 },
      { brand: "Urban Outfitters", item: "Low Rise Jeans", price: 78 },
    ],
    likes: 1823,
    comments: 64,
    timestamp: "5h ago",
  },
]

export default function CommunityPage() {
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())

  const handleLike = (postId: number) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 relative">
      <AnimatedBackground />

      <div className="relative z-10 pb-24">
        {/* Header */}
        <div className="sticky top-0 glass-card rounded-b-2xl p-4 mb-6 z-20">
          <div className="flex items-center justify-between">
            <Link href="/" className="w-10 h-10 rounded-full glass-card flex items-center justify-center">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold">Community</h1>
            <button
              onClick={() => setShowCreatePost(true)}
              className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white"
            >
              <Camera size={20} />
            </button>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6 px-4">
          {posts.map((post) => (
            <div key={post.id} className="glass-card rounded-3xl overflow-hidden">
              {/* Post Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={post.user.avatar || "/placeholder.svg"}
                    alt={post.user.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold">{post.user.username}</span>
                      {post.user.verified && <span className="text-blue-400">✓</span>}
                    </div>
                    <span className="text-xs text-gray-400">{post.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Post Image */}
              <img src={post.image || "/placeholder.svg"} alt="Outfit post" className="w-full h-96 object-cover" />

              {/* Reward Banner */}
              {post.reward && (
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 p-3 m-4 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Gift className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400 font-semibold">
                      🎉 You earned {post.reward.discount}% off at {post.reward.brand} from{" "}
                      {post.reward.views.toLocaleString()} views and {post.reward.buys} buys!
                    </span>
                  </div>
                </div>
              )}

              {/* Post Actions */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-1 transition-all duration-300 ${
                        likedPosts.has(post.id) ? "text-red-500" : "text-gray-400"
                      }`}
                    >
                      <Heart size={20} fill={likedPosts.has(post.id) ? "currentColor" : "none"} />
                      <span className="text-sm">{post.likes.toLocaleString()}</span>
                    </button>

                    <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors">
                      <MessageCircle size={20} />
                      <span className="text-sm">{post.comments}</span>
                    </button>

                    <button className="text-gray-400 hover:text-white transition-colors">
                      <Share size={20} />
                    </button>
                  </div>
                </div>

                <p className="text-sm mb-3">{post.caption}</p>

                {/* Tagged Items */}
                <div className="space-y-2">
                  {post.items.map((item, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-3 rounded-xl glass-card hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          {item.brand} {item.item}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold">${item.price}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-500 text-white">Buy Now</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full max-w-[480px] mx-auto glass-card rounded-t-3xl p-6 animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Post Your Fit</h2>
              <button
                onClick={() => setShowCreatePost(false)}
                className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="w-full h-48 rounded-2xl glass-card flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Camera size={32} className="mx-auto mb-2" />
                  <p>Upload your outfit photo</p>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-4">
                <h3 className="font-semibold mb-3">Tag Your Items</h3>
                <button className="w-full py-3 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-all duration-300">
                  + Add Item Tags
                </button>
              </div>

              <div className="glass-card rounded-2xl p-4">
                <h3 className="font-semibold mb-2">Potential Rewards</h3>
                <p className="text-sm text-gray-300 mb-3">
                  📣 If this post gets 3,000 views and 10 buys, you'll unlock 10% off at H&M!
                </p>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>• 1,000 views = 5% off</p>
                  <p>• 3,000 views = 10% off</p>
                  <p>• 10,000 views = 20% off</p>
                  <p>• +1% per verified purchase (max 30%)</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-3 mb-4">
              <p className="text-xs text-yellow-300">
                ⚠️ Rewards shown are illustrative. Actual discounts depend on verified performance and participating
                brands.
              </p>
            </div>

            <button className="w-full py-3 rounded-2xl gradient-bg text-white font-semibold hover:scale-105 transition-all duration-300">
              Share Your Style
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
