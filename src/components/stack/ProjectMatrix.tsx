'use client'

import { useMemo, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ToolCategory, UsageIntensity } from '@/content/stack'
import { PROJECT_ORDER, PROJECT_LABELS, getToolIntensityForProject } from '@/content/stack'
import { useStackInteraction } from './useStackInteraction'

interface ProjectMatrixProps {
  categories: ToolCategory[]
  isInView: boolean
}

const intensityCellClass: Record<UsageIntensity, string> = {
  high: 'bg-[rgba(184,147,90,0.75)] text-[#0c0c0e] font-medium',
  medium: 'bg-[rgba(184,147,90,0.35)] text-bronze',
  low: 'bg-[rgba(184,147,90,0.12)] text-bronze/60',
  none: 'text-[#2d2d2d]',
}

const intensityLabel: Record<UsageIntensity, string> = {
  high: 'HIGH',
  medium: 'MED',
  low: 'LOW',
  none: '\u2014',
}

const legendLevels: { label: string; intensity: UsageIntensity }[] = [
  { label: 'High', intensity: 'high' },
  { label: 'Med', intensity: 'medium' },
  { label: 'Low', intensity: 'low' },
  { label: 'None', intensity: 'none' },
]

const legendDotColors: Record<UsageIntensity, string> = {
  high: 'rgba(184, 147, 90, 0.75)',
  medium: 'rgba(184, 147, 90, 0.35)',
  low: 'rgba(184, 147, 90, 0.12)',
  none: 'rgba(255, 255, 255, 0.05)',
}

export default function ProjectMatrix({ categories, isInView }: ProjectMatrixProps) {
  const { activeTool } = useStackInteraction()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const allTools = useMemo(() => {
    return categories.flatMap((category) =>
      category.tools.map((tool) => ({
        ...tool,
        categoryId: category.id,
        categoryColor: category.color,
      }))
    )
  }, [categories])

  const toolsWithUsage = useMemo(() => {
    return allTools.filter((tool) => tool.usage.length > 0)
  }, [allTools])

  useEffect(() => {
    if (!activeTool || !scrollContainerRef.current) return
    const row = scrollContainerRef.current.querySelector(`[data-matrix-row="${activeTool.name}"]`)
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [activeTool])

  return (
    <motion.div
      className={cn(
        'rounded-lg p-4',
        'bg-[var(--surface)] backdrop-blur-sm',
        'border border-[var(--border)]'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-bronze">◫</span>
          <h3 className="font-mono text-xs font-semibold tracking-wide uppercase text-[var(--text-primary)]">
            Project Integration Matrix
          </h3>
          <span className="font-mono text-[10px] text-[var(--text-muted)] ml-1">
            : <span className="text-bronze">usage intensity</span>
          </span>
        </div>

        {/* Legend */}
        <div className="hidden md:flex items-center gap-3">
          {legendLevels.map(({ label, intensity }) => (
            <div key={intensity} className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-sm"
                style={{ backgroundColor: legendDotColors[intensity] }}
              />
              <span className="font-mono text-[9px] text-[var(--text-muted)]">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Column headers */}
          <div className="flex items-center mb-2 sticky top-0 bg-[var(--surface)] z-10 pb-2">
            <div className="w-[90px] shrink-0" />
            <div
              className="flex-1 grid gap-1"
              style={{ gridTemplateColumns: `repeat(${PROJECT_ORDER.length}, 1fr)` }}
            >
              {PROJECT_ORDER.map((projectId) => (
                <div key={projectId} className="text-center">
                  <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider whitespace-nowrap">
                    {PROJECT_LABELS[projectId]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Rows — 3-4 visible, rest scrollable */}
          <div
            ref={scrollContainerRef}
            className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-bronze/20 hover:scrollbar-thumb-bronze/40"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(184, 147, 90, 0.2) transparent',
            }}
          >
            <div className="space-y-[2px] pr-1">
              {toolsWithUsage.map((tool) => {
                const isHighlighted = activeTool?.name === tool.name
                const hasActive = activeTool !== null
                const isDimmed = hasActive && !isHighlighted

                return (
                  <motion.div
                    key={tool.name}
                    data-matrix-row={tool.name}
                    className={cn(
                      'flex items-center gap-2 py-[3px] px-1 rounded transition-colors duration-200',
                      isHighlighted && 'bg-bronze/10 outline outline-1 outline-bronze/20'
                    )}
                    animate={{
                      opacity: isDimmed ? 0.2 : 1,
                      backgroundColor: isHighlighted
                        ? 'rgba(184, 147, 90, 0.1)'
                        : 'rgba(0, 0, 0, 0)',
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Tool name */}
                    <div className="w-[90px] shrink-0">
                      <span
                        className={cn(
                          'font-mono text-[10px] truncate block transition-colors duration-200',
                          isHighlighted
                            ? 'text-[var(--text-primary)] font-medium'
                            : 'text-[var(--text-muted)]'
                        )}
                      >
                        {tool.name}
                      </span>
                    </div>

                    {/* Intensity cells */}
                    <div
                      className="flex-1 grid gap-1"
                      style={{ gridTemplateColumns: `repeat(${PROJECT_ORDER.length}, 1fr)` }}
                    >
                      {PROJECT_ORDER.map((projectId) => {
                        const intensity = getToolIntensityForProject(tool, projectId)
                        return (
                          <div key={projectId} className="text-center">
                            <span
                              className={cn(
                                'inline-block font-mono text-[9px] px-1.5 py-[1px] rounded-sm transition-all duration-200',
                                intensityCellClass[intensity],
                                isHighlighted &&
                                  intensity !== 'none' &&
                                  'ring-1 ring-bronze/40 shadow-[0_0_6px_rgba(184,147,90,0.25)]'
                              )}
                            >
                              {intensityLabel[intensity]}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="relative mt-2">
        <div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-[var(--surface)] to-transparent pointer-events-none" />
        <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between">
          <span className="text-[9px] text-[var(--text-muted)] font-mono">
            {toolsWithUsage.length} tools across {PROJECT_ORDER.length} projects
          </span>
          <span className="text-[9px] text-[var(--text-muted)] font-mono">Scroll for more</span>
        </div>
      </div>
    </motion.div>
  )
}
