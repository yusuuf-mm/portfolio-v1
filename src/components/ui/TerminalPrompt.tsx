import { cn } from '@/lib/utils'

interface TerminalPromptProps {
  text: string
  className?: string
  showCursor?: boolean
}

export default function TerminalPrompt({
  text,
  className,
  showCursor = true,
}: TerminalPromptProps) {
  return (
    <div className={cn('flex items-center gap-2 font-mono text-sm', className)}>
      <span className="text-[var(--accent)]">{'>'}</span>
      <span className="text-[var(--text-primary)]">{text}</span>
      {showCursor && <span className="inline-block w-2 h-4 bg-[var(--accent)] animate-pulse" />}
    </div>
  )
}
