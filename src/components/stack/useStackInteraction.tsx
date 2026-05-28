'use client'

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'
import type { Tool } from '@/content/stack'

type InteractionMode = 'hover' | 'locked'

interface StackInteractionState {
  hoveredTool: Tool | null
  lockedTool: Tool | null
  hoveredProject: string | null
  mode: InteractionMode
}

interface StackInteractionActions {
  setHoveredTool: (tool: Tool | null) => void
  toggleLockedTool: (tool: Tool) => void
  setHoveredProject: (projectId: string | null) => void
  clearAll: () => void
  isToolActive: (tool: Tool) => boolean
  toggleMode: () => void
  activeTool: Tool | null
}

type StackInteractionContextValue = StackInteractionState & StackInteractionActions

const StackInteractionContext = createContext<StackInteractionContextValue | null>(null)

export function StackInteractionProvider({ children }: { children: ReactNode }) {
  const [hoveredTool, setHoveredTool] = useState<Tool | null>(null)
  const [lockedTool, setLockedTool] = useState<Tool | null>(null)
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)
  const [mode, setMode] = useState<InteractionMode>('hover')

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'hover' ? 'locked' : 'hover'
      if (next === 'hover') {
        setLockedTool(null)
      }
      return next
    })
  }, [])

  const toggleLockedTool = useCallback((tool: Tool) => {
    setLockedTool((prev) => (prev?.name === tool.name ? null : tool))
  }, [])

  const clearAll = useCallback(() => {
    setHoveredTool(null)
    setLockedTool(null)
    setHoveredProject(null)
  }, [])

  const isToolActive = useCallback(
    (tool: Tool) => {
      return hoveredTool?.name === tool.name || lockedTool?.name === tool.name
    },
    [hoveredTool, lockedTool]
  )

  const activeTool = useMemo(() => lockedTool ?? hoveredTool, [lockedTool, hoveredTool])

  const value = useMemo<StackInteractionContextValue>(
    () => ({
      hoveredTool,
      lockedTool,
      hoveredProject,
      mode,
      setHoveredTool,
      toggleLockedTool,
      setHoveredProject,
      clearAll,
      isToolActive,
      toggleMode,
      activeTool,
    }),
    [
      hoveredTool,
      lockedTool,
      hoveredProject,
      mode,
      toggleLockedTool,
      clearAll,
      isToolActive,
      toggleMode,
      activeTool,
    ]
  )

  return (
    <StackInteractionContext.Provider value={value}>{children}</StackInteractionContext.Provider>
  )
}

export function useStackInteraction() {
  const context = useContext(StackInteractionContext)
  if (!context) {
    throw new Error('useStackInteraction must be used within a StackInteractionProvider')
  }
  return context
}
