"use client"

import { useState, useEffect } from "react"
import type { ChecklistItem } from "@/lib/models"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Save, ArrowLeft } from "lucide-react"
import { ChecklistItemComponent } from "@/components/checklist-item"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface ChecklistContainerProps {
  tripType: string
  initialItems: ChecklistItem[]
}

export function ChecklistContainer({ tripType, initialItems }: ChecklistContainerProps) {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems)
  const [newItemName, setNewItemName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [checklistId, setChecklistId] = useState<string | null>(null)
  const { toast } = useToast()

  // Load existing checklist on mount
  useEffect(() => {
    const loadChecklist = async () => {
      try {
        const response = await fetch(`/api/checklist?tripType=${tripType}`)
        if (response.ok) {
          const data = await response.json()
          if (data.checklist) {
            setChecklistId(data.checklist._id.toString())
            setItems(data.checklist.items)
          }
        }
      } catch (error) {
        console.error("Error loading checklist:", error)
      }
    }
    loadChecklist()
  }, [tripType])

  // Group items by category
  const itemsByCategory = items.reduce(
    (acc, item) => {
      const category = item.category || "Other"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(item)
      return acc
    },
    {} as Record<string, ChecklistItem[]>,
  )

  const toggleItemPacked = (id: string) => {
    const updatedItems = items.map((item) => 
      item._id?.toString() === id ? { ...item, isPacked: !item.isPacked } : item
    )
    setItems(updatedItems)
    updateChecklist(updatedItems)
  }

  const addNewItem = () => {
    if (!newItemName.trim()) return

    const newItem: ChecklistItem = {
      name: newItemName.trim(),
      category: "Custom",
      tripTypes: [tripType],
      isEssential: false,
      isPacked: false,
    }

    const updatedItems = [...items, newItem]
    setItems(updatedItems)
    setNewItemName("")
    updateChecklist(updatedItems)
  }

  const removeItem = async (id: string) => {
    if (!checklistId) {
      // If no checklist exists yet, just remove from local state
      setItems(items.filter((item) => item._id?.toString() !== id))
      return
    }

    try {
      const response = await fetch(`/api/checklist?itemId=${id}&checklistId=${checklistId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete item")
      }

      setItems(items.filter((item) => item._id?.toString() !== id))
      toast({
        title: "Item removed",
        description: "The item has been removed from your checklist.",
      })
    } catch (error) {
      console.error("Error deleting item:", error)
      toast({
        title: "Error",
        description: "Failed to remove the item. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateChecklist = async (updatedItems: ChecklistItem[]) => {
    setIsSaving(true)
    try {
      if (!checklistId) {
        // If no checklist exists, create a new one
        const response = await fetch("/api/checklist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tripType,
            items: updatedItems,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to save checklist")
        }

        const data = await response.json()
        setChecklistId(data.checklistId)
        toast({
          title: "Checklist saved!",
          description: "Your packing list has been saved successfully.",
        })
      } else {
        // Update existing checklist
        const response = await fetch("/api/checklist", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            checklistId,
            items: updatedItems,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to update checklist")
        }

        toast({
          title: "Checklist updated!",
          description: "Your packing list has been updated successfully.",
        })
      }
    } catch (error) {
      console.error("Error saving checklist:", error)
      toast({
        title: "Error",
        description: "Failed to save your checklist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Trip Types
          </Button>
        </Link>

        <Button onClick={() => updateChecklist(items)} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Checklist"}
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Add a custom item..."
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addNewItem()
            }
          }}
        />
        <Button onClick={addNewItem}>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="space-y-6">
        {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
          <div key={category} className="space-y-2">
            <h2 className="text-xl font-semibold">{category}</h2>
            <div className="bg-card rounded-lg shadow p-4 space-y-2">
              {categoryItems.map((item) => (
                <ChecklistItemComponent
                  key={item._id?.toString() || item.name}
                  item={item}
                  onToggle={toggleItemPacked}
                  onRemove={removeItem}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
