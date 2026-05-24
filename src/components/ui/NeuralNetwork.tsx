'use client'

import { useCallback, useEffect, useState, useMemo } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Background,
  useNodesState,
  useEdgesState,
  Position,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NeuralNetworkProps {
  activationProgress: number // 0 to 1
  onComplete?: () => void
}

// Custom node component
function NeuralNode({ data }: { data: { label: string; layer: number; activated: boolean; isOutput: boolean } }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative px-3 py-2 rounded-lg border-2 transition-all duration-500',
        'font-mono text-xs text-center min-w-[80px]',
        data.activated
          ? 'border-bronze bg-bronze/20 text-bronze shadow-[0_0_20px_rgba(205,127,50,0.4)]'
          : 'border-[var(--border)] bg-[var(--glass-bg)] text-[var(--text-muted)]',
        data.isOutput && data.activated && 'shadow-[0_0_30px_rgba(205,127,50,0.6)]'
      )}
    >
      {data.label}
      {data.activated && (
        <span className="absolute inset-0 rounded-lg border-2 border-bronze animate-ping opacity-20" />
      )}
    </motion.div>
  )
}

const nodeTypes = { neural: NeuralNode }

export default function NeuralNetwork({ activationProgress, onComplete }: NeuralNetworkProps) {
  const [hasCompleted, setHasCompleted] = useState(false)

  // Define network structure
  const networkStructure = useMemo(() => ({
    input: [{ id: 'input-1', label: 'Software Engineering\nFoundation' }],
    hidden1: [
      { id: 'h1-1', label: 'Algorithms' },
      { id: 'h1-2', label: 'Systems Design' },
      { id: 'h1-3', label: 'API Architecture' },
    ],
    hidden2: [
      { id: 'h2-1', label: 'ML Models' },
      { id: 'h2-2', label: 'Data Pipelines' },
      { id: 'h2-3', label: 'Statistical Analysis' },
      { id: 'h2-4', label: 'Feature Engineering' },
    ],
    output: [{ id: 'output-1', label: 'AI Systems\nEngineer' }],
  }), [])

  // Calculate which layer is activated based on progress
  const getLayerActivation = useCallback((progress: number) => {
    if (progress < 0.2) return { input: false, hidden1: false, hidden2: false, output: false }
    if (progress < 0.4) return { input: true, hidden1: false, hidden2: false, output: false }
    if (progress < 0.6) return { input: true, hidden1: true, hidden2: false, output: false }
    if (progress < 0.8) return { input: true, hidden1: true, hidden2: true, output: false }
    return { input: true, hidden1: true, hidden2: true, output: true }
  }, [])

  const activation = getLayerActivation(activationProgress)

  // Create nodes with positions
  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = []
    const xPositions = { input: 0, hidden1: 200, hidden2: 400, output: 600 }
    const centerY = 200

    // Input layer
    networkStructure.input.forEach((node, i) => {
      nodes.push({
        id: node.id,
        type: 'neural',
        position: { x: xPositions.input, y: centerY },
        data: { label: node.label, layer: 0, activated: activation.input, isOutput: false },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      })
    })

    // Hidden layer 1
    const h1Spacing = 80
    const h1StartY = centerY - ((networkStructure.hidden1.length - 1) * h1Spacing) / 2
    networkStructure.hidden1.forEach((node, i) => {
      nodes.push({
        id: node.id,
        type: 'neural',
        position: { x: xPositions.hidden1, y: h1StartY + i * h1Spacing },
        data: { label: node.label, layer: 1, activated: activation.hidden1, isOutput: false },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      })
    })

    // Hidden layer 2
    const h2Spacing = 70
    const h2StartY = centerY - ((networkStructure.hidden2.length - 1) * h2Spacing) / 2
    networkStructure.hidden2.forEach((node, i) => {
      nodes.push({
        id: node.id,
        type: 'neural',
        position: { x: xPositions.hidden2, y: h2StartY + i * h2Spacing },
        data: { label: node.label, layer: 2, activated: activation.hidden2, isOutput: false },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      })
    })

    // Output layer
    networkStructure.output.forEach((node) => {
      nodes.push({
        id: node.id,
        type: 'neural',
        position: { x: xPositions.output, y: centerY },
        data: { label: node.label, layer: 3, activated: activation.output, isOutput: true },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      })
    })

    return nodes
  }, [networkStructure, activation])

  // Create edges
  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = []
    
    // Input to hidden1
    networkStructure.input.forEach((input) => {
      networkStructure.hidden1.forEach((hidden) => {
        edges.push({
          id: `${input.id}-${hidden.id}`,
          source: input.id,
          target: hidden.id,
          animated: activation.hidden1,
          style: {
            stroke: activation.hidden1 ? 'var(--bronze)' : 'var(--border)',
            strokeWidth: activation.hidden1 ? 2 : 1,
            opacity: activation.input ? 1 : 0.3,
          },
        })
      })
    })

    // Hidden1 to hidden2
    networkStructure.hidden1.forEach((h1) => {
      networkStructure.hidden2.forEach((h2) => {
        edges.push({
          id: `${h1.id}-${h2.id}`,
          source: h1.id,
          target: h2.id,
          animated: activation.hidden2,
          style: {
            stroke: activation.hidden2 ? 'var(--bronze)' : 'var(--border)',
            strokeWidth: activation.hidden2 ? 2 : 1,
            opacity: activation.hidden1 ? 1 : 0.3,
          },
        })
      })
    })

    // Hidden2 to output
    networkStructure.hidden2.forEach((hidden) => {
      networkStructure.output.forEach((output) => {
        edges.push({
          id: `${hidden.id}-${output.id}`,
          source: hidden.id,
          target: output.id,
          animated: activation.output,
          style: {
            stroke: activation.output ? 'var(--bronze)' : 'var(--border)',
            strokeWidth: activation.output ? 2 : 1,
            opacity: activation.hidden2 ? 1 : 0.3,
          },
        })
      })
    })

    return edges
  }, [networkStructure, activation])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Update nodes and edges when activation changes
  useEffect(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges, setNodes, setEdges])

  // Trigger completion callback
  useEffect(() => {
    if (activation.output && !hasCompleted) {
      setHasCompleted(true)
      onComplete?.()
    }
  }, [activation.output, hasCompleted, onComplete])

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--glass-bg)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        panOnScroll={false}
        panOnDrag={false}
        preventScrolling={false}
      >
        <Background color="var(--border)" gap={20} size={1} />
      </ReactFlow>
    </div>
  )
}
