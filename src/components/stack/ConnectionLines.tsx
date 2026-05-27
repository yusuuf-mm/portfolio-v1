'use client'

import { useEffect, useState, useRef, startTransition } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PROJECT_ORDER, getToolIntensityForProject } from '@/content/stack'
import { useStackInteraction } from './useStackInteraction'

interface Connection {
  id: string
  path: string
  intensity: 'low' | 'medium' | 'high'
}

function calculateBezierPath(startX: number, startY: number, endX: number, endY: number): string {
  // Calculate control points for a smooth curve
  const controlOffset = Math.abs(endX - startX) * 0.3

  // Create a smooth S-curve
  const cp1x = startX
  const cp1y = startY + controlOffset
  const cp2x = endX
  const cp2y = endY - controlOffset

  return `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`
}

function getIntensityColor(intensity: 'low' | 'medium' | 'high'): string {
  switch (intensity) {
    case 'high':
      return 'rgba(184, 147, 90, 0.9)'
    case 'medium':
      return 'rgba(184, 147, 90, 0.6)'
    case 'low':
      return 'rgba(184, 147, 90, 0.35)'
  }
}

function getIntensityWidth(intensity: 'low' | 'medium' | 'high'): number {
  switch (intensity) {
    case 'high':
      return 2
    case 'medium':
      return 1.5
    case 'low':
      return 1
  }
}

export default function ConnectionLines() {
  const { activeTool, lockedTool } = useStackInteraction()
  const [connections, setConnections] = useState<Connection[]>([])
  const [mounted, setMounted] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const animationFrameRef = useRef<number>(0)

  useEffect(() => {
    startTransition(() => {
      setMounted(true)
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    })
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Calculate connections when active tool changes
  useEffect(() => {
    if (!activeTool) {
      startTransition(() => setConnections([]))
      return
    }

    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    // Use requestAnimationFrame for smoother updates
    animationFrameRef.current = requestAnimationFrame(() => {
      const toolElement = document.querySelector(`[data-tool="${activeTool.name}"]`)
      if (!toolElement) {
        setConnections([])
        return
      }

      const toolRect = toolElement.getBoundingClientRect()
      const startX = toolRect.left + toolRect.width / 2
      const startY = toolRect.bottom

      const newConnections: Connection[] = []

      // Find all matrix cells for this tool
      PROJECT_ORDER.forEach((projectId) => {
        const intensity = getToolIntensityForProject(activeTool, projectId)
        if (intensity === 'none') return

        const cellElement = document.querySelector(
          `[data-matrix-cell="${activeTool.name}-${projectId}"]`
        )
        if (!cellElement) return

        const cellRect = cellElement.getBoundingClientRect()
        const endX = cellRect.left + cellRect.width / 2
        const endY = cellRect.top

        const path = calculateBezierPath(startX, startY, endX, endY)

        newConnections.push({
          id: `${activeTool.name}-${projectId}`,
          path,
          intensity: intensity as 'low' | 'medium' | 'high',
        })
      })

      setConnections(newConnections)
    })

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [activeTool])

  if (!mounted || connections.length === 0) return null

  return createPortal(
    <svg
      className="fixed inset-0 pointer-events-none z-40"
      width={dimensions.width}
      height={dimensions.height}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Gradient for lines */}
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(184, 147, 90, 0.8)" />
          <stop offset="100%" stopColor="rgba(184, 147, 90, 0.4)" />
        </linearGradient>

        {/* Glow filter */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <AnimatePresence>
        {connections.map((connection) => (
          <motion.g
            key={connection.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Glow layer */}
            <motion.path
              d={connection.path}
              fill="none"
              stroke={getIntensityColor(connection.intensity)}
              strokeWidth={getIntensityWidth(connection.intensity) + 2}
              strokeLinecap="round"
              filter="url(#glow)"
              opacity={0.3}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              exit={{ pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />

            {/* Main line */}
            <motion.path
              d={connection.path}
              fill="none"
              stroke={getIntensityColor(connection.intensity)}
              strokeWidth={getIntensityWidth(connection.intensity)}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />

            {/* Animated dash overlay for locked state */}
            {lockedTool && (
              <motion.path
                d={connection.path}
                fill="none"
                stroke="rgba(184, 147, 90, 0.4)"
                strokeWidth={getIntensityWidth(connection.intensity)}
                strokeLinecap="round"
                strokeDasharray="4 8"
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: -24 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            )}
          </motion.g>
        ))}
      </AnimatePresence>
    </svg>,
    document.body
  )
}
