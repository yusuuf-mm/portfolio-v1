import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import localFont from 'next/font/local'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const instrumentSerif = localFont({
  src: '../../public/fonts/InstrumentSerif-Regular.woff2',
  variable: '--font-instrument-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Yusuf | AI Systems Engineer',
  description:
    'I build systems that predict, optimize, and decide. Full-stack engineering from data pipelines to deployed models.',
  openGraph: {
    title: 'Yusuf | AI Systems Engineer',
    description:
      'I build systems that predict, optimize, and decide. Full-stack engineering from data pipelines to deployed models.',
    url: 'https://yusuufmm.is-a.dev',
    siteName: 'Yusuf Portfolio',
    images: [{ url: 'https://yusuufmm.is-a.dev/og', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yusuf | AI Systems Engineer',
    description:
      'I build systems that predict, optimize, and decide. Full-stack engineering from data pipelines to deployed models.',
    images: ['https://yusuufmm.is-a.dev/og'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: 'https://yusuufmm.is-a.dev',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--accent)] focus:text-[var(--background)] focus:rounded"
          >
            Skip to content
          </a>
          <main id="main-content">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
