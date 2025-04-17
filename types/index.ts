export interface Category {
  id: number
  name: string
  created_at?: string
}

export interface Job {
  id: number
  title: string
  company: string
  location: string
  type: string
  salary: string
  category_id: number
  category?: string
  description: string
  requirements: string
  responsibilities: string
  posted_date: string
  status: string
  created_at?: string
  updated_at?: string
}

export interface Application {
  id: number
  job_id: number
  job_title?: string
  full_name: string
  email: string
  phone: string
  cover_letter: string
  resume_url?: string
  status: string
  created_at?: string
  updated_at?: string
}

export interface AdminUser {
  id: number
  email: string
  password_hash: string
  created_at?: string
}
