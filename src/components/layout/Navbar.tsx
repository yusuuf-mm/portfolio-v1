'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu } from 'lucide-react'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { cn } from '@/lib/utils'

const links = ['About', 'Build', 'Projects', 'Stack', 'Contact']

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
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
        { threshold: 0.4 }
      )
      observer.observe(el)
      observers.push(observer)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  // Close mobile menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header
      className="fixed top-5 left-1/2 z-[1000] pointer-events-none"
      style={{ transform: 'translateX(-50%)' }}
    >
      <nav
        ref={menuRef}
        className={cn(
          'pointer-events-auto flex items-center gap-1 rounded-full',
          'transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
          'h-12 px-2 max-w-[600px]'
        )}
        style={{
          background: 'var(--navbar-bg)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid var(--navbar-border)',
          boxShadow: scrolled ? 'var(--navbar-shadow-scrolled)' : 'var(--navbar-shadow)',
          opacity: scrolled ? 1 : 0.9,
        }}
      >
        {/* Logo */}
        <a
          href="#"
          className={cn(
            'font-mono text-sm font-semibold px-4 py-1.5 rounded-full',
            'text-[var(--accent-warm)] hover:opacity-80 transition-opacity'
          )}
        >
          YM
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
                  'px-3 py-1.5 rounded-full transition-all duration-200',
                  'font-mono text-sm',
                  isActive
                    ? 'text-[var(--accent-warm)] font-medium'
                    : 'text-[var(--text-muted)] hover:text-[var(--accent-warm)]'
                )}
              >
                {link}
              </a>
            )
          })}
        </div>

        {/* Theme toggle + hamburger */}
        <div className="flex items-center gap-1 ml-1 mr-1">
          <ThemeToggle />
          <button
            className={cn(
              'md:hidden p-2 rounded-full min-h-[36px] min-w-[36px]',
              'flex items-center justify-center transition-colors',
              'text-[var(--text-muted)] hover:text-[var(--accent-warm)]'
            )}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <Menu size={16} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={cn('pointer-events-auto mt-2 rounded-2xl overflow-hidden md:hidden')}
            style={{
              background: 'var(--navbar-bg)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid var(--navbar-border)',
              boxShadow: 'var(--navbar-shadow)',
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="py-2 px-2 flex flex-col">
              {links.map((link, i) => {
                const id = link.toLowerCase()
                const isActive = activeSection === id
                return (
                  <motion.a
                    key={link}
                    href={'#' + id}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'px-4 py-2.5 rounded-full font-mono text-sm transition-colors',
                      isActive
                        ? 'text-[var(--accent-warm)] font-medium'
                        : 'text-[var(--text-muted)] hover:text-[var(--accent-warm)]'
                    )}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: i * 0.05,
                      duration: 0.25,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {link}
                  </motion.a>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
