import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import WhatIBuild from '@/components/sections/WhatIBuild'
import Projects from '@/components/sections/Projects'
import Stack from '@/components/sections/Stack'
import Contact from '@/components/sections/Contact'

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <WhatIBuild />
      <Projects />
      <Stack />
      <Contact />
    </main>
  )
}
