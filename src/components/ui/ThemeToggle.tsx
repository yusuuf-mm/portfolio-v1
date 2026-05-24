'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export default function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className={cn(
          'p-1.5 rounded-full transition-colors duration-200',
          'text-[var(--text-muted)] hover:text-bronze',
          className
        )}
        aria-label="Toggle theme"
      >
        <Moon size={16} />
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className={cn(
        'p-1.5 rounded-full transition-colors duration-200',
        'text-[var(--text-muted)] hover:text-bronze',
        className
      )}
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
