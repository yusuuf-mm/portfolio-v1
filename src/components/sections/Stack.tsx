'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { stack } from '@/content/stack'
import { StackInteractionProvider } from '@/components/stack/useStackInteraction'
import CategoryTreemap from '@/components/stack/CategoryTreemap'
import ProjectMatrix from '@/components/stack/ProjectMatrix'
import ToolTooltip from '@/components/stack/ToolTooltip'
import ConnectionLines from '@/components/stack/ConnectionLines'

function StackContent() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="stack" ref={sectionRef} className="py-24 lg:py-32 bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-6 lg:px-16">
        {/* Header */}
        <motion.div
          className="flex flex-col gap-4 mb-12"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="font-mono text-sm text-bronze">{'\u276F'} yusuf.sys ~ stack</span>

          <h2 className="font-serif text-3xl lg:text-5xl text-[var(--text-primary)] tracking-tight leading-tight">
            Tools I Build With
          </h2>

          <p className="font-mono text-xs text-[var(--text-muted)] max-w-2xl leading-relaxed">
            Hover any tool to see which projects it powers and at what depth.
            Click to lock the view for exploration. The matrix below shows the full integration landscape.
          </p>
        </motion.div>

        {/* Category Treemap */}
        <div className="mb-10">
          <CategoryTreemap categories={stack} isInView={isInView} />
        </div>

        {/* Project Integration Matrix */}
        <div className="hidden md:block">
          <ProjectMatrix categories={stack} isInView={isInView} />
        </div>

        {/* Mobile fallback message */}
        <motion.div
          className="md:hidden p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="font-mono text-xs text-[var(--text-muted)] text-center">
            View on desktop to see the full project integration matrix and connection lines.
          </p>
        </motion.div>

        {/* Interactive overlays */}
        <ToolTooltip />
        <ConnectionLines />
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
