"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Key, Lock, Unlock, Sparkles } from "lucide-react"

interface AnimatedKeyProps {
  isRotating?: boolean
  onKeyClick?: () => void
}

const PARTICLE_COLORS = [
  "#60a5fa", // blue-400
  "#8b5cf6", // violet-500
  "#34d399", // emerald-400
  "#fbbf24", // amber-400
  "#f472b6", // pink-400
  "#10b981", // emerald-500
  "#3b82f6", // blue-500
]

export default function AnimatedKey({ isRotating: externalIsRotating, onKeyClick }: AnimatedKeyProps) {
  const [isRotating, setIsRotating] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; color: string }[]>([])
  const [showHint, setShowHint] = useState(true)
  const keyRef = useRef<HTMLDivElement>(null)
  const lockRef = useRef<HTMLDivElement>(null)

  // Sync with external state if provided
  useEffect(() => {
    if (externalIsRotating !== undefined) {
      setIsRotating(externalIsRotating)

      if (externalIsRotating && !isRotating) {
        setTimeout(() => {
          generateParticles()
          setUnlocked(true)
          setShowHint(false)
        }, 1000)
      }
    }
  }, [externalIsRotating, isRotating])

  // Hide hint after delay
  useEffect(() => {
    if (showHint) {
      const timer = setTimeout(() => setShowHint(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showHint])

  const generateParticles = () => {
    if (lockRef.current) {
      const rect = lockRef.current.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const newParticles = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: centerX,
        y: centerY,
        size: Math.random() * 5 + 2,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      }))

      setParticles(newParticles)

      // Clear particles after animation
      setTimeout(() => setParticles([]), 2000)
    }
  }

  const handleClick = () => {
    if (!isRotating) {
      setIsRotating(true)
      setShowHint(false)

      setTimeout(() => {
        generateParticles()
        setUnlocked(true)
        onKeyClick?.()
      }, 1000)
    } else if (unlocked) {
      onKeyClick?.()
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-80 w-72">
      {/* Hint animation */}
      <AnimatePresence>
        {showHint && !isRotating && !unlocked && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-20 h-20 rounded-full bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
            >
              <motion.div
                animate={{ rotate: [0, 90, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
              >
                <Key className="w-10 h-10 text-emerald-400" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        {/* Glow effect when unlocked */}
        <AnimatePresence>
          {unlocked && (
            <motion.div
              className="absolute -inset-4 rounded-full pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.6, 0],
                background: [
                  "radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, rgba(0, 0, 0, 0) 70%)",
                  "radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(0, 0, 0, 0) 70%)",
                ],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, repeat: 3, repeatType: "reverse" }}
            />
          )}
        </AnimatePresence>

        {/* Lock body */}
        <div
          ref={lockRef}
          className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border-4 border-gray-700 shadow-xl relative overflow-hidden"
        >
          {/* Metallic texture */}
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNwYXR0ZXJuKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')]"></div>
          
          {/* Lock keyhole */}
          <div className="absolute w-10 h-1.5 bg-black/80 rounded-full"></div>

          {/* Lock status indicator */}
          <AnimatePresence mode="wait">
            {unlocked ? (
              <motion.div
                key="unlocked"
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <Unlock className="w-4 h-4 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="locked"
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center shadow-md"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <Lock className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Key */}
          <motion.div
            ref={keyRef}
            className="cursor-pointer relative z-10"
            onClick={handleClick}
            animate={isRotating ? { rotate: 360 } : {}}
            transition={
              isRotating
                ? {
                    duration: 1,
                    ease: [0.16, 1, 0.3, 1],
                  }
                : {}
            }
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              {/* Key head */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 border-2 border-yellow-700 flex items-center justify-center shadow-lg">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400 border border-yellow-500"></div>
              </div>

              {/* Key body */}
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-5 h-16 bg-gradient-to-b from-yellow-300 to-yellow-600 border border-yellow-700">
                {/* Key teeth */}
                <div className="absolute top-7 right-0 w-3.5 h-2 bg-yellow-600 border-t border-r border-b border-yellow-700"></div>
                <div className="absolute top-10 right-0 w-2.5 h-2 bg-yellow-600 border-t border-r border-b border-yellow-700"></div>
                <div className="absolute top-14 right-0 w-4 h-2 bg-yellow-600 border-t border-r border-b border-yellow-700"></div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Particles */}
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                x: particle.x,
                y: particle.y,
                zIndex: 20,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                x: particle.x + (Math.random() * 120 - 60),
                y: particle.y + (Math.random() * 120 - 60),
                opacity: [1, 0],
                scale: [0, 1.5, 0],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: Math.random() * 1 + 0.5,
                ease: "easeOut",
              }}
            />
          ))}
        </AnimatePresence>

        {/* Decorative ring */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-36 h-36 rounded-full border-2 border-dashed border-gray-600/50"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity }}
          />
        </div>
      </div>

      {/* Unlocked message */}
      <AnimatePresence>
        {unlocked && (
          <motion.div
            className="mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold flex items-center gap-3 cursor-pointer shadow-lg hover:shadow-emerald-500/20"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            onClick={handleClick}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)" }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 0.5, repeat: 3, repeatType: "loop" }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            ¡Acceso Concedido!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status text */}
      <AnimatePresence>
        <motion.p
          className="mt-5 text-center text-sm font-medium px-4 py-2 rounded-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            color: unlocked ? "#34d399" : "#9ca3af",
            background: unlocked ? "rgba(16, 185, 129, 0.1)" : "rgba(0, 0, 0, 0.3)",
          }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {unlocked ? "Haz clic para continuar" : isRotating ? "Girando llave..." : "Haz clic para girar"}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}