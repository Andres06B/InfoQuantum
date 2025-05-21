"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import AnimatedDoor from "./animations/animated-door"
import AnimatedBell from "./animations/animated-bell"
import AnimatedKey from "./animations/animated-key"
import { useMediaQuery } from "@/hooks/use-media-query"

type AnimationStep = "door" | "bell" | "key" | "complete"

interface AnimationSequenceProps {
  onComplete: () => void
  stepsConfig?: {
    door?: { title: string; prompt: string }
    bell?: { initialTitle: string; successTitle: string; initialPrompt: string; successText: string }
    key?: { initialTitle: string; successTitle: string; prompt: string; successText: string }
    complete?: { title: string; loadingText: string }
  }
}

const DEFAULT_STEPS_CONFIG = {
  door: {
    title: "Bienvenido a Quantum Gateway",
    prompt: "Toca la puerta para comenzar tu experiencia hotelera digital",
  },
  bell: {
    initialTitle: "Procesando tu reserva",
    successTitle: "¡Reserva Confirmada con Éxito!",
    initialPrompt: "Estamos preparando todo para ti",
    successText: "Preparando tu acceso...",
  },
  key: {
    initialTitle: "Check-in Digital",
    successTitle: "¡Check-in Completado!",
    prompt: "Finalizando tu registro",
    successText: "¡Acceso concedido!",
  },
}

export default function AnimationSequence({ onComplete, stepsConfig = DEFAULT_STEPS_CONFIG }: AnimationSequenceProps) {
  const [currentStep, setCurrentStep] = useState<AnimationStep>("door")
  const [doorOpen, setDoorOpen] = useState(false)
  const [bellRung, setBellRung] = useState(false)
  const [reservationSuccess, setReservationSuccess] = useState(false)
  const [keyTurned, setKeyTurned] = useState(false)
  const [accessGranted, setAccessGranted] = useState(false)

  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")

  const config = useMemo(() => ({
    door: { ...DEFAULT_STEPS_CONFIG.door, ...stepsConfig.door },
    bell: { ...DEFAULT_STEPS_CONFIG.bell, ...stepsConfig.bell },
    key: { ...DEFAULT_STEPS_CONFIG.key, ...stepsConfig.key },
  }), [stepsConfig])

  const scale = useMemo(() => {
    if (isMobile) return 0.8
    if (isTablet) return 1
    return 1.2
  }, [isMobile, isTablet])

  const animationVariants = useMemo(() => ({
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: 1.2,
          when: "beforeChildren",
          staggerChildren: 0.5,
        },
      },
      exit: {
        opacity: 0,
        transition: { duration: 0.6 },
      },
    },
    item: {
      hidden: { y: 30, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 1 },
      },
    },
    successCircle: {
      animate: {
        scale: [1, 1.2, 1],
        boxShadow: [
          "0 0 0 0 rgba(59, 130, 246, 0.5)",
          "0 0 0 20px rgba(59, 130, 246, 0)",
          "0 0 0 0 rgba(59, 130, 246, 0)",
        ],
      },
      transition: { duration: 2, repeat: 0 },
    },
  }), [])

  const handleDoorClick = useCallback(() => {
    if (doorOpen) return
    setDoorOpen(true)
  }, [doorOpen])

  // Secuencia automática más lenta
  useEffect(() => {
    if (!doorOpen) return

    const timer1 = setTimeout(() => {
      setCurrentStep("bell")
      setBellRung(true)
    }, 3000)

    const timer2 = setTimeout(() => {
      setReservationSuccess(true)
    }, 6000)

    const timer3 = setTimeout(() => {
      setCurrentStep("key")
      setKeyTurned(true)
    }, 9500)

    const timer4 = setTimeout(() => {
      setAccessGranted(true)
    }, 12500)

    const timer5 = setTimeout(() => {
      onComplete()
    }, 15500)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      clearTimeout(timer5)
    }
  }, [doorOpen, onComplete])

  const getStepTitle = (step: AnimationStep): string => {
    switch (step) {
      case "door": return config.door.title
      case "bell": return reservationSuccess ? config.bell.successTitle : config.bell.initialTitle
      case "key": return keyTurned ? config.key.successTitle : config.key.initialTitle
      default: return ""
    }
  }

  const getStepPrompt = (step: AnimationStep): string => {
    switch (step) {
      case "door": return config.door.prompt
      case "bell": return reservationSuccess ? config.bell.successText : config.bell.initialPrompt
      case "key": return keyTurned ? config.key.successText : config.key.prompt
      default: return ""
    }
  }

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

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 overflow-hidden">
      <AnimatePresence mode="wait">
        {currentStep === "door" && renderStepContainer(
          "door",
          <motion.div className="mb-10" variants={animationVariants.item} style={{ scale }}>
            <AnimatedDoor isOpen={doorOpen} onDoorClick={handleDoorClick} />
          </motion.div>,
          "from-purple-400, via-blue-500, to-teal-400"
        )}

        {currentStep === "bell" && renderStepContainer(
          "bell",
          <motion.div className="mb-10" variants={animationVariants.item} style={{ scale }}>
            <AnimatedBell isRinging={bellRung && !reservationSuccess} showMessage={reservationSuccess} />
          </motion.div>,
          "from-yellow-400, via-amber-500, to-orange-400"
        )}

        {currentStep === "key" && renderStepContainer(
          "key",
          <motion.div className="mb-10" variants={animationVariants.item} style={{ scale }}>
            <AnimatedKey isRotating={keyTurned} />
          </motion.div>,
          "from-green-400, via-emerald-500, to-teal-400"
        )}

        {accessGranted && (
          <motion.div
            key="complete-step"
            className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20"
              {...animationVariants.successCircle}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 md:h-12 md:w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>

            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
            </motion.h2>

            <motion.div
              className="bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
            >
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
