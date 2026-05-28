'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Lock, Unlock } from 'lucide-react'
import { stack } from '@/content/stack'
import {
  StackInteractionProvider,
  useStackInteraction,
} from '@/components/stack/useStackInteraction'
import CategoryTreemap from '@/components/stack/CategoryTreemap'
import ProjectMatrix from '@/components/stack/ProjectMatrix'
import ToolInfoPanel from '@/components/stack/ToolInfoPanel'

function StackContent() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const { mode, toggleMode } = useStackInteraction()

  return (
    <section id="stack" ref={sectionRef} className="py-20 lg:py-28 bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-4 lg:px-12">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border)]"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <span className="font-mono text-[10px] text-bronze tracking-[0.12em] uppercase">
              yusuf.sys ~ stack
            </span>
            <h2 className="font-sans text-xl lg:text-2xl font-medium text-[var(--text-primary)] mt-1">
              Tools I Build With
            </h2>
          </div>
          <button
            onClick={toggleMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-[10px] uppercase tracking-wider transition-all duration-200 border cursor-pointer"
            style={{
              background:
                mode === 'locked' ? 'rgba(184, 147, 90, 0.15)' : 'rgba(184, 147, 90, 0.06)',
              borderColor: mode === 'locked' ? '#b8935a' : 'rgba(184, 147, 90, 0.3)',
              color: '#b8935a',
            }}
          >
            {mode === 'locked' ? <Lock size={12} /> : <Unlock size={12} />}
            {mode === 'locked' ? 'Locked' : 'Hover mode'}
          </button>
        </motion.div>

        {/* Bento Grid: Treemap + Info Panel */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-3 mb-3"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <CategoryTreemap categories={stack} isInView={isInView} />
          <ToolInfoPanel />
        </motion.div>

        {/* Project Integration Matrix */}
        <ProjectMatrix categories={stack} isInView={isInView} />
      </div>
    </section>
  )
}

export default function Stack() {
  return (
    <StackInteractionProvider>
      <StackContent />
    </StackInteractionProvider>
  )
}
