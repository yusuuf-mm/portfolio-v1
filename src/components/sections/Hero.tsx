'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import TerminalPrompt from '@/components/ui/TerminalPrompt'

const TerminalCube = dynamic(() => import('@/components/three/TerminalCube'), { ssr: false })

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
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

const heroLine = 'I architect intelligent systems \u2014 end to end, from model to decision.'

const techBadges = ['Python', 'TypeScript', 'AWS', 'PyTorch', 'Optimization']

export default function Hero() {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index < heroLine.length) {
        setDisplayedText(heroLine.slice(0, index + 1))
        index++
      } else {
        setIsTyping(false)
        clearInterval(interval)
      }
    }, 28)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      className={cn('min-h-[100dvh] flex flex-col relative overflow-hidden bg-[var(--background)]')}
    >
      <div className="flex-1 flex items-center flex-col lg:flex-row">
        {/* Left column */}
        <motion.div
          className="lg:w-1/2 px-6 lg:px-16 py-16 lg:py-0 flex flex-col justify-center gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <TerminalPrompt text="yusuf.sys ~ init" showCursor />
          </motion.div>

          <motion.div variants={itemVariants}>
            <h1>
              <span className="font-serif text-5xl lg:text-7xl text-[var(--text-primary)] tracking-tight leading-none">
                Yusuf
              </span>
              <br />
              <span className="font-mono text-lg lg:text-xl text-[var(--accent)] mt-1 block">
                AI Systems Engineer
              </span>
            </h1>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="font-mono text-sm lg:text-base text-[var(--text-muted)] max-w-md leading-relaxed">
              {displayedText}
              {isTyping && (
                <span className="inline-block w-2 h-4 bg-[var(--accent)] animate-pulse ml-0.5 align-middle" />
              )}
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-3 flex-wrap">
            <a
              href="#projects"
              className={cn(
                'bg-[var(--accent)] text-white px-6 py-2.5 font-mono text-sm',
                'transition-opacity hover:opacity-80'
              )}
            >
              View Projects
            </a>
            <a
              href="#contact"
              className={cn(
                'border border-[var(--border)] text-[var(--text-primary)] px-6 py-2.5 font-mono text-sm',
                'transition-opacity hover:opacity-80'
              )}
            >
              Get in Touch
            </a>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
            {techBadges.map((t) => (
              <Badge key={t} label={t} />
            ))}
          </motion.div>
        </motion.div>

        {/* Right column — 3D cube */}
        <div className="lg:w-1/2 h-64 lg:h-full min-h-[400px] relative">
          <div className="absolute inset-0">
            <TerminalCube accentColor="#B8935A" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-5 h-8 border border-[var(--border)] rounded-full mx-auto flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-[var(--accent)] rounded-full" />
        </div>
      </motion.div>
    </section>
  )
}
