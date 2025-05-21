"use client"

import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import AnimatedDoor from "./animations/animated-door"
import AnimatedBell from "./animations/animated-bell"
import AnimatedKey from "./animations/animated-key"
import { useMediaQuery } from "@/hooks/use-media-query"

type AnimationStep = "door" | "bell" | "key" | "complete"

interface AnimationSequenceProps {
  onComplete: () => void
  stepsConfig?: {
    door?: {
      title: string
      prompt: string
      continueText: string
    }
    bell?: {
      initialTitle: string
      confirmationTitle: string
      successTitle: string
      initialPrompt: string
      confirmationPrompt: string
      successText: string
    }
    key?: {
      initialTitle: string
      successTitle: string
      prompt: string
      successText: string
    }
    complete?: {
      title: string
      loadingText: string
    }
  }
}

const DEFAULT_STEPS_CONFIG = {
  door: {
    title: "Bienvenido a Quantum Gateway",
    prompt: "Toca la puerta para comenzar tu experiencia hotelera digital",
    continueText: "Continuar al sistema de reservas",
  },
  bell: {
    initialTitle: "Solicita tu reserva ahora",
    confirmationTitle: "Confirma los detalles de tu reserva",
    successTitle: "¡Reserva Confirmada con Éxito!",
    initialPrompt: "Toca la campana para iniciar tu reserva",
    confirmationPrompt: "Verifica tus datos y confirma con otro toque",
    successText: "Proceder al check-in digital",
  },
  key: {
    initialTitle: "Check-in Digital",
    successTitle: "¡Check-in Completado!",
    prompt: "Gira la llave para finalizar tu registro",
    successText: "Acceder a tu área personal",
  },
  complete: {
    title: "¡Bienvenido a tu Experiencia Quantum Gateway!",
    loadingText: "Preparando tu estadía personalizada...",
  },
}

export default function AnimationSequence({ 
  onComplete, 
  stepsConfig = DEFAULT_STEPS_CONFIG 
}: AnimationSequenceProps) {
  const [currentStep, setCurrentStep] = useState<AnimationStep>("door")
  const [doorOpen, setDoorOpen] = useState(false)
  const [bellRung, setBellRung] = useState(false)
  const [bellClickCount, setBellClickCount] = useState(0)
  const [reservationSuccess, setReservationSuccess] = useState(false)
  const [keyTurned, setKeyTurned] = useState(false)
  const [accessGranted, setAccessGranted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")

  // Obtener configuración combinada
  const config = useMemo(() => ({
    door: { ...DEFAULT_STEPS_CONFIG.door, ...stepsConfig.door },
    bell: { ...DEFAULT_STEPS_CONFIG.bell, ...stepsConfig.bell },
    key: { ...DEFAULT_STEPS_CONFIG.key, ...stepsConfig.key },
    complete: { ...DEFAULT_STEPS_CONFIG.complete, ...stepsConfig.complete },
  }), [stepsConfig])

  // Escala basada en dispositivo
  const scale = useMemo(() => {
    if (isMobile) return 0.8
    if (isTablet) return 1
    return 1.2
  }, [isMobile, isTablet])

  // Variantes de animación reutilizables
  const animationVariants = useMemo(() => ({
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: 0.8,
          when: "beforeChildren",
          staggerChildren: 0.3,
        },
      },
      exit: {
        opacity: 0,
        transition: { duration: 0.5 },
      },
    },
    item: {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.6 },
      },
    },
    successCircle: {
      animate: {
        scale: [1, 1.2, 1],
        boxShadow: [
          "0 0 0 0 rgba(59, 130, 246, 0.5)",
          "0 0 0 15px rgba(59, 130, 246, 0)",
          "0 0 0 0 rgba(59, 130, 246, 0)",
        ],
      },
      transition: { duration: 1.5, repeat: 0 },
    },
  }), [])

  // Manejadores de eventos
  const handleDoorClick = useCallback(() => {
    if (doorOpen || isTransitioning) return
    setDoorOpen(true)
  }, [doorOpen, isTransitioning])

  const handleDoorContinue = useCallback(() => {
    if (!doorOpen || isTransitioning) return

    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentStep("bell")
      setIsTransitioning(false)
    }, 500)
  }, [doorOpen, isTransitioning])

  const handleBellClick = useCallback(() => {
    if (reservationSuccess || isTransitioning) return

    const newClickCount = bellClickCount + 1
    setBellClickCount(newClickCount)

    if (newClickCount === 1) {
      setBellRung(true)
    } else if (newClickCount === 2) {
      setReservationSuccess(true)
    }
  }, [reservationSuccess, isTransitioning, bellClickCount])

  const handleReservationContinue = useCallback(() => {
    if (!reservationSuccess || isTransitioning) return

    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentStep("key")
      setIsTransitioning(false)
    }, 500)
  }, [reservationSuccess, isTransitioning])

  const handleKeyClick = useCallback(() => {
    if (keyTurned || isTransitioning) return
    setKeyTurned(true)
  }, [keyTurned, isTransitioning])

  const handleAccessContinue = useCallback(() => {
    if (!keyTurned || isTransitioning) return

    setIsTransitioning(true)
    setAccessGranted(true)

    setTimeout(() => {
      onComplete()
    }, 2000)
  }, [keyTurned, isTransitioning, onComplete])

  // Componentes de paso reutilizables
  const renderStepContainer = (
    step: AnimationStep,
    children: React.ReactNode,
    gradientColors: string
  ) => (
    <motion.div
      key={`${step}-step`}
      className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto text-center"
      variants={animationVariants.container}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div className="relative mb-6 inline-block" variants={animationVariants.item}>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r pb-2"
          style={{ backgroundImage: `linear-gradient(to right, ${gradientColors})` }}>
          {getStepTitle(step)}
        </h2>
        <div className="absolute -bottom-2 left-0 right-0 h-0.5"
          style={{ backgroundImage: `linear-gradient(to right, ${gradientColors.replace(/[^,]+(?=\))/g, '0')}, ${gradientColors.split('via')[1].split('to')[0]}, ${gradientColors.replace(/[^,]+(?=\))/g, '0')})` }}></div>
      </motion.div>

      {children}

      <motion.div className="bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full" variants={animationVariants.item}>
        <p className="text-base sm:text-lg text-center text-gray-200">
          {getStepPrompt(step)}
        </p>
      </motion.div>
    </motion.div>
  )

  // Funciones auxiliares para obtener textos
  const getStepTitle = (step: AnimationStep): string => {
    switch (step) {
      case "door": return config.door.title
      case "bell": 
        return reservationSuccess 
          ? config.bell.successTitle 
          : bellRung 
            ? config.bell.confirmationTitle 
            : config.bell.initialTitle
      case "key": return keyTurned ? config.key.successTitle : config.key.initialTitle
      default: return ""
    }
  }

  const getStepPrompt = (step: AnimationStep): string => {
    switch (step) {
      case "door": return doorOpen ? config.door.continueText : config.door.prompt
      case "bell": 
        return reservationSuccess 
          ? config.bell.successText 
          : bellRung 
            ? config.bell.confirmationPrompt 
            : config.bell.initialPrompt
      case "key": return keyTurned ? config.key.successText : config.key.prompt
      default: return ""
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Paso 1: Puerta */}
        {currentStep === "door" && renderStepContainer(
          "door",
          <motion.div
            className={`mb-10 ${doorOpen ? "cursor-pointer" : ""}`}
            onClick={doorOpen ? handleDoorContinue : undefined}
            variants={animationVariants.item}
            style={{ scale }}
          >
            <AnimatedDoor isOpen={doorOpen} onDoorClick={handleDoorClick} />
          </motion.div>,
          "from-purple-400, via-blue-500, to-teal-400"
        )}

        {/* Paso 2: Campana */}
        {currentStep === "bell" && renderStepContainer(
          "bell",
          <motion.div
            className={`mb-10 ${reservationSuccess ? "cursor-pointer" : ""}`}
            onClick={reservationSuccess ? handleReservationContinue : handleBellClick}
            variants={animationVariants.item}
            style={{ scale }}
          >
            <AnimatedBell isRinging={bellRung && !reservationSuccess} showMessage={reservationSuccess} />
          </motion.div>,
          "from-yellow-400, via-amber-500, to-orange-400"
        )}

        {/* Paso 3: Llave */}
        {currentStep === "key" && renderStepContainer(
          "key",
          <motion.div
            className={`mb-10 ${keyTurned ? "cursor-pointer" : ""}`}
            onClick={keyTurned ? handleAccessContinue : undefined}
            variants={animationVariants.item}
            style={{ scale }}
          >
            <AnimatedKey isRotating={keyTurned} onKeyClick={handleKeyClick} />
          </motion.div>,
          "from-green-400, via-emerald-500, to-teal-400"
        )}

        {/* Paso 4: Completado */}
        {accessGranted && (
          <motion.div
            key="complete-step"
            className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20"
              {...animationVariants.successCircle}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>

            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {config.complete.title}
            </motion.h2>

            <motion.div
              className="bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <p className="text-base sm:text-lg text-center text-gray-200">
                {config.complete.loadingText}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}