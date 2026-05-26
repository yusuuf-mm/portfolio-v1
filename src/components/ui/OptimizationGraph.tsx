'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface PathData {
  id: string
  points: { x: number; y: number }[]
  cost: string
  time?: string
  loss?: string
  isOptimal: boolean
  labelPos: { x: number; y: number }
}

const paths: PathData[] = [
  {
    id: 'path1',
    points: [
      { x: 120, y: 200 },
      { x: 250, y: 120 },
      { x: 400, y: 100 },
      { x: 550, y: 130 },
      { x: 680, y: 200 },
    ],
    cost: '$8.2k',
    labelPos: { x: 400, y: 85 },
    isOptimal: false,
  },
  {
    id: 'path2',
    points: [
      { x: 120, y: 200 },
      { x: 220, y: 160 },
      { x: 350, y: 150 },
      { x: 480, y: 140 },
      { x: 580, y: 160 },
      { x: 680, y: 200 },
    ],
    cost: '$5.4k',
    labelPos: { x: 350, y: 135 },
    isOptimal: false,
  },
  {
    id: 'path3',
    points: [
      { x: 120, y: 200 },
      { x: 200, y: 190 },
      { x: 320, y: 195 },
      { x: 450, y: 190 },
      { x: 560, y: 185 },
      { x: 680, y: 200 },
    ],
    cost: '$3.1k',
    time: '4ms',
    loss: '0.01%',
    labelPos: { x: 320, y: 180 },
    isOptimal: true,
  },
  {
    id: 'path4',
    points: [
      { x: 120, y: 200 },
      { x: 220, y: 240 },
      { x: 350, y: 250 },
      { x: 480, y: 240 },
      { x: 580, y: 220 },
      { x: 680, y: 200 },
    ],
    cost: '$6.2k',
    labelPos: { x: 350, y: 265 },
    isOptimal: false,
  },
  {
    id: 'path5',
    points: [
      { x: 120, y: 200 },
      { x: 250, y: 280 },
      { x: 400, y: 300 },
      { x: 550, y: 270 },
      { x: 680, y: 200 },
    ],
    cost: '$9.1k',
    labelPos: { x: 400, y: 315 },
    isOptimal: false,
  },
]

function createSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return ''

  let d = `M ${points[0].x} ${points[0].y}`

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cpX1 = prev.x + (curr.x - prev.x) * 0.5
    const cpY1 = prev.y
    const cpX2 = prev.x + (curr.x - prev.x) * 0.5
    const cpY2 = curr.y
    d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`
  }

  return d
}

export default function OptimizationGraph() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })
  const [phase, setPhase] = useState<'idle' | 'searching' | 'converged'>('idle')
  const [activePathIndex, setActivePathIndex] = useState(-1)
  const [statusText, setStatusText] = useState('initializing')

  useEffect(() => {
    if (!isInView) return

    const runAnimation = () => {
      // Reset
      setPhase('idle')
      setActivePathIndex(-1)
      setStatusText('initializing')

      // Start searching
      setTimeout(() => {
        setPhase('searching')
        setStatusText('computing_paths')
      }, 500)

      // Explore paths one by one
      const pathOrder = [0, 1, 3, 4, 2] // Explore non-optimal first, then optimal
      pathOrder.forEach((pathIdx, i) => {
        setTimeout(
          () => {
            setActivePathIndex(pathIdx)
            if (pathIdx === 2) {
              setStatusText('optimal_found')
              setPhase('converged')
            }
          },
          1500 + i * 800
        )
      })
    }

    runAnimation()
    const interval = setInterval(runAnimation, 8000)
    return () => clearInterval(interval)
  }, [isInView])

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#0a0a0f] rounded-lg border border-[var(--border)] overflow-hidden"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[#0c0c12]">
        <div className="flex items-center gap-4 font-mono text-xs">
          <span className="text-[var(--text-muted)]">
            process: <span className="text-[var(--text-primary)]">Pyomo/Gurobi_v9</span>
          </span>
          <span className="text-[var(--text-muted)]">|</span>
          <span className="text-[var(--text-muted)]">
            status:{' '}
            <span
              className={
                phase === 'converged'
                  ? 'text-emerald-400'
                  : phase === 'searching'
                    ? 'text-bronze'
                    : 'text-[var(--text-muted)]'
              }
            >
              {statusText}
            </span>
          </span>
        </div>
        <span className="font-mono text-xs text-[var(--text-muted)]">
          obj_func: <span className="text-bronze">min(Σ c·x)</span>
        </span>
      </div>

      {/* Graph area */}
      <div className="relative p-8">
        <svg viewBox="0 0 800 400" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Grid pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="1"
              />
            </pattern>

            {/* Glow filter for optimal path */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Animated dash for searching */}
            <linearGradient id="searchGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b8935a" stopOpacity="0" />
              <stop offset="50%" stopColor="#b8935a" stopOpacity="1" />
              <stop offset="100%" stopColor="#b8935a" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Background grid */}
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* All paths */}
          {paths.map((path, index) => {
            const pathD = createSmoothPath(path.points)
            const isActive = activePathIndex === index
            const isOptimalAndConverged = path.isOptimal && phase === 'converged'
            const shouldFade = phase === 'converged' && !path.isOptimal

            return (
              <g key={path.id}>
                {/* Base path */}
                <motion.path
                  d={pathD}
                  fill="none"
                  stroke={isOptimalAndConverged ? '#b8935a' : 'rgba(255,255,255,0.15)'}
                  strokeWidth={isOptimalAndConverged ? 3 : 1.5}
                  strokeDasharray={isOptimalAndConverged ? 'none' : '6 4'}
                  filter={isOptimalAndConverged ? 'url(#glow)' : 'none'}
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{
                    opacity: shouldFade ? 0.2 : isActive || phase === 'idle' ? 1 : 0.4,
                    pathLength: 1,
                  }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />

                {/* Animated search indicator */}
                {isActive && phase === 'searching' && !path.isOptimal && (
                  <motion.circle
                    r="6"
                    fill="#b8935a"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: 2 }}
                  >
                    <animateMotion dur="0.8s" repeatCount="2" path={pathD} />
                  </motion.circle>
                )}

                {/* Optimal path pulse animation */}
                {isOptimalAndConverged && (
                  <motion.path
                    d={pathD}
                    fill="none"
                    stroke="#b8935a"
                    strokeWidth={6}
                    strokeLinecap="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    filter="url(#glow)"
                  />
                )}

                {/* Cost/metric labels */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: shouldFade ? 0.3 : isActive || isOptimalAndConverged ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <rect
                    x={path.labelPos.x - 30}
                    y={path.labelPos.y - 10}
                    width={60}
                    height={20}
                    rx={4}
                    fill={isOptimalAndConverged ? 'rgba(184,147,90,0.2)' : 'rgba(0,0,0,0.6)'}
                    stroke={isOptimalAndConverged ? '#b8935a' : 'rgba(255,255,255,0.1)'}
                    strokeWidth={1}
                  />
                  <text
                    x={path.labelPos.x}
                    y={path.labelPos.y + 4}
                    textAnchor="middle"
                    className="font-mono text-[10px]"
                    fill={isOptimalAndConverged ? '#b8935a' : 'rgba(255,255,255,0.6)'}
                  >
                    Cst: {path.cost}
                  </text>
                </motion.g>

                {/* Additional metrics for optimal path */}
                {path.isOptimal && isOptimalAndConverged && (
                  <>
                    <motion.g
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <rect
                        x={path.labelPos.x + 80}
                        y={path.labelPos.y - 10}
                        width={55}
                        height={20}
                        rx={4}
                        fill="rgba(184,147,90,0.15)"
                        stroke="rgba(184,147,90,0.4)"
                        strokeWidth={1}
                      />
                      <text
                        x={path.labelPos.x + 107}
                        y={path.labelPos.y + 4}
                        textAnchor="middle"
                        className="font-mono text-[10px]"
                        fill="#b8935a"
                      >
                        Tm: {path.time}
                      </text>
                    </motion.g>
                    <motion.g
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <rect
                        x={path.labelPos.x + 145}
                        y={path.labelPos.y - 10}
                        width={60}
                        height={20}
                        rx={4}
                        fill="rgba(184,147,90,0.15)"
                        stroke="rgba(184,147,90,0.4)"
                        strokeWidth={1}
                      />
                      <text
                        x={path.labelPos.x + 175}
                        y={path.labelPos.y + 4}
                        textAnchor="middle"
                        className="font-mono text-[10px]"
                        fill="#b8935a"
                      >
                        Ls: {path.loss}
                      </text>
                    </motion.g>
                  </>
                )}
              </g>
            )
          })}

          {/* Input node - Raw Problem */}
          <g>
            <motion.circle
              cx={80}
              cy={200}
              r={35}
              fill="#0c0c12"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={2}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
            <motion.circle
              cx={80}
              cy={200}
              r={25}
              fill="rgba(255,255,255,0.05)"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={1}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
            <motion.text
              x={80}
              y={260}
              textAnchor="middle"
              className="font-mono text-sm"
              fill="var(--text-primary)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Raw Problem
            </motion.text>
            <motion.text
              x={80}
              y={278}
              textAnchor="middle"
              className="font-mono text-[10px]"
              fill="var(--text-muted)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Nodes: 14.2k
            </motion.text>
          </g>

          {/* Output node - Optimal Decision */}
          <g>
            <motion.circle
              cx={720}
              cy={200}
              r={35}
              fill={phase === 'converged' ? 'rgba(184,147,90,0.15)' : '#0c0c12'}
              stroke={phase === 'converged' ? '#b8935a' : 'rgba(255,255,255,0.2)'}
              strokeWidth={2}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              filter={phase === 'converged' ? 'url(#glow)' : 'none'}
            />
            {/* Play icon */}
            <motion.path
              d="M 712 190 L 732 200 L 712 210 Z"
              fill={phase === 'converged' ? '#b8935a' : 'rgba(255,255,255,0.3)'}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            />
            <motion.text
              x={720}
              y={260}
              textAnchor="middle"
              className="font-mono text-sm"
              fill={phase === 'converged' ? '#b8935a' : 'var(--text-primary)'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Optimal Decision
            </motion.text>
            <motion.text
              x={720}
              y={278}
              textAnchor="middle"
              className="font-mono text-[10px]"
              fill="var(--text-muted)"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'converged' ? 1 : 0 }}
              transition={{ delay: 0.5 }}
            >
              Conf: 99.9%
            </motion.text>
          </g>

          {/* Intermediate nodes on paths */}
          {paths.map((path) =>
            path.points.slice(1, -1).map((point, idx) => (
              <motion.circle
                key={`${path.id}-node-${idx}`}
                cx={point.x}
                cy={point.y}
                r={4}
                fill={path.isOptimal && phase === 'converged' ? '#b8935a' : 'rgba(255,255,255,0.2)'}
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  opacity: phase === 'converged' && !path.isOptimal ? 0.3 : 1,
                }}
                transition={{ duration: 0.3, delay: 0.5 + idx * 0.1 }}
              />
            ))
          )}
        </svg>
      </div>
    </div>
  )
}
