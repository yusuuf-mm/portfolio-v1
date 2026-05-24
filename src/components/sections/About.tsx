'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { narrative, journey } from '@/content/about'

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.2,
    },
  },
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-[var(--background)] relative dot-grid"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left — narrative (60%) */}
          <motion.div
            className="lg:w-[60%] flex flex-col gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {/* Section label */}
            <motion.div variants={fadeInUp}>
              <span className="font-mono text-sm text-bronze">
                {'\u276F'} yusuf.sys ~ about
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              variants={slideInLeft}
              className="font-serif text-3xl lg:text-5xl text-[var(--text-primary)] tracking-tight leading-tight"
            >
              {narrative.heading}
            </motion.h2>

            {/* Paragraphs */}
            <motion.div
              variants={staggerContainer}
              className="flex flex-col gap-5"
            >
              {narrative.paragraphs.map((paragraph, i) => (
                <motion.p
                  key={i}
                  variants={fadeInUp}
                  className="font-sans text-base lg:text-lg text-[var(--text-muted)] leading-relaxed max-w-prose"
                >
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — timeline (40%) */}
          <motion.div
            className="lg:w-[40%] flex flex-col gap-0"
            variants={slideInRight}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {journey.map((entry, i) => (
              <motion.div
                key={entry.tag}
                className="relative pl-10 pb-10 last:pb-0"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.4 + i * 0.15,
                }}
              >
                {/* Vertical line */}
                {i < journey.length - 1 && (
                  <div className="absolute left-[15px] top-8 bottom-0 w-px bg-[var(--border)]" />
                )}

                {/* Node dot with badge */}
                <div
                  className={cn(
                    'absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center',
                    'border-2 transition-all',
                    entry.isCurrent
                      ? 'border-bronze bg-bronze'
                      : 'border-[var(--border)] bg-[var(--background)]'
                  )}
                >
                  <span
                    className={cn(
                      'font-mono text-[10px] font-bold',
                      entry.isCurrent ? 'text-[var(--background)]' : 'text-[var(--text-muted)]'
                    )}
                  >
                    {entry.tag}
                  </span>

                  {/* Pulsing ring for current role */}
                  {entry.isCurrent && (
                    <span className="absolute inset-0 rounded-full border-2 border-bronze animate-ping opacity-30" />
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-sm font-semibold text-[var(--text-primary)]">
                    {entry.role}
                  </span>
                  <span className="font-sans text-sm text-[var(--text-muted)]">
                    {entry.description}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
