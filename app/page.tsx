"use client"

import { useState, useEffect } from "react"
import Welcome from "@/components/welcome"
import ServiceIcons from "@/components/service-icons"
import InfoCards from "@/components/info-cards"
import QuantumSection from "@/components/quantum-section"
import StarryBackground from "@/components/starry-background"
import LoadingScreen from "@/components/loading-screen"
import FloatingParticles from "@/components/floating-particles"
import AnimationSequence from "@/components/animation-sequence"
import { motion, AnimatePresence } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [animationComplete, setAnimationComplete] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    // Simular carga de recursos
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <AnimatePresence mode="wait">{loading && <LoadingScreen onComplete={() => setLoading(false)} />}</AnimatePresence>

      <StarryBackground />
      <FloatingParticles density={isMobile ? 15 : 30} />

      <AnimatePresence mode="wait">
        {!loading && !animationComplete && (
          <motion.div
            key="animation-sequence"
            className="fixed inset-0 z-20 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AnimationSequence onComplete={() => setAnimationComplete(true)} />
          </motion.div>
        )}

        {animationComplete && (
          <motion.div
            key="main-content"
            className="container relative z-10 mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Welcome />
            <ServiceIcons />
            <InfoCards />
            <QuantumSection />

            <footer className="py-8 px-4 text-center border-t border-gray-800 mt-16">
              <p className="text-gray-400">
                © {new Date().getFullYear()} Quantum Gateway. Todos los derechos reservados.
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
