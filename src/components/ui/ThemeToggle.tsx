'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className={cn(
        'p-2 rounded-lg border transition-all duration-200',
        'border-[var(--border)] bg-[var(--surface)]',
        'hover:border-[var(--accent)] text-[var(--text-muted)]',
        'hover:text-[var(--accent)]',
        className
      )}
      aria-label="Toggle theme"
      suppressHydrationWarning
    >
      <span suppressHydrationWarning>
        {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </span>
    </button>
  )
}
