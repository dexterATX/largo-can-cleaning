import { createClient } from '@supabase/supabase-js'

/**
 * Create a Supabase client using the anon key (respects RLS)
 * Use this for public API routes where RLS should be enforced
 */
export function createAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(url, key)
}
