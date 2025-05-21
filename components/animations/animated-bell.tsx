"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Bell, ChevronRight, Star } from "lucide-react"

interface AnimatedBellProps {
  isRinging?: boolean
  showMessage?: boolean
  hotelName?: string
}

type Particle = {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  speed: number
  color: string
  delay: number
}

type SoundWave = {
  id: number
  delay: number
  duration: number
  scale: number
}

export default function EnhancedAnimatedBell({
  isRinging: externalIsRinging,
  showMessage: externalShowMessage,
  hotelName = "GATEWAY"
}: AnimatedBellProps) {
  const [internalIsRinging, setInternalIsRinging] = useState(false)
  const [internalShowMessage, setInternalShowMessage] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [soundWaves, setSoundWaves] = useState<SoundWave[]>([])
  const [bellPressed, setBellPressed] = useState(false)
  const bellRef = useRef<HTMLDivElement>(null)

  const isRinging = externalIsRinging !== undefined ? externalIsRinging : internalIsRinging
  const showMessage = externalShowMessage !== undefined ? externalShowMessage : internalShowMessage

  useEffect(() => {
    if (externalIsRinging !== undefined && externalIsRinging && !isRinging) {
      setInternalIsRinging(true)
      generateParticles()
      generateSoundWaves()
    }
  }, [externalIsRinging, isRinging])

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

      // Una variedad de colores complementarios para las partículas
      const colors = [
        'rgba(253, 224, 71, 0.85)', // yellow-300
        'rgba(250, 204, 21, 0.85)', // yellow-400
        'rgba(234, 179, 8, 0.85)',  // yellow-500
        'rgba(217, 119, 6, 0.85)',  // amber-600
        'rgba(245, 158, 11, 0.85)', // amber-500
        'rgba(251, 191, 36, 0.85)', // amber-400
      ]

      const newParticles = Array.from({ length: 35 }).map((_, i) => ({
        id: i,
        x: centerX,
        y: centerY,
        size: Math.random() * 6 + 2,
        opacity: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 1.5 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.2
      }))

      setParticles(newParticles)
      setTimeout(() => setParticles([]), 2000)
    }
  }

  const generateSoundWaves = () => {
    const waves = Array.from({ length: 4 }).map((_, i) => ({
      id: i,
      delay: i * 0.15,
      duration: 1.2 + Math.random() * 0.3,
      scale: 1 + i * 0.3
    }))

    setSoundWaves(waves)
    setTimeout(() => setSoundWaves([]), 2000)
  }

  const handleBellPress = () => {
    if (!isRinging && !showMessage) {
      setBellPressed(true)
      setTimeout(() => setBellPressed(false), 300)
      setInternalIsRinging(true)
      generateParticles()
      generateSoundWaves()
      
      // Auto show confirmation after a delay
      setTimeout(() => {
        setInternalIsRinging(false)
        setInternalShowMessage(true)
      }, 3000)
    }
  }

  const bellVariants = {
    ringing: {
      rotate: [0, 15, -15, 12, -12, 8, -8, 5, -5, 0],
      transition: { 
        duration: 1.8, 
        ease: [0.45, 0, 0.55, 1],
        times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.65, 0.8, 0.9, 1]
      }
    },
    pressed: {
      scale: 0.92,
      transition: { duration: 0.2 }
    },
    idle: { 
      rotate: 0,
      scale: 1
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-[26rem] w-[20rem]">
      {/* Hotel branding */}
      <div className="absolute top-5 left-0 right-0 flex justify-center">
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
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"></div>
      </div>

      {/* Background ambient glow */}
      <motion.div
        className="absolute w-full h-full rounded-3xl"
        style={{
          background: "radial-gradient(circle at center, rgba(245, 158, 11, 0.02) 0%, transparent 70%)",
        }}
        animate={{
          opacity: isRinging ? [0.2, 0.6, 0.2] : 0.2
        }}
        transition={{ 
          duration: 2, 
          repeat: isRinging ? Infinity : 0, 
          repeatType: "reverse" 
        }}
      />

      {/* Glowing ring */}
      <motion.div
        className="absolute w-48 h-48 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)"
        }}
        animate={{ 
          scale: isRinging ? [1, 1.15, 1] : 1,
          opacity: isRinging ? [0.6, 0.8, 0.6] : 0.6
        }}
        transition={{ 
          duration: 1.5, 
          repeat: isRinging ? Infinity : 0,
          repeatType: "reverse"
        }}
      />

      {/* Sound waves */}
      <AnimatePresence>
        {soundWaves.map(wave => (
          <motion.div
            key={wave.id}
            className="absolute rounded-full border border-amber-400/30"
            style={{ width: 100, height: 100 }}
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{
              scale: wave.scale + 0.8,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: wave.duration,
              delay: wave.delay,
              ease: "easeOut"
            }}
          />
        ))}
      </AnimatePresence>

      {/* Bell Container */}
      <motion.div
        className="relative z-10 p-8 rounded-full cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBellPress}
      >
        {/* Bell shine effect */}
        <div className="absolute -inset-1 bg-gradient-to-tr from-amber-300/20 to-amber-100/10 blur opacity-70 rounded-full"></div>
        
        {/* Bell Base */}
        <motion.div
          className="relative z-20 bg-gradient-to-b from-amber-800/80 to-amber-900/80 p-5 rounded-full shadow-lg backdrop-blur-xl border border-amber-600/30"
          variants={bellVariants}
          animate={
            isRinging 
              ? "ringing" 
              : bellPressed 
                ? "pressed"
                : "idle"
          }
        >
          {/* Bell inner shine */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-amber-200/10 to-transparent"></div>
          
          {/* Bell icon with refined styling */}
          <motion.div
            ref={bellRef}
            className="relative"
          >
            <Bell className="w-16 h-16 text-amber-300 drop-shadow-xl" strokeWidth={2} />
            
            {/* Bell highlight */}
            <div className="absolute top-1 left-1 w-4 h-4 bg-amber-100/30 rounded-full blur-sm"></div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Particles */}
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute rounded-full pointer-events-none z-10"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color.replace('0.85)', '0.6)')}`,
            }}
            initial={{ 
              x: "50%", 
              y: "50%", 
              opacity: 0,
              scale: 0.2
            }}
            animate={{ 
              x: `calc(50% + ${(Math.random() - 0.5) * 160}px)`,
              y: `calc(50% + ${(Math.random() - 0.5) * 160}px)`,
              opacity: [0, p.opacity, 0],
              scale: [0.2, 1, 0.5],
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ 
              duration: p.speed * 1.5, 
              ease: "easeOut",
              delay: p.delay
            }}
          />
        ))}
      </AnimatePresence>

      {/* Confirmation message */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            className="absolute top-full -mt-4 py-4 px-6 text-white rounded-2xl bg-gradient-to-br from-emerald-600/90 to-emerald-800/90 flex items-center gap-4 shadow-2xl z-10 border border-emerald-400/20 backdrop-blur-sm"
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            {/* Success check mark with pulse effect */}
            <motion.div
              className="relative bg-white/10 rounded-full p-2 backdrop-blur-sm border border-emerald-300/30"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                delay: 0.2
              }}
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-emerald-400/30"
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.7, 0, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
              <Check className="w-6 h-6 text-emerald-300" strokeWidth={3} />
            </motion.div>
            
            {/* Message text with better typography */}
            <div className="flex flex-col">
              <motion.span 
                className="text-base font-bold text-emerald-100"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                ¡Reserva Confirmada!
              </motion.span>
              
              <motion.span 
                className="block text-sm text-emerald-200/80 mt-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                Estamos preparando todo para su llegada
              </motion.span>
            </div>
            
            {/* Decorative arrow */}
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ChevronRight className="w-5 h-5 text-emerald-300/70" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status indicator */}
      <motion.div
        className="absolute bottom-6 left-0 right-0 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="px-6 py-3 rounded-full backdrop-blur-md flex items-center gap-2 shadow-md border"
          animate={{
            background: showMessage
              ? "rgba(16, 185, 129, 0.15)"
              : isRinging
                ? "rgba(245, 158, 11, 0.15)"
                : "rgba(255, 255, 255, 0.05)",
            color: showMessage
              ? "#d1fae5"
              : isRinging
                ? "#fcd34d"
                : "#e5e7eb",
            borderColor: showMessage
              ? "rgba(16, 185, 129, 0.3)"
              : isRinging
                ? "rgba(245, 158, 11, 0.3)"
                : "rgba(255, 255, 255, 0.1)",
          }}
          transition={{ duration: 0.4 }}
        >
          {/* Animated status dot */}
          <motion.div 
            className="w-2 h-2 rounded-full"
            animate={{
              backgroundColor: showMessage
                ? "#10b981"
                : isRinging
                  ? "#f59e0b" 
                  : "#e5e7eb",
              scale: isRinging ? [1, 1.5, 1] : 1
            }}
            transition={{ 
              duration: 1, 
              repeat: isRinging ? Infinity : 0,
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
              repeat: isRinging ? Infinity : 0,
              repeatType: "reverse"
            }}
          >
            {showMessage
              ? "¡Servicio confirmado!"
              : isRinging
                ? "Procesando su solicitud..."
                : "Listo para atenderle"}
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  )
}