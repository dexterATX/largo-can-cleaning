import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Largo Can Cleaning - Professional Trash Can Cleaning Services'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)',
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            opacity: 0.1,
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1200 630"
            style={{ position: 'absolute' }}
          >
            <defs>
              <pattern
                id="grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="30" cy="30" r="2" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Main content container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 60px',
            position: 'relative',
          }}
        >
          {/* Trash can icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '30px',
            }}
          >
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              fill="none"
            >
              {/* Trash can body */}
              <rect
                x="20"
                y="30"
                width="60"
                height="60"
                rx="4"
                fill="white"
              />
              {/* Trash can lid */}
              <rect
                x="15"
                y="22"
                width="70"
                height="10"
                rx="3"
                fill="white"
              />
              {/* Lid handle */}
              <rect
                x="42"
                y="14"
                width="16"
                height="10"
                rx="3"
                fill="white"
              />
              {/* Sparkle effects */}
              <circle cx="75" cy="25" r="6" fill="#60a5fa" />
              <circle cx="82" cy="40" r="4" fill="#3b82f6" />
              <circle cx="70" cy="15" r="3" fill="#93c5fd" />
              {/* Lines on can */}
              <rect x="32" y="40" width="4" height="40" rx="2" fill="#0d9488" />
              <rect x="48" y="40" width="4" height="40" rx="2" fill="#0d9488" />
              <rect x="64" y="40" width="4" height="40" rx="2" fill="#0d9488" />
            </svg>
          </div>

          {/* Business name */}
          <div
            style={{
              display: 'flex',
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              lineHeight: 1.1,
              marginBottom: '20px',
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            Largo Can Cleaning
          </div>

          {/* Tagline */}
          <div
            style={{
              display: 'flex',
              fontSize: '32px',
              color: 'rgba(255, 255, 255, 0.95)',
              textAlign: 'center',
              marginBottom: '24px',
              fontWeight: '500',
            }}
          >
            Professional Trash Can Cleaning Services
          </div>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              width: '120px',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '2px',
              marginBottom: '24px',
            }}
          />

          {/* Location */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '26px',
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: '500',
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Serving Largo & Pinellas County, FL
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 50%, #3b82f6 100%)',
            display: 'flex',
          }}
        />

        {/* Corner accents */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            width: '60px',
            height: '60px',
            borderTop: '4px solid rgba(255, 255, 255, 0.3)',
            borderLeft: '4px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderTop: '4px solid rgba(255, 255, 255, 0.3)',
            borderRight: '4px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '28px',
            left: '20px',
            width: '60px',
            height: '60px',
            borderBottom: '4px solid rgba(255, 255, 255, 0.3)',
            borderLeft: '4px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '28px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderBottom: '4px solid rgba(255, 255, 255, 0.3)',
            borderRight: '4px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
