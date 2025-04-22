import type { Product } from "../lib/types"

// Mock product data
const products: Product[] = [
  {
    id: "1",
    name: "Minimalist Watch",
    description: "A sleek, minimalist watch with a leather strap. Perfect for any occasion.",
    price: 9999,
    image: "/placeholder.svg?height=600&width=600",
    stock: 10,
    category: "accessories",
    brand: "Timeless",
  },
  {
    id: "2",
    name: "Wireless Headphones",
    description: "Premium wireless headphones with noise cancellation and long battery life.",
    price: 19999,
    image: "/placeholder.svg?height=600&width=600",
    stock: 5,
    category: "electronics",
    brand: "SoundWave",
  },
  {
    id: "3",
    name: "Cotton T-Shirt",
    description: "Soft, comfortable cotton t-shirt available in various colors.",
    price: 2999,
    image: "/placeholder.svg?height=600&width=600",
    stock: 20,
    category: "clothing",
    brand: "BasicWear",
  },
  {
    id: "4",
    name: "Leather Wallet",
    description: "Handcrafted leather wallet with multiple card slots and a coin pocket.",
    price: 4999,
    image: "/placeholder.svg?height=600&width=600",
    stock: 8,
    category: "accessories",
    brand: "LeatherCraft",
  },
  {
    id: "5",
    name: "Smart Water Bottle",
    description: "Track your hydration with this smart water bottle that syncs with your phone.",
    price: 3499,
    image: "/placeholder.svg?height=600&width=600",
    stock: 15,
    category: "lifestyle",
    brand: "HydroTech",
  },
  {
    id: "6",
    name: "Yoga Mat",
    description: "Non-slip yoga mat made from eco-friendly materials.",
    price: 2499,
    image: "/placeholder.svg?height=600&width=600",
    stock: 12,
    category: "fitness",
    brand: "ZenFit",
  },
  {
    id: "7",
    name: "Ceramic Coffee Mug",
    description: "Handmade ceramic coffee mug with a unique design.",
    price: 1499,
    image: "/placeholder.svg?height=600&width=600",
    stock: 25,
    category: "home",
    brand: "ArtisanHome",
  },
  {
    id: "8",
    name: "Portable Charger",
    description: "High-capacity portable charger for all your devices.",
    price: 3999,
    image: "/placeholder.svg?height=600&width=600",
    stock: 18,
    category: "electronics",
    brand: "PowerUp",
  },
  {
    id: "9",
    name: "Sunglasses",
    description: "Stylish sunglasses with UV protection.",
    price: 7999,
    image: "/placeholder.svg?height=600&width=600",
    stock: 7,
    category: "accessories",
    brand: "ShadeStyle",
  },
  {
    id: "10",
    name: "Backpack",
    description: "Durable backpack with multiple compartments and laptop sleeve.",
    price: 5999,
    image: "/placeholder.svg?height=600&width=600",
    stock: 9,
    category: "accessories",
    brand: "TrekGear",
  },
  {
    id: "11",
    name: "Wireless Earbuds",
    description: "True wireless earbuds with touch controls and charging case.",
    price: 12999,
    image: "/placeholder.svg?height=600&width=600",
    stock: 14,
    category: "electronics",
    brand: "SoundWave",
  },
  {
    id: "12",
    name: "Fitness Tracker",
    description: "Track your steps, heart rate, and sleep with this sleek fitness band.",
    price: 8999,
    image: "/placeholder.svg?height=600&width=600",
    stock: 11,
    category: "fitness",
    brand: "FitTech",
  },
  {
    id: "13",
    name: "Denim Jacket",
    description: "Classic denim jacket that goes with everything in your wardrobe.",
    price: 6999,
    image: "/placeholder.svg?height=600&width=600",
    stock: 6,
    category: "clothing",
    brand: "UrbanStyle",
  },
  {
    id: "14",
    name: "Scented Candle",
    description: "Long-lasting scented candle made with natural wax and essential oils.",
    price: 1999,
    image: "/placeholder.svg?height=600&width=600",
    stock: 30,
    category: "home",
    brand: "AromaLux",
  },
  {
    id: "15",
    name: "Mechanical Keyboard",
    description: "Tactile mechanical keyboard with RGB lighting for gaming and typing.",
    price: 9499,
    image: "/placeholder.svg?height=600&width=600",
    stock: 8,
    category: "electronics",
    brand: "TechType",
  },
]

// Function to get all products
export async function getProducts(): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return products
}

// Function to get a product by ID
export async function getProductById(id: string): Promise<Product | undefined> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return products.find((product) => product.id === id)
}

// Function to get products by brand
export async function getProductsByBrand(brand: string): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return products.filter((product) => product.brand === brand)
}

// Function to get all unique brands
export async function getAllBrands(): Promise<string[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))
  const brands = new Set(products.map((product) => product.brand))
  return Array.from(brands)
}
