'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { narrative, journey } from '@/content/about'

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="about" ref={sectionRef} className={cn('py-24 lg:py-32 bg-[var(--background)]')}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left — narrative */}
          <motion.div
            className="lg:w-1/2 flex flex-col gap-6"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
            }}
          >
            <div className="flex items-center gap-2 font-mono text-sm text-[var(--accent)]">
              <span>{'>'}</span>
              <span>yusuf.sys ~ about</span>
            </div>

            <h2 className="font-serif text-3xl lg:text-5xl text-[var(--text-primary)] tracking-tight leading-tight">
              {narrative.heading}
            </h2>

            <div className="flex flex-col gap-4">
              {narrative.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="font-sans text-base lg:text-lg text-[var(--text-muted)] leading-relaxed max-w-prose"
                >
                  {p}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Right — timeline */}
          <motion.div
            className="lg:w-1/2 flex flex-col gap-0"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              delay: 0.2,
            }}
          >
            {journey.map((entry, i) => (
              <motion.div
                key={entry.tag}
                className="relative pl-8 pb-10 last:pb-0"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                  delay: 0.4 + i * 0.15,
                }}
              >
                {/* Vertical line */}
                {i < journey.length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-0 w-px bg-[var(--border)]" />
                )}

                {/* Node dot */}
                <div
                  className={cn(
                    'absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center',
                    i === journey.length - 1
                      ? 'border-[var(--accent)] bg-[var(--accent)]'
                      : 'border-[var(--border)] bg-[var(--background)]'
                  )}
                >
                  <span
                    className={cn(
                      'text-[10px] font-mono font-bold',
                      i === journey.length - 1
                        ? 'text-[var(--background)]'
                        : 'text-[var(--text-muted)]'
                    )}
                  >
                    {entry.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold text-[var(--text-primary)]">
                      {entry.role}
                    </span>
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                      {entry.period}
                    </span>
                  </div>
                  <p className="font-sans text-sm text-[var(--text-muted)]">{entry.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
