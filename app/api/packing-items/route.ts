import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tripType = searchParams.get("tripType")

    const client = await clientPromise
    const db = client.db("travel-checklist")

    let query = {}
    if (tripType) {
      query = { tripTypes: tripType }
    }

    const packingItems = await db.collection("packingItems").find(query).toArray()

    return NextResponse.json(packingItems)
  } catch (error) {
    console.error("Error fetching packing items:", error)
    return NextResponse.json({ error: "Failed to fetch packing items" }, { status: 500 })
  }
}
