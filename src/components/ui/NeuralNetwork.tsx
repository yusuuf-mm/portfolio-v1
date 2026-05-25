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
  x: number
  y: number
  layer: number
}

export default function NeuralNetwork({ activationProgress, onComplete }: NeuralNetworkProps) {
  const hasCompletedRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const activation = useMemo(() => {
    if (activationProgress < 0.2)
      return { input: false, hidden1: false, hidden2: false, output: false }
    if (activationProgress < 0.4)
      return { input: true, hidden1: false, hidden2: false, output: false }
    if (activationProgress < 0.6)
      return { input: true, hidden1: true, hidden2: false, output: false }
    if (activationProgress < 0.8)
      return { input: true, hidden1: true, hidden2: true, output: false }
    return { input: true, hidden1: true, hidden2: true, output: true }
  }, [activationProgress])

  const { nodes, connections } = useMemo(() => {
    const height = 400
    const centerY = height / 2
    const xPositions = [50, 200, 400, 600]

    const nodeList: NetworkNode[] = []

    nodeList.push({
      id: 'input-1',
      label: 'Software Engineering Foundation',
      x: xPositions[0],
      y: centerY,
      layer: 0,
    })

    const h1Labels = ['Algorithms', 'Systems Design', 'API Architecture']
    const h1Spacing = 90
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

    const h2Labels = ['ML Models', 'Data Pipelines', 'Statistical Analysis', 'Feature Engineering']
    const h2Spacing = 80
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

    nodeList.push({
      id: 'output-1',
      label: 'AI Systems Engineer',
      x: xPositions[3],
      y: centerY,
      layer: 3,
    })

    const connectionList: { from: NetworkNode; to: NetworkNode; sourceLayer: number }[] = []

    const inputNode = nodeList.find((n) => n.id === 'input-1')!
    const h1Nodes = nodeList.filter((n) => n.layer === 1)
    const h2Nodes = nodeList.filter((n) => n.layer === 2)
    const outputNode = nodeList.find((n) => n.id === 'output-1')!

    h1Nodes.forEach((h1) => {
      connectionList.push({ from: inputNode, to: h1, sourceLayer: 0 })
    })

    h1Nodes.forEach((h1) => {
      h2Nodes.forEach((h2) => {
        connectionList.push({ from: h1, to: h2, sourceLayer: 1 })
      })
    })

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

  return (
    <div
      ref={containerRef}
      className="w-full h-[400px] rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] relative"
    >
      <svg className="w-full h-full" viewBox="0 0 700 400" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.5" fill="var(--border)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {connections.map((conn, i) => {
          const active = isEdgeActive(conn.sourceLayer)
          const visible = isEdgeVisible(conn.sourceLayer)
          return (
            <motion.line
              key={'edge-' + i}
              x1={conn.from.x + 50}
              y1={conn.from.y}
              x2={conn.to.x - 50}
              y2={conn.to.y}
              stroke={active ? 'var(--accent-warm)' : 'var(--border)'}
              strokeWidth={active ? 2 : 1}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: visible ? 1 : 0,
                opacity: visible ? (active ? 1 : 0.4) : 0,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          )
        })}

        {nodes.map((node) => {
          const active = isNodeActive(node.layer)
          const isOutput = node.layer === 3
          return (
            <g key={node.id}>
              {active && (
                <motion.ellipse
                  cx={node.x}
                  cy={node.y}
                  rx={isOutput ? 70 : 55}
                  ry={isOutput ? 25 : 18}
                  fill="var(--accent-warm)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  filter="blur(8px)"
                />
              )}

              <motion.rect
                x={node.x - (isOutput ? 65 : 50)}
                y={node.y - (isOutput ? 20 : 15)}
                width={isOutput ? 130 : 100}
                height={isOutput ? 40 : 30}
                rx={6}
                fill={active ? 'rgba(184, 147, 90, 0.15)' : 'var(--surface)'}
                stroke={active ? 'var(--accent-warm)' : 'var(--border)'}
                strokeWidth={active ? 2 : 1}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: node.layer * 0.1 }}
              />

              <motion.text
                x={node.x}
                y={node.y + 4}
                textAnchor="middle"
                fill={active ? 'var(--accent-warm)' : 'var(--text-muted)'}
                fontSize={node.layer === 0 || isOutput ? 10 : 11}
                fontFamily="var(--font-geist-mono)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: node.layer * 0.1 + 0.2 }}
              >
                {node.label}
              </motion.text>

              {active && (
                <motion.rect
                  x={node.x - (isOutput ? 65 : 50)}
                  y={node.y - (isOutput ? 20 : 15)}
                  width={isOutput ? 130 : 100}
                  height={isOutput ? 40 : 30}
                  rx={6}
                  fill="none"
                  stroke="var(--accent-warm)"
                  strokeWidth={1}
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </g>
          )
        })}
      </svg>

      <div className="absolute bottom-3 left-0 right-0 flex justify-between px-6 text-[10px] font-mono text-[var(--text-muted)]">
        <span className={cn(activation.input && 'text-[var(--accent-warm)]')}>INPUT</span>
        <span className={cn(activation.hidden1 && 'text-[var(--accent-warm)]')}>HIDDEN_1</span>
        <span className={cn(activation.hidden2 && 'text-[var(--accent-warm)]')}>HIDDEN_2</span>
        <span className={cn(activation.output && 'text-[var(--accent-warm)]')}>OUTPUT</span>
      </div>
    </div>
  )
}
