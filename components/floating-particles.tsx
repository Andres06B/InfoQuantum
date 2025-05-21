"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface Particle {
  x: number
  y: number
  size: number
  color: string
  speedX: number
  speedY: number
  opacity: number
  opacityChange: number
  rotation: number
  rotationSpeed: number
  shape: "circle" | "square"
  originalX: number
  originalY: number
  driftX: number
  driftY: number
}

interface FloatingParticlesProps {
  density?: number
  colors?: string[]
  maxSize?: number
  minSize?: number
  baseSpeed?: number
  shape?: "circle" | "square" | "mix"
  interactivity?: boolean
  zIndex?: number
  motionType?: "float" | "orbit" | "drift"
}

const DEFAULT_COLORS = [
  "rgba(96, 165, 250, 0.7)",  // blue-400
  "rgba(139, 92, 246, 0.7)",  // violet-500
  "rgba(52, 211, 153, 0.7)",  // emerald-400
  "rgba(251, 191, 36, 0.7)",  // amber-400
  "rgba(236, 72, 153, 0.7)",  // pink-500
  "rgba(16, 185, 129, 0.7)",  // emerald-500
  "rgba(59, 130, 246, 0.7)",  // blue-500
]

export default function FloatingParticles({
  density = 30,
  colors = DEFAULT_COLORS,
  maxSize = 5,
  minSize = 1,
  baseSpeed = 0.5,
  shape = "circle",
  interactivity = true,
  zIndex = 0,
  motionType = "float",
}: FloatingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationIdRef = useRef<number | null>(null)
  const mousePosRef = useRef<{ x: number; y: number; radius: number } | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  
  const isReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)")
  const isMobile = useMediaQuery("(max-width: 768px)")
  
  // Adjust settings based on device
  const particleDensity = isMobile ? Math.floor(density * 0.6) : density
  const actualSpeed = isReducedMotion ? baseSpeed * 0.2 : baseSpeed

  // Initialize particles with stable positions
  const initParticles = useCallback((canvas: HTMLCanvasElement) => {
    const particles: Particle[] = []
    const shapeTypes = shape === "mix" ? ["circle", "square"] : [shape]
    
    for (let i = 0; i < particleDensity; i++) {
      const currentShape = shapeTypes[Math.floor(Math.random() * shapeTypes.length)]
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      
      particles.push({
        x,
        y,
        size: Math.random() * (maxSize - minSize) + minSize,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * actualSpeed,
        speedY: (Math.random() - 0.5) * actualSpeed,
        opacity: Math.random() * 0.6 + 0.2,
        opacityChange: Math.random() * 0.008 * (Math.random() > 0.5 ? 1 : -1),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        shape: currentShape as "circle" | "square",
        originalX: x,
        originalY: y,
        driftX: (Math.random() - 0.5) * 2,
        driftY: (Math.random() - 0.5) * 2
      })
    }
    
    particlesRef.current = particles
  }, [particleDensity, colors, maxSize, minSize, actualSpeed, shape])

  // Draw particles with different shapes and glow effects
  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save()
    ctx.translate(particle.x, particle.y)
    ctx.rotate(particle.rotation)
    
    // Draw glow effect
    if (particle.size > 2) {
      const glow = ctx.createRadialGradient(
        0, 0, 0,
        0, 0, particle.size * 1.5
      )
      glow.addColorStop(0, particle.color.replace('0.7', '0.4'))
      glow.addColorStop(1, 'transparent')
      
      ctx.beginPath()
      ctx.arc(0, 0, particle.size * 1.5, 0, Math.PI * 2)
      ctx.fillStyle = glow
      ctx.fill()
    }
    
    // Draw particle
    ctx.globalAlpha = particle.opacity
    ctx.fillStyle = particle.color
    
    if (particle.shape === "square") {
      ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
    } else {
      ctx.beginPath()
      ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2)
      ctx.fill()
    }
    
    ctx.restore()
  }, [])

  // Handle mouse movement for interactivity
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!interactivity || !canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const scaleX = canvasRef.current.width / rect.width
    const scaleY = canvasRef.current.height / rect.height
    
    mousePosRef.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      radius: 150 * (window.devicePixelRatio || 1),
    }
  }, [interactivity])

  // Update particles with optional mouse interaction
  const updateParticles = useCallback((canvas: HTMLCanvasElement, time: number) => {
    const mouse = mousePosRef.current
    const particles = particlesRef.current
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      
      // Update position based on motion type
      switch (motionType) {
        case "orbit":
          p.x = p.originalX + Math.cos(time * 0.001 + i) * p.size * 10
          p.y = p.originalY + Math.sin(time * 0.001 + i * 0.7) * p.size * 10
          break
        case "drift":
          p.x += p.speedX + Math.sin(time * 0.001 + i) * 0.2
          p.y += p.speedY + Math.cos(time * 0.001 + i * 0.5) * 0.2
          break
        case "float":
        default:
          p.x += p.speedX
          p.y += p.speedY
          break
      }
      
      // Mouse interaction
      if (mouse && interactivity) {
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < mouse.radius) {
          const angle = Math.atan2(dy, dx)
          const force = (mouse.radius - distance) / mouse.radius * 3
          p.x -= Math.cos(angle) * force
          p.y -= Math.sin(angle) * force
        }
      }
      
      // Update opacity with bouncing effect
      p.opacity += p.opacityChange
      if (p.opacity <= 0.2 || p.opacity >= 0.8) {
        p.opacityChange = -p.opacityChange
      }
      
      // Update rotation
      p.rotation += p.rotationSpeed
      
      // Wrap-around edges with buffer
      const buffer = p.size * 2
      if (p.x < -buffer) p.x = canvas.width + buffer
      if (p.x > canvas.width + buffer) p.x = -buffer
      if (p.y < -buffer) p.y = canvas.height + buffer
      if (p.y > canvas.height + buffer) p.y = -buffer
    }
  }, [interactivity, motionType])

  // Main draw function
  const drawParticles = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    updateParticles(canvas, time)
    
    // Draw particles sorted by size for better depth perception
    const sortedParticles = [...particlesRef.current].sort((a, b) => a.size - b.size)
    sortedParticles.forEach(particle => drawParticle(ctx, particle))
  }, [updateParticles, drawParticle])

  // Animation loop with timestamp
  const animate = useCallback((time: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    drawParticles(ctx, canvas, time)
    animationIdRef.current = requestAnimationFrame(animate)
  }, [drawParticles])

  // Canvas setup with proper DPI handling
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const dpr = window.devicePixelRatio || 1
    const width = window.innerWidth
    const height = window.innerHeight
    
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    
    ctx.scale(dpr, dpr)
    ctx.imageSmoothingEnabled = true
    
    initParticles(canvas)
    setIsLoaded(true)
    animationIdRef.current = requestAnimationFrame(animate)
    
    setDimensions({ width, height })
  }, [initParticles, animate])

  // Handle resize with debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setupCanvas()
      }, 100)
    }
    
    window.addEventListener("resize", handleResize)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("resize", handleResize)
    }
  }, [setupCanvas])

  // Effect hooks for setup and cleanup
  useEffect(() => {
    if (interactivity) {
      window.addEventListener("mousemove", handleMouseMove)
    }
    
    setupCanvas()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [setupCanvas, handleMouseMove, interactivity])

  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed top-0 left-0 w-full h-full pointer-events-none transition-opacity duration-1000 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ zIndex }}
      aria-hidden="true"
    />
  )
}