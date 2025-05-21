"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Bell, BellRing } from "lucide-react"

interface AnimatedBellProps {
  isRinging?: boolean
  showMessage?: boolean
  onBellClick?: () => void
}

export default function AnimatedBell({
  isRinging: externalIsRinging,
  showMessage: externalShowMessage,
  onBellClick,
}: AnimatedBellProps) {
  const [internalIsRinging, setInternalIsRinging] = useState(false)
  const [internalShowMessage, setInternalShowMessage] = useState(false)
  const [particles, setParticles] = useState<{id: number, x: number, y: number, size: number, opacity: number, color: string}[]>([])
  const bellRef = useRef<HTMLDivElement>(null)

  // Derive the actual states
  const isRinging = externalIsRinging !== undefined ? externalIsRinging : internalIsRinging
  const showMessage = externalShowMessage !== undefined ? externalShowMessage : internalShowMessage

  // Sync external states
  useEffect(() => {
    if (externalIsRinging !== undefined) {
      setInternalIsRinging(externalIsRinging)
      if (externalIsRinging) {
        generateParticles()
      }
    }
  }, [externalIsRinging])

  useEffect(() => {
    if (externalShowMessage !== undefined) {
      setInternalShowMessage(externalShowMessage)
    }
  }, [externalShowMessage])

  const generateParticles = () => {
    if (bellRef.current) {
      const bellRect = bellRef.current.getBoundingClientRect()
      const centerX = bellRect.width / 2
      const centerY = bellRect.height / 2

      const newParticles = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        x: centerX,
        y: centerY,
        size: Math.random() * 6 + 3,
        opacity: Math.random() * 0.7 + 0.3,
        color: `hsl(${Math.random() * 60 + 30}, 100%, ${Math.random() * 30 + 60}%)`
      }))

      setParticles(newParticles)

      setTimeout(() => {
        setParticles([])
      }, 1500)
    }
  }

  const handleClick = () => {
    if (onBellClick) {
      onBellClick()
    }
    
    if (externalIsRinging === undefined && !isRinging && !showMessage) {
      setInternalIsRinging(true)
      generateParticles()
      setTimeout(() => setInternalIsRinging(false), 1500)
    }
  }

  const bellVariants = {
    ringing: {
      rotate: [0, 15, -15, 15, -15, 10, -10, 5, -5, 0],
      y: [0, -5, 0, -3, 0],
      transition: {
        duration: 1.5,
        ease: "easeInOut"
      }
    },
    idle: {
      rotate: 0,
      y: 0
    }
  }

  const soundWaveVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: (i: number) => ({
      opacity: [0, 0.6 - (i * 0.2), 0],
      scale: 1 + (i * 0.7),
      transition: {
        duration: 1.8,
        repeat: 2,
        repeatType: "loop" as "loop",
        delay: i * 0.25
      }
    })
  }

  const particleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (custom: any) => ({
      opacity: [0, custom.opacity, 0],
      x: custom.x + (Math.random() - 0.5) * 60,
      y: custom.y - Math.random() * 80 - 20,
      scale: [0.3, 1, 0],
      transition: {
        duration: 1.2,
        ease: "easeOut"
      }
    })
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-96 w-72">
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          opacity: isRinging ? [0, 0.3, 0] : 0,
          background: "radial-gradient(circle, rgba(250, 204, 21, 0.3) 0%, rgba(0, 0, 0, 0) 70%)",
        }}
        transition={{ duration: 1.5, repeat: isRinging ? 2 : 0 }}
      />

      {/* Bell container */}
      <motion.div
        ref={bellRef}
        className="cursor-pointer relative w-full h-2/3 flex items-center justify-center"
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        variants={bellVariants}
        animate={isRinging ? "ringing" : "idle"}
      >
        {/* Detailed bell with modern design */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Bell top with shine */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-3.5 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-t-md shadow-sm z-10">
            <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-yellow-200/80 rounded-full"></div>
          </div>
          
          {/* Bell body with metallic shine */}
          <div className="relative w-24 h-20 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-t-full shadow-xl border border-yellow-400 overflow-hidden">
            {/* Metal shine effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4)_0%,transparent_70%)]"></div>
            
            {/* Detailed rings */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-yellow-200/90 via-yellow-300/90 to-yellow-200/90 rounded-full"></div>
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-22 h-0.5 bg-gradient-to-r from-yellow-200/80 via-yellow-300/80 to-yellow-200/80 rounded-full"></div>
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-yellow-200/70 via-yellow-300/70 to-yellow-200/70 rounded-full"></div>
          </div>
          
          {/* Bell bottom with thickness */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-gradient-to-b from-yellow-500 to-yellow-600 rounded-b-full shadow-md">
            <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-22 h-0.5 bg-yellow-300/30 rounded-full"></div>
          </div>
          
          {/* Bell clapper with movement */}
          <motion.div 
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-8 bg-gradient-to-b from-yellow-600 to-yellow-700 rounded-full shadow-inner"
            animate={{
              y: isRinging ? [0, 2, -1, 1, 0] : 0
            }}
            transition={{
              duration: 1.5,
              repeat: isRinging ? 2 : 0
            }}
          >
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-yellow-800 rounded-full"></div>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-yellow-200 rounded-full shadow-sm"></div>
          <div className="absolute top-6 right-1/4 transform translate-y-1/2 w-1 h-1 bg-yellow-200 rounded-full shadow-sm"></div>
          <div className="absolute top-6 left-1/4 transform translate-y-1/2 w-1 h-1 bg-yellow-200 rounded-full shadow-sm"></div>
        </div>

        {/* Sound waves with improved effect */}
        {isRinging && (
          <>
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-yellow-400/40 rounded-full pointer-events-none"
                style={{
                  width: 100 + (i * 40),
                  height: 100 + (i * 40),
                  boxShadow: `0 0 ${i * 5}px rgba(250, 204, 21, ${0.4 - (i * 0.1)})`
                }}
                custom={i}
                variants={soundWaveVariants}
                initial="initial"
                animate="animate"
              />
            ))}
          </>
        )}

        {/* Particles effect */}
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: particle.size,
                height: particle.size,
                background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
                filter: "blur(0.5px)"
              }}
              custom={particle}
              variants={particleVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Success message with improved design */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            className="absolute top-full mt-6 p-4 text-center text-white rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center gap-3 shadow-xl cursor-pointer z-10 border border-emerald-400/30"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={handleClick}
            whileHover={{ 
              scale: 1.03,
              boxShadow: "0 5px 20px rgba(16, 185, 129, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="bg-white rounded-full p-1.5 shadow-md"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
            >
              <Check className="w-5 h-5 text-green-600" />
            </motion.div>
            <div>
              <span className="text-sm font-semibold block">¡Reserva Confirmada!</span>
              <span className="text-xs font-light opacity-90">Haz clic para continuar</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status text with animation */}
      <motion.div 
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.p
          className="text-sm px-5 py-2 rounded-full backdrop-blur-sm bg-white/10 text-gray-200 inline-block"
          animate={{
            background: showMessage 
              ? "rgba(16, 185, 129, 0.1)" 
              : isRinging 
                ? "rgba(234, 179, 8, 0.1)"
                : "rgba(255, 255, 255, 0.1)",
            color: showMessage 
              ? "rgb(209, 250, 229)" 
              : isRinging 
                ? "rgb(253, 230, 138)"
                : "rgb(229, 231, 235)"
          }}
          transition={{ duration: 0.3 }}
        >
          {showMessage 
            ? "¡Listo!" 
            : isRinging 
              ? "Procesando tu solicitud..." 
              : "Toca la campana para llamar"}
        </motion.p>
      </motion.div>
    </div>
  )
}