'use client'

import { useEffect, useState, useRef } from 'react'
import { useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

type NodeType = 'input' | 'process' | 'storage' | 'output' | 'ml' | 'optimizer'

interface DAGNode {
  id: string
  label: string
  type: NodeType
  x: number
  y: number
}

interface DAGEdge {
  from: string
  to: string
}

interface ProjectDAGProps {
  projectId: string
  isHovered?: boolean
}

// DAG configurations for each project (coordinates in viewBox units 0-100)
const dagConfigs: Record<string, { nodes: DAGNode[]; edges: DAGEdge[] }> = {
  'energy-pipeline': {
    nodes: [
      { id: 'iot', label: 'IoT', type: 'input', x: 8, y: 25 },
      { id: 'kafka', label: 'Kafka', type: 'process', x: 28, y: 25 },
      { id: 'spark', label: 'Spark', type: 'process', x: 48, y: 25 },
      { id: 'postgres', label: 'PostgreSQL', type: 'storage', x: 68, y: 12 },
      { id: 's3', label: 'S3', type: 'storage', x: 68, y: 38 },
      { id: 'airflow', label: 'Airflow', type: 'process', x: 28, y: 62 },
      { id: 'dbt', label: 'dbt', type: 'process', x: 48, y: 62 },
      { id: 'optimizer', label: 'LP Solver', type: 'optimizer', x: 68, y: 62 },
      { id: 'dashboard', label: 'Dashboard', type: 'output', x: 90, y: 45 },
    ],
    edges: [
      { from: 'iot', to: 'kafka' },
      { from: 'kafka', to: 'spark' },
      { from: 'spark', to: 'postgres' },
      { from: 'spark', to: 's3' },
      { from: 'airflow', to: 'dbt' },
      { from: 'dbt', to: 'optimizer' },
      { from: 'postgres', to: 'dashboard' },
      { from: 'optimizer', to: 'dashboard' },
    ],
  },
  habitos: {
    nodes: [
      { id: 'input', label: 'User Goals', type: 'input', x: 10, y: 40 },
      { id: 'constraints', label: 'Constraints', type: 'process', x: 35, y: 18 },
      { id: 'milp', label: 'MILP Solver', type: 'optimizer', x: 55, y: 40 },
      { id: 'energy', label: 'Energy Model', type: 'process', x: 35, y: 62 },
      { id: 'schedule', label: 'Schedule', type: 'output', x: 85, y: 40 },
    ],
    edges: [
      { from: 'input', to: 'constraints' },
      { from: 'input', to: 'milp' },
      { from: 'input', to: 'energy' },
      { from: 'constraints', to: 'milp' },
      { from: 'energy', to: 'milp' },
      { from: 'milp', to: 'schedule' },
    ],
  },
  'neti-hyoptima': {
    nodes: [
      { id: 'sources', label: 'Sources', type: 'input', x: 10, y: 40 },
      { id: 'etl', label: 'ETL', type: 'process', x: 30, y: 40 },
      { id: 'lstm', label: 'LSTM', type: 'ml', x: 50, y: 18 },
      { id: 'xgb', label: 'XGBoost', type: 'ml', x: 50, y: 62 },
      { id: 'milp', label: 'MILP', type: 'optimizer', x: 70, y: 40 },
      { id: 'scenario', label: 'Scenarios', type: 'output', x: 92, y: 40 },
    ],
    edges: [
      { from: 'sources', to: 'etl' },
      { from: 'etl', to: 'lstm' },
      { from: 'etl', to: 'xgb' },
      { from: 'lstm', to: 'milp' },
      { from: 'xgb', to: 'milp' },
      { from: 'milp', to: 'scenario' },
    ],
  },
  'titanic-optimizer': {
    nodes: [
      { id: 'passengers', label: 'Passengers', type: 'input', x: 8, y: 40 },
      { id: 'features', label: 'Features', type: 'process', x: 28, y: 40 },
      { id: 'xgboost', label: 'XGBoost', type: 'ml', x: 48, y: 25 },
      { id: 'ethics', label: 'Ethics', type: 'process', x: 48, y: 55 },
      { id: 'mip', label: 'MIP Solver', type: 'optimizer', x: 70, y: 40 },
      { id: 'allocation', label: 'Allocation', type: 'output', x: 92, y: 40 },
    ],
    edges: [
      { from: 'passengers', to: 'features' },
      { from: 'features', to: 'xgboost' },
      { from: 'features', to: 'ethics' },
      { from: 'xgboost', to: 'mip' },
      { from: 'ethics', to: 'mip' },
      { from: 'mip', to: 'allocation' },
    ],
  },
}

const nodeStyles: Record<NodeType, string> = {
  input: 'bg-white/10 border-white/40 text-white',
  process: 'bg-sky-500/15 border-sky-400/50 text-sky-400',
  storage: 'bg-emerald-500/15 border-emerald-400/50 text-emerald-400',
  output: 'bg-bronze/20 border-bronze/60 text-bronze',
  ml: 'bg-violet-500/15 border-violet-400/50 text-violet-400',
  optimizer: 'bg-bronze/20 border-bronze/60 text-bronze',
}

function DAGEdgePath({
  from,
  to,
  nodes,
  isActive,
  flowProgress,
}: {
  from: string
  to: string
  nodes: DAGNode[]
  isActive: boolean
  flowProgress: number
}) {
  const fromNode = nodes.find((n) => n.id === from)
  const toNode = nodes.find((n) => n.id === to)

  if (!fromNode || !toNode) return null

  const x1 = fromNode.x
  const y1 = fromNode.y
  const x2 = toNode.x
  const y2 = toNode.y

  // Control points for bezier curve
  const midX = (x1 + x2) / 2

  // Create SVG path
  const path = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`

  // Calculate position on bezier for animated dot
  const t = flowProgress
  const dotX =
    Math.pow(1 - t, 3) * x1 +
    3 * Math.pow(1 - t, 2) * t * midX +
    3 * (1 - t) * Math.pow(t, 2) * midX +
    Math.pow(t, 3) * x2
  const dotY =
    Math.pow(1 - t, 3) * y1 +
    3 * Math.pow(1 - t, 2) * t * y1 +
    3 * (1 - t) * Math.pow(t, 2) * y2 +
    Math.pow(t, 3) * y2

  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke={isActive ? 'rgba(205,160,100,0.6)' : 'rgba(255,255,255,0.15)'}
        strokeWidth={isActive ? 0.8 : 0.5}
        className="transition-all duration-300"
      />
      {isActive && flowProgress > 0 && flowProgress < 1 && (
        <circle cx={dotX} cy={dotY} r="1.2" fill="#cda064" className="drop-shadow-sm">
          <animate attributeName="opacity" values="1;0.6;1" dur="0.5s" repeatCount="indefinite" />
        </circle>
      )}
    </g>
  )
}

export default function ProjectDAG({ projectId, isHovered = false }: ProjectDAGProps) {
  const config = dagConfigs[projectId]
  const [activeEdgeIndex, setActiveEdgeIndex] = useState(0)
  const [flowProgress, setFlowProgress] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, margin: '-50px' })

  useEffect(() => {
    if (!config || !isInView) return

    const edgeCount = config.edges.length
    let animationFrame: number
    let startTime: number | null = null
    const edgeDuration = 600

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime

      const totalDuration = edgeCount * edgeDuration
      const cycleProgress = (elapsed % totalDuration) / totalDuration

      const currentEdgeFloat = cycleProgress * edgeCount
      const currentEdge = Math.floor(currentEdgeFloat)
      const edgeProgress = currentEdgeFloat - currentEdge

      setActiveEdgeIndex(currentEdge)
      setFlowProgress(edgeProgress)

      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [config, isInView])

  if (!config) return null

  return (
    <div ref={ref} className="relative w-full h-full min-h-[200px] p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] text-white/50">pipeline_dag</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[9px] text-emerald-500">running</span>
        </div>
      </div>

      {/* DAG Container */}
      <div className="flex-1 relative">
        <svg viewBox="0 0 100 80" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Edges */}
          {config.edges.map((edge, i) => (
            <DAGEdgePath
              key={`${edge.from}-${edge.to}`}
              from={edge.from}
              to={edge.to}
              nodes={config.nodes}
              isActive={i <= activeEdgeIndex}
              flowProgress={i === activeEdgeIndex ? flowProgress : i < activeEdgeIndex ? 1 : 0}
            />
          ))}
        </svg>

        {/* Nodes as HTML elements positioned absolutely */}
        {config.nodes.map((node) => {
          const isNodeActive =
            node.type === 'input' ||
            config.edges.some((e, idx) => e.to === node.id && idx <= activeEdgeIndex)

          return (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
              }}
            >
              <div
                className={cn(
                  'px-2 py-0.5 rounded text-[8px] font-mono whitespace-nowrap border transition-all duration-300',
                  nodeStyles[node.type],
                  isNodeActive || isHovered ? 'opacity-100' : 'opacity-50'
                )}
              >
                {node.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Mobile timeline version
export function ProjectDAGMobile({ projectId }: { projectId: string }) {
  const config = dagConfigs[projectId]
  if (!config) return null

  // Get unique node labels in flow order
  const flowOrder = config.edges.reduce<string[]>((acc, edge) => {
    if (!acc.includes(edge.from)) acc.push(edge.from)
    if (!acc.includes(edge.to)) acc.push(edge.to)
    return acc
  }, [])

  const orderedNodes = flowOrder
    .map((id) => config.nodes.find((n) => n.id === id))
    .filter(Boolean) as DAGNode[]

  return (
    <div className="flex items-center gap-1 overflow-x-auto py-2 px-1">
      {orderedNodes.slice(0, 5).map((node, i) => (
        <div key={node.id} className="flex items-center">
          <span
            className={cn(
              'px-2 py-0.5 rounded text-[8px] font-mono whitespace-nowrap border',
              nodeStyles[node.type]
            )}
          >
            {node.label}
          </span>
          {i < orderedNodes.slice(0, 5).length - 1 && (
            <span className="text-bronze mx-1 text-[10px]">→</span>
          )}
        </div>
      ))}
      {orderedNodes.length > 5 && <span className="font-mono text-[9px] text-white/50">...</span>}
    </div>
  )
}
