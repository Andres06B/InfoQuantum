"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"

interface LoadingScreenProps {
  onComplete: () => void
  duration?: number
  ringsCount?: number
}

export default function LoadingScreen({ 
  onComplete, 
  duration = 3000, 
  ringsCount = 5 
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const isReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)")
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Configuraciones adaptativas
  const config = useMemo(() => ({
    speedFactor: isReducedMotion || isMobile ? 2 : 1,
    updateInterval: isMobile ? 20 : 30, // Más rápido en móviles
    ringColors: [
      "border-t-blue-400 border-r-purple-400 border-b-cyan-400 border-l-indigo-400",
      "border-t-purple-400 border-r-cyan-400 border-b-indigo-400 border-l-blue-400",
      "border-t-cyan-400 border-r-indigo-400 border-b-blue-400 border-l-purple-400",
      "border-t-indigo-400 border-r-blue-400 border-b-purple-400 border-l-cyan-400",
      "border-t-blue-400 border-r-cyan-400 border-b-purple-400 border-l-indigo-400",
    ]
  }), [isReducedMotion, isMobile])

  // Animación de progreso suavizada
  const smoothProgress = useMotionValue(0)
  const roundedProgress = useTransform(smoothProgress, (value) => Math.round(value))

  useEffect(() => {
    const interval = setInterval(() => {
      if (progress < 100) {
        const increment = (100 / (duration / config.updateInterval)) * config.speedFactor
        const newProgress = Math.min(progress + increment, 100)
        setProgress(newProgress)
        smoothProgress.set(newProgress)
      } else {
        onComplete()
      }
    }, config.updateInterval)

    return () => clearInterval(interval)
  }, [progress, duration, config, onComplete, smoothProgress])

  // Configuraciones de animación
  const animations = useMemo(() => ({
    container: {
      initial: { opacity: 1 },
      animate: { opacity: progress === 100 ? 0 : 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.8 }
    },
    rings: (i: number) => ({
      animate: !isReducedMotion ? { 
        rotate: i % 2 === 0 ? 360 : -360,
        scale: [1, 1.05, 1],
      } : {},
      transition: !isReducedMotion ? { 
        duration: 3 + i, 
        repeat: Infinity, 
        ease: "linear",
        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      } : {}
    }),
    centerDot: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      transition: { delay: 0.5, duration: 0.5 }
    },
    textPulse: {
      animate: !isReducedMotion ? { opacity: [0.7, 1, 0.7] } : {},
      transition: !isReducedMotion ? { 
        duration: 2.5, 
        repeat: Infinity, 
        ease: "easeInOut" 
      } : {}
    },
    progressBar: {
      style: { width: `${progress}%` },
      transition: { duration: config.updateInterval / 1000 }
    }
  }), [progress, isReducedMotion, config.updateInterval])

  // Generar anillos concéntricos
  const renderRings = () => {
    return Array.from({ length: ringsCount }).map((_, i) => (
      <motion.div
        key={i}
        className={`absolute inset-${i * 2} border-4 ${config.ringColors[i % config.ringColors.length]} rounded-full`}
        {...animations.rings(i)}
      />
    ))
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-blue-950 via-purple-950 to-indigo-950"
      {...animations.container}
    >
      {/* Anillos animados */}
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-8">
        {renderRings()}
        
        {/* Punto central con efecto de pulso */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          {...animations.centerDot}
        >
          <motion.div
            className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full"
            animate={!isReducedMotion ? { 
              opacity: [0.3, 0.7, 0.3],
              scale: [0.9, 1.1, 0.9]
            } : {}}
            transition={!isReducedMotion ? { 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            } : {}}
          />
        </motion.div>
      </div>

      {/* Texto con animación sutil */}
      <motion.div
        className="text-center"
        {...animations.textPulse}
      >
        <motion.p 
          className="text-lg sm:text-xl font-medium text-white mb-2"
        >
          Cargando Quantum Gateway
        </motion.p>
        <motion.p 
          className="text-xs sm:text-sm text-gray-300"
          animate={!isReducedMotion ? { x: [-1, 1, -1] } : {}}
          transition={!isReducedMotion ? { 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          } : {}}
        >
          Preparando tu experiencia...
        </motion.p>
      </motion.div>

      {/* Barra de progreso con animación suave */}
      <div className="w-64 h-2 mt-8 overflow-hidden bg-gray-800 rounded-full">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"
          {...animations.progressBar}
        />
        <motion.span 
          className="absolute mt-2 text-xs text-white"
          style={{ left: '50%', transform: 'translateX(-50%)' }}
        >
          {Math.round(progress)}%
        </motion.span>
      </div>
    </motion.div>
  )
}