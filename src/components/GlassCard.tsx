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
        'rounded-xl border backdrop-blur-sm',
        'bg-[var(--surface)] border-[var(--border)]',
        hover &&
          'transition-all duration-300 hover:border-[var(--accent)] hover:bg-[var(--surface)]',
        className
      )}
    >
      {children}
    </div>
  )
}
