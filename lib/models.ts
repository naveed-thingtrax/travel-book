import type { ObjectId } from "mongodb"

export interface TripType {
  _id?: ObjectId | string
  name: string
  description: string
  icon: string
}

export interface PackingItem {
  _id?: ObjectId | string
  name: string
  category: string
  tripTypes: string[]
  isEssential: boolean
}

export interface ChecklistItem extends PackingItem {
  isPacked: boolean
}

export interface UserChecklist {
  _id?: ObjectId | string
  userId: string
  tripType: string
  items: ChecklistItem[]
  createdAt: Date
  updatedAt: Date
}
