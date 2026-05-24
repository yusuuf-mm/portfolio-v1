'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const SkillRadar = dynamic(() => import('@/components/three/SkillRadar'), { ssr: false })

// Boot sequence with service names matching radar nodes
const bootSequence = [
  { status: 'BOOT', service: 'yusuf.sys v2.0', message: 'initializing...', nodeIndex: -1 },
  { status: 'OK', service: 'software-engineering.core', message: 'loaded', nodeIndex: 0 },
  { status: 'OK', service: 'machine-learning.models', message: 'active', nodeIndex: 2 },
  { status: 'OK', service: 'data-engineering.pipelines', message: 'streaming', nodeIndex: 1 },
  { status: 'OK', service: 'operations-research.solver', message: 'ready', nodeIndex: 4 },
  { status: 'OK', service: 'ai-systems.orchestrator', message: 'online', nodeIndex: 3 },
  {
    status: 'READY',
    service: 'All systems nominal',
    message: 'Architect mode: ENABLED.',
    nodeIndex: 5,
  },
]

// Compact terminal commands for after boot
const compactCommands = [
  { cmd: 'whoami', output: 'Yusuf Muhammad Musa' },
  { cmd: 'status', output: 'Open to opportunities' },
  { cmd: 'currently_building', output: 'Intelligent systems that optimize and decide' },
]

interface BootLine {
  status: string
  service: string
  message: string
}

interface CompactLine {
  cmd: string
  output: string
}

const ease = [0.22, 1, 0.36, 1] as const // Boot animation easing

function BootTerminal({
  onBootComplete,
  onNodeFlare,
}: {
  onBootComplete: () => void
  onNodeFlare: (index: number) => void
}) {
  const [bootLines, setBootLines] = useState<BootLine[]>([])
  const [compactLines, setCompactLines] = useState<CompactLine[]>([])
  const [bootComplete, setBootComplete] = useState(false)
  const [showCompact, setShowCompact] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Boot sequence effect
  useEffect(() => {
    let currentIndex = 0

    const addLine = () => {
      if (currentIndex >= bootSequence.length) {
        // Boot complete, transition to compact mode
        setTimeout(() => {
          setBootComplete(true)
          onBootComplete()
          setTimeout(() => setShowCompact(true), 500)
        }, 400)
        return
      }

      const line = bootSequence[currentIndex]
      setBootLines((prev) => [
        ...prev,
        { status: line.status, service: line.service, message: line.message },
      ])

      // Trigger node flare on radar
      if (line.nodeIndex >= 0) {
        onNodeFlare(line.nodeIndex)
      }

      currentIndex++
      setTimeout(addLine, currentIndex === 1 ? 400 : 280)
    }

    const timeout = setTimeout(addLine, 600)
    return () => clearTimeout(timeout)
  }, [onBootComplete, onNodeFlare])

  // Show compact commands after boot
  useEffect(() => {
    if (!showCompact) return

    let cmdIndex = 0
    const addCmd = () => {
      if (cmdIndex >= compactCommands.length) return
      setCompactLines((prev) => [...prev, compactCommands[cmdIndex]])
      cmdIndex++
      setTimeout(addCmd, 350)
    }

    setTimeout(addCmd, 300)
  }, [showCompact])

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setShowCursor((prev) => !prev), 530)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [bootLines, compactLines])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'BOOT':
        return 'text-blue-400'
      case 'OK':
        return 'text-green-400'
      case 'READY':
        return 'text-bronze'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <motion.div
      layout
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
    >
      <div className="rounded-lg overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.4)] border border-white/10">
        {/* Title bar */}
        <div className="bg-[#1a1a1a] px-4 py-3 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <span className="flex-1 text-center font-mono text-xs text-[#6B7280]">~/YUSUF — ZSH</span>
        </div>

        {/* Terminal body */}
        <div
          ref={terminalRef}
          className={cn(
            'bg-[#0D0D0D] p-4 overflow-y-auto terminal-scanlines transition-all duration-500',
            bootComplete ? 'h-[200px]' : 'h-[280px] lg:h-[320px]'
          )}
        >
          <div className="font-mono text-sm space-y-1">
            {/* Boot sequence lines */}
            {bootLines.map((line, i) => (
              <motion.div
                key={`boot-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className="flex"
              >
                <span className={cn('w-[70px] shrink-0', getStatusColor(line.status))}>
                  [ {line.status.padEnd(5)} ]
                </span>
                <span className="text-[#E0E0E0] mr-2">{line.service}</span>
                <span className="text-[#6B7280]">{line.message}</span>
              </motion.div>
            ))}

            {/* Compact mode commands */}
            <AnimatePresence>
              {showCompact && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="pt-3 border-t border-white/5 mt-3"
                  />
                  {compactLines.map((item, i) => {
                    if (!item) return null
                    return (
                      <motion.div
                        key={`compact-${i}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex">
                          <span className="text-bronze mr-2">$</span>
                          <span className="text-[#E0E0E0]">{item.cmd}</span>
                        </div>
                        <div className="text-[#A0A0A0] ml-4">{item.output}</div>
                      </motion.div>
                    )
                  })}
                </>
              )}
            </AnimatePresence>

            {/* Cursor */}
            {bootComplete && compactLines.length >= compactCommands.length && (
              <div className="flex pt-1">
                <span className="text-bronze mr-2">$</span>
                <span
                  className={cn(
                    'inline-block w-2 h-4 bg-bronze',
                    showCursor ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ProfileCard({ visible }: { visible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={visible ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 40, scale: 0.95 }}
      transition={{ duration: 0.7, ease, delay: 0.2 }}
      className="relative"
    >
      {/* Glass card container */}
      <div className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5 dark:bg-white/[0.02] backdrop-blur-md shadow-2xl">
        {/* Headshot placeholder */}
        <div className="relative aspect-[4/5] w-full max-w-[320px] bg-gradient-to-br from-bronze/20 to-navy/20 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-bronze/30 mx-auto mb-4 flex items-center justify-center">
              <span className="font-serif text-4xl text-bronze">Y</span>
            </div>
          </div>
          {/* Subtle gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h2 className="font-serif text-2xl text-white font-medium tracking-tight">
            Yusuf Muhammad Musa
          </h2>
          <p className="text-bronze font-mono text-sm mt-1">AI Systems Engineer</p>
          <p className="text-gray-300 text-sm mt-2 leading-relaxed">
            Building intelligent systems that optimize, decide, and scale.
          </p>
        </div>
      </div>

      {/* Status indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="mt-4 flex items-center gap-2"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
        </span>
        <span className="text-sm text-[var(--text-secondary)] font-mono">
          Available for opportunities
        </span>
      </motion.div>
    </motion.div>
  )
}

export default function Hero() {
  const [bootComplete, setBootComplete] = useState(false)
  const [activeNodes, setActiveNodes] = useState<number[]>([])

  const handleNodeFlare = useCallback((index: number) => {
    setActiveNodes((prev) => [...prev, index])
  }, [])

  const handleBootComplete = useCallback(() => {
    setBootComplete(true)
  }, [])

  return (
    <section className="min-h-[100dvh] flex flex-col relative overflow-hidden bg-[var(--background)]">
      <div className="flex-1 flex items-center pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 w-full">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            {/* Left Side — Terminal + Radar */}
            <motion.div
              layout
              className={cn(
                'w-full flex flex-col gap-6 transition-all duration-700',
                bootComplete ? 'lg:w-[55%]' : 'lg:w-[60%]'
              )}
            >
              <BootTerminal onBootComplete={handleBootComplete} onNodeFlare={handleNodeFlare} />

              {/* 3D Radar - smaller, below terminal on mobile, inline on desktop */}
              <div
                className={cn(
                  'relative transition-all duration-500',
                  bootComplete ? 'h-[220px] lg:h-[200px]' : 'h-[260px] lg:h-[240px]'
                )}
              >
                <SkillRadar activeNodes={activeNodes} compact={bootComplete} />
              </div>

              {/* CTAs - appear after boot */}
              <AnimatePresence>
                {bootComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5, ease }}
                    className="flex gap-4"
                  >
                    <a
                      href="#projects"
                      className={cn(
                        'px-6 py-2.5 font-mono text-sm rounded',
                        'bg-navy dark:bg-bronze text-white',
                        'transition-all hover:opacity-90 hover:scale-[1.02]'
                      )}
                    >
                      View Projects
                    </a>
                    <a
                      href="#contact"
                      className={cn(
                        'px-6 py-2.5 font-mono text-sm rounded',
                        'border border-[var(--border)] text-[var(--text-primary)]',
                        'transition-all hover:border-bronze hover:text-bronze'
                      )}
                    >
                      Get in Touch
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Right Side — Profile Card (appears after boot) */}
            <div
              className={cn(
                'w-full lg:w-[40%] flex justify-center lg:justify-end transition-all duration-700',
                !bootComplete && 'lg:opacity-0 lg:pointer-events-none'
              )}
            >
              <ProfileCard visible={bootComplete} />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: bootComplete ? 1 : 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <div className="w-5 h-8 border border-[var(--border)] rounded-full mx-auto flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-bronze rounded-full" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
