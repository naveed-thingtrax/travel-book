"use client"

import type { ChecklistItem } from "@/lib/models"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChecklistItemProps {
  item: ChecklistItem
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}

export function ChecklistItemComponent({ item, onToggle, onRemove }: ChecklistItemProps) {
  const id = item._id?.toString() || item.name

  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <div className="flex items-center space-x-3">
        <Checkbox id={`item-${id}`} checked={item.isPacked} onCheckedChange={() => onToggle(id)} />
        <label
          htmlFor={`item-${id}`}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            item.isPacked && "line-through text-muted-foreground",
          )}
        >
          {item.name}
          {item.isEssential && (
            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Essential</span>
          )}
        </label>
      </div>

      <Button variant="ghost" size="sm" onClick={() => onRemove(id)} className="h-8 w-8 p-0">
        <Trash2 className="h-4 w-4 text-muted-foreground" />
        <span className="sr-only">Remove item</span>
      </Button>
    </div>
  )
}
