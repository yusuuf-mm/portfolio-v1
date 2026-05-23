'use client'

import { useRef, Suspense } from 'react'
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

const projectGradients: Record<string, string> = {
  'neti-hyoptima': 'linear-gradient(135deg, #0D3B3E 0%, #0A1628 100%)',
  'energy-pipeline': 'linear-gradient(135deg, #3D2000 0%, #1A0E00 100%)',
  habitos: 'linear-gradient(135deg, #1E1040 0%, #0D0D1A 100%)',
  'titanic-optimizer': 'linear-gradient(135deg, #1A2840 0%, #0D0D1A 100%)',
  expensewise: 'linear-gradient(135deg, #0D2818 0%, #0D0D1A 100%)',
}

const statusStyles: Record<string, string> = {
  Live: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  Complete: 'text-[var(--accent)]',
  'In Development': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-mono border rounded-sm',
        statusStyles[status] || statusStyles['Complete']
      )}
      style={
        status === 'Complete'
          ? {
              background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
              borderColor: 'color-mix(in srgb, var(--accent) 20%, transparent)',
            }
          : undefined
      }
    >
      {status}
    </span>
  )
}

function ProjectBanner({ project, height }: { project: (typeof projects)[0]; height: string }) {
  const gradient = projectGradients[project.id] || projectGradients['neti-hyoptima']
  return (
    <div
      className="relative overflow-hidden flex items-end p-6"
      style={{ background: gradient, height }}
    >
      {/* Animated grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* Mockup frame */}
      <div
        className="absolute top-4 right-4 w-32 h-20 border border-white/5 rounded"
        style={{ opacity: 0.4 }}
      >
        <div className="flex gap-1 px-1.5 pt-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
        </div>
        <div className="px-1.5 pt-1">
          <div className="w-full h-px bg-white/5 mb-0.5" />
          <div className="w-3/4 h-px bg-white/5" />
        </div>
      </div>
      {/* "// preview" label */}
      <span className="absolute bottom-3 right-4 font-mono text-[10px] text-white/15">
        {'// preview'}
      </span>
      {/* Title + subtitle */}
      <div className="relative z-10 flex flex-col gap-1">
        <h3 className="font-mono text-lg lg:text-xl font-semibold text-white/90">
          {project.title}
        </h3>
        <p className="font-mono text-xs text-white/50">{project.subtitle}</p>
      </div>
      {/* Status badge */}
      <div className="absolute top-4 left-4">
        <StatusBadge status={project.status} />
      </div>
    </div>
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
        <Suspense fallback={null}>
          <OrchestrationNodes />
        </Suspense>
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
            Selected Work
          </h2>
        </motion.div>

        {/* Featured projects — 2-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {featured.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                delay: 0.15 + i * 0.1,
              }}
            >
              <GlassCard hover className="flex flex-col h-full overflow-hidden">
                <ProjectBanner project={project} height="160px" />
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <p className="font-sans text-sm text-[var(--text-muted)] leading-relaxed max-w-[65ch]">
                    {project.description}
                  </p>
                  <ul className="flex flex-col gap-1.5">
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
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.stack.slice(0, 5).map((s) => (
                      <Badge key={s} label={s} />
                    ))}
                  </div>
                  {/* Meta row */}
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                    <div className="flex items-center gap-3">
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
                          className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                        >
                          <ExternalLink size={12} />
                          Demo
                        </a>
                      )}
                    </div>
                    <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-wider uppercase">
                      {project.type}
                    </span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Compact projects */}
        {compact.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {compact.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                  delay: 0.4 + i * 0.1,
                }}
              >
                <GlassCard hover className="flex flex-col overflow-hidden">
                  <ProjectBanner project={project} height="80px" />
                  <div className="p-5 flex flex-col gap-3">
                    <p className="font-sans text-sm text-[var(--text-muted)] leading-relaxed max-w-[65ch]">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.stack.slice(0, 4).map((s) => (
                        <Badge key={s} label={s} />
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                      <div className="flex items-center gap-3">
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
                      </div>
                      <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-wider uppercase">
                        {project.type}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
