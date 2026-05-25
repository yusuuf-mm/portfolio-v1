'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'
import { narrative } from '@/content/about'
import dynamic from 'next/dynamic'

const NeuralNetwork = dynamic(() => import('@/components/ui/NeuralNetwork'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center">
      <span className="font-mono text-sm text-[var(--text-muted)]">Loading network...</span>
    </div>
  ),
})

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

const terminalLines = [
  { prompt: '>', text: 'cat journey.log', delay: 0 },
  { prompt: '', text: '───────────────────────────────────────', delay: 0.3 },
  { prompt: '[2019]', text: 'Initialized: Software Engineer', delay: 0.5 },
  { prompt: '[2021]', text: 'Module loaded: Data Engineering', delay: 0.7 },
  { prompt: '[2023]', text: 'Upgrade: ML Systems Integration', delay: 0.9 },
  { prompt: '[NOW]', text: 'Status: AI Systems Engineer', delay: 1.1, highlight: true },
  { prompt: '', text: '───────────────────────────────────────', delay: 1.3 },
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const networkContainerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [networkComplete, setNetworkComplete] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)

  const { scrollYProgress } = useScroll({
    target: networkContainerRef,
    offset: ['start end', 'end start'],
  })

  const activationProgress = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const unsubscribe = activationProgress.on('change', (v) => {
      setProgress(Math.min(1, Math.max(0, v)))
    })
    return unsubscribe
  }, [activationProgress])

  useEffect(() => {
    if (networkComplete) {
      const timer = setTimeout(() => setShowTerminal(true), 300)
      return () => clearTimeout(timer)
    }
  }, [networkComplete])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-[var(--background)] relative overflow-hidden"
    >
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-50" />

      <div className="max-w-6xl mx-auto px-6 lg:px-16 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <span className="font-mono text-sm text-bronze">
            {'\u276F'} neural_network.forward_pass()
          </span>
          <h2 className="font-serif text-3xl lg:text-5xl text-[var(--text-primary)] tracking-tight leading-tight mt-3">
            Knowledge Propagation
          </h2>
          <p className="font-sans text-[var(--text-muted)] mt-4 max-w-2xl">
            Watch how software engineering foundations compound into AI systems expertise. Scroll to
            activate the forward pass.
          </p>
        </motion.div>

        {/* Neural Network Visualization */}
        <motion.div
          ref={networkContainerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="mb-16"
        >
          <NeuralNetwork
            activationProgress={progress}
            onComplete={() => setNetworkComplete(true)}
          />

          {/* Progress indicator */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 h-1 bg-[var(--border)] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-bronze rounded-full"
                style={{ width: progress * 100 + '%' }}
              />
            </div>
            <span className="font-mono text-xs text-[var(--text-muted)]">
              {Math.round(progress * 100)}% activated
            </span>
          </div>
        </motion.div>

        {/* Terminal Output + Narrative */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={showTerminal ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="grid lg:grid-cols-2 gap-8"
        >
          {/* Terminal Journey Log */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] backdrop-blur-md overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--background)]/50">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="font-mono text-xs text-[var(--text-muted)] ml-2">journey.log</span>
            </div>

            <div className="p-4 font-mono text-sm space-y-1">
              {terminalLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={showTerminal ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                    delay: line.delay,
                  }}
                  className={cn('flex gap-2', line.highlight && 'text-bronze')}
                >
                  {line.prompt && (
                    <span
                      className={cn(line.highlight ? 'text-bronze' : 'text-[var(--text-muted)]')}
                    >
                      {line.prompt}
                    </span>
                  )}
                  <span
                    className={cn(
                      line.highlight ? 'text-bronze font-semibold' : 'text-[var(--text-primary)]'
                    )}
                  >
                    {line.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Narrative Text */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={showTerminal ? 'visible' : 'hidden'}
            className="flex flex-col gap-5"
          >
            {narrative.paragraphs.map((paragraph, i) => (
              <motion.p
                key={i}
                variants={fadeInUp}
                className="font-sans text-base lg:text-lg text-[var(--text-muted)] leading-relaxed"
              >
                {paragraph}
              </motion.p>
            ))}

            <motion.div variants={fadeInUp} className="mt-4 pt-4 border-t border-[var(--border)]">
              <span className="font-mono text-sm text-bronze">— Yusuf Muhammad Musa</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
