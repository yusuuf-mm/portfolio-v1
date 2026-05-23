import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import WhatIBuild from '@/components/sections/WhatIBuild'
import Projects from '@/components/sections/Projects'
import Stack from '@/components/sections/Stack'
import Contact from '@/components/sections/Contact'
import ScrollProgress from '@/components/ui/ScrollProgress'

function SectionDivider() {
  return (
    <div
      className="h-20"
      style={{
        background: 'linear-gradient(to bottom, transparent, var(--background), transparent)',
      }}
    />
  )
}

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Hero />
      <SectionDivider />
      <About />
      <SectionDivider />
      <WhatIBuild />
      <SectionDivider />
      <Projects />
      <SectionDivider />
      <Stack />
      <SectionDivider />
      <Contact />
    </>
  )
}
