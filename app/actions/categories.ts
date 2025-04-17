"use server"

import { executeQuery } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { Category } from "@/types"

// Get all categories
export async function getCategories() {
  try {
    const query = `SELECT * FROM categories ORDER BY name`
    const categories = await executeQuery<Category[]>(query)
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

// Create a new category
export async function createCategory(name: string) {
  try {
    const query = `INSERT INTO categories (name, created_at) VALUES (?, NOW())`
    const result = await executeQuery<any>(query, [name])

    revalidatePath("/admin/dashboard")
    revalidatePath("/")

    return {
      success: true,
      data: {
        id: result.insertId,
        name,
      },
    }
  } catch (error) {
    console.error("Error creating category:", error)
    return { success: false, error: (error as Error).message }
  }
}
