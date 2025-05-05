import { Header } from "@/components/header"
import { TripTypeCard } from "@/components/trip-type-card"
import { seedDatabase } from "@/lib/seed-data"

// Seed the database when the app starts
export const dynamic = "force-dynamic"

export default async function Home() {
  // Seed the database on initial load
  await seedDatabase()

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Choose Your Trip Type</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TripTypeCard
            name="beach"
            title="Beach Vacation"
            description="Sun, sand, and relaxation"
            icon="umbrella-beach"
          />
          <TripTypeCard name="hike" title="Hiking Trip" description="Adventure in the great outdoors" icon="mountain" />
          <TripTypeCard name="work" title="Business Trip" description="Professional travel for work" icon="briefcase" />
        </div>
      </div>
    </main>
  )
}
