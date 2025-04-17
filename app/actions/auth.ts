"use server"

import { executeQuery } from "@/lib/db"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

// Sign in with email and password
export async function signIn(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Get user from database
    const query = `SELECT * FROM admin_users WHERE email = ?`
    const users = await executeQuery<any[]>(query, [email])

    if (users.length === 0) {
      return { success: false, error: "Invalid email or password" }
    }

    const user = users[0]

    // Check password
    const passwordMatch = password ===user.password_hash
    console.log('iiiiiiiiii  :  ',user.password_hash)
    if (!passwordMatch) {
      return { success: false, error: "Invalid email or password" }
    }

    // Create session
    const sessionId = uuidv4()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

    // Store session in database
    const sessionQuery = `
      INSERT INTO sessions (id, user_id, expires_at)
      VALUES (?, ?, ?)
    `

    await executeQuery(sessionQuery, [sessionId, user.id, expiresAt])

    // Set session cookie
    cookies().set("session_id", sessionId, {
      httpOnly: true,
      secure: false, // Set to false for local development
      expires: expiresAt,
      path: "/",
    })

    return { success: true, data: { id: user.id, email: user.email } }
  } catch (error) {
    console.error("Error signing in:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Sign out
export async function signOut() {
  try {
    const sessionId = cookies().get("session_id")?.value

    if (sessionId) {
      // Delete session from database
      const query = `DELETE FROM sessions WHERE id = ?`
      await executeQuery(query, [sessionId])

      // Clear session cookie
      cookies().delete("session_id")
    }

    redirect("/admin/login")
  } catch (error) {
    console.error("Error signing out:", error)
    return { success: false, error: (error as Error).message }
  }
}

// Check if user is authenticated
export async function checkAuth() {
  try {
    const sessionId = cookies().get("session_id")?.value

    if (!sessionId) {
      redirect("/admin/login")
    }

    // Get session from database
    const query = `
      SELECT s.*, u.email
      FROM sessions s
      JOIN admin_users u ON s.user_id = u.id
      WHERE s.id = ? AND s.expires_at > NOW()
    `

    const sessions = await executeQuery<any[]>(query, [sessionId])

    if (sessions.length === 0) {
      // Session expired or not found
      cookies().delete("session_id")
      redirect("/admin/login")
    }

    const session = sessions[0]

    return {
      user: {
        id: session.user_id,
        email: session.email,
      },
    }
  } catch (error) {
    console.error("Error checking auth:", error)
    redirect("/admin/login")
  }
}
