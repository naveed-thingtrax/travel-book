import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, UmbrellaIcon, Mountain } from "lucide-react"

interface TripTypeCardProps {
  name: string
  title: string
  description: string
  icon: string
}

export function TripTypeCard({ name, title, description, icon }: TripTypeCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "umbrella-beach":
        return <UmbrellaIcon className="h-12 w-12 text-primary" />
      case "mountain":
        return <Mountain className="h-12 w-12 text-primary" />
      case "briefcase":
        return <Briefcase className="h-12 w-12 text-primary" />
      default:
        return <Briefcase className="h-12 w-12 text-primary" />
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-col items-center">
        {getIcon()}
        <CardTitle className="mt-4">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p>Get a customized packing list for your {title.toLowerCase()}</p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href={`/checklist/${name}`}>
          <Button>Create Checklist</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
