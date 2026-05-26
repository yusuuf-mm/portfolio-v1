'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { narrative } from '@/content/about'
import dynamic from 'next/dynamic'

const NeuralNetwork = dynamic(() => import('@/components/ui/NeuralNetwork'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] rounded-xl border border-[var(--border)] bg-void flex items-center justify-center">
      <span className="font-mono text-sm text-[var(--text-muted)]">Loading network...</span>
    </div>
  ),
})

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
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
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const networkContainerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [networkComplete, setNetworkComplete] = useState(false)

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

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-[var(--background)] relative overflow-hidden"
    >
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-50" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <span className="font-mono text-sm text-bronze">
            {'\u276F'} neural_network.forward_pass()
          </span>
        </motion.div>

        {/* Neural Network Visualization */}
        <motion.div
          ref={networkContainerRef}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="mb-0"
        >
          <NeuralNetwork
            activationProgress={progress}
            onComplete={() => setNetworkComplete(true)}
          />
        </motion.div>

        {/* Three Column Narrative - Below Network */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={networkComplete || progress > 0.5 ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mt-12 pt-8 border-t border-[var(--border)]"
        >
          {narrative.paragraphs.map((paragraph, i) => (
            <motion.div key={i} variants={fadeInUp} className="relative">
              {/* Decorative line above paragraph */}
              <div className="w-8 h-px bg-bronze mb-4" />
              <p className="font-sans text-sm lg:text-base text-[var(--text-muted)] leading-relaxed">
                {paragraph}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex items-center gap-4"
        >
          <div className="flex-1 h-px bg-[var(--border)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-bronze rounded-full"
              style={{ width: progress * 100 + '%' }}
            />
          </div>
          <span className="font-mono text-xs text-[var(--text-muted)]">
            {Math.round(progress * 100)}% activated
          </span>
        </motion.div>
      </div>
    </section>
  )
}
