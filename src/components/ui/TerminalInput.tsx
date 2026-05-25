'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const ease = [0.22, 1, 0.36, 1] as const

interface TerminalInputProps {
  label: string
  name: string
  type?: string
  required?: boolean
  rows?: number
  placeholder?: string
}

export default function TerminalInput({
  label,
  name,
  type = 'text',
  required,
  rows,
  placeholder,
}: TerminalInputProps) {
  const [focused, setFocused] = useState(false)

  const inputClasses = cn(
    'w-full px-0 py-3 font-mono text-sm bg-transparent',
    'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50',
    'border-0 border-b border-[var(--border)] rounded-none',
    'outline-none transition-colors'
  )

  return (
    <div className="flex flex-col gap-2 relative">
      <label
        htmlFor={name}
        className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider"
      >
        {label}
      </label>

      {rows ? (
        <textarea
          id={name}
          name={name}
          required={required}
          rows={rows}
          className={cn(inputClasses, 'resize-none')}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          className={inputClasses}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      )}

      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-[var(--accent-warm)]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.3, ease }}
        style={{ transformOrigin: 'left' }}
      />
    </div>
  )
}
