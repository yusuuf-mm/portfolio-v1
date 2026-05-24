import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Instrument_Serif } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollProgress from '@/components/layout/ScrollProgress'
import './globals.css'

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Yusuf Muhammad Musa | AI Systems Engineer',
  description: 'I architect intelligent systems — end to end, from model to decision.',
  keywords: ['AI Systems Engineer', 'Machine Learning', 'Operations Research', 'Data Engineering', 'Python', 'FastAPI'],
  authors: [{ name: 'Yusuf Muhammad Musa' }],
  openGraph: {
    title: 'Yusuf Muhammad Musa | AI Systems Engineer',
    description: 'I architect intelligent systems — end to end, from model to decision.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yusuf Muhammad Musa | AI Systems Engineer',
    description: 'I architect intelligent systems — end to end, from model to decision.',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F4F2EE' },
    { media: '(prefers-color-scheme: dark)', color: '#08090C' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable} bg-[var(--background)]`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <ScrollProgress />
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
