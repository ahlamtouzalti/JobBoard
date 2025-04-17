"use server"

import { executeQuery } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { Job } from "@/types"

// Get all jobs
export async function getJobs(categoryId?: number) {
  try {
    const query = `
      SELECT j.*, c.name as category
      FROM jobs j
      LEFT JOIN categories c ON j.category_id = c.id
      WHERE j.status = 'Active'
      ${categoryId ? "AND j.category_id = ?" : ""}
      ORDER BY j.posted_date DESC
    `

    const params = categoryId ? [categoryId] : []
    const jobs = await executeQuery<Job[]>(query, params)

    return jobs.map((job) => ({
      ...job,
      requirements: job.requirements || "",
      responsibilities: job.responsibilities || "",
    }))
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return []
  }
}

// Get a single job by ID
export async function getJobById(id: number) {
  try {
    const query = `
      SELECT j.*, c.name as category
      FROM jobs j
      LEFT JOIN categories c ON j.category_id = c.id
      WHERE j.id = ?
    `

    const jobs = await executeQuery<Job[]>(query, [id])

    if (jobs.length === 0) {
      return null
    }

    const job = jobs[0]

    return {
      ...job,
      requirements: job.requirements ? job.requirements.split("\n") : [],
      responsibilities: job.responsibilities ? job.responsibilities.split("\n") : [],
    } as Job & { requirements: string[]; responsibilities: string[] }
  } catch (error) {
    console.error("Error fetching job:", error)
    return null
  }
}

// Create a new job
export async function createJob(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const company = formData.get("company") as string
    const location = formData.get("location") as string
    const type = formData.get("type") as string
    const salary = formData.get("salary") as string
    const categoryId = Number.parseInt(formData.get("category_id") as string)
    const description = formData.get("description") as string
    const requirements = formData.get("requirements") as string
    const responsibilities = formData.get("responsibilities") as string

    const query = `
      INSERT INTO jobs (
        title, company, location, type, salary, category_id, 
        description, requirements, responsibilities, status, posted_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', NOW())
    `

    const params = [title, company, location, type, salary, categoryId, description, requirements, responsibilities]

    const result = await executeQuery<any>(query, params)

    revalidatePath("/admin/dashboard")
    revalidatePath("/")

    return {
      success: true,
      data: {
        id: result.insertId,
        title,
        company,
        location,
        type,
        salary,
        category_id: categoryId,
        description,
        requirements,
        responsibilities,
        status: "Active",
      },
    }
  } catch (error) {
    console.error("Error creating job:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Update a job
export async function updateJob(id: number, formData: FormData) {
  try {
    const title = formData.get("title") as string
    const company = formData.get("company") as string
    const location = formData.get("location") as string
    const type = formData.get("type") as string
    const salary = formData.get("salary") as string
    const categoryId = Number.parseInt(formData.get("category_id") as string)
    const description = formData.get("description") as string
    const requirements = formData.get("requirements") as string
    const responsibilities = formData.get("responsibilities") as string
    const status = formData.get("status") as string

    const query = `
      UPDATE jobs
      SET title = ?, company = ?, location = ?, type = ?, salary = ?,
          category_id = ?, description = ?, requirements = ?, 
          responsibilities = ?, status = ?, updated_at = NOW()
      WHERE id = ?
    `

    const params = [
      title,
      company,
      location,
      type,
      salary,
      categoryId,
      description,
      requirements,
      responsibilities,
      status,
      id,
    ]

    await executeQuery(query, params)

    revalidatePath("/admin/dashboard")
    revalidatePath("/")
    revalidatePath(`/jobs/${id}`)

    return {
      success: true,
      data: {
        id,
        title,
        company,
        location,
        type,
        salary,
        category_id: categoryId,
        description,
        requirements,
        responsibilities,
        status,
      },
    }
  } catch (error) {
    console.error("Error updating job:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Delete a job
export async function deleteJob(id: number) {
  try {
    const query = `DELETE FROM jobs WHERE id = ?`
    await executeQuery(query, [id])

    revalidatePath("/admin/dashboard")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error deleting job:", error)
    return { success: false, error: (error as Error).message }
  }
}
