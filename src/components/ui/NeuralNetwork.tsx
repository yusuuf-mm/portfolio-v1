'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NeuralNetworkProps {
  activationProgress: number
  onComplete?: () => void
}

interface NetworkNode {
  id: string
  label: string
  subtitle?: string
  x: number
  y: number
  layer: number
}

export default function NeuralNetwork({ activationProgress, onComplete }: NeuralNetworkProps) {
  const hasCompletedRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const activation = useMemo(() => {
    if (activationProgress < 0.15)
      return { input: false, hidden1: false, hidden2: false, output: false }
    if (activationProgress < 0.35)
      return { input: true, hidden1: false, hidden2: false, output: false }
    if (activationProgress < 0.55)
      return { input: true, hidden1: true, hidden2: false, output: false }
    if (activationProgress < 0.75)
      return { input: true, hidden1: true, hidden2: true, output: false }
    return { input: true, hidden1: true, hidden2: true, output: true }
  }, [activationProgress])

  const { nodes, connections } = useMemo(() => {
    const width = 1000
    const height = 420
    const centerY = height / 2 + 30
    const xPositions = [120, 320, 560, 880]

    const nodeList: NetworkNode[] = []

    // Input node
    nodeList.push({
      id: 'input-1',
      label: 'Software Engineering Foundation',
      subtitle: 'RAW CAPABILITY',
      x: xPositions[0],
      y: centerY,
      layer: 0,
    })

    // Hidden Layer 1
    const h1Labels = ['Algorithms', 'Systems Design', 'API Architecture']
    const h1Spacing = 85
    const h1StartY = centerY - ((h1Labels.length - 1) * h1Spacing) / 2
    h1Labels.forEach((label, i) => {
      nodeList.push({
        id: `h1-${i}`,
        label,
        x: xPositions[1],
        y: h1StartY + i * h1Spacing,
        layer: 1,
      })
    })

    // Hidden Layer 2
    const h2Labels = ['ML Models', 'Data Pipelines', 'Statistical Analysis', 'Feature Engineering']
    const h2Spacing = 70
    const h2StartY = centerY - ((h2Labels.length - 1) * h2Spacing) / 2
    h2Labels.forEach((label, i) => {
      nodeList.push({
        id: `h2-${i}`,
        label,
        x: xPositions[2],
        y: h2StartY + i * h2Spacing,
        layer: 2,
      })
    })

    // Output node
    nodeList.push({
      id: 'output-1',
      label: 'AI Systems Engineer',
      subtitle: 'CONVERGED CAPABILITY',
      x: xPositions[3],
      y: centerY,
      layer: 3,
    })

    const connectionList: { from: NetworkNode; to: NetworkNode; sourceLayer: number }[] = []

    const inputNode = nodeList.find((n) => n.id === 'input-1')!
    const h1Nodes = nodeList.filter((n) => n.layer === 1)
    const h2Nodes = nodeList.filter((n) => n.layer === 2)
    const outputNode = nodeList.find((n) => n.id === 'output-1')!

    // Input to H1
    h1Nodes.forEach((h1) => {
      connectionList.push({ from: inputNode, to: h1, sourceLayer: 0 })
    })

    // H1 to H2
    h1Nodes.forEach((h1) => {
      h2Nodes.forEach((h2) => {
        connectionList.push({ from: h1, to: h2, sourceLayer: 1 })
      })
    })

    // H2 to Output
    h2Nodes.forEach((h2) => {
      connectionList.push({ from: h2, to: outputNode, sourceLayer: 2 })
    })

    return { nodes: nodeList, connections: connectionList }
  }, [])

  useEffect(() => {
    if (activation.output && !hasCompletedRef.current) {
      hasCompletedRef.current = true
      onComplete?.()
    }
  }, [activation.output, onComplete])

  const isNodeActive = useCallback(
    (layer: number) => {
      if (layer === 0) return activation.input
      if (layer === 1) return activation.hidden1
      if (layer === 2) return activation.hidden2
      return activation.output
    },
    [activation]
  )

  const isEdgeActive = useCallback(
    (sourceLayer: number) => {
      if (sourceLayer === 0) return activation.hidden1
      if (sourceLayer === 1) return activation.hidden2
      return activation.output
    },
    [activation]
  )

  const isEdgeVisible = useCallback(
    (sourceLayer: number) => {
      if (sourceLayer === 0) return activation.input
      if (sourceLayer === 1) return activation.hidden1
      return activation.hidden2
    },
    [activation]
  )

  const getNodeWidth = (layer: number) => {
    if (layer === 0) return 200
    if (layer === 3) return 160
    return 130
  }

  const getNodeHeight = (layer: number) => {
    if (layer === 0 || layer === 3) return 50
    return 36
  }

  return (
    <div
      ref={containerRef}
      className="w-full rounded-xl overflow-hidden border border-[var(--border)] bg-void relative"
    >
      {/* Header */}
      <div className="text-center pt-8 pb-4">
        <h3 className="font-serif text-2xl lg:text-3xl text-[var(--text-primary)] tracking-tight">
          Knowledge Architecture Activation
        </h3>
        <motion.p
          className="font-mono text-xs tracking-[0.3em] mt-2"
          animate={{
            color: activation.output ? '#b8935a' : 'var(--text-muted)',
          }}
        >
          FORWARD PASS SIMULATION ACTIVE
        </motion.p>
      </div>

      {/* Layer Labels */}
      <div className="flex justify-between px-8 lg:px-16 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
        <span className={cn('w-[200px] text-center', activation.input && 'text-bronze')}>
          Input Layer
        </span>
        <span className={cn('w-[130px] text-center', activation.hidden1 && 'text-bronze')}>
          Hidden Layer 1
        </span>
        <span className={cn('w-[130px] text-center', activation.hidden2 && 'text-bronze')}>
          Hidden Layer 2
        </span>
        <span className={cn('w-[160px] text-center', activation.output && 'text-bronze')}>
          Output Layer
        </span>
      </div>

      {/* Neural Network SVG */}
      <svg
        className="w-full"
        viewBox="0 0 1000 420"
        preserveAspectRatio="xMidYMid meet"
        style={{ minHeight: '350px' }}
      >
        {/* Connection Lines */}
        {connections.map((conn, i) => {
          const active = isEdgeActive(conn.sourceLayer)
          const visible = isEdgeVisible(conn.sourceLayer)
          const fromWidth = getNodeWidth(conn.from.layer)
          const toWidth = getNodeWidth(conn.to.layer)

          return (
            <motion.path
              key={'edge-' + i}
              d={`M ${conn.from.x + fromWidth / 2} ${conn.from.y} 
                  C ${conn.from.x + fromWidth / 2 + 60} ${conn.from.y}, 
                    ${conn.to.x - toWidth / 2 - 60} ${conn.to.y}, 
                    ${conn.to.x - toWidth / 2} ${conn.to.y}`}
              fill="none"
              stroke={active ? '#b8935a' : 'rgba(184, 147, 90, 0.2)'}
              strokeWidth={active ? 2 : 1}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: visible ? 1 : 0,
                opacity: visible ? (active ? 1 : 0.4) : 0,
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          )
        })}

        {/* Connection Points (small circles) */}
        {nodes.map((node) => {
          const active = isNodeActive(node.layer)
          const nodeWidth = getNodeWidth(node.layer)

          return (
            <g key={`connectors-${node.id}`}>
              {/* Left connector (except input) */}
              {node.layer !== 0 && (
                <motion.circle
                  cx={node.x - nodeWidth / 2}
                  cy={node.y}
                  r={4}
                  fill={active ? '#b8935a' : 'transparent'}
                  stroke={active ? '#b8935a' : 'rgba(184, 147, 90, 0.3)'}
                  strokeWidth={1}
                  initial={{ scale: 0 }}
                  animate={{ scale: active ? 1 : 0.8 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              {/* Right connector (except output) */}
              {node.layer !== 3 && (
                <motion.circle
                  cx={node.x + nodeWidth / 2}
                  cy={node.y}
                  r={4}
                  fill={active ? '#b8935a' : 'transparent'}
                  stroke={active ? '#b8935a' : 'rgba(184, 147, 90, 0.3)'}
                  strokeWidth={1}
                  initial={{ scale: 0 }}
                  animate={{ scale: active ? 1 : 0.8 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </g>
          )
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const active = isNodeActive(node.layer)
          const nodeWidth = getNodeWidth(node.layer)
          const nodeHeight = getNodeHeight(node.layer)
          const isTerminal = node.layer === 0 || node.layer === 3

          return (
            <g key={node.id}>
              {/* Glow effect for active nodes */}
              {active && (
                <motion.rect
                  x={node.x - nodeWidth / 2}
                  y={node.y - nodeHeight / 2}
                  width={nodeWidth}
                  height={nodeHeight}
                  rx={nodeHeight / 2}
                  fill="#b8935a"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.1, 0.25, 0.1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  filter="blur(12px)"
                />
              )}

              {/* Node rectangle */}
              <motion.rect
                x={node.x - nodeWidth / 2}
                y={node.y - nodeHeight / 2}
                width={nodeWidth}
                height={nodeHeight}
                rx={nodeHeight / 2}
                fill={active ? 'rgba(184, 147, 90, 0.15)' : 'transparent'}
                stroke={active ? '#b8935a' : 'rgba(184, 147, 90, 0.3)'}
                strokeWidth={active ? 2 : 1}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: node.layer * 0.1 }}
              />

              {/* Node label */}
              <motion.text
                x={node.x}
                y={node.y + (isTerminal ? -2 : 4)}
                textAnchor="middle"
                fill={active ? '#b8935a' : 'rgba(184, 147, 90, 0.6)'}
                fontSize={isTerminal ? 11 : 12}
                fontFamily="var(--font-geist-mono)"
                fontWeight={isTerminal ? 600 : 400}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: node.layer * 0.1 + 0.2 }}
              >
                {node.label}
              </motion.text>

              {/* Subtitle for terminal nodes */}
              {node.subtitle && (
                <motion.text
                  x={node.x}
                  y={node.y + 12}
                  textAnchor="middle"
                  fill={active ? 'rgba(184, 147, 90, 0.7)' : 'rgba(184, 147, 90, 0.4)'}
                  fontSize={8}
                  fontFamily="var(--font-geist-mono)"
                  letterSpacing="0.1em"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: node.layer * 0.1 + 0.3 }}
                >
                  {node.subtitle}
                </motion.text>
              )}

              {/* Pulse ring for active output */}
              {active && node.layer === 3 && (
                <motion.rect
                  x={node.x - nodeWidth / 2}
                  y={node.y - nodeHeight / 2}
                  width={nodeWidth}
                  height={nodeHeight}
                  rx={nodeHeight / 2}
                  fill="none"
                  stroke="#b8935a"
                  strokeWidth={1}
                  initial={{ opacity: 0.8, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.15 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
