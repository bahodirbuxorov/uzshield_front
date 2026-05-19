export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="cyber-grid-bg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Falling code rain — purely decorative columns */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          opacity: 0.18,
          maskImage: 'linear-gradient(to bottom, transparent 0%, #000 30%, #000 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 30%, #000 70%, transparent 100%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-100%',
            left: 0,
            right: 0,
            height: '200%',
            background:
              'repeating-linear-gradient(to right, transparent 0 96px, rgba(0,255,148,0.05) 96px 97px, transparent 97px 192px)',
          }}
        />
      </div>

      {/* Top-left HUD */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          left: 32,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--muted)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="live-dot" style={{ width: 6, height: 6 }} />
          uzshield · secure session
        </div>
        <div style={{ marginTop: 4, color: 'var(--muted)', opacity: 0.6 }}>
          [ tls-1.3 / aes-256-gcm ]
        </div>
      </div>

      {/* Bottom-right HUD */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          right: 32,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--muted)',
          letterSpacing: '0.12em',
          textAlign: 'right',
          zIndex: 1,
          opacity: 0.7,
        }}
      >
        <div>v0.1.0 · build {new Date().getFullYear()}</div>
        <div style={{ color: 'var(--accent)', marginTop: 4, opacity: 0.7 }}>
          {'// protecting the perimeter'}
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 440, padding: '0 16px' }}>
        {children}
      </div>
    </div>
  )
}
