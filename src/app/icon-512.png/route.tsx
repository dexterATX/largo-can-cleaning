import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 240,
          background: 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 102,
          color: 'white',
          fontWeight: 'bold',
          fontFamily: 'system-ui, sans-serif',
          textShadow: '4px 4px 8px rgba(0,0,0,0.3)',
        }}
      >
        LC
      </div>
    ),
    {
      width: 512,
      height: 512,
    }
  )
}
