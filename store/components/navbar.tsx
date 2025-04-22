"use client"

import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "./cart-provider"
import { Badge } from "../components/ui/badge"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const { items } = useCart()
  const pathname = usePathname()

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-bold text-xl">
          SwipeShop
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className={cn(pathname === "/liked" && "bg-accent")}>
            <Link href="/liked">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Liked Products</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className={cn("relative", pathname === "/cart" && "bg-accent")}>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Shopping Cart</span>
              {items.length > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {items.reduce((acc, item) => acc + item.quantity, 0)}
                </Badge>
              )}
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
