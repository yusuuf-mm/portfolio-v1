'use client'

import { useRef, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { motion, useInView } from 'framer-motion'
import { RiBrainLine, RiLineChartLine, RiStackLine } from 'react-icons/ri'
import type { IconType } from 'react-icons'
import { cn } from '@/lib/utils'
import GlassCard from '@/components/ui/GlassCard'
import Badge from '@/components/ui/Badge'
import { pillars } from '@/content/about'

const SystemTopology = dynamic(() => import('@/components/three/SystemTopology'), { ssr: false })

const iconMap: Record<string, IconType> = {
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
    <section
      id="build"
      ref={sectionRef}
      className={cn('relative py-24 lg:py-32 bg-[var(--background)] overflow-hidden')}
    >
      {/* 3D background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <Suspense fallback={null}>
          <SystemTopology />
        </Suspense>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-16">
        {/* Header */}
        <motion.div
          className="flex flex-col gap-4 mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          }}
        >
          <div className="flex items-center gap-2 font-mono text-sm text-[var(--accent)]">
            <span>{'>'}</span>
            <span>yusuf.sys ~ capabilities</span>
          </div>

          <h2 className="font-serif text-3xl lg:text-5xl text-[var(--text-primary)] tracking-tight leading-tight max-w-2xl">
            Three things I do that most engineers treat as separate disciplines
          </h2>
        </motion.div>

        {/* Pillars — asymmetric layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* First card — wider */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="lg:row-span-2"
          >
            <PillarCard pillar={pillars[0]} Icon={iconMap[pillars[0].icon]} isInView={isInView} />
          </motion.div>

          {/* Cards 2 and 3 stacked */}
          {pillars.slice(1).map((pillar, i) => {
            const Icon = iconMap[pillar.icon]
            return (
              <motion.div
                key={pillar.title}
                custom={i + 1}
                variants={cardVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
              >
                <PillarCard pillar={pillar} Icon={Icon} isInView={isInView} />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function PillarCard({
  pillar,
  Icon,
  isInView,
}: {
  pillar: (typeof pillars)[0]
  Icon: IconType
  isInView: boolean
}) {
  return (
    <GlassCard
      hover
      className="p-6 lg:p-8 flex flex-col gap-5 h-full border-l-2 border-l-[var(--accent)]"
    >
      <motion.div
        className="w-12 h-12 flex items-center justify-center"
        style={{ color: 'var(--accent)' }}
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        <Icon size={32} />
      </motion.div>
      <h3 className="font-mono text-lg font-semibold text-[var(--text-primary)]">{pillar.title}</h3>
      <p className="font-sans text-sm text-[var(--text-muted)] leading-relaxed max-w-[65ch]">
        {pillar.description}
      </p>
      <ul className="flex flex-col gap-2 flex-1">
        {pillar.specifics.map((item, i) => (
          <motion.li
            key={item}
            className="flex items-start gap-2 font-mono text-xs text-[var(--text-muted)]"
            initial={{ opacity: 0, x: -8 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
            transition={{ delay: 0.6 + i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              className="mt-0.5 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full"
              style={{ border: '1px solid var(--accent)', color: 'var(--accent)' }}
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ delay: 0.7 + i * 0.1, duration: 0.3, type: 'spring', stiffness: 300 }}
            >
              <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <motion.path
                  d="M1 4 L3 6 L7 2"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
            </motion.span>
            <span>{item}</span>
          </motion.li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border)]">
        {pillar.badges.map((badge) => (
          <Badge key={badge} label={badge} />
        ))}
      </div>
    </GlassCard>
  )
}
