import { cn } from '@/lib/utils'

interface BadgeProps {
  label: string
  className?: string
}

export default function Badge({ label, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block px-2 py-0.5 rounded-md text-xs font-mono',
        'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)]',
        className
      )}
    >
      {label}
    </span>
  )
}
