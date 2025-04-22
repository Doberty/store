import type { Product } from "./types"
import { v4 as uuidv4 } from "uuid"

// Get or create a user ID
export function getUserId(): string {
  if (typeof window === "undefined") return "server"

  let userId = localStorage.getItem("userId")
  if (!userId) {
    userId = uuidv4()
    localStorage.setItem("userId", userId || "")
  }
  return userId || ""
}

// Functions to manage liked products in localStorage
export function getLikedProducts(): Product[] {
  if (typeof window === "undefined") return []

  const likedProducts = localStorage.getItem("likedProducts")
  if (!likedProducts) return []

  try {
    return JSON.parse(likedProducts)
  } catch (error) {
    console.error("Failed to parse liked products from localStorage", error)
    return []
  }
}

export function addToLikedProducts(product: Product): void {
  if (typeof window === "undefined") return

  const likedProducts = getLikedProducts()

  // Check if product is already liked
  if (!likedProducts.some((p) => p.id === product.id)) {
    const updatedLikedProducts = [...likedProducts, product]
    localStorage.setItem("likedProducts", JSON.stringify(updatedLikedProducts))

    // Record interaction with the API
    recordInteraction(product.id, "like")
  }
}

export function removeFromLikedProducts(productId: string): void {
  if (typeof window === "undefined") return

  const likedProducts = getLikedProducts()
  const updatedLikedProducts = likedProducts.filter((product) => product.id !== productId)

  if (updatedLikedProducts.length === 0) {
    localStorage.removeItem("likedProducts")
  } else {
    localStorage.setItem("likedProducts", JSON.stringify(updatedLikedProducts))
  }

  // Record interaction with the API
  recordInteraction(productId, "dislike")
}

export function isProductLiked(productId: string): boolean {
  if (typeof window === "undefined") return false

  const likedProducts = getLikedProducts()
  return likedProducts.some((product) => product.id === productId)
}

// Record user interaction with the API
export async function recordInteraction(
  productId: string,
  action: "like" | "dislike" | "view" | "purchase",
): Promise<void> {
  try {
    const userId = getUserId()
    await fetch(`/api/interactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        productId,
        action,
      }),
    })
  } catch (error) {
    console.error("Failed to record interaction:", error)
  }
}

// Fetch personalized recommendations
export async function getRecommendations(): Promise<Product[]> {
  try {
    const userId = getUserId()
    const response = await fetch(`/api/recommendations?userId=${userId}`)
    if (!response.ok) {
      throw new Error("Failed to fetch recommendations")
    }
    const data = await response.json()
    return data.products
  } catch (error) {
    console.error("Error fetching recommendations:", error)
    return []
  }
}
