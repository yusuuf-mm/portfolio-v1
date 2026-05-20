import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-[var(--text-muted)]">Phase 1 — Design System ✓</p>
      </div>
      <Footer />
    </main>
  )
}
