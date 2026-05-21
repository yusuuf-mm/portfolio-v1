import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import WhatIBuild from '@/components/sections/WhatIBuild'
import Projects from '@/components/sections/Projects'

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <WhatIBuild />
      <Projects />
    </main>
  )
}
