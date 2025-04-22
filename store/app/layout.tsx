import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "../components/theme-provider"
import Navbar from "../components/navbar"
import { CartProvider } from "../components/cart-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SwipeShop - Discover Products",
  description: "Discover products with a swipe",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-1">{children}</div>
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
