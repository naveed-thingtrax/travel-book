import clientPromise from "./mongodb"
import type { TripType, PackingItem } from "./models"

export async function seedDatabase() {
  const client = await clientPromise
  const db = client.db("travel-checklist")

  // Check if data already exists
  const tripTypesCount = await db.collection("tripTypes").countDocuments()
  const packingItemsCount = await db.collection("packingItems").countDocuments()

  if (tripTypesCount > 0 && packingItemsCount > 0) {
    console.log("Database already seeded")
    return
  }

  // Seed trip types
  const tripTypes: TripType[] = [
    {
      name: "beach",
      description: "Beach vacation",
      icon: "umbrella-beach",
    },
    {
      name: "hike",
      description: "Hiking trip",
      icon: "mountain",
    },
    {
      name: "work",
      description: "Business trip",
      icon: "briefcase",
    },
  ]

  // Seed packing items
  const packingItems: PackingItem[] = [
    // Essentials for all trips
    {
      name: "Passport/ID",
      category: "Documents",
      tripTypes: ["beach", "hike", "work"],
      isEssential: true,
    },
    {
      name: "Phone charger",
      category: "Electronics",
      tripTypes: ["beach", "hike", "work"],
      isEssential: true,
    },
    {
      name: "Toothbrush",
      category: "Toiletries",
      tripTypes: ["beach", "hike", "work"],
      isEssential: true,
    },
    {
      name: "Toothpaste",
      category: "Toiletries",
      tripTypes: ["beach", "hike", "work"],
      isEssential: true,
    },

    // Beach specific
    {
      name: "Swimsuit",
      category: "Clothing",
      tripTypes: ["beach"],
      isEssential: true,
    },
    {
      name: "Sunscreen",
      category: "Toiletries",
      tripTypes: ["beach", "hike"],
      isEssential: true,
    },
    {
      name: "Beach towel",
      category: "Accessories",
      tripTypes: ["beach"],
      isEssential: false,
    },
    {
      name: "Flip flops",
      category: "Footwear",
      tripTypes: ["beach"],
      isEssential: false,
    },

    // Hiking specific
    {
      name: "Hiking boots",
      category: "Footwear",
      tripTypes: ["hike"],
      isEssential: true,
    },
    {
      name: "Water bottle",
      category: "Accessories",
      tripTypes: ["hike", "beach"],
      isEssential: true,
    },
    {
      name: "First aid kit",
      category: "Health",
      tripTypes: ["hike"],
      isEssential: true,
    },
    {
      name: "Backpack",
      category: "Accessories",
      tripTypes: ["hike"],
      isEssential: true,
    },

    // Work specific
    {
      name: "Laptop",
      category: "Electronics",
      tripTypes: ["work"],
      isEssential: true,
    },
    {
      name: "Business attire",
      category: "Clothing",
      tripTypes: ["work"],
      isEssential: true,
    },
    {
      name: "Notebook",
      category: "Accessories",
      tripTypes: ["work"],
      isEssential: false,
    },
    {
      name: "Business cards",
      category: "Documents",
      tripTypes: ["work"],
      isEssential: false,
    },
  ]

  // Insert data
  if (tripTypesCount === 0) {
    await db.collection("tripTypes").insertMany(tripTypes)
    console.log("Trip types seeded")
  }

  if (packingItemsCount === 0) {
    await db.collection("packingItems").insertMany(packingItems)
    console.log("Packing items seeded")
  }
}
