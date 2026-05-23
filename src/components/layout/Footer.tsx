import { ExternalLink, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import TerminalPrompt from '@/components/ui/TerminalPrompt'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Build', href: '#build' },
  { label: 'Projects', href: '#projects' },
  { label: 'Stack', href: '#stack' },
  { label: 'Contact', href: '#contact' },
]

const socialLinks = [
  { icon: ExternalLink, href: 'https://github.com/yusuuf-mm', label: 'GitHub' },
  { icon: Globe, href: 'https://linkedin.com/in/yusuufmm', label: 'LinkedIn' },
]

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)]">
      {/* Main row */}
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left — terminal prompt */}
        <TerminalPrompt text="yusuf.sys ~ end" showCursor={false} />

        {/* Center — nav links */}
        <nav className="flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={cn(
                'font-mono text-xs text-[var(--text-muted)]',
                'hover:text-[var(--accent)] transition-colors duration-200'
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right — social icons */}
        <div className="flex items-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200"
              aria-label={link.label}
            >
              <link.icon size={16} />
            </a>
          ))}
        </div>
      </div>

      {/* Bottom line */}
      <div className="border-t border-[var(--border)]">
        <p className="max-w-6xl mx-auto px-6 py-4 font-mono text-xs text-[var(--text-muted)] text-center">
          {'\u00A9'} 2026 Yusuf Muhammad Musa. Built with precision.
        </p>
      </div>
    </footer>
  )
}
