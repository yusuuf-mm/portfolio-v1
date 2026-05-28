'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Cpu,
  Database,
  Activity,
  ChevronRight,
  Lock,
  Unlock,
} from 'lucide-react'

// ============================================================================
// Types & Constants
// ============================================================================

type SolverState = 'idle' | 'exploring' | 'violation' | 'converged'
type PathType = 'none' | 'blue' | 'red' | 'bronze'

const COLORS = {
  bg: '#0c0c0e',
  blue: '#3b82f6',
  blueGlow: 'rgba(59, 130, 246, 0.3)',
  red: '#ef4444',
  redGlow: 'rgba(239, 68, 68, 0.4)',
  bronze: '#d97706', // amber-600
  bronzeGlow: 'rgba(217, 119, 6, 0.45)',
  textMuted: '#6b7280',
  border: 'rgba(255, 255, 255, 0.06)',
}

// Log history template for Card 1
const LOG_HISTORY_TEMPLATES = [
  'Initializing Pyomo partition solver...',
  'Ingesting high-dimensional constraint vectors...',
  'LLM-heuristic parsing: node x₁ > 0 proposed.',
  'Claude API prompt token count: 1,420 | lat: 154ms',
  'Real-time inference latency: 98ms (P99).',
  'Agentic worker: evaluating continuous relaxation bounds.',
  'Branch-and-Bound: sub-agent generated branch node #428.',
  'Gemini Pro inference: latency 182ms | decision threshold met.',
  'Orchestrating adaptive constraint feedback loop...',
  'Sub-agent status: heuristic optimization successful.',
  'Resolving boundary conditions for sub-problem #14.',
  'Pruning branch: node bound exceeding optimal objective.',
]

// ============================================================================
// Main Component
// ============================================================================

export default function WhatIBuild() {
  // Global States
  const [solverState, setSolverState] = useState<SolverState>('idle')
  const [activePathType, setActivePathType] = useState<PathType>('none')
  const [interactive, setInteractive] = useState(false)

  // Hover States for Bidirectional Synchronization
  const [hoveredPath, setHoveredPath] = useState<PathType>('none')
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null)

  // Live Telemetry States
  const [logs, setLogs] = useState<string[]>([
    `[04:16:13] [INIT] Pyomo solver pipeline active`,
    `[04:16:14] [ORCH] Ingesting high-dimensional matrices`,
    `[04:16:14] [LLM] Heuristic: node x₁ > 0 suggested`,
    `[04:16:15] [API] Claude token: 1.4k | lat: 142ms`,
  ])
  const [solverStats, setSolverStats] = useState({
    obj: '1,402.00',
    gap: '0.00%',
    nodes: '1,248',
    constraints: '84 / 120',
    simplexIter: 14820,
    pivots: 12,
  })

  // Determine active visual state (merges animation and hover states)
  const currentPathType = useMemo<PathType>(() => {
    if (hoveredPath !== 'none') return hoveredPath
    if (hoveredCardIndex === 0) return 'blue'
    if (hoveredCardIndex === 1) return 'bronze'
    if (hoveredCardIndex === 2) return 'red'
    return activePathType
  }, [hoveredPath, hoveredCardIndex, activePathType])

  const currentSolverState = useMemo<SolverState>(() => {
    if (hoveredPath === 'blue' || hoveredCardIndex === 0) return 'exploring'
    if (hoveredPath === 'bronze' || hoveredCardIndex === 1) return 'converged'
    if (hoveredPath === 'red' || hoveredCardIndex === 2) return 'violation'
    return solverState
  }, [hoveredPath, hoveredCardIndex, solverState])

  // --------------------------------------------------------------------------
  // Auto-loop Solver Animation Sequence (when not interactive)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (interactive) return

    let timer: NodeJS.Timeout
    const runSequence = () => {
      // 1. Exploration Phase (Blue Paths)
      setSolverState('exploring')
      setActivePathType('blue')

      // 2. Violation Phase (Red Path)
      timer = setTimeout(() => {
        setSolverState('violation')
        setActivePathType('red')

        // 3. Convergence Phase (Bronze Path)
        timer = setTimeout(() => {
          setSolverState('converged')
          setActivePathType('bronze')

          // 4. Idle / Hold State
          timer = setTimeout(() => {
            setSolverState('idle')
            setActivePathType('none')
          }, 4500)
        }, 3200)
      }, 4200)
    }

    runSequence()
    const interval = setInterval(runSequence, 13000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [interactive])

  // --------------------------------------------------------------------------
  // Card 1 Live Readout logs generator
  // --------------------------------------------------------------------------
  useEffect(() => {
    let index = 0

    const interval = setInterval(() => {
      const now = new Date()
      const timeStr = now.toTimeString().split(' ')[0]
      const nextLogTemplate = LOG_HISTORY_TEMPLATES[index % LOG_HISTORY_TEMPLATES.length]

      setLogs((prev) => {
        const nextLogs = [...prev, `[${timeStr}] [SYS] ${nextLogTemplate}`]
        if (nextLogs.length > 5) nextLogs.shift()
        return nextLogs
      })
      index++
    }, 1800)

    return () => clearInterval(interval)
  }, [])

  // --------------------------------------------------------------------------
  // Card 2 Live Readout solver variables fluctuator
  // --------------------------------------------------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      setSolverStats((prev) => {
        // Base values change based on the active path type
        let objVal = '1,402.00'
        let gapVal = '0.00%'
        let nodeVal = '1,248'
        let constraintVal = '84 / 120'
        let pivotVal = 12

        if (currentPathType === 'blue') {
          objVal = (7100 + Math.random() * 200).toFixed(2)
          gapVal = (4.15 + Math.random() * 0.2).toFixed(2) + '%'
          nodeVal = Math.floor(820 + Math.random() * 50).toString()
          constraintVal = '68 / 120'
          pivotVal = Math.floor(6 + Math.random() * 4)
        } else if (currentPathType === 'red') {
          objVal = '6,800.00'
          gapVal = 'N/A'
          nodeVal = '512'
          constraintVal = 'Violated'
          pivotVal = 0
        } else if (currentPathType === 'none') {
          objVal = '--'
          gapVal = '--'
          nodeVal = '--'
          constraintVal = '--'
          pivotVal = 0
        }

        return {
          obj: objVal,
          gap: gapVal,
          nodes: nodeVal,
          constraints: constraintVal,
          simplexIter: prev.simplexIter + Math.floor(Math.random() * 12),
          pivots: pivotVal,
        }
      })
    }, 800)

    return () => clearInterval(interval)
  }, [currentPathType])

  // Reset interactive overrides
  const resetHoverStates = () => {
    setHoveredPath('none')
  }

  return (
    <section
      id="build"
      className="py-24 lg:py-32 bg-[#08090c] relative overflow-hidden select-none"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-16 relative z-10">
        {/* Monospace Eyebrow & Title Banner */}
        <div className="flex flex-col gap-4 mb-12">
          <motion.span
            className="font-mono text-sm text-amber-600/90 tracking-widest flex items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-amber-500">{'\u276F'}</span> yusuf.sys ~ capabilities
          </motion.span>

          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h2 className="font-serif text-3xl lg:text-5xl text-neutral-100 tracking-tight leading-tight max-w-3xl text-balance">
              Integer Programming Solution Explorer
            </h2>
            <p className="font-sans text-sm lg:text-base text-neutral-400 max-w-xl">
              Search through non-convex feasibility space
            </p>
          </motion.div>
        </div>

        {/* ====================================================================
            DOUBLE-BEZEL GRAPH CONTAINER
            ==================================================================== */}
        <div className="mb-16 p-1.5 bg-white/[0.02] border border-white/[0.06] rounded-[2rem] shadow-2xl">
          <div className="bg-[#0c0c0e] rounded-[calc(2rem-6px)] overflow-hidden border border-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]">
            {/* Solver Sub-Header / Control Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-4 border-b border-white/[0.05]">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] tracking-wide text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-600"></span>
                  process: <span className="text-neutral-200">Pyomo/Gurobi_v9</span>
                </span>
                <span className="text-neutral-700">|</span>
                <span className="flex items-center gap-2">
                  status:
                  <span
                    className={`font-semibold capitalize px-2 py-0.5 rounded-full text-[10px] ${
                      currentSolverState === 'converged'
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        : currentSolverState === 'violation'
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                          : currentSolverState === 'exploring'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {currentSolverState === 'converged'
                      ? 'optimal_found'
                      : currentSolverState === 'violation'
                        ? 'violation_detected'
                        : currentSolverState === 'exploring'
                          ? 'computing_paths'
                          : 'idle'}
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-5">
                <span className="font-mono text-[11px] text-neutral-400">
                  obj_func:{' '}
                  <span className="text-amber-500 font-semibold">
                    min(Z = &Sigma; c&#8322;&middot;x&#8322; + r&#8322;)
                  </span>
                </span>

                <button
                  onClick={() => {
                    setInteractive((prev) => !prev)
                    resetHoverStates()
                  }}
                  className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase px-3 py-1.5 rounded-full transition-all duration-300"
                  style={{
                    background: interactive ? 'rgba(217, 119, 6, 0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${interactive ? 'rgba(217, 119, 6, 0.4)' : 'rgba(255,255,255,0.08)'}`,
                    color: interactive ? '#d97706' : '#9ca3af',
                  }}
                >
                  {interactive ? (
                    <Unlock size={10} strokeWidth={2} />
                  ) : (
                    <Lock size={10} strokeWidth={2} />
                  )}
                  {interactive ? 'Interactive Mode' : 'Unlock Interactivity'}
                </button>
              </div>
            </div>

            {/* Interactive Mode Help Text */}
            <AnimatePresence>
              {interactive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-2.5 font-mono text-[10px] tracking-wide border-b border-white/[0.04] bg-white/[0.01]"
                >
                  <span className="text-neutral-500 font-semibold uppercase">Hover Paths:</span>
                  <span
                    className={`cursor-pointer transition-colors ${
                      hoveredPath === 'blue'
                        ? 'text-blue-400'
                        : 'text-neutral-400 hover:text-blue-300'
                    }`}
                    onMouseEnter={() => setHoveredPath('blue')}
                    onMouseLeave={resetHoverStates}
                  >
                    Relaxed Feasible &rarr; Blue
                  </span>
                  <span className="text-neutral-700">|</span>
                  <span
                    className={`cursor-pointer transition-colors ${
                      hoveredPath === 'red' ? 'text-red-400' : 'text-neutral-400 hover:text-red-300'
                    }`}
                    onMouseEnter={() => setHoveredPath('red')}
                    onMouseLeave={resetHoverStates}
                  >
                    Logic Violation &rarr; Red
                  </span>
                  <span className="text-neutral-700">|</span>
                  <span
                    className={`cursor-pointer transition-colors ${
                      hoveredPath === 'bronze'
                        ? 'text-amber-500'
                        : 'text-neutral-400 hover:text-amber-400'
                    }`}
                    onMouseEnter={() => setHoveredPath('bronze')}
                    onMouseLeave={resetHoverStates}
                  >
                    Optimal Winding IP &rarr; Bronze
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SVG Graph Canvas */}
            <div className="relative p-6 bg-[#0c0c0e]">
              <svg
                viewBox="0 0 800 400"
                className="w-full h-auto"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* Grid Pattern */}
                  <pattern id="dot-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
                    <circle cx="1.5" cy="1.5" r="1" fill="rgba(255,255,255,0.025)" />
                  </pattern>

                  {/* Path Glow Filters */}
                  <filter id="glowBlue" x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="glowRed" x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur stdDeviation="7" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="glowBronze" x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Draw Dot Grid */}
                <rect width="100%" height="100%" fill="url(#dot-pattern)" />

                {/* ====================================================================
                    POLYHEDRAL BOUNDARIES (Feasibility Space Bounded Regions)
                    ==================================================================== */}
                {/* Top Polygon */}
                <polygon
                  points="240,140 380,50 500,85 550,150 420,200 300,180"
                  fill="rgba(255,255,255,0.015)"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                <text
                  x="380"
                  y="85"
                  fill="rgba(255,255,255,0.15)"
                  fontSize="9"
                  textAnchor="middle"
                  className="font-mono tracking-wider"
                >
                  Feasibility Boundary (Upper)
                </text>

                {/* Bottom Polygon */}
                <polygon
                  points="250,260 400,220 540,240 600,300 480,350 320,330"
                  fill="rgba(255,255,255,0.015)"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                <text
                  x="440"
                  y="325"
                  fill="rgba(255,255,255,0.15)"
                  fontSize="9"
                  textAnchor="middle"
                  className="font-mono tracking-wider"
                >
                  Feasibility Boundary (Lower)
                </text>

                {/* ====================================================================
                    PATH DRAWING & FLOWS
                    ==================================================================== */}

                {/* 1. BLUE PATHS (Feasible Paths / Continuous Relaxed) */}
                {/* Path 1 (Top Blue) */}
                <motion.path
                  d="M 80 200 C 150 180, 220 160, 260 140 C 320 110, 380 70, 440 90 C 540 110, 620 150, 720 200"
                  fill="none"
                  stroke={currentPathType === 'blue' ? COLORS.blue : 'rgba(255,255,255,0.05)'}
                  strokeWidth={currentPathType === 'blue' ? 3 : 1.5}
                  filter={currentPathType === 'blue' ? 'url(#glowBlue)' : 'none'}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: currentSolverState !== 'idle' ? 1 : 0 }}
                  transition={{ duration: 2.2, ease: 'easeInOut' }}
                />

                {/* Path 2 (Middle Blue) */}
                <motion.path
                  d="M 80 200 C 150 180, 220 160, 270 180 C 340 220, 420 220, 480 180 C 580 150, 640 140, 720 200"
                  fill="none"
                  stroke={currentPathType === 'blue' ? COLORS.blue : 'rgba(255,255,255,0.05)'}
                  strokeWidth={currentPathType === 'blue' ? 3 : 1.5}
                  filter={currentPathType === 'blue' ? 'url(#glowBlue)' : 'none'}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: currentSolverState !== 'idle' ? 1 : 0 }}
                  transition={{ duration: 1.6, ease: 'easeOut' }}
                />

                {/* Path 3 (Bottom Blue) */}
                <motion.path
                  d="M 80 200 C 150 180, 220 160, 260 200 C 320 250, 380 270, 460 220 C 540 190, 620 180, 720 200"
                  fill="none"
                  stroke={currentPathType === 'blue' ? COLORS.blue : 'rgba(255,255,255,0.05)'}
                  strokeWidth={currentPathType === 'blue' ? 3 : 1.5}
                  filter={currentPathType === 'blue' ? 'url(#glowBlue)' : 'none'}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: currentSolverState !== 'idle' ? 1 : 0 }}
                  transition={{ duration: 2.8, ease: 'easeInOut' }}
                />

                {/* Interactive triggers for Blue Paths */}
                {interactive && (
                  <path
                    d="M 80 200 C 150 180, 220 160, 270 180 C 340 220, 420 220, 480 180 C 580 150, 640 140, 720 200"
                    fill="none"
                    stroke="transparent"
                    strokeWidth={20}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPath('blue')}
                    onMouseLeave={resetHoverStates}
                  />
                )}

                {/* 2. RED PATH (Logic Violation Shortcut) */}
                <motion.path
                  d="M 80 200 C 180 120, 300 100, 440 110"
                  fill="none"
                  stroke={currentPathType === 'red' ? COLORS.red : 'rgba(255,255,255,0.03)'}
                  strokeWidth={currentPathType === 'red' ? 3.5 : 1.5}
                  filter={currentPathType === 'red' ? 'url(#glowRed)' : 'none'}
                  initial={{ pathLength: 0 }}
                  animate={{
                    pathLength:
                      currentSolverState === 'violation' || currentSolverState === 'converged'
                        ? 1
                        : 0,
                  }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />

                {/* Interactive trigger for Red Path */}
                {interactive && (
                  <path
                    d="M 80 200 C 180 120, 300 100, 440 110"
                    fill="none"
                    stroke="transparent"
                    strokeWidth={20}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPath('red')}
                    onMouseLeave={resetHoverStates}
                  />
                )}

                {/* 3. BRONZE PATH (Optimal Valid IP Branch) */}
                <motion.path
                  d="M 80 200 C 120 220, 180 250, 220 290 C 280 340, 380 345, 480 330 C 580 315, 640 270, 720 200"
                  fill="none"
                  stroke={currentPathType === 'bronze' ? COLORS.bronze : 'rgba(255,255,255,0.03)'}
                  strokeWidth={currentPathType === 'bronze' ? 4 : 1.5}
                  filter={currentPathType === 'bronze' ? 'url(#glowBronze)' : 'none'}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: currentSolverState === 'converged' ? 1 : 0 }}
                  transition={{ duration: 2.2, ease: 'easeInOut' }}
                />

                {/* Interactive trigger for Bronze Path */}
                {interactive && (
                  <path
                    d="M 80 200 C 120 220, 180 250, 220 290 C 280 340, 380 345, 480 330 C 580 315, 640 270, 720 200"
                    fill="none"
                    stroke="transparent"
                    strokeWidth={20}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPath('bronze')}
                    onMouseLeave={resetHoverStates}
                  />
                )}

                {/* ====================================================================
                    REAL-TIME GLOWING DOTS (FLOW INDICATORS)
                    ==================================================================== */}
                {/* Blue Flows */}
                {currentSolverState === 'exploring' && (
                  <>
                    <motion.circle r="4" fill="#60a5fa" filter="url(#glowBlue)">
                      <animateMotion
                        dur="2.2s"
                        repeatCount="Infinity"
                        path="M 80 200 C 150 180, 220 160, 260 140 C 320 110, 380 70, 440 90 C 540 110, 620 150, 720 200"
                      />
                    </motion.circle>
                    <motion.circle r="4" fill="#60a5fa" filter="url(#glowBlue)">
                      <animateMotion
                        dur="1.6s"
                        repeatCount="Infinity"
                        path="M 80 200 C 150 180, 220 160, 270 180 C 340 220, 420 220, 480 180 C 580 150, 640 140, 720 200"
                      />
                    </motion.circle>
                    <motion.circle r="4" fill="#60a5fa" filter="url(#glowBlue)">
                      <animateMotion
                        dur="2.8s"
                        repeatCount="Infinity"
                        path="M 80 200 C 150 180, 220 160, 260 200 C 320 250, 380 270, 460 220 C 540 190, 620 180, 720 200"
                      />
                    </motion.circle>
                  </>
                )}

                {/* Red Flow */}
                {currentSolverState === 'violation' && (
                  <motion.circle r="5" fill="#f87171" filter="url(#glowRed)">
                    <animateMotion
                      dur="1.2s"
                      repeatCount="Infinity"
                      path="M 80 200 C 180 120, 300 100, 440 110"
                    />
                  </motion.circle>
                )}

                {/* Bronze Flow */}
                {currentSolverState === 'converged' && (
                  <motion.circle r="5" fill="#fbbf24" filter="url(#glowBronze)">
                    <animateMotion
                      dur="2.2s"
                      repeatCount="Infinity"
                      path="M 80 200 C 120 220, 180 250, 220 290 C 280 340, 380 345, 480 330 C 580 315, 640 270, 720 200"
                    />
                  </motion.circle>
                )}

                {/* ====================================================================
                    PATH LABELS / METRICS OVERLAYS
                    ==================================================================== */}

                {/* 1. BLUE PATH METRICS (Show only when active/exploring) */}
                {currentPathType === 'blue' && (
                  <g className="pointer-events-none">
                    {/* Path 1 Label */}
                    <foreignObject x="270" y="55" width="130" height="38">
                      <div className="bg-[#0c0c0e]/90 border border-blue-500/20 text-blue-400 font-mono text-[9px] p-1.5 rounded shadow-lg backdrop-blur-sm">
                        <div>Cst ($): $9.2k</div>
                        <div>Risk (r): 0.11</div>
                      </div>
                    </foreignObject>

                    {/* Path 2 Label */}
                    <foreignObject x="340" y="210" width="130" height="38">
                      <div className="bg-[#0c0c0e]/90 border border-blue-500/20 text-blue-400 font-mono text-[9px] p-1.5 rounded shadow-lg backdrop-blur-sm">
                        <div>Cst ($): $7.1k</div>
                        <div>Risk (r): 0.05</div>
                      </div>
                    </foreignObject>

                    {/* Path 3 Label */}
                    <foreignObject x="280" y="260" width="130" height="38">
                      <div className="bg-[#0c0c0e]/90 border border-blue-500/20 text-blue-400 font-mono text-[9px] p-1.5 rounded shadow-lg backdrop-blur-sm">
                        <div>Cst ($): $11.3k</div>
                        <div>Risk (r): 0.02</div>
                      </div>
                    </foreignObject>

                    {/* General Feasibility space label */}
                    <text
                      x="440"
                      y="150"
                      fill="rgba(96,165,250,0.8)"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="font-mono tracking-wider"
                    >
                      Feasible Path (Continuous Relaxed)
                    </text>
                  </g>
                )}

                {/* 2. RED PATH METRIC (Show when active/violated) */}
                {currentPathType === 'red' && (
                  <g className="pointer-events-none">
                    {/* Metric label */}
                    <foreignObject x="200" y="100" width="120" height="38">
                      <div className="bg-[#0c0c0e]/90 border border-red-500/20 text-red-400 font-mono text-[9px] p-1.5 rounded shadow-lg backdrop-blur-sm">
                        <div>Cst ($): $6.8k</div>
                        <div>Risk (r): 0.23</div>
                      </div>
                    </foreignObject>
                  </g>
                )}

                {/* 3. BRONZE PATH METRICS (Show when active/converged) */}
                {currentPathType === 'bronze' && (
                  <g className="pointer-events-none">
                    {/* Segment 1 Divergence label */}
                    <foreignObject x="130" y="265" width="110" height="24">
                      <div className="bg-[#0c0c0e]/90 border border-amber-600/20 text-amber-500 font-mono text-[9px] px-1.5 py-0.5 rounded shadow-lg text-center backdrop-blur-sm">
                        Branching (x₁): &gt;0
                      </div>
                    </foreignObject>

                    {/* Segment 2 Midpoint label */}
                    <foreignObject x="310" y="352" width="140" height="38">
                      <div className="bg-[#0c0c0e]/90 border border-amber-600/20 text-amber-500 font-mono text-[9px] p-1.5 rounded shadow-lg backdrop-blur-sm">
                        <div>Cst ($): $8.4k | Risk (r): 0.01</div>
                        <div className="text-[8px] text-amber-500/70">Total Obj: 8,401</div>
                      </div>
                    </foreignObject>

                    {/* Segment 3 Final Link label */}
                    <foreignObject x="540" y="295" width="120" height="24">
                      <div className="bg-[#0c0c0e]/90 border border-amber-600/20 text-amber-500 font-mono text-[9px] px-1.5 py-0.5 rounded shadow-lg text-center backdrop-blur-sm">
                        Constraint Satisfied
                      </div>
                    </foreignObject>

                    {/* General path indicator */}
                    <text
                      x="440"
                      y="280"
                      fill="rgba(217,119,6,0.8)"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="font-mono tracking-wider animate-pulse"
                    >
                      Valid IP Branch
                    </text>
                  </g>
                )}

                {/* ====================================================================
                    INTERMEDIATE NODES
                    ==================================================================== */}
                {/* Logic Violation Node (Red Target) */}
                <g>
                  <circle
                    cx="440"
                    cy="110"
                    r={currentSolverState === 'violation' ? '8' : '5'}
                    fill={currentSolverState === 'violation' ? COLORS.red : 'rgba(255,255,255,0.1)'}
                    stroke={
                      currentSolverState === 'violation' ? '#f87171' : 'rgba(255,255,255,0.2)'
                    }
                    strokeWidth="1.5"
                    className="transition-all duration-300"
                  />
                  {currentSolverState === 'violation' && (
                    <circle
                      cx="440"
                      cy="110"
                      r="16"
                      fill="none"
                      stroke={COLORS.red}
                      strokeWidth="1"
                      className="animate-ping"
                    />
                  )}
                </g>

                {/* Interactive Intersection nodes */}
                <circle cx="220" cy="160" r="4" fill="rgba(255,255,255,0.2)" />
                <circle cx="480" cy="180" r="4" fill="rgba(255,255,255,0.2)" />

                {/* ====================================================================
                    START NODE (Left: Raw Problem)
                    ==================================================================== */}
                <g className="cursor-pointer">
                  {/* Focus Glow */}
                  {currentSolverState === 'exploring' && (
                    <circle
                      cx="80"
                      cy="200"
                      r="40"
                      fill="none"
                      stroke="rgba(59,130,246,0.4)"
                      strokeWidth="1.5"
                      className="animate-pulse"
                    />
                  )}
                  {/* Outer circle */}
                  <circle
                    cx="80"
                    cy="200"
                    r="32"
                    fill={COLORS.bg}
                    stroke={
                      currentSolverState === 'exploring' ? COLORS.blue : 'rgba(255,255,255,0.15)'
                    }
                    strokeWidth="1.5"
                    className="transition-all duration-300"
                  />
                  {/* Inner Ring */}
                  <circle
                    cx="80"
                    cy="200"
                    r="22"
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="1"
                  />

                  {/* Solver symbol */}
                  <foreignObject x="68" y="188" width="24" height="24">
                    <Activity
                      size={24}
                      className={
                        currentSolverState === 'exploring' ? 'text-blue-400' : 'text-neutral-500'
                      }
                      strokeWidth={1}
                    />
                  </foreignObject>

                  {/* Metadata labels */}
                  <text
                    x="80"
                    y="252"
                    fill="rgba(255,255,255,0.85)"
                    fontSize="11"
                    textAnchor="middle"
                    className="font-mono font-medium tracking-wide"
                  >
                    Raw Problem (IP)
                  </text>
                  <text
                    x="80"
                    y="268"
                    fill="rgba(255,255,255,0.4)"
                    fontSize="9"
                    textAnchor="middle"
                    className="font-mono tracking-normal"
                  >
                    Nodes: 1.2k | Integer Constraints
                  </text>
                </g>

                {/* ====================================================================
                    DESTINATION NODE (Right: Optimal Decision)
                    ==================================================================== */}
                <g>
                  {/* Focus Glow */}
                  {currentSolverState === 'converged' && (
                    <circle
                      cx="720"
                      cy="200"
                      r="42"
                      fill="none"
                      stroke="rgba(217,119,6,0.5)"
                      strokeWidth="2"
                      className="animate-ping"
                      style={{ animationDuration: '3s' }}
                    />
                  )}
                  {/* Outer circle */}
                  <circle
                    cx="720"
                    cy="200"
                    r="32"
                    fill={currentSolverState === 'converged' ? 'rgba(217,119,6,0.08)' : COLORS.bg}
                    stroke={
                      currentSolverState === 'converged' ? COLORS.bronze : 'rgba(255,255,255,0.15)'
                    }
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />
                  {/* Inner Ring */}
                  <circle
                    cx="720"
                    cy="200"
                    r="22"
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="1"
                  />

                  {/* Target Node Icon */}
                  <foreignObject x="708" y="188" width="24" height="24">
                    <CheckCircle2
                      size={24}
                      className={
                        currentSolverState === 'converged' ? 'text-amber-500' : 'text-neutral-500'
                      }
                      strokeWidth={1}
                    />
                  </foreignObject>

                  {/* Metadata labels */}
                  <text
                    x="720"
                    y="252"
                    fill={currentSolverState === 'converged' ? '#fbbf24' : 'rgba(255,255,255,0.85)'}
                    fontSize="11"
                    textAnchor="middle"
                    className="font-mono font-medium tracking-wide transition-colors duration-300"
                  >
                    Optimal Integer Decision
                  </text>
                  <text
                    x="720"
                    y="268"
                    fill={
                      currentSolverState === 'converged'
                        ? 'rgba(251,191,36,0.7)'
                        : 'rgba(255,255,255,0.4)'
                    }
                    fontSize="9"
                    textAnchor="middle"
                    className="font-mono tracking-normal transition-colors duration-300"
                  >
                    Obj Value: 1,402
                  </text>
                </g>

                {/* ====================================================================
                    LOGIC VIOLATION ERROR PILL OVERLAY
                    ==================================================================== */}
                <g>
                  {currentSolverState === 'violation' && (
                    <motion.g
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      {/* Anchor connector line */}
                      <line
                        x1="440"
                        y1="110"
                        x2="440"
                        y2="50"
                        stroke="#ef4444"
                        strokeWidth="1"
                        strokeDasharray="3,3"
                      />

                      {/* Pill container */}
                      <foreignObject x="340" y="8" width="200" height="52">
                        <div className="bg-[#180a0a] border border-red-500/40 text-red-500 rounded-lg p-2 shadow-2xl text-center shadow-red-950/30">
                          <div className="font-mono text-[10px] font-bold tracking-widest flex items-center justify-center gap-1.5">
                            <AlertTriangle size={11} strokeWidth={2} /> ! LOGIC_VIOLATION
                          </div>
                          <div className="font-sans text-[8.5px] text-red-400/90 tracking-wide mt-0.5">
                            Integer rounding error detected
                          </div>
                        </div>
                      </foreignObject>
                    </motion.g>
                  )}
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* ====================================================================
            BOTTOM BENTO PANEL: CORE SYSTEMS ARCHITECTURE
            ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CARD 1: AGENTIC WORKFLOWS */}
          <div
            className={`p-[1px] bg-gradient-to-b from-white/10 to-white/[0.02] border border-white/[0.08] rounded-[2rem] shadow-2xl transition-all duration-300 ${
              currentPathType === 'blue'
                ? 'ring-1 ring-blue-500/30 border-blue-500/20 bg-blue-500/[0.02] shadow-[0_0_20px_rgba(59,130,246,0.15)] scale-[1.01]'
                : currentPathType === 'red'
                  ? 'opacity-40 scale-[0.98]'
                  : ''
            }`}
            onMouseEnter={() => interactive && setHoveredPath('blue')}
            onMouseLeave={resetHoverStates}
          >
            <div className="p-6 lg:p-8 bg-[#0c0c0e]/95 rounded-[calc(2rem-1px)] h-full flex flex-col justify-between border border-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]">
              <div className="flex flex-col gap-4">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Terminal size={18} strokeWidth={1.2} />
                  </div>
                  <span className="font-mono text-[9px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                    AI LAYER
                  </span>
                </div>

                {/* Text Copy */}
                <div>
                  <h3 className="font-mono text-xs font-semibold text-neutral-200 tracking-wider uppercase mb-2">
                    AGENTIC WORKFLOWS & REAL-TIME INFERENCE ENGINE
                  </h3>
                  <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                    Integrating AI models into production systems as decision-making engines
                    embedded in real workflows, not demos.
                  </p>
                </div>

                {/* Live Readout: Terminal logs stream */}
                <div className="mt-2 bg-black/50 border border-white/[0.04] p-3 rounded-lg h-32 overflow-hidden flex flex-col justify-end gap-1.5 font-mono text-[9px] leading-relaxed select-text">
                  <div className="text-neutral-500 border-b border-white/[0.04] pb-1 mb-1 flex items-center justify-between">
                    <span>AGENT_ORCHESTRATOR_CONSOLE</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                  </div>
                  {logs.map((log, idx) => (
                    <div
                      key={idx}
                      className="whitespace-nowrap overflow-hidden text-ellipsis text-blue-400/90"
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Pill Grid */}
              <div className="flex flex-wrap gap-1.5 pt-4 mt-6 border-t border-white/[0.04]">
                {['Claude API', 'Gemini', 'HuggingFace', 'LangChain', 'Python'].map((pill) => (
                  <span
                    key={pill}
                    className="font-mono text-[9px] px-2 py-0.5 rounded bg-blue-500/5 border border-blue-500/15 text-blue-400/80"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CARD 2: MATHEMATICAL SOLVER */}
          <div
            className={`p-[1px] bg-gradient-to-b from-white/10 to-white/[0.02] border border-white/[0.08] rounded-[2rem] shadow-2xl transition-all duration-300 ${
              currentPathType === 'bronze'
                ? 'ring-1 ring-amber-600/30 border-amber-600/20 bg-amber-600/[0.02] shadow-[0_0_25px_rgba(217,119,6,0.25)] scale-[1.01]'
                : currentPathType === 'red'
                  ? 'opacity-40 scale-[0.98]'
                  : ''
            }`}
            onMouseEnter={() => interactive && setHoveredPath('bronze')}
            onMouseLeave={resetHoverStates}
          >
            <div className="p-6 lg:p-8 bg-[#0c0c0e]/95 rounded-[calc(2rem-1px)] h-full flex flex-col justify-between border border-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]">
              <div className="flex flex-col gap-4">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <Cpu size={18} strokeWidth={1.2} />
                  </div>
                  <span className="font-mono text-[9px] text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                    OPTIMIZATION
                  </span>
                </div>

                {/* Text Copy */}
                <div>
                  <h3 className="font-mono text-xs font-semibold text-neutral-200 tracking-wider uppercase mb-2">
                    MATHEMATICAL SOLVER & PRESCRIPTIVE ANALYTICS
                  </h3>
                  <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                    Building mathematical models that prescribe the best action, not just predict,
                    utilizing operations research.
                  </p>
                </div>

                {/* Live Readout: Optimization states grid */}
                <div className="mt-2 bg-black/50 border border-white/[0.04] p-3 rounded-lg h-32 flex flex-col justify-between font-mono text-[9px]">
                  <div className="text-neutral-500 border-b border-white/[0.04] pb-1 flex items-center justify-between">
                    <span>SOLVER_TELEMETRY_STREAM</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 py-1 text-neutral-300">
                    <div className="flex justify-between border-b border-white/[0.02] pb-0.5">
                      <span className="text-neutral-500">OBJ_Z:</span>
                      <span className="text-amber-500 font-semibold">{solverStats.obj}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/[0.02] pb-0.5">
                      <span className="text-neutral-500">GAP:</span>
                      <span className="text-amber-500 font-semibold">{solverStats.gap}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/[0.02] pb-0.5">
                      <span className="text-neutral-500">NODES:</span>
                      <span className="text-neutral-200">{solverStats.nodes}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/[0.02] pb-0.5">
                      <span className="text-neutral-500">CONSTR:</span>
                      <span className="text-neutral-200">{solverStats.constraints}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">PIVOTS:</span>
                      <span className="text-neutral-200">{solverStats.pivots}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">ITER:</span>
                      <span className="text-neutral-200">{solverStats.simplexIter}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tech Pill Grid */}
              <div className="flex flex-wrap gap-1.5 pt-4 mt-6 border-t border-white/[0.04]">
                {['OR-Tools', 'PuLP', 'PyTorch', 'SciPy', 'Pyomo'].map((pill) => (
                  <span
                    key={pill}
                    className="font-mono text-[9px] px-2 py-0.5 rounded bg-amber-500/5 border border-amber-500/15 text-amber-500/80"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CARD 3: FULL-STACK INFRASTRUCTURE */}
          <div
            className={`p-[1px] bg-gradient-to-b from-white/10 to-white/[0.02] border border-white/[0.08] rounded-[2rem] shadow-2xl transition-all duration-300 ${
              currentPathType === 'red'
                ? 'ring-1 ring-red-500/40 border-red-500/30 bg-red-950/10 shadow-[0_0_30px_rgba(239,68,68,0.3)] scale-[1.01] animate-pulse'
                : hoveredCardIndex === 2
                  ? 'ring-1 ring-white/20'
                  : ''
            }`}
            onMouseEnter={() => {
              if (interactive) setHoveredPath('red')
              setHoveredCardIndex(2)
            }}
            onMouseLeave={() => {
              resetHoverStates()
              setHoveredCardIndex(null)
            }}
          >
            <div className="p-6 lg:p-8 bg-[#0c0c0e]/95 rounded-[calc(2rem-1px)] h-full flex flex-col justify-between border border-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)]">
              <div className="flex flex-col gap-4">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors duration-300 ${
                      currentPathType === 'red'
                        ? 'bg-red-500/5 border-red-500/20 text-red-500'
                        : 'bg-neutral-800/20 border-white/[0.08] text-neutral-400'
                    }`}
                  >
                    <Database size={18} strokeWidth={1.2} />
                  </div>
                  <span
                    className={`font-mono text-[9px] px-2 py-0.5 rounded-full border transition-colors duration-300 ${
                      currentPathType === 'red'
                        ? 'text-red-500 bg-red-500/10 border-red-500/20'
                        : 'text-neutral-400 bg-neutral-800/40 border-white/[0.06]'
                    }`}
                  >
                    DATA & INFRA
                  </span>
                </div>

                {/* Text Copy */}
                <div>
                  <h3 className="font-mono text-xs font-semibold text-neutral-200 tracking-wider uppercase mb-2">
                    FULL-STACK INFRASTRUCTURE & PIPELINE DATA FABRIC
                  </h3>
                  <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                    Owning the full stack from raw data pipelines and feature engineering to
                    deployed models and cloud infrastructure.
                  </p>
                </div>

                {/* Live Readout: Timeline + status */}
                <div className="mt-2 bg-black/50 border border-white/[0.04] p-3 rounded-lg h-32 flex flex-col justify-between font-mono text-[9px] select-text">
                  <div className="text-neutral-500 border-b border-white/[0.04] pb-1 flex items-center justify-between">
                    <span>PIPELINE_ORCHESTRATION</span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                        currentPathType === 'red' ? 'bg-red-500' : 'bg-green-400'
                      }`}
                    ></span>
                  </div>

                  {/* Horizontal Pipeline Steps */}
                  <div className="flex items-center justify-between px-1 py-2">
                    {/* Step 1: dbt */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-5 h-5 rounded bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 text-[8px] font-bold">
                        dbt
                      </div>
                      <span className="text-[7px] text-neutral-500">Ingest</span>
                    </div>

                    <ChevronRight size={10} className="text-neutral-600" />

                    {/* Step 2: Store */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-5 h-5 rounded bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 text-[8px] font-bold">
                        Feat
                      </div>
                      <span className="text-[7px] text-neutral-500">Store</span>
                    </div>

                    <ChevronRight size={10} className="text-neutral-600" />

                    {/* Step 3: Train */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-5 h-5 rounded bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 text-[8px] font-bold">
                        GPU
                      </div>
                      <span className="text-[7px] text-neutral-500">Train</span>
                    </div>

                    <ChevronRight size={10} className="text-neutral-600" />

                    {/* Step 4: Validation */}
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center text-[8px] font-bold border transition-colors duration-300 ${
                          currentPathType === 'red'
                            ? 'bg-red-500/10 border-red-500/30 text-red-500'
                            : 'bg-green-500/10 border-green-500/20 text-green-400'
                        }`}
                      >
                        Eval
                      </div>
                      <span className="text-[7px] text-neutral-500">Verify</span>
                    </div>

                    <ChevronRight size={10} className="text-neutral-600" />

                    {/* Step 5: Deploy */}
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center text-[8px] font-bold border transition-colors duration-300 ${
                          currentPathType === 'red'
                            ? 'bg-amber-500/5 border-amber-500/20 text-amber-500'
                            : 'bg-green-500/10 border-green-500/20 text-green-400'
                        }`}
                      >
                        AWS
                      </div>
                      <span className="text-[7px] text-neutral-500">Deploy</span>
                    </div>
                  </div>

                  {/* Warning Log Details */}
                  {currentPathType === 'red' ? (
                    <div className="text-red-400 bg-red-950/20 border border-red-500/10 p-1.5 rounded text-[8px] leading-relaxed flex gap-1.5 items-start">
                      <AlertTriangle size={10} className="text-red-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>[FAIL]</strong> Integer rounding error bypassed constraints.
                        Edge-case safety handler tripped. Pipeline stalled.
                      </span>
                    </div>
                  ) : (
                    <div className="text-green-400/90 bg-green-950/10 border border-green-500/10 p-1.5 rounded text-[8px] leading-relaxed flex gap-1.5 items-start">
                      <CheckCircle2 size={10} className="text-green-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>[HEALTHY]</strong> Pipeline synced. Objective function verified
                        under strict integer conditions.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tech Pill Grid */}
              <div className="flex flex-wrap gap-1.5 pt-4 mt-6 border-t border-white/[0.04]">
                {['AWS', 'Next.js', 'TypeScript', 'dbt'].map((pill) => (
                  <span
                    key={pill}
                    className="font-mono text-[9px] px-2 py-0.5 rounded bg-neutral-800/40 border border-white/[0.06] text-neutral-400"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
