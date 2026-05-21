'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ExternalLink, Globe, Mail, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const contactLinks = [
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
  {
    icon: MapPin,
    label: 'Location',
    value: 'Bauchi, Nigeria',
    href: null,
  },
]

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')

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

      if (res.ok) {
        setStatus('sent')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" ref={sectionRef} className={cn('py-24 lg:py-32 bg-[var(--background)]')}>
      <div className="max-w-6xl mx-auto px-6 lg:px-16">
        {/* Header */}
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
            Let{"'"}s Build Something
          </h2>

          <p className="font-mono text-sm text-[var(--text-muted)] max-w-md">
            Open to roles, collaborations, and interesting problems.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left — form */}
          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.7, ease, delay: 0.2 }}
          >
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className={cn(
                  'w-full px-4 py-3 font-mono text-sm',
                  'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)]',
                  'rounded-none outline-none transition-colors',
                  'focus:border-[var(--accent)]'
                )}
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={cn(
                  'w-full px-4 py-3 font-mono text-sm',
                  'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)]',
                  'rounded-none outline-none transition-colors',
                  'focus:border-[var(--accent)]'
                )}
                placeholder="you@example.com"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="message"
                className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                className={cn(
                  'w-full px-4 py-3 font-mono text-sm resize-none',
                  'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)]',
                  'rounded-none outline-none transition-colors',
                  'focus:border-[var(--accent)]'
                )}
                placeholder="Tell me about your project or role..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'sending' || status === 'sent'}
              className={cn(
                'self-start px-8 py-3 font-mono text-sm',
                'bg-[var(--accent)] text-white',
                'transition-opacity hover:opacity-80 disabled:opacity-50'
              )}
            >
              {status === 'sending'
                ? 'Sending...'
                : status === 'sent'
                  ? 'Sent!'
                  : 'Send Message \u203A'}
            </button>

            {status === 'error' && (
              <p className="font-mono text-xs text-red-500">
                Something went wrong. Please try again.
              </p>
            )}

            {status === 'sent' && (
              <p className="font-mono text-xs text-[var(--accent)]">
                Message sent successfully. I{"'"}ll get back to you soon.
              </p>
            )}
          </motion.form>

          {/* Right — links + availability */}
          <motion.div
            className="flex flex-col gap-8"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.7, ease, delay: 0.3 }}
          >
            {/* Availability */}
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="font-mono text-sm text-emerald-500">Open to Opportunities</span>
            </div>

            {/* Links */}
            <div className="flex flex-col gap-5">
              {contactLinks.map((link) => (
                <div key={link.label} className="flex items-start gap-4">
                  <link.icon size={18} className="text-[var(--accent)] mt-0.5 shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">
                      {link.label}
                    </span>
                    {link.href ? (
                      <a
                        href={link.href}
                        target={link.href.startsWith('mailto') ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        className="font-mono text-sm text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
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
          </motion.div>
        </div>
      </div>
    </section>
  )
}
