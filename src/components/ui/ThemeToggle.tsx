'use client'

import { useEffect, useState, startTransition } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    startTransition(() => setMounted(true))
  }, [])

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
      <span suppressHydrationWarning>
        {mounted && resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </span>
    </button>
  )
}
