"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Key, Sparkles } from "lucide-react"

interface AnimatedDoorProps {
  isOpen?: boolean
  onDoorClick?: () => void
}

export default function AnimatedDoor({ isOpen: externalIsOpen, onDoorClick }: AnimatedDoorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [particles, setParticles] = useState<
    {
      id: number
      x: number
      y: number
      size: number
      opacity: number
      speed: number
      angle: number
      distance: number
      color: string
    }[]
  >([])
  const [showWelcome, setShowWelcome] = useState(false)
  const doorRef = useRef<HTMLDivElement>(null)

  // Sync with external state
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen)
      if (externalIsOpen && !isOpen) {
        generateQuantumParticles()
      }
    }
  }, [externalIsOpen, isOpen])

  // Generate quantum energy particles
  const generateQuantumParticles = () => {
    if (doorRef.current) {
      const doorRect = doorRef.current.getBoundingClientRect()
      const centerX = doorRect.width / 2
      const centerY = doorRect.height / 2

      const quantumParticles = Array.from({ length: 80 }).map((_, i) => ({
        id: i,
        x: centerX,
        y: centerY,
        size: Math.random() * 8 + 3,
        opacity: Math.random() * 0.9 + 0.1,
        speed: Math.random() * 1.5 + 0.5,
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * 150 + 100,
        color: `hsl(${Math.random() * 60 + 30}, 100%, ${Math.random() * 30 + 60}%)`
      }))

      setParticles(quantumParticles)
      setShowWelcome(true)

      setTimeout(() => {
        setParticles([])
        setShowWelcome(false)
      }, 3500)
    }
  }

  const handleClick = () => {
    if (!isOpen) {
      setIsOpen(true)
      generateQuantumParticles()
      onDoorClick?.()
    }
  }

  return (
    <div className="relative w-64 h-[28rem] cursor-pointer group perspective-1000" onClick={handleClick}>
      {/* Marco exterior moderno con biseles */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 p-2 shadow-2xl">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-gray-300 to-gray-400 shadow-inner overflow-hidden">
          {/* Puerta principal */}
          <motion.div
            ref={doorRef}
            className="absolute inset-0 bg-gradient-to-br from-amber-800 to-amber-900 rounded-md overflow-hidden"
            animate={{
              rotateY: isOpen ? -90 : 0,
              boxShadow: isOpen 
                ? "0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 165, 0, 0.4)" 
                : "0 5px 25px rgba(0, 0, 0, 0.4)",
            }}
            transition={{
              type: "spring",
              stiffness: isOpen ? 40 : 120,
              damping: isOpen ? 7 : 15,
              mass: 2,
            }}
            style={{
              transformOrigin: "left center",
              backfaceVisibility: "hidden",
              zIndex: 10,
            }}
            whileHover={{
              filter: "brightness(1.15)",
            }}
          >
            {/* Textura de madera sutil */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay"></div>
            </div>

            {/* Número de habitación moderno */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-14 h-10 bg-gradient-to-b from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg border border-yellow-400">
              <span className="text-black font-bold text-xl tracking-tighter">101</span>
            </div>

            {/* Logo QG futurista */}
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-xl border-2 border-yellow-400">
              <span className="text-black font-bold text-2xl tracking-tighter">QG</span>
              <div className="absolute inset-0 rounded-full border border-yellow-300/50 pointer-events-none"></div>
            </div>

            {/* Paneles de la puerta con diseño moderno */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-3 gap-2 p-3 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="border-2 border-amber-700/50 rounded-sm bg-gradient-to-b from-amber-900/30 to-amber-900/10"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              ))}
            </div>

            {/* Manija futurista */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <motion.div 
                className="w-7 h-16 bg-gradient-to-b from-yellow-500 to-yellow-600 rounded-lg border border-yellow-400 shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-300 rounded-full"></div>
              </motion.div>
            </div>

            {/* Sensor biométrico futurista */}
            <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2">
              <motion.div 
                className="w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full shadow-lg border border-yellow-300"
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(250, 204, 21, 0.7)",
                    "0 0 0 12px rgba(250, 204, 21, 0)",
                    "0 0 0 0 rgba(250, 204, 21, 0)",
                  ],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
              />
              <div className="absolute -inset-2 rounded-full border border-yellow-400/30 pointer-events-none"></div>
            </div>

            {/* Efecto de borde luminoso al abrir */}
            <motion.div 
              className="absolute inset-0 rounded-md border-2 pointer-events-none"
              initial={{ borderColor: "transparent" }}
              animate={{ 
                borderColor: isOpen ? "rgba(255, 215, 0, 0.5)" : "transparent",
                boxShadow: isOpen ? "inset 0 0 20px rgba(255, 215, 0, 0.3)" : "none"
              }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </div>
      </div>

      {/* Quantum particles mejoradas */}
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
              zIndex: 20,
              background: `radial-gradient(circle at center, ${particle.color} 0%, transparent 70%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{
              x: particle.x + Math.cos(particle.angle) * particle.distance,
              y: particle.y + Math.sin(particle.angle) * particle.distance,
              opacity: [0, particle.opacity, 0],
              scale: [0.3, 1.5, 0],
              rotate: [0, Math.random() * 360],
            }}
            transition={{
              duration: particle.speed,
              ease: "easeOut",
            }}
          />
        ))}
      </AnimatePresence>

      {/* Interior del portal cuántico */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center rounded-lg overflow-hidden"
        style={{ zIndex: 5 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.8, delay: isOpen ? 0.2 : 0 }}
      >
        {/* Fondo del portal con efecto de profundidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-indigo-900 to-black"></div>
        
        {/* Efecto de energía radial */}
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.2)_0%,transparent_70%)]"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        {/* Anillos de energía dinámicos */}
        <motion.div
          className="absolute rounded-full border-2 border-yellow-400/30"
          style={{
            width: "70%",
            height: "70%",
          }}
          animate={{
            scale: [0.8, 1.3, 0.8],
            opacity: [0.2, 0.6, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
          }}
        />

        <motion.div
          className="absolute rounded-full border border-yellow-400/20"
          style={{
            width: "90%",
            height: "90%",
          }}
          animate={{
            scale: [0.9, 1.2, 0.9],
            opacity: [0.1, 0.4, 0.1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            delay: 1,
          }}
        />

        {/* Efecto de partículas flotantes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-yellow-400/30 rounded-full"
              style={{
                width: Math.random() * 6 + 2,
                height: Math.random() * 6 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, (Math.random() - 0.5) * 40],
                x: [0, (Math.random() - 0.5) * 30],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Mensaje de bienvenida mejorado */}
        {showWelcome && (
          <motion.div
            className="relative z-10 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="text-4xl font-mono text-yellow-100 mb-2 tracking-wider font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500">
                QUANTUM
              </div>
              <div className="text-4xl font-mono text-yellow-300 mb-4 tracking-wider font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                GATEWAY
              </div>
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <Sparkles className="text-yellow-400 mr-2" />
                <div className="text-lg text-yellow-200 font-light">Portal activado</div>
                <Sparkles className="text-yellow-400 ml-2" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Indicador de interacción mejorado */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 py-4 text-center text-sm opacity-90 group-hover:opacity-100 transition-opacity"
        animate={{
          y: isOpen ? 30 : 0,
          opacity: isOpen ? 0 : 0.9,
        }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <motion.div
          className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-600/30 to-yellow-500/30 backdrop-blur-sm border border-yellow-400/30 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
        >
          <Key className="w-5 h-5 text-yellow-300" />
          <p className="font-medium text-yellow-100">
            {isOpen ? "Explorando..." : "Toca para abrir el portal"}
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}