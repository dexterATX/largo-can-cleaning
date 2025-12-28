import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}

export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 80,
          background: 'linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 36,
          color: 'white',
          fontWeight: 'bold',
          fontFamily: 'system-ui, sans-serif',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        }}
      >
        LC
      </div>
    ),
    { ...size }
  )
}
