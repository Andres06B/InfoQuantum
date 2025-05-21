"use client"

import { motion } from "framer-motion"
import { Hotel, Globe, Settings } from "lucide-react"

export default function ServiceIcons() {
  const iconVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: 0.2 * i,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  }

  const iconHoverVariants = {
    hover: {
      scale: 1.08,
      rotate: 1,
      boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.25)",
      transition: { duration: 0.3 },
    },
  }

  const iconContainers = [
    {
      icon: <Hotel className="w-10 h-10 sm:w-12 sm:h-12 text-white" />,
      title: "Plataforma de Gestión",
      description: "Administra reservas, habitaciones y pagos en una sola plataforma SaaS accesible desde cualquier dispositivo.",
      gradient: "from-indigo-600 via-purple-600 to-blue-600",
    },
    {
      icon: <Globe className="w-10 h-10 sm:w-12 sm:h-12 text-white" />,
      title: "Landing Pages Dinámicas",
      description: "Cada establecimiento cuenta con su propio portal personalizado para aumentar visibilidad y atraer más clientes.",
      gradient: "from-blue-600 via-cyan-500 to-sky-500",
    },
    {
      icon: <Settings className="w-10 h-10 sm:w-12 sm:h-12 text-white" />,
      title: "Backoffice Inteligente",
      description: "Optimiza la operación con control centralizado, análisis predictivo y automatización del flujo administrativo.",
      gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    },
  ]

  return (
    <section className="py-20 px-6">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight relative inline-block pb-3 text-white">
          Nuestros Servicios
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-80" />
        </h2>
        <p className="mt-4 text-white/80 max-w-2xl mx-auto text-lg">
          Potenciamos la gestión hotelera con tecnología moderna, accesible y eficiente.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {iconContainers.map((container, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center text-center px-4"
            variants={iconVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={index}
          >
            <motion.div
              className={`relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 mb-6 rounded-full bg-gradient-to-br ${container.gradient} shadow-xl border-4 border-white/20`}
              whileHover="hover"
              variants={iconHoverVariants}
            >
              {container.icon}
              <motion.div
                className="absolute w-36 h-36 sm:w-40 sm:h-40 rounded-full border-2 border-white/10 opacity-0"
                animate={{ opacity: [0, 0.2, 0], scale: [0.9, 1.2, 1.4] }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "loop" }}
              />
            </motion.div>
            <h3 className="mb-3 text-2xl sm:text-3xl font-semibold text-white drop-shadow-sm">
              {container.title}
            </h3>
            <p className="text-white/80 leading-relaxed max-w-xs">
              {container.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
