"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { Product } from "../lib/types"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, X } from "lucide-react"
import Image from "next/image"
import { useCart } from "./cart-provider"
import { addToLikedProducts, removeFromLikedProducts, recordInteraction, getRecommendations } from "../lib/client-data"
import ProductDetailDialog from "./product-detail-dialog"
import { Badge } from "../components/ui/badge"
import { Skeleton } from "../components/ui/skeleton"

interface ProductDiscoveryProps {
  initialProducts: Product[]
}

export default function ProductDiscovery({ initialProducts }: ProductDiscoveryProps) {
  const [products] = useState<Product[]>(initialProducts)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [direction, setDirection] = useState<"left" | "right" | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [loading, setLoading] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const { addItem } = useCart()

  const currentProduct = products[currentIndex]

  const [buttonAction, setButtonAction] = useState<"like" | "dislike" | null>(null)
  const [animating, setAnimating] = useState(false)

  // Fetch personalized recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (currentIndex > products.length / 2) {
        setLoading(true)
        try {
          const recommendations = await getRecommendations()
          if (recommendations.length > 0) {
          }
        } catch (error) {
          console.error("Failed to fetch recommendations:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchRecommendations()
  }, [currentIndex, products.length])

  // Record view when product changes
  useEffect(() => {
    if (currentProduct) {
      recordInteraction(currentProduct.id, "view")
    }
  }, [currentProduct])

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!cardRef.current) return

    let clientX: number, clientY: number

    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    setDragStart({ x: clientX, y: clientY })
  }

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragStart || !cardRef.current) return

    let clientX: number, clientY: number

    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const dx = clientX - dragStart.x
    const dy = clientY - dragStart.y

    setOffset({ x: dx, y: dy })

    if (dx > 50) {
      setDirection("right")
    } else if (dx < -50) {
      setDirection("left")
    } else {
      setDirection(null)
    }
  }

  const handleDragEnd = () => {
    if (!dragStart || !cardRef.current) return

    if (direction === "right") {
      handleLike()
    } else if (direction === "left") {
      handleDislike()
    } else {
      // Reset position if not swiped far enough
      setOffset({ x: 0, y: 0 })
    }

    setDragStart(null)
    setDirection(null)
  }

  const handleLike = () => {
    if (!currentProduct || animating) return

    setButtonAction("like")
    setAnimating(true)
    setOffset({ x: 100, y: 0 })

    setTimeout(() => {
      addToLikedProducts(currentProduct)
      goToNextProduct()
      setButtonAction(null)
      setAnimating(false)
    }, 300)
  }

  const handleDislike = () => {
    if (!currentProduct || animating) return

    setButtonAction("dislike")
    setAnimating(true)
    setOffset({ x: -100, y: 0 })

    setTimeout(() => {
      removeFromLikedProducts(currentProduct.id)
      goToNextProduct()
      setButtonAction(null)
      setAnimating(false)
    }, 300)
  }

  const handleAddToCart = () => {
    if (!currentProduct) return

    addItem(currentProduct, 1)
  }

  const goToNextProduct = () => {
    setOffset({ x: 0, y: 0 })

    if (currentIndex < products.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Reset or show "no more products" message
    }
  }


  const cardStyle = {
    transform: dragStart
      ? `translate(${offset.x}px, ${offset.y}px) rotate(${offset.x * 0.1}deg)`
      : buttonAction
        ? `translate(${offset.x}px, ${offset.y}px) rotate(${offset.x * 0.1}deg)`
        : "translate(0px, 0px) rotate(0deg)",
    transition: dragStart ? "none" : "transform 0.3s ease",
  }

  if (!currentProduct && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-xl font-medium mb-4">No more products</h2>
        <p className="text-muted-foreground mb-6">Check out your liked products or continue shopping</p>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <a href="/liked">View Liked</a>
          </Button>
          <Button onClick={() => setCurrentIndex(0)}>Start Over</Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Discover Products</h2>
      </div>

      <div className="relative h-[60vh] w-full">
        {loading && !currentProduct ? (
          <div className="absolute inset-0 bg-card rounded-xl overflow-hidden shadow-lg flex flex-col">
            <Skeleton className="h-4/5 w-full" />
            <div className="p-4 bg-card">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        ) : currentProduct ? (
          <div
            ref={cardRef}
            className="absolute inset-0 bg-card rounded-xl overflow-hidden shadow-lg"
            style={cardStyle}
            onMouseDown={handleDragStart}
            onMouseMove={dragStart ? handleDragMove : undefined}
            onMouseUp={handleDragEnd}
            onMouseLeave={dragStart ? handleDragEnd : undefined}
            onTouchStart={handleDragStart}
            onTouchMove={dragStart ? handleDragMove : undefined}
            onTouchEnd={handleDragEnd}
          >
            <div className="relative h-4/5 w-full cursor-pointer" onClick={() => setShowDetail(true)}>
              <Image
                src={currentProduct.image || "/placeholder.svg"}
                alt={currentProduct.name}
                fill
                className="object-cover"
              />
              {(direction === "right" || buttonAction === "like") && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full font-bold transform rotate-12 z-10">
                  LIKE
                </div>
              )}
              {(direction === "left" || buttonAction === "dislike") && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full font-bold transform -rotate-12 z-10">
                  NOPE
                </div>
              )}
              <Badge className="absolute top-4 left-4 bg-black/70 text-white z-20">{currentProduct.brand}</Badge>
            </div>
            <div className="p-4 bg-card">
              <h2 className="text-xl font-bold">{currentProduct.name}</h2>
              <div className="flex justify-between items-center">
                <p className="text-lg font-medium">{formatPrice(currentProduct.price)}</p>
                <Badge variant="outline">{currentProduct.category}</Badge>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <Button variant="outline" size="icon" className="h-14 w-14 rounded-full" onClick={handleDislike}>
          <X className="h-6 w-6" />
        </Button>
        <Button variant="outline" size="icon" className="h-14 w-14 rounded-full" onClick={handleAddToCart}>
          <ShoppingCart className="h-6 w-6" />
        </Button>
        <Button
          variant="default"
          size="icon"
          className="h-14 w-14 rounded-full bg-red-500 hover:bg-red-600"
          onClick={handleLike}
        >
          <Heart className="h-6 w-6" />
        </Button>
      </div>

      <ProductDetailDialog product={currentProduct} open={showDetail} onOpenChange={setShowDetail} />
    </>
  )
}
import { formatPrice } from "@/lib/utils"
