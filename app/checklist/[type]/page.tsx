import { Header } from "@/components/header"
import { ChecklistContainer } from "@/components/checklist-container"
import { notFound } from "next/navigation"
import clientPromise from "@/lib/mongodb"

export const dynamic = "force-dynamic"

interface ChecklistPageProps {
  params: {
    type: string
  }
}

export default async function ChecklistPage({ params }: ChecklistPageProps) {
  if (!params?.type) {
    notFound()
  }

  const type = params.type

  // Validate trip type
  const validTypes = ["beach", "hike", "work"]
  if (!validTypes.includes(type)) {
    notFound()
  }

  try {
    // Get trip type details
    const client = await clientPromise
    const db = client.db("travel-checklist")

    const tripType = await db.collection("tripTypes").findOne({ name: type })

    if (!tripType) {
      notFound()
    }

    // Get packing items for this trip type
    const packingItems = await db.collection("packingItems").find({ tripTypes: type }).toArray()

    // Convert MongoDB objects to plain JavaScript objects
    const serializedItems = packingItems.map((item) => ({
      _id: item._id.toString(),
      name: item.name,
      category: item.category,
      tripTypes: item.tripTypes,
      isEssential: item.isEssential,
      isPacked: false,
    }))

    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold text-center mb-2">{tripType.description} Packing List</h1>
          <p className="text-center text-muted-foreground mb-8">Check off items as you pack them</p>

          <ChecklistContainer
            tripType={type}
            initialItems={serializedItems}
          />
        </div>
      </main>
    )
  } catch (error) {
    console.error("Error loading checklist page:", error)
    notFound()
  }
}
