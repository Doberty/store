"use client"

import { useEffect, useState } from "react"
import type { Product } from "@/lib/types"
import { getLikedProducts } from "@/lib/client-data"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LikedPage() {
  const [likedProducts, setLikedProducts] = useState<Product[]>([])

  useEffect(() => {
    setLikedProducts(getLikedProducts())
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Liked Products</h1>

        {likedProducts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-4">No liked products yet</h2>
            <p className="text-muted-foreground mb-6">Start swiping to discover products you love</p>
            <Button asChild>
              <Link href="/">Discover Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {likedProducts.map((product) => (
              <ProductCard key={product.id} product={product} showActions={true} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
