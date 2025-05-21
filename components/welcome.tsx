"use client"

import { motion } from "framer-motion"

export default function Welcome() {
  return (
    <motion.section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-8 py-20 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Fondos decorativos flotantes */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        <div className="absolute top-1/4 left-1/4 w-52 sm:w-64 h-52 sm:h-64 rounded-full bg-purple-500 blur-3xl opacity-40 animate-float-slow" />
        <div className="absolute top-1/3 right-1/4 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-blue-500 blur-3xl opacity-30 animate-float-medium" />
        <div className="absolute bottom-1/4 right-1/3 w-60 sm:w-72 h-60 sm:h-72 rounded-full bg-teal-500 blur-3xl opacity-40 animate-float-fast" />
      </motion.div>

      <motion.div
        className="max-w-4xl lg:max-w-6xl mx-auto px-2 sm:px-4"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Título principal */}
        <motion.div
          className="relative inline-block mb-10"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            scale: { duration: 0.8, ease: "backOut" },
            opacity: { duration: 0.6, delay: 0.3 }
          }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-teal-400 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Bienvenido a <span className="whitespace-nowrap">Quantum Gateway</span>
          </motion.h1>

          {/* Línea decorativa bajo el título */}
          <motion.div
            className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-blue-500 to-teal-400 rounded-full opacity-80"
            initial={{ scaleX: 0, transformOrigin: "center" }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.8,
              ease: [0.22, 1, 0.36, 1]
            }}
          />
        </motion.div>

        {/* Descripción */}
        <motion.p
          className="mt-8 text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed px-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 1.0,
            ease: "easeOut"
          }}
        >
          La puerta hacia una experiencia hotelera revolucionaria, donde la tecnología y el confort se fusionan para crear momentos inolvidables.
        </motion.p>
      </motion.div>

      {/* Flecha flotante - Versión mejorada */}
      <motion.div
        className="absolute bottom-6 sm:bottom-10 w-full flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4 }}
      >
        <motion.div
          className="flex flex-col items-center"
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md shadow-lg">
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ 
                marginLeft: "1px", // Ajuste fino de centrado
                marginTop: "2px"   // Ajuste fino de centrado
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
          <div className="mt-2 text-xs text-white/50">Desplázate</div>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}