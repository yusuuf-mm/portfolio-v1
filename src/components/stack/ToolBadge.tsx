'use client'

import { useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Tool } from '@/content/stack'
import { useStackInteraction } from './useStackInteraction'

interface ToolBadgeProps {
  tool: Tool
  categoryColor: string
}

export default function ToolBadge({ tool, categoryColor }: ToolBadgeProps) {
  const badgeRef = useRef<HTMLButtonElement>(null)
  const { setHoveredTool, toggleLockedTool, lockedTool, isToolActive, mode } = useStackInteraction()

  const isActive = isToolActive(tool)
  const isLocked = lockedTool?.name === tool.name
  const hasUsage = tool.usage.length > 0

  const handleMouseEnter = useCallback(() => {
    if (mode === 'hover') {
      setHoveredTool(tool)
    }
  }, [tool, setHoveredTool, mode])

  const handleMouseLeave = useCallback(() => {
    if (mode === 'hover') {
      setHoveredTool(null)
    }
  }, [setHoveredTool, mode])

  const handleClick = useCallback(() => {
    if (!hasUsage) return
    toggleLockedTool(tool)
  }, [tool, toggleLockedTool, hasUsage])

  return (
    <motion.button
      ref={badgeRef}
      data-tool={tool.name}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative px-2 py-0.5 rounded font-mono text-[9px] leading-tight',
        'border transition-all duration-200 cursor-pointer',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-bronze/50',
        !hasUsage && 'opacity-40 cursor-default',
        isActive
          ? 'shadow-[0_0_8px_rgba(184,147,90,0.3)]'
          : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:border-bronze/30 hover:text-[var(--text-primary)]',
        isLocked && 'ring-1 ring-bronze/40'
      )}
      style={
        isActive
          ? {
              background: `color-mix(in srgb, ${categoryColor} 20%, transparent)`,
              borderColor: categoryColor,
              color: categoryColor,
            }
          : undefined
      }
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={hasUsage ? { scale: 1.05 } : undefined}
      whileTap={hasUsage ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.15 }}
      aria-pressed={isLocked}
      aria-label={`${tool.name}${isLocked ? ' (locked)' : ''}`}
    >
      {tool.name}
      {isLocked && (
        <motion.span
          className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-bronze"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        />
      )}
    </motion.button>
  )
}
