'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import { cn } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import { projects } from '@/content/projects'

const featured = projects.filter((p) => p.featured)
const compact = projects.filter((p) => !p.featured)

const gradientMap: Record<string, string> = {
  'neti-hyoptima': 'project-gradient-neti',
  'energy-pipeline': 'project-gradient-energy',
  habitos: 'project-gradient-habitos',
  'titanic-optimizer': 'project-gradient-titanic',
  expensewise: 'project-gradient-expensewise',
}

const animationMap: Record<string, 'grid' | 'lines' | 'dots'> = {
  'neti-hyoptima': 'grid',
  'energy-pipeline': 'lines',
  habitos: 'dots',
}

const statusStyles = {
  Live: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  Complete: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  'In Development': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
} as const

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'absolute top-4 right-4 inline-flex items-center px-2.5 py-1 text-xs font-mono border rounded',
        statusStyles[status as keyof typeof statusStyles] || statusStyles.Complete
      )}
    >
      {status}
    </span>
  )
}

function ProjectBanner({
  gradient,
  animation,
  title,
  subtitle,
  status,
  isFeatured,
}: {
  gradient: string
  animation?: 'grid' | 'lines' | 'dots'
  title: string
  subtitle: string
  status: string
  isFeatured: boolean
}) {
  return (
    <div
      className={cn('relative overflow-hidden', isFeatured ? 'h-[200px]' : 'h-[80px]', gradient)}
    >
      {animation === 'grid' && <div className="absolute inset-0 animated-grid" />}
      {animation === 'lines' && <div className="absolute inset-0 flowing-lines overflow-hidden" />}
      {animation === 'dots' && <div className="absolute inset-0 pulsing-dots" />}

      <div className="absolute inset-4 border border-white/10 rounded-sm">
        <div className="absolute top-2 left-3 flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
        </div>
        <span className="absolute top-2 right-3 font-mono text-[10px] text-white/40">
          {'// preview'}
        </span>
      </div>

      <StatusBadge status={status} />

      {isFeatured && (
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-serif text-xl lg:text-2xl text-white mb-1">{title}</h3>
          <p className="font-mono text-xs text-white/60">{subtitle}</p>
        </div>
      )}
    </div>
  )
}

function FeaturedCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const gradient = gradientMap[project.id] || 'project-gradient-neti'
  const animation = animationMap[project.id]

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
        <ProjectBanner
          gradient={gradient}
          animation={animation}
          title={project.title}
          subtitle={project.subtitle}
          status={project.status}
          isFeatured
        />

        <div className="p-6 flex flex-col gap-4">
          <span className="font-mono text-xs text-[var(--text-muted)]">{project.type}</span>

          <p className="font-sans text-sm text-[var(--text-muted)] leading-relaxed">
            {project.description}
          </p>

          <ul className="flex flex-col gap-2 flex-1">
            {project.highlights.map((h) => (
              <li
                key={h}
                className="flex items-start gap-2 font-mono text-xs text-[var(--text-muted)]"
              >
                <span className="text-bronze mt-0.5">{'\u203A'}</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>

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
    </motion.div>
  )
}

function CompactCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const gradient = gradientMap[project.id] || 'project-gradient-neti'

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
        <ProjectBanner
          gradient={gradient}
          title={project.title}
          subtitle={project.subtitle}
          status={project.status}
          isFeatured={false}
        />

        <div className="p-5 flex flex-col gap-3">
          <div>
            <h3 className="font-mono text-base font-semibold text-[var(--text-primary)]">
              {project.title}
            </h3>
            <p className="font-mono text-xs text-bronze">{project.subtitle}</p>
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

        {/* Featured cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
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
