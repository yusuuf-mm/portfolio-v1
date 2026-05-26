'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import { cn } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import ProjectDAG, { ProjectDAGMobile } from '@/components/ui/ProjectDAG'
import { projects } from '@/content/projects'

const featured = projects.filter((p) => p.featured)
const compact = projects.filter((p) => !p.featured)

const statusStyles = {
  Live: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  Complete: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  'In Development': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
} as const

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 text-xs font-mono border rounded',
        statusStyles[status as keyof typeof statusStyles] || statusStyles.Complete
      )}
    >
      {status}
    </span>
  )
}

function FeaturedCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const hasDAG = ['energy-pipeline', 'habitos', 'neti-hyoptima'].includes(project.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.1 + index * 0.1,
      }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          'rounded-lg overflow-hidden h-full',
          'bg-[var(--surface)] backdrop-blur-xl',
          'border border-[var(--border)]',
          'transition-all duration-300',
          'hover:border-bronze/30 hover:shadow-lg hover:shadow-bronze/5'
        )}
      >
        {/* Main content area - split layout for featured with DAG */}
        <div className={cn('flex flex-col', hasDAG && 'lg:flex-row')}>
          {/* Left side - Card content (60% on desktop) */}
          <div className={cn('flex flex-col', hasDAG ? 'lg:w-[60%]' : 'w-full')}>
            {/* Header */}
            <div className="p-6 pb-4 border-b border-[var(--border)]">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-serif text-xl lg:text-2xl text-[var(--text-primary)] mb-1">
                    {project.title}
                  </h3>
                  <p className="font-mono text-xs text-bronze">{project.subtitle}</p>
                </div>
                <StatusBadge status={project.status} />
              </div>
              <span className="font-mono text-xs text-[var(--text-muted)]">{project.type}</span>
            </div>

            {/* Description and highlights */}
            <div className="p-6 flex flex-col gap-4 flex-1">
              <p className="font-sans text-sm text-[var(--text-muted)] leading-relaxed">
                {project.description}
              </p>

              <ul className="flex flex-col gap-2">
                {project.highlights.slice(0, 3).map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2 font-mono text-xs text-[var(--text-muted)]"
                  >
                    <span className="text-bronze mt-0.5">{'\u203A'}</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              {/* Mobile DAG timeline */}
              {hasDAG && (
                <div className="lg:hidden pt-2 border-t border-[var(--border)]">
                  <span className="font-mono text-[10px] text-[var(--text-muted)] mb-2 block">
                    pipeline_flow
                  </span>
                  <ProjectDAGMobile projectId={project.id} />
                </div>
              )}

              {/* Stack */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--border)]">
                {project.stack.slice(0, 6).map((tool) => (
                  <Badge key={tool} label={tool} />
                ))}
                {project.stack.length > 6 && (
                  <span className="font-mono text-xs text-[var(--text-muted)] self-center">
                    +{project.stack.length - 6}
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
                    className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-muted)] hover:text-bronze transition-colors"
                  >
                    <SiGithub size={14} />
                    GitHub
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-mono text-xs text-bronze hover:opacity-80 transition-opacity"
                  >
                    <ExternalLink size={14} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right side - DAG visualization (40% on desktop) */}
          {hasDAG && (
            <div className="hidden lg:block lg:w-[40%] border-l border-[var(--border)] bg-void/50">
              <ProjectDAG projectId={project.id} isHovered={isHovered} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function CompactCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.3 + index * 0.1,
      }}
      className="group"
    >
      <div
        className={cn(
          'rounded-lg overflow-hidden h-full',
          'bg-[var(--surface)] backdrop-blur-xl',
          'border border-[var(--border)]',
          'transition-all duration-300',
          'hover:border-bronze/30'
        )}
      >
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-mono text-base font-semibold text-[var(--text-primary)]">
                {project.title}
              </h3>
              <p className="font-mono text-xs text-bronze">{project.subtitle}</p>
            </div>
            <StatusBadge status={project.status} />
          </div>

          <span className="font-mono text-xs text-[var(--text-muted)]">{project.type}</span>

          <p className="font-sans text-sm text-[var(--text-muted)] leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 pt-3 border-t border-[var(--border)]">
            {project.stack.slice(0, 4).map((tool) => (
              <Badge key={tool} label={tool} />
            ))}
            {project.stack.length > 4 && (
              <span className="font-mono text-xs text-[var(--text-muted)] self-center">
                +{project.stack.length - 4}
              </span>
            )}
          </div>

          {project.github && (
            <div className="flex items-center gap-4 pt-2">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-muted)] hover:text-bronze transition-colors"
              >
                <SiGithub size={14} />
                GitHub
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="projects" ref={sectionRef} className="py-24 lg:py-32 bg-[var(--background)]">
      <div className="max-w-6xl mx-auto px-6 lg:px-16">
        {/* Header */}
        <motion.div
          className="flex flex-col gap-4 mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="font-mono text-sm text-bronze">{'\u276F'} yusuf.sys ~ projects</span>

          <h2 className="font-serif text-3xl lg:text-5xl text-[var(--text-primary)] tracking-tight leading-tight">
            Systems I&apos;ve Built
          </h2>

          <p className="font-mono text-sm text-[var(--text-muted)] max-w-md">
            End-to-end. From model to deployment.
          </p>
        </motion.div>

        {/* Featured cards - single column for DAG layout */}
        <div className="flex flex-col gap-6 mb-8">
          {featured.map((project, i) => (
            <FeaturedCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* Compact cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {compact.map((project, i) => (
            <CompactCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
