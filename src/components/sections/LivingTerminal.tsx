'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface TerminalLine {
  type: 'command' | 'output' | 'blank'
  text: string
}

const sequence: TerminalLine[] = [
  { type: 'command', text: 'whoami' },
  { type: 'output', text: 'Yusuf Muhammad Musa' },
  { type: 'blank', text: '' },
  { type: 'command', text: 'title' },
  { type: 'output', text: 'AI Systems Engineer' },
  { type: 'blank', text: '' },
  { type: 'command', text: 'specialization' },
  { type: 'output', text: 'Operations Research \u00B7 ML Systems \u00B7 End-to-End AI' },
  { type: 'blank', text: '' },
  { type: 'command', text: 'currently_building' },
  { type: 'output', text: 'Intelligent systems that optimize and decide' },
  { type: 'blank', text: '' },
  { type: 'command', text: 'skills --list' },
  { type: 'output', text: '[ Python, FastAPI, PyTorch, Kafka, dbt, AWS, PuLP, Next.js ]' },
  { type: 'blank', text: '' },
  { type: 'command', text: 'status' },
  { type: 'output', text: 'Open to opportunities \u00B7 Bauchi, Nigeria' },
  { type: 'blank', text: '' },
  { type: 'command', text: '' },
]

export default function LivingTerminal() {
  const [visibleLines, setVisibleLines] = useState<number>(0)
  const [currentText, setCurrentText] = useState('')
  const [isTypingCommand, setIsTypingCommand] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const lineIndex = useRef(0)
  const charIndex = useRef(0)
  const phase = useRef<'type-command' | 'show-output' | 'pause'>('type-command')

  useEffect(() => {
    const tick = () => {
      if (lineIndex.current >= sequence.length) return

      const line = sequence[lineIndex.current]

      if (phase.current === 'type-command') {
        if (line.type === 'blank') {
          setVisibleLines((prev) => prev + 1)
          lineIndex.current++
          return
        }

        if (line.type === 'output') {
          setVisibleLines((prev) => prev + 1)
          lineIndex.current++
          setIsTypingCommand(false)
          return
        }

        // Type command character by character
        setIsTypingCommand(true)
        if (charIndex.current < line.text.length) {
          setCurrentText(line.text.slice(0, charIndex.current + 1))
          charIndex.current++
        } else {
          // Command finished typing
          setVisibleLines((prev) => prev + 1)
          lineIndex.current++
          charIndex.current = 0
          setCurrentText('')
          setIsTypingCommand(false)
        }
      }
    }

    const interval = setInterval(tick, 40)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll terminal body
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [visibleLines, currentText])

  return (
    <motion.div
      className="w-full max-w-xl lg:max-w-none rounded-lg overflow-hidden"
      style={{
        background: '#0D0D0D',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center px-4 py-2.5"
        style={{
          background: '#1A1A1A',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: '#FF5F57' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#FFBD2E' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#28C840' }} />
        </div>
        <span className="flex-1 text-center font-mono text-xs" style={{ color: '#666' }}>
          ~/YUSUF {'\u2014'} ZSH
        </span>
        <div className="w-14" />
      </div>

      {/* Terminal body */}
      <div
        ref={containerRef}
        className="p-4 lg:p-5 font-mono text-sm leading-relaxed overflow-y-auto"
        style={{
          height: '340px',
          position: 'relative',
        }}
      >
        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)',
            zIndex: 1,
          }}
        />

        <div className="relative z-10">
          {sequence.slice(0, visibleLines).map((line, i) => {
            if (line.type === 'blank') {
              return <div key={i} className="h-3" />
            }
            if (line.type === 'command') {
              return (
                <div key={i} className="flex gap-2">
                  <span style={{ color: '#B8935A' }}>$</span>
                  <span style={{ color: '#E0E0E0' }}>{line.text}</span>
                </div>
              )
            }
            return (
              <div key={i} className="pl-5" style={{ color: '#A0A0A0' }}>
                {line.text}
              </div>
            )
          })}

          {/* Currently typing command */}
          {isTypingCommand && (
            <div className="flex gap-2">
              <span style={{ color: '#B8935A' }}>$</span>
              <span style={{ color: '#E0E0E0' }}>{currentText}</span>
              <span
                className="inline-block w-2 h-4 align-middle"
                style={{
                  background: '#B8935A',
                  animation: 'blink 1s step-end infinite',
                }}
              />
            </div>
          )}

          {/* Final cursor */}
          {!isTypingCommand && visibleLines >= sequence.length - 1 && (
            <div className="flex gap-2">
              <span style={{ color: '#B8935A' }}>$</span>
              <span
                className="inline-block w-2 h-4 align-middle"
                style={{
                  background: '#B8935A',
                  animation: 'blink 1s step-end infinite',
                }}
              />
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </motion.div>
  )
}
