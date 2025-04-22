import { type NextRequest, NextResponse } from "next/server"
import { recordUserInteraction } from "@/lib/redis"

export async function POST(request: NextRequest) {
  try {
    const { userId, productId, action } = await request.json()

    if (!userId || !productId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate action
    if (!["like", "dislike", "view", "purchase"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    // Record the interaction
    await recordUserInteraction(userId, productId, action)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error recording interaction:", error)
    return NextResponse.json({ error: "Failed to record interaction" }, { status: 500 })
  }
}
