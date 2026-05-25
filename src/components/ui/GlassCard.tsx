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
        'rounded-lg border backdrop-blur-xl',
        'bg-[var(--surface)] border-[var(--border)]',
        'shadow-[0_4px_24px_rgba(0,0,0,0.08)]',
        hover &&
          'transition-all duration-300 hover:border-bronze/40 hover:shadow-lg hover:shadow-bronze/5',
        className
      )}
    >
      {children}
    </div>
  )
}
