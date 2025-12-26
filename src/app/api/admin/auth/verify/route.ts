import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/auth/session'

export async function GET() {
  try {
    const isValid = await verifySession()

    if (!isValid) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { authenticated: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('Session verification error:', error)
    return NextResponse.json(
      { authenticated: false, error: 'Verification failed' },
      { status: 500 }
    )
  }
}
