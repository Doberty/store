export interface Product {
    id: string
    name: string
    description: string
    price: number
    image: string
    stock: number
    category: string
    brand: string
  }
  
  export interface UserPreference {
    userId: string
    likedProducts: string[]
    dislikedProducts: string[]
    viewedProducts: string[]
    lastInteractions: Array<{
      productId: string
      action: "like" | "dislike" | "view" | "purchase"
      timestamp: number
    }>
  }
  