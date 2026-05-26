'use client'

import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Tool, UsageIntensity } from '@/content/stack'
import { PROJECT_LABELS } from '@/content/stack'
import { useStackInteraction } from './useStackInteraction'

function IntensityIndicator({ intensity }: { intensity: UsageIntensity }) {
  const dots = intensity === 'high' ? 3 : intensity === 'medium' ? 2 : intensity === 'low' ? 1 : 0

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn(
            'w-1.5 h-1.5 rounded-full transition-colors',
            i <= dots ? 'bg-bronze' : 'bg-[var(--border)]'
          )}
        />
      ))}
    </div>
  )
}

function IntensityLabel({ intensity }: { intensity: UsageIntensity }) {
  const labels: Record<UsageIntensity, string> = {
    none: 'None',
    low: 'Low',
    medium: 'Med',
    high: 'High',
  }

  return (
    <span
      className={cn(
        'text-[9px] uppercase tracking-wider',
        intensity === 'high'
          ? 'text-bronze'
          : intensity === 'medium'
            ? 'text-bronze/70'
            : intensity === 'low'
              ? 'text-[var(--text-muted)]'
              : 'text-[var(--text-muted)]/50'
      )}
    >
      {labels[intensity]}
    </span>
  )
}

export default function ToolTooltip() {
  const { activeTool, lockedTool } = useStackInteraction()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!activeTool) return

    const toolElement = document.querySelector(`[data-tool="${activeTool.name}"]`)
    if (!toolElement) return

    const rect = toolElement.getBoundingClientRect()
    const tooltipWidth = 280
    const tooltipHeight = 200

    // Position to the right of the badge by default, or left if not enough space
    let x = rect.right + 12
    let y = rect.top - 20

    // Check if tooltip would go off-screen to the right
    if (x + tooltipWidth > window.innerWidth - 20) {
      x = rect.left - tooltipWidth - 12
    }

    // Check if tooltip would go off-screen at the bottom
    if (y + tooltipHeight > window.innerHeight - 20) {
      y = window.innerHeight - tooltipHeight - 20
    }

    // Check if tooltip would go off-screen at the top
    if (y < 20) {
      y = 20
    }

    setPosition({ x, y })
  }, [activeTool])

  if (!mounted || !activeTool) return null

  const projectsWithUsage = activeTool.usage.filter((u) => u.intensity !== 'none')

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={tooltipRef}
        className={cn(
          'fixed z-50 w-[280px] p-4 rounded-lg',
          'bg-[#0d0e12]/95 backdrop-blur-md',
          'border border-[var(--border)]',
          'shadow-xl shadow-black/30',
          lockedTool ? 'ring-1 ring-bronze/30' : ''
        )}
        style={{ left: position.x, top: position.y }}
        initial={{ opacity: 0, scale: 0.95, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 5 }}
        transition={{ duration: 0.15 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--border)]">
          <h4 className="font-mono text-sm font-semibold text-[var(--text-primary)]">
            {activeTool.name}
          </h4>
          {lockedTool && (
            <span className="text-[9px] uppercase tracking-wider text-bronze">Locked</span>
          )}
        </div>

        {/* Projects list */}
        {projectsWithUsage.length > 0 ? (
          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
              Projects Used In:
            </span>
            <div className="space-y-2">
              {projectsWithUsage.map((usage) => (
                <div
                  key={usage.projectId}
                  className="flex items-start justify-between gap-2 p-2 rounded bg-[var(--surface)] border border-[var(--border)]"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-[var(--text-primary)] truncate">
                        {PROJECT_LABELS[usage.projectId] || usage.projectId}
                      </span>
                      <IntensityIndicator intensity={usage.intensity} />
                    </div>
                    {usage.subsystem && (
                      <span className="block text-[9px] text-[var(--text-muted)] mt-0.5 truncate">
                        {usage.subsystem}
                      </span>
                    )}
                    {usage.role && (
                      <span className="block text-[9px] text-bronze/80 mt-0.5 leading-tight">
                        {usage.role}
                      </span>
                    )}
                  </div>
                  <IntensityLabel intensity={usage.intensity} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-[11px] text-[var(--text-muted)] italic">
            Part of the stack but not deployed in these specific projects.
          </div>
        )}

        {/* Hint */}
        <div className="mt-3 pt-2 border-t border-[var(--border)]">
          <span className="text-[9px] text-[var(--text-muted)]">
            {lockedTool ? 'Click badge again to unlock' : 'Click to lock tooltip'}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}
