import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Sin el tipo Database para evitar que TypeScript resuelva las tablas como 'never'
// cuando el schema no matchea exactamente. Las queries siguen funcionando igual.
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from Server Component — ignorar
          }
        },
      },
    }
  )
}
