import Link from "next/link"
import { Luggage } from "lucide-react"

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Luggage size={24} />
          <span className="font-bold text-xl">Travel Checklist</span>
        </Link>
      </div>
    </header>
  )
}
