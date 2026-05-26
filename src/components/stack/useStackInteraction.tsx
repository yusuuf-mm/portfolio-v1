'use client'

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'
import type { Tool } from '@/content/stack'

interface StackInteractionState {
  hoveredTool: Tool | null
  lockedTool: Tool | null
  hoveredProject: string | null
}

interface StackInteractionActions {
  setHoveredTool: (tool: Tool | null) => void
  toggleLockedTool: (tool: Tool) => void
  setHoveredProject: (projectId: string | null) => void
  clearAll: () => void
  isToolActive: (tool: Tool) => boolean
  activeTool: Tool | null
}

type StackInteractionContextValue = StackInteractionState & StackInteractionActions

const StackInteractionContext = createContext<StackInteractionContextValue | null>(null)

export function StackInteractionProvider({ children }: { children: ReactNode }) {
  const [hoveredTool, setHoveredTool] = useState<Tool | null>(null)
  const [lockedTool, setLockedTool] = useState<Tool | null>(null)
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)

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

  // Active tool prioritizes locked over hovered
  const activeTool = useMemo(() => lockedTool ?? hoveredTool, [lockedTool, hoveredTool])

  const value = useMemo<StackInteractionContextValue>(
    () => ({
      hoveredTool,
      lockedTool,
      hoveredProject,
      setHoveredTool,
      toggleLockedTool,
      setHoveredProject,
      clearAll,
      isToolActive,
      activeTool,
    }),
    [hoveredTool, lockedTool, hoveredProject, toggleLockedTool, clearAll, isToolActive, activeTool]
  )

  return (
    <StackInteractionContext.Provider value={value}>
      {children}
    </StackInteractionContext.Provider>
  )
}

export function useStackInteraction() {
  const context = useContext(StackInteractionContext)
  if (!context) {
    throw new Error('useStackInteraction must be used within a StackInteractionProvider')
  }
  return context
}
