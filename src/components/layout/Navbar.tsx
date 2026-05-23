'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { cn } from '@/lib/utils'

const links = ['About', 'Build', 'Projects', 'Stack', 'Contact']

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active section detection via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    links.forEach((link) => {
      const id = link.toLowerCase()
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id)
          }
        },
        { rootMargin: '-40% 0px -40% 0px' }
      )
      observer.observe(el)
      observers.push(observer)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <header className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <nav
          className={cn(
            'pointer-events-auto flex items-center gap-1 px-2 py-2 rounded-full',
            'backdrop-blur-xl border border-[var(--border)]',
            'transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]'
          )}
          style={{
            background: compact
              ? 'color-mix(in srgb, var(--background) 90%, transparent)'
              : 'color-mix(in srgb, var(--background) 70%, transparent)',
            paddingTop: compact ? '6px' : '8px',
            paddingBottom: compact ? '6px' : '8px',
          }}
        >
          {/* Logo */}
          <a
            href="#"
            className="font-mono text-xs text-[var(--accent)] px-3 py-1.5 hover:opacity-80 transition-opacity"
          >
            y
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5">
            {links.map((link) => {
              const id = link.toLowerCase()
              const isActive = activeSection === id
              return (
                <a
                  key={link}
                  href={'#' + id}
                  className={cn(
                    'px-3 py-1.5 rounded-full font-mono text-xs transition-all duration-200',
                    isActive
                      ? 'text-[var(--accent)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  )}
                  style={
                    isActive
                      ? { background: 'color-mix(in srgb, var(--accent) 10%, transparent)' }
                      : undefined
                  }
                >
                  {link}
                </a>
              )
            })}
          </div>

          {/* Theme toggle + hamburger */}
          <div className="flex items-center gap-1 ml-1">
            <ThemeToggle />
            <button
              className="md:hidden p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--accent)] min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <svg
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <line
                  x1="0"
                  y1="1"
                  x2="16"
                  y2="1"
                  style={{
                    transformOrigin: 'center',
                    transform: menuOpen ? 'translateY(5px) rotate(45deg)' : 'none',
                    transition: 'transform 0.3s cubic-bezier(0.32,0.72,0,1)',
                  }}
                />
                <line
                  x1="0"
                  y1="6"
                  x2="16"
                  y2="6"
                  style={{
                    opacity: menuOpen ? 0 : 1,
                    transform: menuOpen ? 'scaleX(0)' : 'none',
                    transition: 'all 0.2s cubic-bezier(0.32,0.72,0,1)',
                  }}
                />
                <line
                  x1="0"
                  y1="11"
                  x2="16"
                  y2="11"
                  style={{
                    transformOrigin: 'center',
                    transform: menuOpen ? 'translateY(-5px) rotate(-45deg)' : 'none',
                    transition: 'transform 0.3s cubic-bezier(0.32,0.72,0,1)',
                  }}
                />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 backdrop-blur-2xl flex flex-col items-center justify-center gap-8"
            style={{ background: 'rgba(8,9,12,0.92)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          >
            {links.map((link, i) => (
              <motion.a
                key={link}
                href={'#' + link.toLowerCase()}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'font-mono text-2xl transition-colors',
                  activeSection === link.toLowerCase()
                    ? 'text-[var(--accent)]'
                    : 'text-[var(--text-primary)] hover:text-[var(--accent)]'
                )}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {link}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
