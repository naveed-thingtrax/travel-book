import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tripType = searchParams.get("tripType")

    if (!tripType) {
      return NextResponse.json({ error: "Trip type is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("travel-checklist")

    // Find the most recent checklist for this trip type
    const checklist = await db.collection("checklists")
      .findOne(
        { tripType },
        { sort: { createdAt: -1 } }
      )

    if (!checklist) {
      return NextResponse.json({ checklist: null })
    }

    // Convert ObjectId to string for client-side use
    const serializedChecklist = {
      ...checklist,
      _id: checklist._id.toString(),
      items: checklist.items.map((item: any) => ({
        ...item,
        _id: item._id?.toString(),
      })),
    }

    return NextResponse.json({ checklist: serializedChecklist })
  } catch (error) {
    console.error("Error fetching checklist:", error)
    return NextResponse.json({ error: "Failed to fetch checklist" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { tripType, items } = await request.json()

    const client = await clientPromise
    const db = client.db("travel-checklist")

    // For now, we'll use a simple userId since we don't have auth
    const userId = "default-user"

    // Process items for MongoDB
    const processedItems = items.map((item: any) => {
      const newItem = { ...item }
      // Remove _id for new items
      if (!newItem._id) {
        delete newItem._id
      }
      return newItem
    })

    const checklist = {
      userId,
      tripType,
      items: processedItems,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("checklists").insertOne(checklist)

    return NextResponse.json({
      success: true,
      checklistId: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("Error creating checklist:", error)
    return NextResponse.json({ error: "Failed to create checklist" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { checklistId, items } = await request.json()

    const client = await clientPromise
    const db = client.db("travel-checklist")

    // Process items for MongoDB
    const processedItems = items.map((item: any) => {
      const newItem = { ...item }
      // Remove _id for new items
      if (!newItem._id) {
        delete newItem._id
      }
      return newItem
    })

    await db.collection("checklists").updateOne(
      { _id: new ObjectId(checklistId) },
      {
        $set: {
          items: processedItems,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating checklist:", error)
    return NextResponse.json({ error: "Failed to update checklist" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get("itemId")
    const checklistId = searchParams.get("checklistId")

    if (!itemId || !checklistId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("travel-checklist")

    // First, get the current checklist
    const checklist = await db.collection("checklists").findOne({ _id: new ObjectId(checklistId) })
    if (!checklist) {
      return NextResponse.json({ error: "Checklist not found" }, { status: 404 })
    }

    // Filter out the item to be deleted
    const updatedItems = checklist.items.filter((item: any) => item._id?.toString() !== itemId)

    // Update the checklist with the filtered items
    await db.collection("checklists").updateOne(
      { _id: new ObjectId(checklistId) },
      {
        $set: {
          items: updatedItems,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting item:", error)
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 })
  }
}
