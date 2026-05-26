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
  const { setHoveredTool, toggleLockedTool, lockedTool, isToolActive } = useStackInteraction()

  const isActive = isToolActive(tool)
  const isLocked = lockedTool?.name === tool.name
  const hasUsage = tool.usage.length > 0

  const handleMouseEnter = useCallback(() => {
    setHoveredTool(tool)
  }, [tool, setHoveredTool])

  const handleMouseLeave = useCallback(() => {
    setHoveredTool(null)
  }, [setHoveredTool])

  const handleClick = useCallback(() => {
    toggleLockedTool(tool)
  }, [tool, toggleLockedTool])

  return (
    <motion.button
      ref={badgeRef}
      data-tool={tool.name}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative px-2.5 py-1 rounded-md font-mono text-[10px] leading-tight',
        'border transition-all duration-200 cursor-pointer',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-bronze/50',
        hasUsage ? 'hover:scale-105' : 'opacity-50 cursor-default',
        isActive
          ? 'bg-bronze/20 border-bronze/60 text-bronze shadow-[0_0_12px_rgba(184,147,90,0.3)]'
          : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:border-bronze/30 hover:text-[var(--text-primary)]',
        isLocked && 'ring-1 ring-bronze/40'
      )}
      style={{
        '--category-color': categoryColor,
      } as React.CSSProperties}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={hasUsage ? { scale: 1.05 } : undefined}
      whileTap={hasUsage ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.2 }}
      aria-pressed={isLocked}
      aria-label={`${tool.name}${isLocked ? ' (locked)' : ''}`}
    >
      {tool.name}
      
      {/* Lock indicator */}
      {isLocked && (
        <motion.span
          className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-bronze"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        />
      )}
    </motion.button>
  )
}
