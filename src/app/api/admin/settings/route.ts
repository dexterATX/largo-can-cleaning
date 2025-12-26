import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifySession } from '@/lib/auth/session'
import { getCsrfTokenFromRequest, validateCsrfToken } from '@/lib/auth/csrf'
import { isRecord } from '@/lib/validation'

/**
 * Type guard to safely access error message from PromiseRejectedResult
 */
function getErrorMessage(reason: unknown): string | undefined {
  if (reason instanceof Error) {
    return reason.message
  }
  if (typeof reason === 'object' && reason !== null && 'message' in reason) {
    const msg = (reason as { message: unknown }).message
    return typeof msg === 'string' ? msg : undefined
  }
  return undefined
}

// GET - Get all settings
export async function GET() {
  try {
    const isAuthenticated = await verifySession()
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('category')

    if (error) {
      console.error('Error fetching settings:', error)
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }

    // Transform array to object keyed by setting key
    const settings: Record<string, unknown> = {}
    data?.forEach((setting) => {
      settings[setting.key] = setting.value
    })

    return NextResponse.json({ data: settings })
  } catch (error) {
    console.error('Settings API error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
  try {
    const isAuthenticated = await verifySession()
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate CSRF token
    const csrfToken = getCsrfTokenFromRequest(request.headers)
    if (!validateCsrfToken(csrfToken)) {
      return NextResponse.json({ error: 'Invalid or missing CSRF token' }, { status: 403 })
    }

    const body = await request.json()
    const supabase = createAdminClient()

    // Validate that body is a record before processing
    if (!isRecord(body)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    // Update each setting using Promise.allSettled for better error handling
    const updates = await Promise.allSettled(
      Object.entries(body).map(async ([key, value]) => {
        // Validate value is a record before storing (settings are JSON objects)
        const settingValue = isRecord(value) ? value : { value }

        const { error } = await supabase
          .from('site_settings')
          .upsert({
            key,
            value: settingValue,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'key',
          })

        if (error) {
          console.error(`Error updating setting ${key}:`, error)
          throw new Error(`Failed to update ${key}: ${error.message}`)
        }

        return { key, success: true }
      })
    )

    // Check for any failures
    const failures = updates.filter(
      (result): result is PromiseRejectedResult => result.status === 'rejected'
    )

    if (failures.length > 0) {
      const failedKeys = failures.map(f => {
        const message = getErrorMessage(f.reason)
        const match = message?.match(/Failed to update (\w+):/)
        return match ? match[1] : 'unknown'
      })
      return NextResponse.json(
        { error: `Failed to update settings: ${failedKeys.join(', ')}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
