import mysql from "mysql2/promise"

// Create a connection pool with hardcoded values
const pool = mysql.createPool({
  host: "localhost",
  user: "root", // Replace with your MySQL username
  password: "", // Replace with your MySQL password
  database: "job_offers_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export async function executeQuery<T>(query: string, params: any[] = []): Promise<T> {
  try {
    const [rows] = await pool.execute(query, params)
    return rows as T
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export default pool
