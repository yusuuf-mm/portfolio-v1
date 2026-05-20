import TerminalPrompt from '@/components/ui/TerminalPrompt'

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-8 mt-32">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <TerminalPrompt text="yusuf.sys ~ end" showCursor={false} />
        <p className="text-xs font-mono text-[var(--text-muted)]">
          © {new Date().getFullYear()} — Built with precision
        </p>
      </div>
    </footer>
  )
}
