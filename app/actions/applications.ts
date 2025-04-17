"use server"

import { executeQuery } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { Application } from "@/types"
import { writeFile } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"

// Get all applications
export async function getApplications() {
  try {
    const query = `
      SELECT a.*, j.title as job_title
      FROM applications a
      LEFT JOIN jobs j ON a.job_id = j.id
      ORDER BY a.created_at DESC
    `

    const applications = await executeQuery<Application[]>(query)
    return applications
  } catch (error) {
    console.error("Error fetching applications:", error)
    return []
  }
}

// Get applications for a specific job
export async function getApplicationsByJobId(jobId: number) {
  try {
    const query = `
      SELECT * FROM applications
      WHERE job_id = ?
      ORDER BY created_at DESC
    `

    const applications = await executeQuery<Application[]>(query, [jobId])
    return applications
  } catch (error) {
    console.error("Error fetching applications:", error)
    return []
  }
}

// Create a new application
export async function createApplication(formData: FormData) {
  try {
    const jobId = Number.parseInt(formData.get("job_id") as string)
    const fullName = formData.get("full_name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const coverLetter = formData.get("cover_letter") as string

    // Handle resume file upload
    let resumeUrl = ""
    const resumeFile = formData.get("resume") as File

    if (resumeFile && resumeFile.size > 0) {
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), "public", "uploads")

      // Generate a unique filename
      const fileName = `${uuidv4()}-${resumeFile.name}`
      const filePath = path.join(uploadsDir, fileName)

      // Convert file to buffer and save it
      const buffer = Buffer.from(await resumeFile.arrayBuffer())
      await writeFile(filePath, buffer)

      // Set the URL to the public path
      resumeUrl = `/uploads/${fileName}`
    }

    const query = `
      INSERT INTO applications (
        job_id, full_name, email, phone, cover_letter, 
        resume_url, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'New', NOW())
    `

    const params = [jobId, fullName, email, phone, coverLetter, resumeUrl]

    const result = await executeQuery<any>(query, params)

    revalidatePath("/admin/dashboard")

    return {
      success: true,
      data: {
        id: result.insertId,
        job_id: jobId,
        full_name: fullName,
        email,
        phone,
        cover_letter: coverLetter,
        resume_url: resumeUrl,
        status: "New",
      },
    }
  } catch (error) {
    console.error("Error creating application:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Update application status
export async function updateApplicationStatus(id: number, status: string) {
  try {
    const query = `
      UPDATE applications
      SET status = ?, updated_at = NOW()
      WHERE id = ?
    `

    await executeQuery(query, [status, id])

    revalidatePath("/admin/dashboard")

    return {
      success: true,
      data: { id, status },
    }
  } catch (error) {
    console.error("Error updating application:", error)
    return { success: false, error: (error as Error).message }
  }
}
