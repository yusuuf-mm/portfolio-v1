'use client'

import { useRef, useState, useMemo, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Download, Mail, MapPin } from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import { FaLinkedinIn } from 'react-icons/fa'
import { cn } from '@/lib/utils'
import TerminalInput from '@/components/ui/TerminalInput'

const ease = [0.22, 1, 0.36, 1] as const

const contactLinks = [
  {
    icon: Mail,
    label: 'Email',
    value: 'yusuf2000mm@gmail.com',
    href: 'mailto:yusuf2000mm@gmail.com',
  },
  {
    icon: SiGithub,
    label: 'GitHub',
    value: 'github.com/yusuuf-mm',
    href: 'https://github.com/yusuuf-mm',
  },
  {
    icon: FaLinkedinIn,
    label: 'LinkedIn',
    value: 'linkedin.com/in/yusuufmm',
    href: 'https://linkedin.com/in/yusuufmm',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Bauchi, Nigeria',
    href: null,
  },
]

// Seeded random for deterministic particle positions
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Drifting particles component
function DriftingParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: seededRandom(i * 7 + 1) * 100,
        y: seededRandom(i * 7 + 2) * 100,
        duration: 15 + seededRandom(i * 7 + 3) * 10,
        delay: seededRandom(i * 7 + 4) * 5,
        dx1: seededRandom(i * 7 + 5) * 100 - 50,
        dx2: seededRandom(i * 7 + 6) * 100 - 50,
        dy1: seededRandom(i * 7 + 7) * 100 - 50,
        dy2: seededRandom(i * 7 + 8) * 100 - 50,
      })),
    []
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full bg-bronze"
          style={{
            left: particle.x + '%',
            top: particle.y + '%',
            opacity: 0.12,
          }}
          animate={{
            x: [0, particle.dx1, particle.dx2, 0],
            y: [0, particle.dy1, particle.dy2, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

// Terminal log steps for the agentic workflow animation
const WORKFLOW_STEPS = [
  { phase: 'PARSING', text: 'input.message → extracting intent...' },
  { phase: 'ROUTING', text: 'forwarding to yusuf.sys inbox...' },
  { phase: 'DELIVERED', text: 'message.sent ✓' },
]

// Animated workflow log component
function WorkflowLog({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (currentStep < WORKFLOW_STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, 600) // 600ms per step = ~2s total
      return () => clearTimeout(timer)
    } else {
      // All steps complete
      const completeTimer = setTimeout(onComplete, 400)
      return () => clearTimeout(completeTimer)
    }
  }, [currentStep, onComplete])

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 400)
    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <div className="font-mono text-xs space-y-1.5 py-2">
      {WORKFLOW_STEPS.slice(0, currentStep).map((step, idx) => (
        <motion.div
          key={step.phase}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2"
        >
          <span
            className={cn(
              'px-1.5 py-0.5 rounded text-[10px] font-medium tracking-wider',
              step.phase === 'DELIVERED'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-bronze/20 text-bronze'
            )}
          >
            {step.phase}
          </span>
          <span className="text-[var(--text-muted)]">{step.text}</span>
        </motion.div>
      ))}
      {currentStep < WORKFLOW_STEPS.length && (
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium tracking-wider bg-bronze/20 text-bronze">
            {WORKFLOW_STEPS[currentStep].phase}
          </span>
          <span className="text-[var(--text-muted)]">{showCursor ? '▌' : ' '}</span>
        </div>
      )}
    </div>
  )
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [showWorkflow, setShowWorkflow] = useState(false)

  const handleWorkflowComplete = useCallback(() => {
    setShowWorkflow(false)
    setStatus('sent')
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    setShowWorkflow(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        setShowWorkflow(false)
        setStatus('error')
      } else {
        form.reset()
        // Workflow animation handles the 'sent' state transition
      }
    } catch {
      setShowWorkflow(false)
      setStatus('error')
    }
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-[var(--background)] relative"
    >
      <DriftingParticles />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-16">
        {/* Header */}
        <motion.div
          className="flex flex-col gap-4 mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease }}
        >
          <span className="font-mono text-sm text-bronze">{'\u276F'} yusuf.sys ~ contact</span>

          <h2 className="font-serif text-3xl lg:text-5xl text-[var(--text-primary)] tracking-tight leading-tight">
            Let&apos;s Build Something
          </h2>

          <p className="font-mono text-sm text-[var(--text-muted)] max-w-md">
            Open to roles, collaborations, and interesting problems.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left — Terminal form */}
          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col gap-8"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.7, ease, delay: 0.2 }}
          >
            <TerminalInput label="Name" name="name" required placeholder="Your name" />

            <TerminalInput
              label="Email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
            />

            <TerminalInput
              label="Message"
              name="message"
              required
              rows={4}
              placeholder="Tell me about your project or role..."
            />

            {/* Submit area with workflow animation */}
            <div className="min-h-[100px]">
              <AnimatePresence mode="wait">
                {showWorkflow ? (
                  <motion.div
                    key="workflow"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4"
                  >
                    <WorkflowLog onComplete={handleWorkflowComplete} />
                  </motion.div>
                ) : status === 'sent' ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-3"
                  >
                    <p className="font-mono text-sm text-bronze">
                      {'\u203A'} message.sent — we&apos;ll be in touch
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus('idle')}
                      className="self-start font-mono text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : status === 'error' ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-3"
                  >
                    <p className="font-mono text-xs text-red-500">
                      {'\u203A'} error.network — please try again
                    </p>
                    <button
                      type="submit"
                      className={cn(
                        'self-start px-8 py-3 font-mono text-sm rounded',
                        'bg-[var(--accent)] text-white',
                        'transition-all hover:opacity-80'
                      )}
                    >
                      Retry {'\u203A'}
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    key="submit"
                    type="submit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      'self-start px-8 py-3 font-mono text-sm rounded',
                      'bg-[var(--accent)] text-white',
                      'transition-all hover:opacity-80'
                    )}
                  >
                    Send Message {'\u203A'}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.form>

          {/* Right — Contact info */}
          <motion.div
            className="flex flex-col gap-8"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.7, ease, delay: 0.3 }}
          >
            {/* Availability status */}
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="font-mono text-sm text-emerald-500">Open to Opportunities</span>
            </div>

            {/* Contact links */}
            <div className="flex flex-col gap-6">
              {contactLinks.map((link) => (
                <div key={link.label} className="flex items-start gap-4">
                  <link.icon className="w-[18px] h-[18px] text-bronze mt-0.5 shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-[11px] text-[var(--text-muted)] uppercase tracking-wider">
                      {link.label}
                    </span>
                    {link.href ? (
                      <a
                        href={link.href}
                        target={link.href.startsWith('mailto') ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        className="font-mono text-sm text-[var(--text-primary)] hover:text-bronze transition-colors"
                      >
                        {link.value}
                      </a>
                    ) : (
                      <span className="font-mono text-sm text-[var(--text-primary)]">
                        {link.value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Download Resume button */}
            {process.env.NEXT_PUBLIC_RESUME_URL && (
              <a
                href="/api/resume"
                download
                className={cn(
                  'self-start flex items-center gap-2 px-6 py-2.5',
                  'font-mono text-sm rounded',
                  'border border-[var(--border)] text-[var(--text-primary)]',
                  'transition-all hover:border-bronze hover:text-bronze'
                )}
              >
                <Download size={16} />
                Download Resume
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
