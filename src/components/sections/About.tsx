'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { narrative, journey } from '@/content/about'

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      id="about"
      ref={sectionRef}
      className={cn('py-24 lg:py-32 bg-[var(--background)] relative')}
    >
      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--text-muted) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 0.04,
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left — narrative */}
          <motion.div
            className="lg:w-1/2 flex flex-col gap-6"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
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
                  className="font-sans text-base lg:text-lg text-[var(--text-muted)] leading-relaxed max-w-[65ch]"
                >
                  {p}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Right — timeline */}
          <motion.div
            className="lg:w-1/2 flex flex-col gap-0"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
            }}
          >
            {journey.map((step, i) => {
              const isCurrent = step.period === 'Now'
              return (
                <motion.div
                  key={step.role}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.3 + i * 0.12,
                    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                  }}
                >
                  {/* Timeline line + dot */}
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      {isCurrent && (
                        <div
                          className="absolute inset-0 w-4 h-4 -translate-x-1 -translate-y-1 rounded-full"
                          style={{
                            border: '2px solid var(--accent)',
                            animation: 'pulseRing 2s ease-in-out infinite',
                          }}
                        />
                      )}
                      <motion.div
                        className="w-2 h-2 rounded-full bg-[var(--accent)]"
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : { scale: 0 }}
                        transition={{
                          delay: 0.4 + i * 0.15,
                          duration: 0.3,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    </div>
                    {i < journey.length - 1 && (
                      <motion.div
                        className="w-px h-16 bg-[var(--border)] origin-top"
                        initial={{ scaleY: 0 }}
                        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                        transition={{
                          delay: 0.5 + i * 0.15,
                          duration: 0.5,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-8">
                    <span className="font-mono text-xs text-[var(--accent)]">{step.tag}</span>
                    <h3 className="font-mono text-sm font-semibold text-[var(--text-primary)] mt-1">
                      {step.role}
                    </h3>
                    <p className="font-sans text-sm text-[var(--text-muted)] mt-1">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes pulseRing {
          0%, 100% { transform: translate(-4px, -4px) scale(1); opacity: 1; }
          50% { transform: translate(-4px, -4px) scale(1.5); opacity: 0; }
        }
      `}</style>
    </section>
  )
}
