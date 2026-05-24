'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import GlassCard from '@/components/ui/GlassCard'
import { stack } from '@/content/stack'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

function ToolCard({ name, icon: Icon }: { name: string; icon: React.ComponentType<{ className?: string }> | null }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className="group"
    >
      <div
        className={cn(
          'w-20 h-20 flex flex-col items-center justify-center gap-2',
          'bg-[var(--surface)] backdrop-blur-sm',
          'border border-[var(--border)] rounded-lg',
          'transition-all duration-200',
          'group-hover:border-bronze/40 group-hover:bg-bronze/5'
        )}
      >
        {Icon ? (
          <Icon className="w-6 h-6 text-[var(--text-muted)] group-hover:text-bronze transition-colors" />
        ) : (
          <span className="font-mono text-[10px] text-[var(--text-muted)] group-hover:text-bronze transition-colors px-1 text-center leading-tight">
            {name}
          </span>
        )}
        {Icon && (
          <span className="font-mono text-[10px] text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors text-center leading-tight max-w-full px-1 truncate">
            {name}
          </span>
        )}
      </div>
    </motion.div>
  )
}

export default function Stack() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      id="stack"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-[var(--background)]"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-16">
        {/* Header */}
        <motion.div
          className="flex flex-col gap-4 mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="font-mono text-sm text-bronze">
            {'\u276F'} yusuf.sys ~ stack
          </span>

          <h2 className="font-serif text-3xl lg:text-5xl text-[var(--text-primary)] tracking-tight leading-tight">
            Tools I Build With
          </h2>
        </motion.div>

        {/* Stack groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stack.map((group, groupIndex) => (
            <motion.div
              key={group.name}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.15 + groupIndex * 0.1,
              }}
            >
              <GlassCard hover className="p-5 lg:p-6 h-full">
                <h3 className="font-mono text-sm font-semibold text-bronze tracking-wide uppercase mb-5">
                  {group.name}
                </h3>

                <motion.div
                  className="flex flex-wrap gap-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                >
                  {group.tools.map((tool) => (
                    <ToolCard key={tool.name} name={tool.name} icon={tool.icon} />
                  ))}
                </motion.div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
