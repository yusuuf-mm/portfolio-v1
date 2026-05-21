'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, useInView } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import GlassCard from '@/components/ui/GlassCard'
import Badge from '@/components/ui/Badge'
import { projects } from '@/content/projects'

const OrchestrationNodes = dynamic(() => import('@/components/three/OrchestrationNodes'), {
  ssr: false,
})

const featured = projects.filter((p) => p.featured)
const compact = projects.filter((p) => !p.featured)

const statusStyles: Record<string, string> = {
  Live: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  Complete: 'bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20',
  'In Development': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-mono border rounded-sm',
        statusStyles[status] || statusStyles['Complete']
      )}
    >
      {status}
    </span>
  )
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={cn('relative py-24 lg:py-32 bg-[var(--background)] overflow-hidden')}
    >
      {/* 3D background */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <OrchestrationNodes />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-16">
        {/* Header */}
        <motion.div
          className="flex flex-col gap-4 mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          }}
        >
          <div className="flex items-center gap-2 font-mono text-sm text-[var(--accent)]">
            <span>{'>'}</span>
            <span>yusuf.sys ~ projects</span>
          </div>

          <h2 className="font-serif text-3xl lg:text-5xl text-[var(--text-primary)] tracking-tight leading-tight">
            Systems I{"'"}ve Built
          </h2>

          <p className="font-mono text-sm text-[var(--text-muted)] max-w-md">
            End-to-end. From model to deployment.
          </p>
        </motion.div>

        {/* Featured cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {featured.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                delay: 0.2 + i * 0.12,
              }}
            >
              <GlassCard
                hover
                className="p-6 lg:p-8 flex flex-col gap-4 h-full border-l-2 border-l-[var(--accent)]"
              >
                {/* Top row */}
                <div className="flex items-center gap-3 flex-wrap">
                  <StatusBadge status={project.status} />
                  <span className="font-mono text-xs text-[var(--text-muted)]">{project.type}</span>
                </div>

                {/* Title + subtitle */}
                <div className="flex flex-col gap-1">
                  <h3 className="font-mono text-lg lg:text-xl font-semibold text-[var(--text-primary)]">
                    {project.title}
                  </h3>
                  <p className="font-sans text-sm text-[var(--accent)]">{project.subtitle}</p>
                </div>

                {/* Description */}
                <p className="font-sans text-sm text-[var(--text-muted)] leading-relaxed">
                  {project.description}
                </p>

                {/* Highlights */}
                <ul className="flex flex-col gap-1.5 flex-1">
                  {project.highlights.slice(0, 3).map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2 font-mono text-xs text-[var(--text-muted)]"
                    >
                      <span className="text-[var(--accent)] mt-0.5">{'\u203A'}</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                {/* Stack badges */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-[var(--border)]">
                  {project.stack.slice(0, 5).map((tool) => (
                    <Badge key={tool} label={tool} />
                  ))}
                  {project.stack.length > 5 && (
                    <span className="font-mono text-xs text-[var(--text-muted)] self-center">
                      +{project.stack.length - 5}
                    </span>
                  )}
                </div>

                {/* Links */}
                <div className="flex items-center gap-4 pt-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                    >
                      <ExternalLink size={12} />
                      GitHub
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-mono text-xs text-[var(--accent)] hover:opacity-80 transition-opacity"
                    >
                      <ExternalLink size={12} />
                      Live Demo
                    </a>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Compact cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {compact.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                delay: 0.5 + i * 0.1,
              }}
            >
              <GlassCard hover className="p-5 lg:p-6 flex flex-col gap-3 h-full">
                {/* Top row */}
                <div className="flex items-center gap-3 flex-wrap">
                  <StatusBadge status={project.status} />
                  <span className="font-mono text-xs text-[var(--text-muted)]">{project.type}</span>
                </div>

                {/* Title + subtitle */}
                <div className="flex flex-col gap-1">
                  <h3 className="font-mono text-base font-semibold text-[var(--text-primary)]">
                    {project.title}
                  </h3>
                  <p className="font-sans text-sm text-[var(--accent)]">{project.subtitle}</p>
                </div>

                {/* Description */}
                <p className="font-sans text-sm text-[var(--text-muted)] leading-relaxed">
                  {project.description}
                </p>

                {/* Stack badges */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border)]">
                  {project.stack.slice(0, 4).map((tool) => (
                    <Badge key={tool} label={tool} />
                  ))}
                  {project.stack.length > 4 && (
                    <span className="font-mono text-xs text-[var(--text-muted)] self-center">
                      +{project.stack.length - 4}
                    </span>
                  )}
                </div>

                {/* Links */}
                <div className="flex items-center gap-4 pt-1">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                    >
                      <ExternalLink size={12} />
                      GitHub
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-mono text-xs text-[var(--accent)] hover:opacity-80 transition-opacity"
                    >
                      <ExternalLink size={12} />
                      Live Demo
                    </a>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
