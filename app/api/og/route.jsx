import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontFamily: 'system-ui',
          textAlign: 'center',
          padding: '60px',
        }}
      >
        <div style={{ fontSize: '72px', marginBottom: '20px' }}>📖</div>
        <h1 style={{ fontSize: '72px', fontWeight: 'bold', marginBottom: '20px' }}>
          Guest Book
        </h1>
        <p style={{ fontSize: '36px', opacity: 0.9 }}>
          Leave your message on the blockchain
        </p>
        <p style={{ fontSize: '28px', marginTop: '40px', opacity: 0.8 }}>
          Built on Base Network
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
