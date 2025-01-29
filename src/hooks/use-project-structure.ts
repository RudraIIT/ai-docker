import { useState } from "react"
import type { FileType } from "@/types/project"

export function useProjectStructure() {
  const [structure, setStructure] = useState<FileType[]>([])

  const addItem = (parentId: string | null, item: Omit<FileType, "id">) => {
    const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) }

    if (!parentId) {
      setStructure([...structure, newItem])
      return
    }

    const updateChildren = (items: FileType[]): FileType[] => {
      return items.map((currentItem) => {
        if (currentItem.id === parentId) {
          return {
            ...currentItem,
            children: [...(currentItem.children || []), newItem],
          }
        }
        if (currentItem.children) {
          return {
            ...currentItem,
            children: updateChildren(currentItem.children),
          }
        }
        return currentItem
      })
    }

    setStructure(updateChildren(structure))
  }

  const removeItem = (id: string) => {
    const removeFromChildren = (items: FileType[]): FileType[] => {
      return items
        .filter((item) => item.id !== id)
        .map((item) => {
          if (item.children) {
            return {
              ...item,
              children: removeFromChildren(item.children),
            }
          }
          return item
        })
    }

    setStructure(removeFromChildren(structure))
  }

  return {
    structure,
    addItem,
    removeItem,
  }
}

