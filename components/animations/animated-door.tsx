"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Key, Sparkles, Star } from "lucide-react"

interface AnimatedDoorProps {
  isOpen?: boolean
  onDoorClick?: () => void
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

export default function AnimatedHotelDoor({ 
  isOpen: externalIsOpen, 
  onDoorClick, 
  hotelName = "GATEWAY" 
}: AnimatedDoorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [glowIntensity, setGlowIntensity] = useState(0)
  const doorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen)
      if (externalIsOpen && !isOpen) {
        generateQuantumParticles()
      }
    }
  }, [externalIsOpen, isOpen])

  const generateQuantumParticles = () => {
    if (doorRef.current) {
      const doorRect = doorRef.current.getBoundingClientRect()
      const centerX = doorRect.width / 2
      const centerY = doorRect.height / 2

      const newParticles = Array.from({ length: 150 }).map((_, i) => ({
        id: i,
        x: centerX,
        y: centerY,
        size: Math.random() * 8 + 4,
        opacity: Math.random() * 0.9 + 0.1,
        speed: Math.random() * 2 + 1,
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * 200 + 120,
        color: `hsl(${Math.random() * 30 + 40}, 100%, ${Math.random() * 30 + 60}%)`,
      }))

      setParticles(newParticles)
      setGlowIntensity(1)

      setTimeout(() => {
        setParticles([])
        setGlowIntensity(0)
      }, 4000)
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
    <div className="relative w-80 h-[34rem] cursor-pointer group perspective-[1200px]" onClick={handleClick}>
      {/* Fondo ambiental con efecto de profundidad */}
      <div className={`absolute inset-0 rounded-xl transition-all duration-1000 overflow-hidden ${isOpen ? "bg-gradient-to-b from-amber-100/50 to-yellow-50/80" : "bg-gradient-to-br from-gray-900 to-gray-800"}`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.7))]" />
      </div>

      {/* Marco exterior tipo hotel de lujo */}
      <div className="absolute inset-0 p-4 rounded-2xl bg-gradient-to-br from-amber-900/40 to-amber-700/20 shadow-[inset_0_0_30px_rgba(212,175,55,0.3)] border-2 border-amber-700/50 z-10 overflow-hidden">
        {/* Patrón decorativo en el marco - estilo Art Deco */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(212,175,55,0.1)_25%,transparent_25%,transparent_50%,rgba(212,175,55,0.1)_50%,rgba(212,175,55,0.1)_75%,transparent_75%,transparent)] bg-[length:16px_16px] opacity-30" />
        
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-inner overflow-hidden">
          {/* Detalles ornamentales - placa de hotel */}
          <div className="absolute top-4 left-0 right-0 flex justify-center z-30">
            <div className="px-6 py-2 bg-gradient-to-r from-amber-800 to-amber-700 rounded-md border border-amber-500/50 shadow-lg">
              <span className="text-amber-200 font-serif text-lg tracking-wider">{hotelName}</span>
            </div>
          </div>
          
          {/* Indicador de estrellas */}
          <div className="absolute top-16 left-0 right-0 flex justify-center gap-1 z-30">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
            ))}
          </div>
          
          {/* Puerta principal */}
          <motion.div
            ref={doorRef}
            className="absolute inset-0 rounded-lg bg-gradient-to-br from-amber-900 to-amber-950 border border-amber-600/30"
            animate={{
              rotateY: isOpen ? -120 : 0,
              boxShadow: isOpen 
                ? "0 0 80px rgba(245, 158, 11, 0.6), 0 0 150px rgba(217, 119, 6, 0.5)"
                : "inset 0 0 40px rgba(120, 53, 15, 0.6), 0 0 30px rgba(180, 83, 9, 0.3)",
            }}
            transition={{
              type: "spring",
              stiffness: isOpen ? 40 : 100,
              damping: 10,
              mass: 3,
            }}
            style={{
              transformOrigin: "left center",
              backfaceVisibility: "hidden",
              zIndex: 20,
            }}
          >
            {/* Textura de madera de alta calidad */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620503374956-c942862f0372?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-overlay" />
            
            {/* Patrón decorativo de la puerta - estilo hotel */}
            <div className="absolute inset-8 border-2 border-amber-800/30 rounded-md"></div>
            <div className="absolute inset-12 border border-amber-700/20 rounded-sm"></div>
            <div className="absolute inset-0 grid grid-cols-2 gap-0">
              <div className="border-r border-amber-800/10"></div>
              <div></div>
            </div>
            
            {/* Panel superior con número de habitación */}
            <div className="absolute top-24 left-0 right-0 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-700 to-amber-800 flex items-center justify-center border-4 border-amber-600/30 shadow-lg">
                <span className="text-amber-200 font-serif text-xl font-semibold">501</span>
              </div>
            </div>
            
            {/* Detalles de la puerta */}
            <div className="absolute inset-0 flex flex-col items-center justify-between p-6 pointer-events-none">
              {/* Parte superior - Detalles ornamentales */}
              <div className="w-full h-20 flex justify-center mt-32">
                <div className="w-48 h-2 bg-gradient-to-r from-transparent via-amber-700/50 to-transparent"></div>
              </div>
              
              {/* Manija de la puerta - Reposicionada al centro-derecha */}
              <div className="absolute top-1/2 right-12 transform -translate-y-1/2">
                <motion.div 
                  className="flex flex-col items-center"
                  animate={{
                    x: isOpen ? 20 : 0,
                    rotate: isOpen ? 15 : 0
                  }}
                  transition={{
                    type: "spring",
                    delay: isOpen ? 0.2 : 0
                  }}
                >
                  {/* Placa de la cerradura */}
                  <div className="w-10 h-16 bg-gradient-to-b from-amber-200 to-amber-400 rounded-sm border border-amber-300 shadow-md"></div>
                  
                  {/* Manija principal */}
                  <div className="relative -mt-8">
                    <div className="w-20 h-8 bg-gradient-to-r from-amber-300 to-amber-500 rounded-full shadow-lg border border-amber-200 flex items-center justify-center">
                      <div className="w-16 h-4 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full border border-amber-300/50"></div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Parte inferior - Decoración */}
              <div className="w-full flex justify-center mt-auto">
                <div className="w-48 h-2 bg-gradient-to-r from-transparent via-amber-700/50 to-transparent"></div>
              </div>
            </div>
            
            {/* Efecto de luz dorada */}
            <motion.div 
              className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(245,158,11,0.3),transparent_70%)] pointer-events-none"
              animate={{ opacity: glowIntensity }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Mirilla */}
            <div className="absolute top-1/5 left-1/2 transform -translate-x-1/2 -translate-y-6 w-6 h-6 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 border-2 border-amber-700/60 shadow-inner"></div>
          </motion.div>
        </div>
      </div>

      {/* Marco decorativo exterior adicional */}
      <div className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-b from-amber-800/20 to-transparent opacity-50"></div>
      <div className="absolute -inset-2 -z-20 rounded-3xl bg-gradient-to-b from-amber-700/10 to-transparent opacity-30"></div>

      {/* Quantum Partículas mejoradas */}
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

      {/* Efecto de destello al abrir */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute inset-0 bg-amber-50/30 pointer-events-none z-25"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Indicador de acción mejorado */}
      <motion.div
        className="absolute bottom-4 left-0 right-0 flex items-center justify-center text-sm z-30"
        animate={{
          y: isOpen ? 40 : 0,
          opacity: isOpen ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <motion.div
          className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-900/60 to-amber-800/60 backdrop-blur-sm border border-amber-500/30 flex items-center gap-3 shadow-lg"
          initial={{ scale: 0.9, opacity: 0.9 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 10,
            repeat: Infinity,
            repeatType: "mirror",
            duration: 2
          }}
          whileHover={{ scale: 1.05 }}
        >
          <Sparkles className="w-5 h-5 text-amber-300" />
          <p className="font-serif text-amber-100 text-shadow shadow-amber-900/50">Descubra la elegancia que le espera</p>
          <Key className="w-5 h-5 text-amber-300" />
        </motion.div>
      </motion.div>

      {/* Luz ambiental del pasillo cuando se abre */}
      {isOpen && (
        <motion.div 
          className="absolute left-0 top-0 bottom-0 w-full h-full z-15"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            background: "radial-gradient(circle at left center, rgba(251, 191, 36, 0.3) 0%, transparent 70%)",
            filter: "blur(20px)"
          }}
        />
      )}
    </div>
  )
}