import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: '#08090C',
        padding: '80px',
        gap: '24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '20px',
          fontFamily: 'monospace',
          color: '#B8935A',
        }}
      >
        {'>'} yusuf.sys
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div
          style={{
            fontSize: '72px',
            fontWeight: '400',
            color: '#EAEAEA',
            letterSpacing: '-2px',
            lineHeight: '1.1',
          }}
        >
          Yusuf
        </div>
        <div
          style={{
            fontSize: '28px',
            fontFamily: 'monospace',
            color: '#B8935A',
          }}
        >
          AI Systems Engineer
        </div>
      </div>

      <div
        style={{
          fontSize: '22px',
          color: '#8B909A',
          maxWidth: '700px',
          lineHeight: '1.4',
        }}
      >
        I build systems that predict, optimize, and decide.
      </div>

      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginTop: '8px',
        }}
      >
        {['Python', 'TypeScript', 'AWS', 'PyTorch', 'Optimization'].map((tag) => (
          <div
            key={tag}
            style={{
              padding: '6px 16px',
              border: '1px solid rgba(255,255,255,0.07)',
              fontSize: '14px',
              fontFamily: 'monospace',
              color: '#8B909A',
              borderRadius: '6px',
            }}
          >
            {tag}
          </div>
        ))}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  )
}
