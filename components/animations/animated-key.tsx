"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Key, Lock, Unlock, Sparkles, Star } from "lucide-react"

interface AnimatedKeyProps {
  isRotating?: boolean
  hotelName?: string
}

type Particle = {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  speed: number
  angle: number
  distance: number
  color: string
}

export default function QuantumKey({ 
  isRotating: externalIsRotating, 
  hotelName = "GATEWAY" 
}: AnimatedKeyProps) {
  const [isRotating, setIsRotating] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [glowIntensity, setGlowIntensity] = useState(0)
  const keyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (externalIsRotating !== undefined) {
      setIsRotating(externalIsRotating)

      if (externalIsRotating && !isRotating) {
        const unlockTimeout = setTimeout(() => {
          generateQuantumParticles()
          setUnlocked(true)
        }, 1000)
        return () => clearTimeout(unlockTimeout)
      }
    }
  }, [externalIsRotating, isRotating])

  const generateQuantumParticles = () => {
    if (keyRef.current) {
      const rect = keyRef.current.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const newParticles = Array.from({ length: 80 }).map((_, i) => ({
        id: i,
        x: centerX,
        y: centerY,
        size: Math.random() * 6 + 3,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 1.5 + 0.8,
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * 120 + 80,
        color: `hsl(${Math.random() * 60 + 160}, 100%, ${Math.random() * 30 + 60}%)`,
      }))

      setParticles(newParticles)
      setGlowIntensity(1)

      setTimeout(() => {
        setParticles([])
        setGlowIntensity(0)
      }, 3000)
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-[28rem] w-80">
      {/* Fondo ambiental */}
      <div className={`absolute inset-0 rounded-2xl transition-all duration-1000 overflow-hidden ${
        unlocked ? "bg-gradient-to-b from-emerald-100/30 to-teal-50/40" : "bg-gradient-to-br from-gray-900 to-gray-800"
      }`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.7))]" />
      </div>

      {/* Hotel branding */}
      <div className="absolute top-6 left-0 right-0 flex justify-center z-10">
        <div className="px-6 py-2 bg-gradient-to-r from-amber-800/60 to-amber-700/60 rounded-md backdrop-blur-sm border border-amber-500/30 shadow-lg">
          <div className="flex flex-col items-center">
            <span className="text-amber-200 font-serif tracking-wider">{hotelName}</span>
            <div className="flex mt-1 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-amber-300 fill-amber-300" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-24 left-0 right-0 flex justify-center">
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent"></div>
      </div>

      {/* Glow effect when unlocked */}
      <AnimatePresence>
        {unlocked && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none z-5"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.4, 0],
              background: "radial-gradient(circle at center, rgba(16,185,129,0.3) 0%, transparent 70%)",
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, repeat: 2, repeatType: "reverse" }}
          />
        )}
      </AnimatePresence>

      {/* Main key container */}
      <div className="relative z-20">
        {/* Lock body */}
        <motion.div
          ref={keyRef}
          className={`w-40 h-40 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden ${
            unlocked 
              ? "bg-gradient-to-br from-emerald-600/90 to-emerald-800/90 border-4 border-emerald-400/60" 
              : "bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-gray-700"
          }`}
          animate={isRotating ? { rotate: 360 } : { rotate: 0 }}
          transition={isRotating ? { duration: 1.5, repeat: Infinity, ease: "linear" } : { duration: 0.5 }}
        >
          {/* Inner shine */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)]" />
          
          {/* Lock/Unlock icon */}
          <AnimatePresence mode="wait">
            {unlocked ? (
              <motion.div
                key="unlock"
                initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <Unlock className="w-16 h-16 text-emerald-300 drop-shadow-lg" strokeWidth={1.5} />
                {/* Icon highlight */}
                <div className="absolute top-2 left-2 w-4 h-4 bg-white/30 rounded-full blur-sm"></div>
              </motion.div>
            ) : (
              <motion.div
                key="lock"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <Lock className="w-16 h-16 text-gray-300 drop-shadow-lg" strokeWidth={1.5} />
                {/* Icon highlight */}
                <div className="absolute top-2 left-2 w-4 h-4 bg-white/30 rounded-full blur-sm"></div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Efecto de luz */}
          <motion.div 
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.3),transparent_70%)] pointer-events-none"
            animate={{ opacity: glowIntensity }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>

        {/* Quantum Particles */}
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: particle.size,
                height: particle.size,
                opacity: particle.opacity,
                x: particle.x,
                y: particle.y,
                zIndex: 30,
                background: `radial-gradient(circle at center, ${particle.color} 0%, transparent 70%)`,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
              }}
              initial={{ opacity: 0 }}
              animate={{
                x: particle.x + Math.cos(particle.angle) * particle.distance,
                y: particle.y + Math.sin(particle.angle) * particle.distance,
                opacity: [0, particle.opacity, 0],
                scale: [0.3, 1.8, 0],
                rotate: [0, Math.random() * 360],
              }}
              transition={{
                duration: particle.speed,
                ease: "easeOut",
                delay: Math.random() * 0.3
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Unlocked Message - Enhanced */}
      <AnimatePresence>
        {unlocked && (
          <motion.div
            className="absolute top-64 mt-8 px-8 py-4 rounded-xl bg-gradient-to-br from-emerald-600/90 to-emerald-800/90 text-white font-semibold flex items-center gap-4 shadow-2xl z-20 border border-emerald-400/30 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            {/* Sparkles animation */}
            <motion.div
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
              className="relative"
            >
              <Sparkles className="w-6 h-6 text-emerald-300" />
              <div className="absolute -inset-1 bg-emerald-400/20 rounded-full blur-sm"></div>
            </motion.div>
            
            {/* Message with better typography */}
            <div className="flex flex-col">
              <motion.span 
                className="text-lg font-bold text-emerald-100 tracking-wide"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                ¡Acceso Cuántico Concedido!
              </motion.span>
              
              <motion.span 
                className="block text-sm text-emerald-200/80 mt-1 font-serif"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                Bienvenido a una experiencia dimensional única
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Text - Enhanced */}
      <motion.div
        className="absolute bottom-8 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="px-6 py-3 rounded-full backdrop-blur-md flex items-center gap-2 shadow-md border"
          animate={{
            background: unlocked
              ? "rgba(16, 185, 129, 0.15)"
              : isRotating
                ? "rgba(245, 158, 11, 0.15)"
                : "rgba(255, 255, 255, 0.05)",
            color: unlocked
              ? "#d1fae5"
              : isRotating
                ? "#fcd34d"
                : "#e5e7eb",
            borderColor: unlocked
              ? "rgba(16, 185, 129, 0.3)"
              : isRotating
                ? "rgba(245, 158, 11, 0.3)"
                : "rgba(255, 255, 255, 0.1)",
          }}
          transition={{ duration: 0.4 }}
        >
          {/* Animated status dot */}
          <motion.div 
            className="w-2 h-2 rounded-full"
            animate={{
              backgroundColor: unlocked
                ? "#10b981"
                : isRotating
                  ? "#f59e0b" 
                  : "#e5e7eb",
              scale: isRotating ? [1, 1.5, 1] : 1
            }}
            transition={{ 
              duration: 1, 
              repeat: isRotating ? Infinity : 0,
              repeatType: "reverse"
            }}
          />
          
          <motion.span 
            className="text-sm font-medium"
            animate={{
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 2, 
              repeat: isRotating ? Infinity : 0,
              repeatType: "reverse"
            }}
          >
            {unlocked
              ? "¡Bienvenido a su suite dimensional!"
              : isRotating
                ? "Autenticando su firma cuántica..."
                : "Espere su acceso privilegiado"}
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Ambient light effect when unlocked */}
      {unlocked && (
        <motion.div 
          className="absolute left-0 top-0 bottom-0 w-full h-full z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            background: "radial-gradient(circle at center, rgba(16, 185, 129, 0.3) 0%, transparent 70%)",
            filter: "blur(20px)"
          }}
        />
      )}
    </div>
  )
}