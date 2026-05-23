import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export default function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border',
        'bg-[var(--surface)] border-[var(--border)]',
        'shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]',
        hover && 'transition-all duration-300 hover:border-[var(--accent)]',
        className
      )}
    >
      {children}
    </div>
  )
}
