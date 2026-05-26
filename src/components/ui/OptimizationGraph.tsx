'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface PathData {
  id: string
  points: { x: number; y: number }[]
  cost: string
  time?: string
  loss?: string
  swap?: string
  isOptimal: boolean
  isRejected?: boolean
  labelPos: { x: number; y: number }
}

const paths: PathData[] = [
  {
    id: 'path1',
    points: [
      { x: 120, y: 200 },
      { x: 250, y: 120 },
      { x: 400, y: 100 },
      { x: 550, y: 110 },
      { x: 680, y: 200 },
    ],
    cost: '$8.2k',
    time: '12ms',
    labelPos: { x: 400, y: 85 },
    isOptimal: false,
  },
  {
    id: 'path2',
    points: [
      { x: 120, y: 200 },
      { x: 220, y: 155 },
      { x: 350, y: 145 },
      { x: 480, y: 150 },
      { x: 580, y: 165 },
      { x: 680, y: 200 },
    ],
    cost: '$5.2k',
    swap: '1ms',
    time: '2ms',
    loss: '0.6%',
    labelPos: { x: 320, y: 128 },
    isOptimal: false,
  },
  {
    id: 'path3',
    points: [
      { x: 120, y: 200 },
      { x: 200, y: 195 },
      { x: 320, y: 200 },
      { x: 450, y: 195 },
      { x: 560, y: 200 },
      { x: 680, y: 200 },
    ],
    cost: '$3.1k',
    time: '4ms',
    loss: '0.01%',
    labelPos: { x: 260, y: 183 },
    isOptimal: true,
  },
  {
    id: 'path4',
    points: [
      { x: 120, y: 200 },
      { x: 220, y: 240 },
      { x: 350, y: 255 },
      { x: 480, y: 250 },
      { x: 580, y: 230 },
      { x: 680, y: 200 },
    ],
    cost: '$5.1k',
    time: '15ms',
    loss: '2.4%',
    labelPos: { x: 320, y: 272 },
    isOptimal: false,
  },
  {
    id: 'path5',
    points: [
      { x: 120, y: 200 },
      { x: 250, y: 290 },
      { x: 400, y: 305 },
      { x: 550, y: 290 },
      { x: 680, y: 200 },
    ],
    cost: '$9.1k',
    time: '4ms',
    labelPos: { x: 400, y: 322 },
    isOptimal: false,
    isRejected: true,
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
  const isInView = useInView(containerRef, { once: false, margin: '-100px' })
  const [phase, setPhase] = useState<'idle' | 'searching' | 'converged'>('idle')
  const [activePathIndex, setActivePathIndex] = useState(-1)
  const [exploredPaths, setExploredPaths] = useState<number[]>([])
  const [statusText, setStatusText] = useState('initializing')
  const [showCapExceeded, setShowCapExceeded] = useState(false)

  useEffect(() => {
    if (!isInView) return

    const runAnimation = () => {
      // Reset
      setPhase('idle')
      setActivePathIndex(-1)
      setExploredPaths([])
      setStatusText('initializing')
      setShowCapExceeded(false)

      // Start searching
      setTimeout(() => {
        setPhase('searching')
        setStatusText('computing_paths')
      }, 500)

      // Explore paths one by one - explore blue paths first, then rejected red, then optimal bronze
      const pathOrder = [0, 1, 3, 4, 2] // Top, upper-mid, lower-mid, bottom (rejected), then optimal
      pathOrder.forEach((pathIdx, i) => {
        setTimeout(
          () => {
            setActivePathIndex(pathIdx)
            setExploredPaths((prev) => [...prev, pathIdx])

            // Show CAP_EXCEEDED when hitting the rejected path
            if (paths[pathIdx].isRejected) {
              setShowCapExceeded(true)
            }

            // Converge on optimal
            if (paths[pathIdx].isOptimal) {
              setStatusText('optimal_found')
              setPhase('converged')
            }
          },
          1500 + i * 1000
        )
      })
    }

    runAnimation()
    const interval = setInterval(runAnimation, 10000)
    return () => clearInterval(interval)
  }, [isInView])

  const getPathColor = (path: PathData, index: number) => {
    const isExplored = exploredPaths.includes(index)
    const isActive = activePathIndex === index
    const isOptimalAndConverged = path.isOptimal && phase === 'converged'

    if (isOptimalAndConverged) return '#b8935a' // Bronze for optimal
    if (path.isRejected && isExplored) return '#ef4444' // Red for rejected
    if (isExplored || isActive) return '#3b82f6' // Blue for explored
    return 'rgba(255,255,255,0.1)' // Dim for unexplored
  }

  const getNodeColor = (path: PathData, index: number) => {
    const isExplored = exploredPaths.includes(index)
    const isOptimalAndConverged = path.isOptimal && phase === 'converged'

    if (isOptimalAndConverged) return '#b8935a'
    if (path.isRejected && isExplored) return '#ef4444'
    if (isExplored) return '#3b82f6'
    return 'rgba(255,255,255,0.2)'
  }

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
            <filter id="glowBronze" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Glow filter for blue paths */}
            <filter id="glowBlue" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Glow filter for red paths */}
            <filter id="glowRed" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background grid */}
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* All paths */}
          {paths.map((path, index) => {
            const pathD = createSmoothPath(path.points)
            const isActive = activePathIndex === index
            const isExplored = exploredPaths.includes(index)
            const isOptimalAndConverged = path.isOptimal && phase === 'converged'
            const shouldFade = phase === 'converged' && !path.isOptimal
            const pathColor = getPathColor(path, index)

            const getFilter = () => {
              if (isOptimalAndConverged) return 'url(#glowBronze)'
              if (path.isRejected && isExplored) return 'url(#glowRed)'
              if (isActive || (isExplored && !shouldFade)) return 'url(#glowBlue)'
              return 'none'
            }

            return (
              <g key={path.id}>
                {/* Base path */}
                <motion.path
                  d={pathD}
                  fill="none"
                  stroke={pathColor}
                  strokeWidth={isOptimalAndConverged ? 3 : isExplored || isActive ? 2.5 : 1.5}
                  strokeDasharray={isOptimalAndConverged || isExplored ? 'none' : '6 4'}
                  filter={getFilter()}
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{
                    opacity: shouldFade
                      ? 0.25
                      : isActive || isExplored || phase === 'idle'
                        ? 1
                        : 0.3,
                    pathLength: 1,
                  }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />

                {/* Animated traveling dot for active path during exploration */}
                {isActive && phase === 'searching' && (
                  <motion.circle
                    r="8"
                    fill={path.isRejected ? '#ef4444' : '#3b82f6'}
                    filter={path.isRejected ? 'url(#glowRed)' : 'url(#glowBlue)'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 0.9, times: [0, 0.1, 0.8, 1] }}
                  >
                    <animateMotion dur="0.9s" repeatCount="1" path={pathD} />
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
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    filter="url(#glowBronze)"
                  />
                )}

                {/* Cost label */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: shouldFade
                      ? 0.3
                      : isActive || isExplored || isOptimalAndConverged
                        ? 1
                        : 0.4,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <rect
                    x={path.labelPos.x - 32}
                    y={path.labelPos.y - 10}
                    width={64}
                    height={20}
                    rx={4}
                    fill={
                      isOptimalAndConverged
                        ? 'rgba(184,147,90,0.2)'
                        : path.isRejected && isExplored
                          ? 'rgba(239,68,68,0.15)'
                          : 'rgba(0,0,0,0.7)'
                    }
                    stroke={
                      isOptimalAndConverged
                        ? '#b8935a'
                        : path.isRejected && isExplored
                          ? '#ef4444'
                          : isExplored
                            ? '#3b82f6'
                            : 'rgba(255,255,255,0.1)'
                    }
                    strokeWidth={1}
                  />
                  <text
                    x={path.labelPos.x}
                    y={path.labelPos.y + 4}
                    textAnchor="middle"
                    className="font-mono text-[10px]"
                    fill={
                      isOptimalAndConverged
                        ? '#b8935a'
                        : path.isRejected && isExplored
                          ? '#ef4444'
                          : isExplored
                            ? '#3b82f6'
                            : 'rgba(255,255,255,0.5)'
                    }
                  >
                    Cst: {path.cost}
                  </text>
                </motion.g>

                {/* Time label for explored paths */}
                {path.time && isExplored && !path.isRejected && (
                  <motion.g
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: shouldFade ? 0.3 : 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <rect
                      x={path.labelPos.x + 75}
                      y={path.labelPos.y - 10}
                      width={55}
                      height={20}
                      rx={4}
                      fill={isOptimalAndConverged ? 'rgba(184,147,90,0.15)' : 'rgba(0,0,0,0.7)'}
                      stroke={
                        isOptimalAndConverged ? 'rgba(184,147,90,0.4)' : 'rgba(59,130,246,0.3)'
                      }
                      strokeWidth={1}
                    />
                    <text
                      x={path.labelPos.x + 102}
                      y={path.labelPos.y + 4}
                      textAnchor="middle"
                      className="font-mono text-[10px]"
                      fill={isOptimalAndConverged ? '#b8935a' : '#3b82f6'}
                    >
                      Tm: {path.time}
                    </text>
                  </motion.g>
                )}

                {/* Swap label for path2 */}
                {path.swap && isExplored && (
                  <motion.g
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: shouldFade ? 0.3 : 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <rect
                      x={path.labelPos.x + 45}
                      y={path.labelPos.y + 15}
                      width={50}
                      height={18}
                      rx={4}
                      fill="rgba(0,0,0,0.7)"
                      stroke="rgba(59,130,246,0.3)"
                      strokeWidth={1}
                    />
                    <text
                      x={path.labelPos.x + 70}
                      y={path.labelPos.y + 27}
                      textAnchor="middle"
                      className="font-mono text-[9px]"
                      fill="#3b82f6"
                    >
                      Sw: {path.swap}
                    </text>
                  </motion.g>
                )}

                {/* Loss label for optimal path when converged */}
                {path.loss && isOptimalAndConverged && (
                  <motion.g
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <rect
                      x={path.labelPos.x + 140}
                      y={path.labelPos.y - 10}
                      width={60}
                      height={20}
                      rx={4}
                      fill="rgba(184,147,90,0.15)"
                      stroke="rgba(184,147,90,0.4)"
                      strokeWidth={1}
                    />
                    <text
                      x={path.labelPos.x + 170}
                      y={path.labelPos.y + 4}
                      textAnchor="middle"
                      className="font-mono text-[10px]"
                      fill="#b8935a"
                    >
                      Ls: {path.loss}
                    </text>
                  </motion.g>
                )}
              </g>
            )
          })}

          {/* CAP_EXCEEDED error box */}
          {showCapExceeded && (
            <motion.g
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <rect
                x={340}
                y={340}
                width={120}
                height={28}
                rx={4}
                fill="rgba(239,68,68,0.2)"
                stroke="#ef4444"
                strokeWidth={1.5}
              />
              <text
                x={400}
                y={358}
                textAnchor="middle"
                className="font-mono text-[11px] font-medium"
                fill="#ef4444"
              >
                ! CAP_EXCEEDED
              </text>
            </motion.g>
          )}

          {/* Input node - Raw Problem (WHITE) */}
          <g>
            <motion.circle
              cx={80}
              cy={200}
              r={35}
              fill="#0c0c12"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={2}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
            <motion.circle
              cx={80}
              cy={200}
              r={25}
              fill="rgba(255,255,255,0.08)"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={1}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
            {/* Inner ring detail */}
            <motion.circle
              cx={80}
              cy={200}
              r={15}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={1}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            />
            <motion.text
              x={80}
              y={255}
              textAnchor="middle"
              className="font-mono text-sm font-medium"
              fill="white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Raw Problem
            </motion.text>
            <motion.text
              x={80}
              y={273}
              textAnchor="middle"
              className="font-mono text-[10px]"
              fill="rgba(255,255,255,0.5)"
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
              stroke={phase === 'converged' ? '#b8935a' : 'rgba(255,255,255,0.3)'}
              strokeWidth={2}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              filter={phase === 'converged' ? 'url(#glowBronze)' : 'none'}
            />
            {/* Play icon */}
            <motion.path
              d="M 712 190 L 732 200 L 712 210 Z"
              fill={phase === 'converged' ? '#b8935a' : 'rgba(255,255,255,0.4)'}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            />
            <motion.text
              x={720}
              y={255}
              textAnchor="middle"
              className="font-mono text-sm font-medium"
              fill={phase === 'converged' ? '#b8935a' : 'white'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Optimal Decision
            </motion.text>
            <motion.text
              x={720}
              y={273}
              textAnchor="middle"
              className="font-mono text-[10px]"
              fill={phase === 'converged' ? 'rgba(184,147,90,0.7)' : 'rgba(255,255,255,0.5)'}
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'converged' ? 1 : 0.5 }}
              transition={{ delay: 0.5 }}
            >
              Conf: 99.9%
            </motion.text>
          </g>

          {/* Intermediate nodes on paths */}
          {paths.map((path, pathIndex) =>
            path.points.slice(1, -1).map((point, idx) => {
              const nodeColor = getNodeColor(path, pathIndex)
              const isExplored = exploredPaths.includes(pathIndex)
              const shouldFade = phase === 'converged' && !path.isOptimal

              return (
                <motion.circle
                  key={`${path.id}-node-${idx}`}
                  cx={point.x}
                  cy={point.y}
                  r={5}
                  fill={nodeColor}
                  stroke={
                    path.isOptimal && phase === 'converged'
                      ? '#b8935a'
                      : path.isRejected && isExplored
                        ? '#ef4444'
                        : isExplored
                          ? '#3b82f6'
                          : 'rgba(255,255,255,0.1)'
                  }
                  strokeWidth={1}
                  initial={{ scale: 0 }}
                  animate={{
                    scale: 1,
                    opacity: shouldFade ? 0.3 : 1,
                  }}
                  transition={{ duration: 0.3, delay: 0.5 + idx * 0.08 }}
                />
              )
            })
          )}
        </svg>
      </div>
    </div>
  )
}
