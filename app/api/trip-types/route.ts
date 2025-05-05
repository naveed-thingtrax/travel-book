import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("travel-checklist")

    const tripTypes = await db.collection("tripTypes").find({}).toArray()

    return NextResponse.json(tripTypes)
  } catch (error) {
    console.error("Error fetching trip types:", error)
    return NextResponse.json({ error: "Failed to fetch trip types" }, { status: 500 })
  }
}
