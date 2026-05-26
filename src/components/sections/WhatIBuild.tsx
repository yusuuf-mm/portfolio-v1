'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { RiBrainLine, RiLineChartLine, RiStackLine } from 'react-icons/ri'
import GlassCard from '@/components/ui/GlassCard'
import Badge from '@/components/ui/Badge'
import OptimizationGraph from '@/components/ui/OptimizationGraph'
import { pillars } from '@/content/about'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain: RiBrainLine,
  GitBranch: RiLineChartLine,
  Layers: RiStackLine,
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      delay: 0.2 + i * 0.15,
    },
  }),
}

export default function WhatIBuild() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="build" ref={sectionRef} className="py-24 lg:py-32 bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-6 lg:px-16">
        {/* Header */}
        <motion.div
          className="flex flex-col gap-4 mb-12"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="font-mono text-sm text-bronze">{'\u276F'} yusuf.sys ~ capabilities</span>

          <h2 className="font-serif text-3xl lg:text-5xl text-[var(--text-primary)] tracking-tight leading-tight max-w-3xl text-balance">
            Three things I do that most engineers treat as separate disciplines
          </h2>
        </motion.div>

        {/* Optimization Routing Graph */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <OptimizationGraph />
        </motion.div>

        {/* Pillar cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = iconMap[pillar.icon]
            const isOptimizationPillar = pillar.icon === 'GitBranch'

            return (
              <motion.div
                key={pillar.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
              >
                <GlassCard
                  hover
                  className={`p-6 lg:p-8 flex flex-col gap-5 h-full border-l-2 ${
                    isOptimizationPillar
                      ? 'border-l-bronze bg-gradient-to-br from-bronze/5 to-transparent'
                      : 'border-l-[var(--border)]'
                  }`}
                >
                  {/* Icon */}
                  <motion.div
                    className={`w-12 h-12 flex items-center justify-center rounded-lg border ${
                      isOptimizationPillar
                        ? 'bg-bronze/10 border-bronze/30'
                        : 'bg-[var(--surface)] border-[var(--border)]'
                    }`}
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    <Icon
                      className={`w-7 h-7 ${isOptimizationPillar ? 'text-bronze' : 'text-bronze'}`}
                    />
                  </motion.div>

                  {/* Title */}
                  <h3
                    className={`font-mono text-lg font-semibold ${
                      isOptimizationPillar ? 'text-bronze' : 'text-[var(--text-primary)]'
                    }`}
                  >
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="font-sans text-sm text-[var(--text-muted)] leading-relaxed">
                    {pillar.description}
                  </p>

                  {/* Specifics */}
                  <ul className="flex flex-col gap-2 flex-1">
                    {pillar.specifics.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 font-mono text-xs text-[var(--text-muted)]"
                      >
                        <span className="text-bronze mt-0.5">{'\u00B7'}</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--border)]">
                    {pillar.badges.map((badge) => (
                      <Badge key={badge} label={badge} />
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
