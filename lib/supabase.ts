import { createClient } from "@supabase/supabase-js"

// For client-side usage (with auth)
let clientSingleton: ReturnType<typeof createClient> | null = null

export function getSupabaseBrowser() {
  if (clientSingleton) return clientSingleton

  clientSingleton = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  return clientSingleton
}

// For server-side usage (without auth)
export function getSupabaseServer() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      persistSession: false,
    },
  })
}
