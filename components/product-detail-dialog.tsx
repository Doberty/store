"use client"

import type { Product } from "../lib/types"
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, Store } from "lucide-react"
import { useCart } from "./cart-provider"
import { addToLikedProducts, isProductLiked } from "../lib/client-data"
import { useState, useEffect } from "react"
import { formatPrice } from "@/lib/utils"
import { Badge } from "../components/ui/badge"

interface ProductDetailDialogProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ProductDetailDialog({ product, open, onOpenChange }: ProductDetailDialogProps) {
  const { addItem } = useCart()
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    if (product) {
      setLiked(isProductLiked(product.id))
    }
  }, [product, open])

  const handleAddToCart = () => {
    addItem(product, 1)
  }

  const handleLike = () => {
    addToLikedProducts(product)
    setLiked(true)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>{product.name}</DialogTitle>
        <div className="relative h-64 w-full">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">{formatPrice(product.price)}</span>
            {product.stock > 0 ? (
              <span className="text-sm text-green-600">In Stock</span>
            ) : (
              <span className="text-sm text-red-600">Out of Stock</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{product.brand}</span>
            <Badge variant="outline" className="ml-auto">
              {product.category}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">{product.description}</p>

          <div className="flex gap-2">
            <Button onClick={handleAddToCart} className="flex-1" disabled={product.stock <= 0}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button
              variant={liked ? "default" : "outline"}
              onClick={handleLike}
              className={liked ? "bg-red-500 hover:bg-red-600" : ""}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
