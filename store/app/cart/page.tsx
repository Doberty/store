"use client"

import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "../../components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart()

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some products to your cart to see them here</p>
            <Button asChild>
              <Link href="/">Discover Products</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                {items.map((item, index) => (
                  <div key={item.product.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="flex gap-4">
                      <div className="relative h-24 w-24 overflow-hidden rounded-md">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className="text-sm text-muted-foreground">{formatPrice(item.product.price)}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeItem(item.product.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between font-medium">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                </div>
                <Button className="w-full mt-6">Checkout</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
