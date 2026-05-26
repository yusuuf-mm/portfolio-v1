'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  type ToolCategory,
  type UsageIntensity,
  PROJECT_ORDER,
  PROJECT_LABELS,
  INTENSITY_COLORS,
  getToolIntensityForProject,
} from '@/content/stack'
import { useStackInteraction } from './useStackInteraction'

interface ProjectMatrixProps {
  categories: ToolCategory[]
  isInView: boolean
}

function IntensityCell({
  intensity,
  isHighlighted,
  toolName,
  projectId,
}: {
  intensity: UsageIntensity
  isHighlighted: boolean
  toolName: string
  projectId: string
}) {
  return (
    <motion.div
      data-matrix-cell={`${toolName}-${projectId}`}
      className={cn(
        'w-full h-6 rounded-sm transition-all duration-200',
        'border border-transparent',
        isHighlighted && intensity !== 'none' && 'ring-1 ring-bronze/60 border-bronze/40',
        isHighlighted && intensity === 'none' && 'border-[var(--border)]'
      )}
      style={{
        backgroundColor: isHighlighted && intensity !== 'none'
          ? INTENSITY_COLORS[intensity].replace(')', ', 1)').replace('rgba', 'rgba')
          : INTENSITY_COLORS[intensity],
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        boxShadow: isHighlighted && intensity !== 'none' 
          ? '0 0 8px rgba(184, 147, 90, 0.4)' 
          : 'none'
      }}
      transition={{ duration: 0.2 }}
    />
  )
}

function IntensityLegend() {
  const levels: { label: string; intensity: UsageIntensity }[] = [
    { label: 'None', intensity: 'none' },
    { label: 'Low', intensity: 'low' },
    { label: 'Med', intensity: 'medium' },
    { label: 'High', intensity: 'high' },
  ]

  return (
    <div className="flex items-center gap-4">
      <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
        Usage Intensity:
      </span>
      <div className="flex items-center gap-2">
        {levels.map(({ label, intensity }) => (
          <div key={intensity} className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-sm border border-[var(--border)]"
              style={{ backgroundColor: INTENSITY_COLORS[intensity] }}
            />
            <span className="font-mono text-[9px] text-[var(--text-muted)]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProjectMatrix({ categories, isInView }: ProjectMatrixProps) {
  const { activeTool } = useStackInteraction()

  // Flatten all tools with their category info
  const allTools = useMemo(() => {
    return categories.flatMap((category) =>
      category.tools.map((tool) => ({
        ...tool,
        categoryId: category.id,
        categoryColor: category.color,
      }))
    )
  }, [categories])

  // Filter to only show tools that have at least one project usage
  const toolsWithUsage = useMemo(() => {
    return allTools.filter((tool) => tool.usage.length > 0)
  }, [allTools])

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
        </div>
        <IntensityLegend />
      </div>

      {/* Matrix */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Column headers (Projects) */}
          <div className="flex items-end mb-2 pl-24">
            <div className="flex-1 grid gap-1" style={{ gridTemplateColumns: `repeat(${PROJECT_ORDER.length}, 1fr)` }}>
              {PROJECT_ORDER.map((projectId) => (
                <div key={projectId} className="text-center">
                  <span className="font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-wider">
                    {PROJECT_LABELS[projectId]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Rows (Tools) */}
          <div className="space-y-1">
            {toolsWithUsage.map((tool) => {
              const isToolHighlighted = activeTool?.name === tool.name

              return (
                <motion.div
                  key={tool.name}
                  className={cn(
                    'flex items-center gap-2 py-0.5 px-1 rounded transition-colors duration-200',
                    isToolHighlighted && 'bg-bronze/10'
                  )}
                  animate={{
                    backgroundColor: isToolHighlighted ? 'rgba(184, 147, 90, 0.1)' : 'transparent',
                  }}
                >
                  {/* Tool name */}
                  <div className="w-24 flex-shrink-0">
                    <span
                      className={cn(
                        'font-mono text-[10px] truncate block transition-colors duration-200',
                        isToolHighlighted ? 'text-bronze font-medium' : 'text-[var(--text-muted)]'
                      )}
                    >
                      {tool.name}
                    </span>
                  </div>

                  {/* Intensity cells */}
                  <div className="flex-1 grid gap-1" style={{ gridTemplateColumns: `repeat(${PROJECT_ORDER.length}, 1fr)` }}>
                    {PROJECT_ORDER.map((projectId) => {
                      const intensity = getToolIntensityForProject(tool, projectId)
                      return (
                        <IntensityCell
                          key={projectId}
                          intensity={intensity}
                          isHighlighted={isToolHighlighted}
                          toolName={tool.name}
                          projectId={projectId}
                        />
                      )
                    })}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mobile hint */}
      <div className="mt-3 pt-2 border-t border-[var(--border)] md:hidden">
        <span className="text-[9px] text-[var(--text-muted)]">
          Scroll horizontally to see all projects
        </span>
      </div>
    </motion.div>
  )
}
