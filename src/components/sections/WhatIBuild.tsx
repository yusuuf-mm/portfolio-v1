'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, useInView } from 'framer-motion'
import { Brain, GitBranch, Layers, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import GlassCard from '@/components/ui/GlassCard'
import Badge from '@/components/ui/Badge'
import { pillars } from '@/content/about'

const SystemTopology = dynamic(() => import('@/components/three/SystemTopology'), { ssr: false })

const iconMap: Record<string, LucideIcon> = {
  Brain,
  GitBranch,
  Layers,
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
    <section
      id="build"
      ref={sectionRef}
      className={cn('relative py-24 lg:py-32 bg-[var(--background)] overflow-hidden')}
    >
      {/* 3D background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <SystemTopology />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-16">
        {/* Header */}
        <motion.div
          className="flex flex-col gap-4 mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-2 font-mono text-sm text-[var(--accent)]">
            <span>{'>'}</span>
            <span>yusuf.sys ~ capabilities</span>
          </div>

          <h2 className="font-serif text-3xl lg:text-5xl text-[var(--text-primary)] tracking-tight leading-tight max-w-2xl">
            Three things I do that most engineers treat as separate disciplines
          </h2>
        </motion.div>

        {/* Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = iconMap[pillar.icon]

            return (
              <motion.div
                key={pillar.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
              >
                <GlassCard hover className="p-6 lg:p-8 flex flex-col gap-5 h-full">
                  {/* Icon */}
                  <div className="w-10 h-10 flex items-center justify-center border border-[var(--border)] rounded-lg bg-[var(--surface)]">
                    <Icon size={20} className="text-[var(--accent)]" />
                  </div>

                  {/* Title */}
                  <h3 className="font-mono text-lg font-semibold text-[var(--text-primary)]">
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
                        <span className="text-[var(--accent)] mt-0.5">{'>'}</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border)]">
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
