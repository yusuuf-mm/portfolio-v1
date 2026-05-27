'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ToolCategory } from '@/content/stack'
import ToolBadge from './ToolBadge'

interface CategoryTreemapProps {
  categories: ToolCategory[]
  isInView: boolean
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const categoryVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

const toolContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
}

function CategoryIcon({ categoryId }: { categoryId: string }) {
  const icons: Record<string, string> = {
    'ai-intelligence': '◈',
    'data-engineering': '⬡',
    'backend-apis': '⊡',
    'cloud-infra': '◇',
    'frontend-viz': '◉',
  }
  return <span className="text-sm opacity-60">{icons[categoryId] || '○'}</span>
}

export default function CategoryTreemap({ categories, isInView }: CategoryTreemapProps) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {categories.map((category) => (
        <motion.div
          key={category.id}
          variants={categoryVariants}
          className={cn(
            'relative p-4 rounded-lg',
            'bg-[var(--surface)] backdrop-blur-sm',
            'border border-[var(--border)]',
            'hover:border-bronze/20 transition-colors duration-300'
          )}
        >
          {/* Category header */}
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--border)]">
            <CategoryIcon categoryId={category.id} />
            <h3
              className="font-mono text-xs font-semibold tracking-wide uppercase"
              style={{ color: category.color }}
            >
              {category.name}
            </h3>
          </div>

          {/* Tool badges */}
          <motion.div
            className="flex flex-wrap gap-1.5"
            variants={toolContainerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {category.tools.map((tool) => (
              <ToolBadge key={tool.name} tool={tool} categoryColor={category.color} />
            ))}
          </motion.div>

          {/* Subtle category accent */}
          <div
            className="absolute inset-0 rounded-lg opacity-5 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at top left, ${category.color}, transparent 70%)`,
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
