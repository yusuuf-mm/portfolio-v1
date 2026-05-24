'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const SkillRadar = dynamic(() => import('@/components/three/SkillRadar'), { ssr: false })

// Terminal command sequence
const terminalSequence = [
  { cmd: 'whoami', output: 'Yusuf Muhammad Musa' },
  { cmd: 'title', output: 'AI Systems Engineer' },
  { cmd: 'specialization', output: 'Operations Research · ML Systems · End-to-End AI' },
  { cmd: 'currently_building', output: 'Intelligent systems that optimize and decide' },
  { cmd: 'skills --list', output: '[ Python, FastAPI, PyTorch, Kafka, dbt, AWS, PuLP, Next.js ]' },
  { cmd: 'status', output: 'Open to opportunities · Bauchi, Nigeria' },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

interface TerminalLine {
  type: 'command' | 'output'
  text: string
  isTyping?: boolean
}

function TerminalWindow() {
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Typing effect
  useEffect(() => {
    if (currentCommandIndex >= terminalSequence.length) return

    const currentCmd = terminalSequence[currentCommandIndex]

    if (charIndex === 0) {
      // Start new command line
      setLines((prev) => [...prev, { type: 'command', text: '', isTyping: true }])
    }

    if (charIndex < currentCmd.cmd.length) {
      // Type command character by character
      const timeout = setTimeout(() => {
        setLines((prev) => {
          const newLines = [...prev]
          const lastLine = newLines[newLines.length - 1]
          if (lastLine && lastLine.type === 'command') {
            lastLine.text = currentCmd.cmd.slice(0, charIndex + 1)
          }
          return newLines
        })
        setCharIndex((prev) => prev + 1)
      }, 40)
      return () => clearTimeout(timeout)
    } else {
      // Command finished, show output
      const timeout = setTimeout(() => {
        setLines((prev) => {
          const newLines = [...prev]
          const lastLine = newLines[newLines.length - 1]
          if (lastLine) lastLine.isTyping = false
          return [...newLines, { type: 'output', text: currentCmd.output }]
        })
        setCharIndex(0)
        setCurrentCommandIndex((prev) => prev + 1)
      }, 200)
      return () => clearTimeout(timeout)
    }
  }, [currentCommandIndex, charIndex])

  // Pause between commands
  useEffect(() => {
    if (currentCommandIndex > 0 && currentCommandIndex < terminalSequence.length && charIndex === 0) {
      const timeout = setTimeout(() => {}, 800)
      return () => clearTimeout(timeout)
    }
  }, [currentCommandIndex, charIndex])

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  return (
    <motion.div
      variants={itemVariants}
      className="w-full max-w-2xl"
    >
      {/* Terminal chrome */}
      <div className="rounded-lg overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.4)] border border-white/10">
        {/* Title bar */}
        <div className="bg-[#1a1a1a] px-4 py-3 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <span className="flex-1 text-center font-mono text-xs text-[#6B7280]">
            ~/YUSUF — ZSH
          </span>
        </div>

        {/* Terminal body */}
        <div
          ref={terminalRef}
          className="bg-[#0D0D0D] p-4 h-[320px] lg:h-[380px] overflow-y-auto terminal-scanlines"
        >
          <div className="font-mono text-sm space-y-2">
            {lines.map((line, i) => (
              <div key={i} className="flex">
                {line.type === 'command' ? (
                  <>
                    <span className="text-bronze mr-2">$</span>
                    <span className="text-[#E0E0E0]">
                      {line.text}
                      {line.isTyping && showCursor && (
                        <span className="inline-block w-2 h-4 bg-bronze ml-0.5 animate-pulse" />
                      )}
                    </span>
                  </>
                ) : (
                  <span className="text-[#A0A0A0] ml-4">{line.text}</span>
                )}
              </div>
            ))}
            {currentCommandIndex >= terminalSequence.length && (
              <div className="flex">
                <span className="text-bronze mr-2">$</span>
                <span className={cn('inline-block w-2 h-4 bg-bronze', showCursor ? 'opacity-100' : 'opacity-0')} />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section className="min-h-[100dvh] flex flex-col relative overflow-hidden bg-[var(--background)]">
      <div className="flex-1 flex items-center pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            {/* Left Side — Terminal (55%) */}
            <motion.div
              className="w-full lg:w-[55%] flex flex-col gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <TerminalWindow />

              {/* CTAs below terminal */}
              <motion.div variants={itemVariants} className="flex gap-4">
                <a
                  href="#projects"
                  className={cn(
                    'px-6 py-2.5 font-mono text-sm rounded',
                    'bg-navy dark:bg-bronze text-white',
                    'transition-opacity hover:opacity-80'
                  )}
                >
                  View Projects
                </a>
                <a
                  href="#contact"
                  className={cn(
                    'px-6 py-2.5 font-mono text-sm rounded',
                    'border border-[var(--border)] text-[var(--text-primary)]',
                    'transition-all hover:border-[var(--accent)]'
                  )}
                >
                  Get in Touch
                </a>
              </motion.div>
            </motion.div>

            {/* Right Side — 3D Skill Radar (45%) */}
            <div className="hidden lg:block lg:w-[45%] h-[500px] relative">
              <SkillRadar />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-5 h-8 border border-[var(--border)] rounded-full mx-auto flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-bronze rounded-full" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
