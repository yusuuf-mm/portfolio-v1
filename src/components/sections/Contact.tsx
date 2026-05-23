'use client'

import { useRef, useState, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import { Download, ExternalLink, Globe, Mail, MapPin } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

interface ContactLink {
  icon: LucideIcon
  label: string
  value: string
  href: string | null
}

const resumeUrl = process.env.NEXT_PUBLIC_RESUME_URL ? '/api/resume' : null

const baseContactLinks: ContactLink[] = [
  {
    icon: Mail,
    label: 'Email',
    value: 'yusuf2000mm@gmail.com',
    href: 'mailto:yusuf2000mm@gmail.com',
  },
  {
    icon: ExternalLink,
    label: 'GitHub',
    value: 'github.com/yusuuf-mm',
    href: 'https://github.com/yusuuf-mm',
  },
  {
    icon: Globe,
    label: 'LinkedIn',
    value: 'linkedin.com/in/yusuufmm',
    href: 'https://linkedin.com/in/yusuufmm',
  },
]

const locationLink: ContactLink = {
  icon: MapPin,
  label: 'Location',
  value: 'Bauchi, Nigeria',
  href: null,
}

function getContactLinks(): ContactLink[] {
  const links: ContactLink[] = [...baseContactLinks]
  if (resumeUrl) {
    links.push({
      icon: Download,
      label: 'Resume',
      value: 'Download Resume',
      href: resumeUrl,
    })
  }
  links.push(locationLink)
  return links
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: seededRandom(i * 7 + 1) * 100,
        y: seededRandom(i * 7 + 2) * 100,
        size: 2 + seededRandom(i * 7 + 3) * 3,
        duration: 12 + seededRandom(i * 7 + 4) * 20,
        delay: seededRandom(i * 7 + 5) * 8,
        dx1: (seededRandom(i * 7 + 6) - 0.5) * 80,
        dx2: (seededRandom(i * 7 + 7) - 0.5) * 60,
        dy1: (seededRandom(i * 7 + 8) - 0.5) * 60,
        dy2: (seededRandom(i * 7 + 9) - 0.5) * 80,
      })),
    []
  )

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: p.x + '%',
            top: p.y + '%',
            background: 'var(--accent)',
            opacity: 0.15,
          }}
          animate={{
            x: [0, p.dx1, p.dx2, 0],
            y: [0, p.dy1, p.dy2, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  )
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const contactLinks = getContactLinks()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')

    const form = e.currentTarget
    const formData = new FormData(form)
    const data = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      message: String(formData.get('message') || ''),
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? 'Request failed')
      }

      setStatus('sent')
      form.reset()
    } catch (err) {
      console.error('Contact form error:', err)
      setStatus('error')
    }
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={cn('py-24 lg:py-32 bg-[var(--background)] relative overflow-hidden')}
    >
      <Particles />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-16">
        <motion.div
          className="flex flex-col gap-4 mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="flex items-center gap-2 font-mono text-sm text-[var(--accent)]">
            <span>{'>'}</span>
            <span>yusuf.sys ~ contact</span>
          </div>

          <h2 className="font-serif text-3xl lg:text-5xl text-[var(--text-primary)] tracking-tight leading-tight">
            Get in Touch
          </h2>

          <p className="font-sans text-base text-[var(--text-muted)] max-w-[65ch]">
            Have a project in mind, a role that fits, or just want to connect? Drop a message below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left — form */}
          <motion.div
            className="flex flex-col gap-6"
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-name"
                  className="font-mono text-xs text-[var(--text-muted)]"
                >
                  Name
                </label>
                <div className="relative">
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    autoComplete="name"
                    className={cn(
                      'w-full px-0 py-3 font-mono text-sm min-h-[44px] bg-transparent border-0 border-b border-[var(--border)] text-[var(--text-primary)] outline-none transition-colors',
                      'focus:border-[var(--accent)]'
                    )}
                    placeholder="Your name"
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 h-px bg-[var(--accent)]"
                    initial={{ width: 0 }}
                    whileInView={{ width: '0%' }}
                    style={{ width: 0 }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-email"
                  className="font-mono text-xs text-[var(--text-muted)]"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  className={cn(
                    'w-full px-0 py-3 font-mono text-sm min-h-[44px] bg-transparent border-0 border-b border-[var(--border)] text-[var(--text-primary)] outline-none transition-colors',
                    'focus:border-[var(--accent)]'
                  )}
                  placeholder="you@example.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-message"
                  className="font-mono text-xs text-[var(--text-muted)]"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  className={cn(
                    'w-full px-0 py-3 font-mono text-sm resize-none min-h-[44px] bg-transparent border-0 border-b border-[var(--border)] text-[var(--text-primary)] outline-none transition-colors',
                    'focus:border-[var(--accent)]'
                  )}
                  placeholder="Tell me about your project or opportunity..."
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className={cn(
                    'bg-[var(--accent)] text-[var(--background)] px-8 py-3 font-mono text-sm min-h-[44px]',
                    'transition-all duration-200 hover:opacity-80 disabled:opacity-50'
                  )}
                >
                  {status === 'sending' ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        className="inline-block w-3 h-3 border border-[var(--background)] border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      />
                      Sending
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </button>

                {status === 'sent' && (
                  <motion.span
                    className="font-mono text-sm text-emerald-500"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease }}
                  >
                    {'\u203A'} message.sent {'\u2014'} we{"'"}ll be in touch
                  </motion.span>
                )}

                {status === 'error' && (
                  <motion.span
                    className="font-mono text-sm text-red-400"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease }}
                  >
                    {'\u203A'} error {'\u2014'} something went wrong. try again.
                  </motion.span>
                )}
              </div>
            </form>
          </motion.div>

          {/* Right — links + availability */}
          <motion.div
            className="flex flex-col gap-8"
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
          >
            <div className="flex flex-col gap-1">
              <span className="font-mono text-xs text-[var(--accent)]">Available for</span>
              <div className="flex flex-col gap-1">
                {[
                  'AI & ML Engineering roles',
                  'Full-stack development projects',
                  'Data pipeline architecture',
                  'Operations Research consulting',
                ].map((item) => (
                  <span key={item} className="font-sans text-sm text-[var(--text-muted)]">
                    {'\u2022'} {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {contactLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1, ease }}
                >
                  <link.icon size={18} className="text-[var(--accent)] flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="font-mono text-xs text-[var(--text-muted)]">{link.label}</span>
                    {link.href ? (
                      <a
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="font-sans text-sm text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                        download={link.label === 'Resume' ? true : undefined}
                      >
                        {link.value}
                      </a>
                    ) : (
                      <span className="font-sans text-sm text-[var(--text-primary)]">
                        {link.value}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
