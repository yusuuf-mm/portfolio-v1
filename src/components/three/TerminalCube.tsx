'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function Cubes({ accentColor, inView }: { accentColor: string; inView: boolean }) {
  const outerRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const { invalidate } = useThree()

  useEffect(() => {
    if (inView) invalidate()
  }, [inView, invalidate])

  useFrame(() => {
    if (!inView) return
    if (outerRef.current) {
      outerRef.current.rotation.y += 0.004
      outerRef.current.rotation.x += 0.001
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= 0.003
    }
    invalidate()
  })

  return (
    <>
      <mesh ref={outerRef}>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial wireframe color={accentColor} />
      </mesh>
      <mesh ref={innerRef}>
        <boxGeometry args={[1.4, 1.4, 1.4]} />
        <meshBasicMaterial wireframe color={accentColor} opacity={0.3} transparent />
      </mesh>
    </>
  )
}

export default function TerminalCube({ accentColor = '#B8935A' }: { accentColor?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: '100px',
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full" aria-hidden="true">
      <Canvas
        frameloop="demand"
        dpr={[1, 2]}
        gl={{ alpha: true }}
        camera={{ position: [0, 0, 4], fov: 50 }}
      >
        <ambientLight intensity={0.5} />
        <Cubes accentColor={accentColor} inView={inView} />
      </Canvas>
    </div>
  )
}
