"use client"

import Image from "next/image"
import type { Product } from "../lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "../components/ui/card"
import { Heart, ShoppingCart } from "lucide-react"
import { useState, useEffect } from "react"
import { isProductLiked, removeFromLikedProducts } from "../lib/client-data"
import { useCart } from "./cart-provider"
import { formatPrice } from "@/lib/utils"
import ProductDetailDialog from "../components/product-detail-dialog"
import { Badge } from "../components/ui/badge"

interface ProductCardProps {
  product: Product
  showActions?: boolean
}

export default function ProductCard({ product, showActions = false }: ProductCardProps) {
  const [liked, setLiked] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    setLiked(isProductLiked(product.id))
  }, [product.id])

  const handleAddToCart = () => {
    addItem(product, 1)
   
  }

  const handleRemoveLike = () => {
    removeFromLikedProducts(product.id)
    setLiked(false)
  }

  return (
    <>
      <Card className="overflow-hidden">
        <div className="relative h-48 cursor-pointer" onClick={() => setShowDetail(true)}>
          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
          <Badge className="absolute top-2 left-2 bg-black/70 text-white">{product.brand}</Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium truncate">{product.name}</h3>
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
          </div>
        </CardContent>
        {showActions && (
          <CardFooter className="p-4 pt-0 flex gap-2">
            <Button variant="default" size="sm" className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            {liked && (
              <Button variant="outline" size="sm" onClick={handleRemoveLike}>
                <Heart className="h-4 w-4 fill-current" />
              </Button>
            )}
          </CardFooter>
        )}
      </Card>

      <ProductDetailDialog product={product} open={showDetail} onOpenChange={setShowDetail} />
    </>
  )
}
