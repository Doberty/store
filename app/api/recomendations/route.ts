import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { getProducts, getProductById } from "@/lib/data"
import { getUserPreferences, getCachedRecommendations, storeRecommendations } from "@/lib/redis"

export async function GET(request: NextRequest) {
  // Get user ID from query params (in a real app, this would come from authentication)
  const userId = request.nextUrl.searchParams.get("userId") || "anonymous"

  try {
    // Check if we have cached recommendations
    const cachedRecommendations = await getCachedRecommendations(userId)
    if (cachedRecommendations.length > 0) {
      // Return cached recommendations
      const recommendedProducts = await Promise.all(cachedRecommendations.map((id) => getProductById(id)))
      return NextResponse.json({
        products: recommendedProducts.filter(Boolean),
        source: "cache",
      })
    }

    // Get user preferences
    const userPreferences = await getUserPreferences(userId)

    // Get all products
    const allProducts = await getProducts()

    // If user has no preferences yet, return trending or random products
    if (userPreferences.likedProducts.length === 0 && userPreferences.viewedProducts.length === 0) {
      // For new users, just return some products they haven't seen yet
      const unseenProducts = allProducts.filter((p) => !userPreferences.viewedProducts.includes(p.id)).slice(0, 10)

      // Store these as recommendations
      await storeRecommendations(
        userId,
        unseenProducts.map((p) => p.id),
      )

      return NextResponse.json({
        products: unseenProducts,
        source: "new_user",
      })
    }

    // Prepare context for Grok
    // Get details of liked products
    const likedProducts = (await Promise.all(userPreferences.likedProducts.map((id) => getProductById(id)))).filter(
      (p): p is NonNullable<typeof p> => Boolean(p),
    )

    // Get details of last viewed products
    const lastViewedIds = userPreferences.lastInteractions
      .filter((i) => i.action === "view")
      .map((i) => i.productId)
      .slice(0, 5)

    const lastViewedProducts = await Promise.all(lastViewedIds.map((id) => getProductById(id)))

    // Create a context string for Grok
    const context = {
      likedProducts: likedProducts
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
        .map((p) => ({
          id: p.id!,
          name: p.name,
          category: p.category,
          brand: p.brand,
          price: p.price,
        })),
      recentlyViewed: lastViewedProducts
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
        .map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          brand: p.brand,
          price: p.price,
        })),
      allProducts: allProducts.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        brand: p.brand,
        price: p.price,
      })),
    }

    // Generate recommendations using Grok
    const { text } = await generateText({
      model: xai("grok-1"),
      prompt: `
        You are a product recommendation system for an e-commerce store.
        
        USER PREFERENCES:
        ${JSON.stringify(context.likedProducts.length > 0 ? context.likedProducts : "No liked products yet")}
        
        RECENTLY VIEWED:
        ${JSON.stringify(context.recentlyViewed.length > 0 ? context.recentlyViewed : "No recently viewed products")}
        
        ALL AVAILABLE PRODUCTS:
        ${JSON.stringify(context.allProducts)}
        
        Based on the user's preferences and recently viewed items, recommend 10 products from the available products.
        Consider similar categories, brands, and price ranges to what the user has liked or viewed.
        If the user has no preferences yet, recommend popular or diverse products.
        
        Return ONLY a JSON array of product IDs, nothing else. Example: ["1", "5", "9"]
      `,
    })

    // Parse the response to get recommended product IDs
    let recommendedIds: string[] = []
    try {
      // Clean the response to ensure it's valid JSON
      const cleanedText = text.replace(/```json|```/g, "").trim()
      recommendedIds = JSON.parse(cleanedText)

      // Ensure we have valid product IDs
      recommendedIds = recommendedIds.filter(
        (id) => allProducts.some((p) => p.id === id) && !userPreferences.dislikedProducts.includes(id),
      )
    } catch (error) {
      console.error("Failed to parse Grok recommendations:", error)
      // Fallback to random products
      recommendedIds = allProducts
        .filter((p) => !userPreferences.dislikedProducts.includes(p.id))
        .sort(() => Math.random() - 0.5)
        .slice(0, 10)
        .map((p) => p.id)
    }

    // Store recommendations in Redis
    await storeRecommendations(userId, recommendedIds)

    // Get full product details for recommended IDs
    const recommendedProducts = await Promise.all(recommendedIds.map((id) => getProductById(id)))

    return NextResponse.json({
      products: recommendedProducts.filter(Boolean),
      source: "grok",
    })
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}
