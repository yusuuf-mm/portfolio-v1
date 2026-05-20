'use client'
import { useEffect, useState } from 'react'
import ThemeToggle from '@/components/ui/ThemeToggle'
import TerminalPrompt from '@/components/ui/TerminalPrompt'
import { cn } from '@/lib/utils'

const links = ['About', 'Build', 'Projects', 'Stack', 'Contact']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-[var(--border)] backdrop-blur-md bg-[var(--background)]/80'
          : 'bg-transparent'
      )}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <TerminalPrompt text="yusuf.sys" showCursor={false} />
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link}
              href={'#' + link.toLowerCase()}
              className={cn(
                'text-sm font-mono text-[var(--text-muted)]',
                'hover:text-[var(--accent)] transition-colors duration-200'
              )}
            >
              {link}
            </a>
          ))}
        </div>
        <ThemeToggle />
      </nav>
    </header>
  )
}
