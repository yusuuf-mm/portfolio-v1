'use client'

import { useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import LivingTerminal from '@/components/sections/LivingTerminal'

const SkillRadar = dynamic(() => import('@/components/three/SkillRadar'), { ssr: false })

function RadarFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-40 h-40">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute inset-0 border border-[var(--accent)]"
            style={{
              opacity: 0.1 + i * 0.1,
              transform: 'rotate(' + i * 30 + 'deg) scale(' + (0.5 + i * 0.25) + ')',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default function Hero() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <section
      className={cn('min-h-[100dvh] flex flex-col relative overflow-hidden bg-[var(--background)]')}
    >
      <div className="flex-1 flex items-center flex-col lg:flex-row">
        {/* Left: terminal */}
        <div className="lg:w-[55%] px-6 lg:px-16 lg:pl-24 py-16 lg:py-0 flex flex-col justify-center">
          <div className="mb-6">
            <span className="font-mono text-xs text-[var(--text-muted)] tracking-widest uppercase">
              yusuf.sys v1.0
            </span>
          </div>
          <LivingTerminal />
          <motion.div
            className="flex gap-3 flex-wrap mt-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <a
              href="#projects"
              className={cn(
                'bg-[var(--accent)] text-[var(--background)] px-6 py-2.5 font-mono text-sm min-h-[44px] flex items-center',
                'transition-all duration-200 hover:scale-[0.98] active:scale-[0.96]'
              )}
            >
              View Projects
            </a>
            <a
              href="#contact"
              className={cn(
                'border border-[var(--border)] text-[var(--text-primary)] px-6 py-2.5 font-mono text-sm min-h-[44px] flex items-center',
                'transition-all duration-200 hover:scale-[0.98] active:scale-[0.96]'
              )}
            >
              Get in Touch
            </a>
          </motion.div>
        </div>

        {/* Right: 3D skill radar */}
        <div className="lg:w-[45%] h-72 lg:h-full min-h-[400px] relative">
          <div className="absolute inset-0">
            {isMobile ? (
              <RadarFallback />
            ) : (
              <Suspense fallback={<RadarFallback />}>
                <SkillRadar />
              </Suspense>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <span className="font-mono text-xs text-[var(--text-muted)] tracking-wider">
          scroll to explore
        </span>
        <motion.div
          className="w-5 h-8 border border-[var(--border)] rounded-full flex items-start justify-center pt-1.5"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <div className="w-1 h-2 bg-[var(--accent)] rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
