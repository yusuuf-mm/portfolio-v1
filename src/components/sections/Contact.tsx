'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Mail, MapPin, Download, AlertTriangle } from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import { FaLinkedinIn } from 'react-icons/fa'
import { cn } from '@/lib/utils'

// ============================================================================
// Types & Constants
// ============================================================================

type FormStatus = 'idle' | 'sending' | 'sent' | 'error'

const WORKFLOW_STEPS = [
  { phase: 'PARSING', text: 'input.message → extracting intent...' },
  { phase: 'ROUTING', text: 'forwarding to yusuf.sys inbox...' },
  { phase: 'DELIVERED', text: 'message.sent ✓' },
]

// ============================================================================
// Sub-Components
// ============================================================================

interface TerminalFieldProps {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
  rows?: number
  focusedField: string
  setFocusedField: (field: string) => void
}

function TerminalField({
  label,
  name,
  type = 'text',
  required,
  placeholder,
  rows,
  focusedField,
  setFocusedField,
}: TerminalFieldProps) {
  const isFocused = focusedField === name

  return (
    <div className={cn('flex flex-col gap-2 relative')}>
      <label
        className={cn('font-mono text-xs flex items-center gap-1.5 text-neutral-500 select-none')}
      >
        <span className={cn('text-bronze font-semibold')}>$</span> {label}
      </label>
      {rows ? (
        <textarea
          name={name}
          required={required}
          placeholder={placeholder}
          rows={rows}
          className={cn(
            'w-full bg-transparent border-0 border-b border-white/10 outline-none text-neutral-400 focus:text-neutral-100 placeholder-white/20 font-mono text-[13px] py-1.5 resize-none transition-colors duration-200'
          )}
          onFocus={() => setFocusedField(name)}
          onBlur={() => setFocusedField('none')}
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          className={cn(
            'w-full bg-transparent border-0 border-b border-white/10 outline-none text-neutral-400 focus:text-neutral-100 placeholder-white/20 font-mono text-[13px] py-1.5 transition-colors duration-200'
          )}
          onFocus={() => setFocusedField(name)}
          onBlur={() => setFocusedField('none')}
        />
      )}
      <motion.div
        className={cn('absolute bottom-0 left-0 right-0 h-[1px] bg-bronze')}
        style={{ originX: 0 }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isFocused ? 1 : 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />
    </div>
  )
}

function WorkflowLog({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (currentStep < WORKFLOW_STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, 700)
      return () => clearTimeout(timer)
    } else {
      const completeTimer = setTimeout(onComplete, 400)
      return () => clearTimeout(completeTimer)
    }
  }, [currentStep, onComplete])

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 400)
    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <div className={cn('font-mono text-[13px] space-y-2.5 py-2 text-left')}>
      {WORKFLOW_STEPS.slice(0, currentStep).map((step) => {
        const isDelivered = step.phase === 'DELIVERED'
        return (
          <motion.div
            key={step.phase}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(isDelivered ? 'text-emerald-400' : 'text-neutral-400')}
          >
            <span className={cn('text-bronze mr-2')}>›</span>
            <span className={cn('font-semibold mr-1.5')}>{step.phase}:</span>
            <span>{step.text}</span>
          </motion.div>
        )
      })}
      {currentStep < WORKFLOW_STEPS.length && (
        <div className={cn('text-neutral-500 flex items-center gap-1.5')}>
          <span className={cn('text-bronze mr-2')}>›</span>
          <span>{WORKFLOW_STEPS[currentStep].phase}...</span>
          <span>{showCursor ? '▌' : ' '}</span>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  // Form states
  const [status, setStatus] = useState<FormStatus>('idle')
  const [showWorkflow, setShowWorkflow] = useState(false)
  const [focusedField, setFocusedField] = useState<string>('none')
  const [isSubmitHovered, setIsSubmitHovered] = useState(false)
  const [deliveredGlow, setDeliveredGlow] = useState(false)

  // Glow reset timer callback
  const handleWorkflowComplete = useCallback(() => {
    setShowWorkflow(false)
    setStatus('sent')
    setDeliveredGlow(true)
    setTimeout(() => {
      setDeliveredGlow(false)
    }, 1500)
  }, [])

  // Submit Handler
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
      }
    } catch {
      setShowWorkflow(false)
      setStatus('error')
    }
  }

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  }

  const terminalVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        delay: 0.15,
      },
    },
  }

  const statusVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        delay: 0.25,
      },
    },
  }

  const statsBoxVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        delay: 0.35 + i * 0.1,
      },
    }),
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={cn('py-24 lg:py-32 bg-[var(--background)] relative overflow-hidden select-none')}
    >
      {/* Background static grid pattern */}
      <div className={cn('absolute inset-0 pointer-events-none overflow-hidden select-none')}>
        <div
          className={cn('absolute inset-0')}
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(184, 147, 90, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(184, 147, 90, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Radial vignette fade to transparent at center */}
        <div
          className={cn('absolute inset-0')}
          style={{
            background: 'radial-gradient(circle at center, var(--background) 20%, transparent 80%)',
          }}
        />
      </div>

      <div className={cn('relative z-10 max-w-6xl mx-auto px-6 lg:px-16')}>
        {/* Header */}
        <motion.div
          className={cn('flex flex-col gap-4 mb-16')}
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <span className={cn('font-mono text-sm text-bronze')}>
            {'\u276F'} yusuf.sys ~ contact
          </span>

          <h2
            className={cn(
              'font-serif text-3xl lg:text-5xl text-[var(--text-primary)] tracking-tight leading-tight'
            )}
          >
            Let&apos;s Build Something
          </h2>

          <p className={cn('font-mono text-sm text-[var(--text-muted)] max-w-md')}>
            Open to roles, collaborations, and interesting problems.
          </p>
        </motion.div>

        {/* Two-column layout grid */}
        <div className={cn('grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-start')}>
          {/* ==================================================================
              LEFT COLUMN — TERMINAL WORKSPACE
              ================================================================== */}
          <motion.div
            variants={terminalVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className={cn('w-full overflow-hidden border rounded-xl')}
            style={{
              borderColor: 'rgba(255, 255, 255, 0.08)',
              boxShadow: deliveredGlow
                ? '0 0 0 1px rgba(52,211,153,0.4), 0 32px 80px rgba(0,0,0,0.5)'
                : '0 32px 80px rgba(0,0,0,0.5)',
              transition: 'box-shadow 1.5s ease',
            }}
          >
            {/* macOS Chrome Titlebar */}
            <div
              className={cn('flex items-center justify-between px-4 py-3 select-none border-b')}
              style={{
                backgroundColor: '#131316',
                borderColor: 'rgba(255, 255, 255, 0.06)',
              }}
            >
              {/* Three dots */}
              <div className={cn('flex gap-2')}>
                <span
                  className={cn('w-3 h-3 rounded-full')}
                  style={{ backgroundColor: '#FF5F57' }}
                />
                <span
                  className={cn('w-3 h-3 rounded-full')}
                  style={{ backgroundColor: '#FFBD2E' }}
                />
                <span
                  className={cn('w-3 h-3 rounded-full')}
                  style={{ backgroundColor: '#28C840' }}
                />
              </div>

              {/* Title label */}
              <div className={cn('font-mono text-[11px] text-neutral-500 tracking-wide')}>
                ~/YUSUF — CONTACT
              </div>

              {/* Hidden spacer to keep title centered */}
              <div className={cn('w-12')} />
            </div>

            {/* Terminal Body Container */}
            <div
              className={cn('p-6 relative overflow-hidden terminal-scanlines')}
              style={{ backgroundColor: '#0D0D0D' }}
            >
              <form onSubmit={handleSubmit} className={cn('flex flex-col gap-6 w-full')}>
                <AnimatePresence mode="wait">
                  {showWorkflow ? (
                    <motion.div
                      key="workflow"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={cn('min-h-[220px] flex flex-col justify-center')}
                    >
                      <WorkflowLog onComplete={handleWorkflowComplete} />
                    </motion.div>
                  ) : status === 'sent' ? (
                    <motion.div
                      key="sent"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        'min-h-[220px] flex flex-col justify-center gap-4 font-mono text-[13px] text-left'
                      )}
                    >
                      <div className={cn('text-emerald-400 flex items-center gap-2')}>
                        <span className={cn('text-bronze')}>›</span> message.sent — we&apos;ll be in
                        touch
                      </div>
                      <button
                        type="button"
                        onClick={() => setStatus('idle')}
                        className={cn(
                          'self-start text-neutral-500 hover:text-neutral-300 transition-colors duration-200'
                        )}
                      >
                        [send another]
                      </button>
                    </motion.div>
                  ) : status === 'error' ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        'min-h-[220px] flex flex-col justify-center gap-4 font-mono text-[13px] text-left'
                      )}
                    >
                      <div className={cn('text-red-500 flex items-center gap-2')}>
                        <span className={cn('text-bronze')}>›</span> error.network — please try
                        again
                      </div>

                      <button
                        type="submit"
                        className={cn(
                          'flex items-center text-left focus:outline-none select-none text-neutral-400 hover:text-white transition-colors duration-200 group self-start'
                        )}
                      >
                        <span className={cn('text-bronze mr-2')}>$</span>
                        <span>
                          retry &rarr;{' '}
                          <span
                            className={cn(
                              'text-neutral-600 group-hover:text-neutral-400 transition-colors duration-200'
                            )}
                          >
                            [Enter ↵]
                          </span>
                        </span>
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="inputs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={cn('flex flex-col gap-6')}
                    >
                      {/* Name input */}
                      <TerminalField
                        label="name"
                        name="name"
                        required
                        placeholder="Your name"
                        focusedField={focusedField}
                        setFocusedField={setFocusedField}
                      />

                      {/* Email input */}
                      <TerminalField
                        label="email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        focusedField={focusedField}
                        setFocusedField={setFocusedField}
                      />

                      {/* Message input */}
                      <TerminalField
                        label="message"
                        name="message"
                        required
                        rows={5}
                        placeholder="Tell me about your project or role..."
                        focusedField={focusedField}
                        setFocusedField={setFocusedField}
                      />

                      {/* Command Line Submit Row */}
                      <div className={cn('min-h-[40px] mt-4 flex')}>
                        <button
                          type="submit"
                          className={cn(
                            'flex items-center text-left focus:outline-none select-none font-mono text-[13px] text-neutral-400 hover:text-white transition-colors duration-200 group self-start relative'
                          )}
                          onMouseEnter={() => setIsSubmitHovered(true)}
                          onMouseLeave={() => setIsSubmitHovered(false)}
                        >
                          <span className={cn('relative flex items-center pl-3')}>
                            <AnimatePresence>
                              {isSubmitHovered && (
                                <motion.span
                                  initial={{ x: -8, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  exit={{ x: -8, opacity: 0 }}
                                  transition={{ duration: 0.15, ease: 'easeOut' }}
                                  className={cn('absolute left-0 text-bronze font-bold')}
                                >
                                  ▌
                                </motion.span>
                              )}
                            </AnimatePresence>
                            <span className={cn('text-bronze mr-2')}>$</span>
                            <span>
                              send_message --to yusuf.sys{' '}
                              <span
                                className={cn(
                                  'text-neutral-600 group-hover:text-neutral-400 transition-colors duration-200'
                                )}
                              >
                                [Enter ↵]
                              </span>
                            </span>
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>

          {/* ==================================================================
              RIGHT COLUMN — SYSTEM STATUS PANEL
              ================================================================== */}
          <div className={cn('flex flex-col gap-6 w-full')}>
            {/* System Status Panel Glass Card */}
            <motion.div
              variants={statusVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className={cn(
                'bg-[var(--surface)] backdrop-blur-md border border-[var(--border)] rounded-xl p-7 flex flex-col justify-between gap-8 select-none'
              )}
            >
              {/* TOP: System Header */}
              <div className={cn('flex flex-col gap-1.5')}>
                <span
                  className={cn(
                    'font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase'
                  )}
                >
                  SYSTEM STATUS
                </span>

                <div className={cn('flex items-center gap-2 mt-1')}>
                  <span className={cn('relative flex h-2 w-2')}>
                    <span
                      className={cn(
                        'animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'
                      )}
                    />
                    <span
                      className={cn('relative inline-flex rounded-full h-2 w-2 bg-emerald-500')}
                    />
                  </span>
                  <span className={cn('font-mono text-xs text-emerald-500 font-semibold')}>
                    Connection established
                  </span>
                </div>

                <span className={cn('font-mono text-xs text-[var(--text-muted)]')}>
                  Available for new engagements
                </span>
              </div>

              {/* MIDDLE: Contact Properties */}
              <div className={cn('flex flex-col gap-5')}>
                {[
                  {
                    label: 'HOST',
                    value: 'yusuf2000mm@gmail.com',
                    href: 'mailto:yusuf2000mm@gmail.com',
                    icon: Mail,
                  },
                  {
                    label: 'REPO',
                    value: 'github.com/yusuuf-mm',
                    href: 'https://github.com/yusuuf-mm',
                    icon: SiGithub,
                  },
                  {
                    label: 'NETWORK',
                    value: 'linkedin.com/in/yusuufmm',
                    href: 'https://linkedin.com/in/yusuufmm',
                    icon: FaLinkedinIn,
                  },
                  {
                    label: 'NODE',
                    value: 'Bauchi, Nigeria',
                    href: null,
                    icon: MapPin,
                  },
                ].map((prop) => (
                  <div key={prop.label} className={cn('flex items-start gap-4 group')}>
                    <prop.icon
                      size={16}
                      strokeWidth={1.5}
                      className={cn('text-bronze mt-0.5 shrink-0')}
                    />
                    <div className={cn('flex flex-col gap-0.5')}>
                      <span
                        className={cn(
                          'font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]'
                        )}
                      >
                        {prop.label}
                      </span>
                      {prop.href ? (
                        <a
                          href={prop.href}
                          target={prop.href.startsWith('mailto') ? undefined : '_blank'}
                          rel="noopener noreferrer"
                          className={cn(
                            'font-mono text-[13px] text-[var(--text-primary)] hover:text-bronze transition-colors duration-200'
                          )}
                        >
                          {prop.value}
                        </a>
                      ) : (
                        <span
                          className={cn(
                            'font-mono text-[13px] text-[var(--text-primary)] select-text'
                          )}
                        >
                          {prop.value}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* BOTTOM: Artifact Pull (Resume) */}
              {process.env.NEXT_PUBLIC_RESUME_URL && (
                <div className={cn('border-t border-[var(--border)] pt-5')}>
                  <a
                    href="/api/resume"
                    download
                    className={cn(
                      'flex items-center justify-center gap-2 w-full py-2.5 rounded border border-[var(--border)] text-[var(--text-primary)] hover:border-bronze hover:text-bronze font-mono text-xs transition-all duration-300'
                    )}
                  >
                    <Download size={14} className={cn('text-bronze')} />
                    <span>$ pull artifact resume.pdf</span>
                  </a>
                </div>
              )}
            </motion.div>

            {/* BELOW status panel: Two stats boxes side-by-side */}
            <div className={cn('grid grid-cols-2 gap-4')}>
              {[
                { count: '5+', label: 'Systems shipped' },
                { count: '24h', label: 'Response time' },
              ].map((box, i) => (
                <motion.div
                  key={box.label}
                  custom={i}
                  variants={statsBoxVariants}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  className={cn(
                    'bg-[var(--surface)] backdrop-blur-md border border-[var(--border)] rounded-xl p-4 flex flex-col justify-center'
                  )}
                >
                  <span className={cn('font-serif text-3xl text-bronze select-none')}>
                    {box.count}
                  </span>
                  <span
                    className={cn('font-mono text-xs text-[var(--text-muted)] mt-1 select-none')}
                  >
                    {box.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
