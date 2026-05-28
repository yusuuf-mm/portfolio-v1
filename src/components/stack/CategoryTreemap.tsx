'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ToolCategory } from '@/content/stack'
import ToolBadge from './ToolBadge'
import { useStackInteraction } from './useStackInteraction'

interface CategoryTreemapProps {
  categories: ToolCategory[]
  isInView: boolean
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const categoryVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

const CATEGORY_STYLES: Record<string, { bg: string; border: string; label: string }> = {
  'ai-intelligence': {
    bg: 'rgba(59, 130, 246, 0.08)',
    border: 'rgba(59, 130, 246, 0.2)',
    label: '#60a5fa',
  },
  'data-engineering': {
    bg: 'rgba(34, 197, 94, 0.07)',
    border: 'rgba(34, 197, 94, 0.18)',
    label: '#4ade80',
  },
  'backend-apis': {
    bg: 'rgba(245, 158, 11, 0.08)',
    border: 'rgba(245, 158, 11, 0.2)',
    label: '#fbbf24',
  },
  'cloud-infra': {
    bg: 'rgba(139, 92, 246, 0.07)',
    border: 'rgba(139, 92, 246, 0.18)',
    label: '#a78bfa',
  },
  'frontend-viz': {
    bg: 'rgba(239, 68, 68, 0.07)',
    border: 'rgba(239, 68, 68, 0.15)',
    label: '#f87171',
  },
}

export default function CategoryTreemap({ categories, isInView }: CategoryTreemapProps) {
  const { activeTool } = useStackInteraction()

  const activeCategory = activeTool
    ? categories.find((c) => c.tools.some((t) => t.name === activeTool.name))
    : null

  return (
    <motion.div
      className="grid grid-cols-2 gap-2"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {categories.map((category, i) => {
        const styles = CATEGORY_STYLES[category.id] ?? {
          bg: 'rgba(184, 147, 90, 0.06)',
          border: 'rgba(184, 147, 90, 0.15)',
          label: '#b8935a',
        }
        const isActiveCategory = activeCategory?.id === category.id
        const isDimmed = activeCategory !== null && !isActiveCategory
        const isFullWidth = i === categories.length - 1 && categories.length % 2 === 1

        return (
          <motion.div
            key={category.id}
            variants={categoryVariants}
            className={cn(
              'relative p-3 rounded-lg cursor-pointer transition-all duration-300',
              isFullWidth && 'col-span-2',
              isDimmed && 'opacity-25'
            )}
            style={{
              background: isActiveCategory
                ? `color-mix(in srgb, ${styles.bg} 180%, transparent)`
                : styles.bg,
              border: `1px solid ${isActiveCategory ? styles.label : styles.border}`,
            }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <span
                className="font-mono text-[10px] font-semibold tracking-wide uppercase"
                style={{ color: styles.label }}
              >
                {category.name}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              <AnimatePresence>
                {category.tools.map((tool) => (
                  <ToolBadge key={tool.name} tool={tool} categoryColor={styles.label} />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
