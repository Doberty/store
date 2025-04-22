import { Redis } from "@upstash/redis"
import { Product } from "./types"
import { getProducts } from "./data"

// Initialize Redis client
export const redis = new Redis({
  url: process.env.URL || "",
  token: process.env.REDIS_TOKEN || "",
})

// User preference keys
const USER_PREFERENCES_KEY = (userId: string) => `user:${userId}:preferences`
const USER_RECOMMENDATIONS_KEY = (userId: string) => `user:${userId}:recommendations`
const PRODUCT_VIEWS_KEY = (productId: string) => `product:${productId}:views`
const PRODUCT_LIKES_KEY = (productId: string) => `product:${productId}:likes`

// Store user interaction with a product
export async function recordUserInteraction(
  userId: string,
  productId: string,
  action: "like" | "dislike" | "view" | "purchase",
) {
  const key = USER_PREFERENCES_KEY(userId)
  const interaction = {
    productId,
    action,
    timestamp: Date.now(),
  }

  // Add to user's interaction history
  await redis.lpush(`${key}:interactions`, JSON.stringify(interaction))
  // Trim to keep only recent interactions
  await redis.ltrim(`${key}:interactions`, 0, 49) // Keep last 50 interactions

  // Update specific sets based on action
  if (action === "like") {
    await redis.sadd(`${key}:liked`, productId)
    await redis.srem(`${key}:disliked`, productId)
    await redis.incr(PRODUCT_LIKES_KEY(productId))
  } else if (action === "dislike") {
    await redis.sadd(`${key}:disliked`, productId)
    await redis.srem(`${key}:liked`, productId)
  } else if (action === "view") {
    await redis.sadd(`${key}:viewed`, productId)
    await redis.incr(PRODUCT_VIEWS_KEY(productId))
  }
}

// Get user preferences
export async function getUserPreferences(userId: string) {
  const key = USER_PREFERENCES_KEY(userId)

  const [liked, disliked, viewed, interactionsJson] = await Promise.all([
    redis.smembers(`${key}:liked`),
    redis.smembers(`${key}:disliked`),
    redis.smembers(`${key}:viewed`),
    redis.lrange(`${key}:interactions`, 0, 9), // Get last 10 interactions
  ])

  const interactions = interactionsJson.map((json) => JSON.parse(json))

  return {
    userId,
    likedProducts: liked,
    dislikedProducts: disliked,
    viewedProducts: viewed,
    lastInteractions: interactions,
  }
}

// Store recommendations for a user
export async function storeRecommendations(userId: string, recommendations: string[]) {
  const key = USER_RECOMMENDATIONS_KEY(userId)

  // Store recommendations with expiration (1 hour)
  await redis.del(key) // Clear existing recommendations
  if (recommendations.length > 0) {
    await redis.rpush(key, ...recommendations)
    await redis.expire(key, 3600) // Expire after 1 hour
  }
}

// Get cached recommendations for a user
export async function getCachedRecommendations(userId: string): Promise<string[]> {
  const key = USER_RECOMMENDATIONS_KEY(userId)
  return redis.lrange(key, 0, -1)
}

// Get trending products based on views and likes
export async function getTrendingProducts(limit = 10): Promise<string[]> {
  // This is a simplified implementation
  // In a real app, you might use Redis Sorted Sets for this
  //const pipeline = redis.pipeline()

  // Get all products
  const allProducts = await getProducts()

  // Get view counts for all products
  const viewCounts: number[] = await Promise.all(
    allProducts.map((product: Product) =>
      redis.get(PRODUCT_VIEWS_KEY(product.id)).then((count => Number.parseInt((count as string | null) || "0"))),
    ),
  )

  // Get like counts for all products
  const likeCounts: number[] = await Promise.all(
    allProducts.map((product: Product) =>
      redis.get(PRODUCT_LIKES_KEY(product.id)).then((count => Number.parseInt((count as string | null) || "0"))),
    ),
  )

  // Calculate a score for each product (views + likes*2)
  const productsWithScores: { id: string; score: number }[] = allProducts.map((product: Product, index: number) => ({
    id: product.id,
    score: viewCounts[index] + likeCounts[index] * 2,
  }))

  // Sort by score and return top products
  return productsWithScores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((p) => p.id)
}

// Helper function to get products (imported from data.ts to avoid circular dependencies)


