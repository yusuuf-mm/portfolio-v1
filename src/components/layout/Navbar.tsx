'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { cn } from '@/lib/utils'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Build', href: '#build' },
  { label: 'Projects', href: '#projects' },
  { label: 'Stack', href: '#stack' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Scroll detection for navbar opacity
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Intersection Observer for active section detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-50% 0px -50% 0px' }
    )

    const sections = document.querySelectorAll('section[id]')
    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])

  return (
    <>
      <header className="fixed top-5 left-0 right-0 z-50 px-4">
        <nav
          className={cn(
            'mx-auto max-w-fit px-4 py-2.5 rounded-full',
            'backdrop-blur-xl transition-all duration-300',
            'border',
            scrolled
              ? 'bg-linen/90 dark:bg-void/90 border-black/10 dark:border-white/8 shadow-lg shadow-black/5'
              : 'bg-linen/85 dark:bg-[rgba(13,13,18,0.85)] border-black/10 dark:border-white/8'
          )}
        >
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a
              href="#"
              className="font-mono text-sm font-bold text-bronze tracking-wider"
            >
              YM
            </a>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'text-sm font-mono transition-colors duration-200',
                    activeSection === link.href.slice(1)
                      ? 'text-bronze'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-4 right-4 z-40 md:hidden"
          >
            <div
              className={cn(
                'rounded-2xl p-4',
                'backdrop-blur-xl',
                'bg-linen/95 dark:bg-void/95',
                'border border-black/10 dark:border-white/8',
                'shadow-xl shadow-black/10'
              )}
            >
              <div className="flex flex-col gap-2">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'px-4 py-3 rounded-lg font-mono text-sm transition-colors',
                      activeSection === link.href.slice(1)
                        ? 'text-bronze bg-bronze/10'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]'
                    )}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
