'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { UsageIntensity } from '@/content/stack'
import { stack, PROJECT_ORDER, PROJECT_LABELS, getToolIntensityForProject } from '@/content/stack'
import { useStackInteraction } from './useStackInteraction'

const intensityBarWidth: Record<UsageIntensity, string> = {
  high: '100%',
  medium: '65%',
  low: '30%',
  none: '0%',
}

const intensityLabelClass: Record<UsageIntensity, string> = {
  high: 'text-bronze',
  medium: 'text-bronze/60',
  low: 'text-[var(--text-muted)]',
  none: 'text-[var(--text-muted)]/30',
}

const barColors: Record<UsageIntensity, string> = {
  high: '#b8935a',
  medium: 'rgba(184, 147, 90, 0.5)',
  low: 'rgba(184, 147, 90, 0.2)',
  none: 'transparent',
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export default function ToolInfoPanel() {
  const { activeTool } = useStackInteraction()

  const categoryName = useMemo(() => {
    if (!activeTool) return ''
    const cat = stack.find((c) => c.tools.some((t) => t.name === activeTool.name))
    return cat?.name ?? ''
  }, [activeTool])

  return (
    <div
      className={cn(
        'rounded-lg p-4 h-full min-h-[200px]',
        'bg-[var(--surface)] backdrop-blur-sm',
        'border border-[var(--border)]',
        'flex flex-col'
      )}
    >
      <div className="text-[10px] text-[var(--text-muted)] tracking-[0.1em] uppercase mb-3">
        Active Tool
      </div>

      <AnimatePresence mode="wait">
        {activeTool ? (
          <motion.div
            key={activeTool.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease }}
            className="flex-1 flex flex-col"
          >
            <h4 className="font-sans text-lg font-medium text-[var(--text-primary)] mb-0.5">
              {activeTool.name}
            </h4>
            <span className="font-mono text-[11px] text-bronze mb-4">{categoryName}</span>

            <div className="flex flex-col gap-2 flex-1">
              {PROJECT_ORDER.map((projectId) => {
                const intensity = getToolIntensityForProject(activeTool, projectId)
                return (
                  <div key={projectId} className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[var(--text-muted)] w-[90px] truncate shrink-0">
                      {PROJECT_LABELS[projectId]}
                    </span>
                    <div className="flex-1 h-[14px] bg-white/[0.04] rounded-sm overflow-hidden">
                      <motion.div
                        className="h-full rounded-sm"
                        style={{ backgroundColor: barColors[intensity] }}
                        initial={{ width: 0 }}
                        animate={{ width: intensityBarWidth[intensity] }}
                        transition={{ duration: 0.4, ease }}
                      />
                    </div>
                    <span
                      className={cn(
                        'font-mono text-[9px] w-8 text-right uppercase',
                        intensityLabelClass[intensity]
                      )}
                    >
                      {intensity === 'none'
                        ? '\u2014'
                        : intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center"
          >
            <span className="font-mono text-[11px] text-[var(--text-muted)]/40 text-center leading-relaxed">
              Hover or click a tool
              <br />
              to see its project usage
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
