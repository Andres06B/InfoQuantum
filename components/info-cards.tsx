"use client"

import { motion } from "framer-motion"
import { Calendar, CheckSquare, BarChart3, Cpu, Bot, Activity, LayoutGrid } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function InfoCards() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)")

 const cards = [
  {
    title: "Gestión Centralizada",
    description:
      "Administra reservas, habitaciones y pagos en una única plataforma SaaS que mejora la eficiencia operativa y reduce errores administrativos.",
    icon: <LayoutGrid className="w-6 h-6" />,
    color: "border-indigo-500",
    hoverColor: "hover:border-indigo-400",
    iconBg: "bg-indigo-500",
    gradient: "from-indigo-600/20 to-indigo-800/20",
    shadowColor: "shadow-indigo-500/10",
    hoverShadowColor: "hover:shadow-indigo-500/20",
  },
  {
    title: "Modelo Predictivo",
    description:
      "Anticipa cancelaciones de reservas mediante inteligencia artificial con Weka, optimizando la planificación y ocupación hotelera.",
    icon: <Activity className="w-6 h-6" />,
    color: "border-pink-500",
    hoverColor: "hover:border-pink-400",
    iconBg: "bg-pink-500",
    gradient: "from-pink-600/20 to-pink-800/20",
    shadowColor: "shadow-pink-500/10",
    hoverShadowColor: "hover:shadow-pink-500/20",
  },
  {
    title: "Dashboard Interactivo",
    description:
      "Visualiza métricas clave y toma decisiones informadas con dashboards embebidos construidos en Power BI.",
    icon: <BarChart3 className="w-6 h-6" />,
    color: "border-teal-500",
    hoverColor: "hover:border-teal-400",
    iconBg: "bg-teal-500",
    gradient: "from-teal-600/20 to-teal-800/20",
    shadowColor: "shadow-teal-500/10",
    hoverShadowColor: "hover:shadow-teal-500/20",
  },
  {
    title: "Asistente Virtual",
    description:
      "Atiende consultas frecuentes automáticamente con un chatbot inteligente integrado, mejorando la experiencia del huésped.",
    icon: <Bot className="w-6 h-6" />,
    color: "border-emerald-500",
    hoverColor: "hover:border-emerald-400",
    iconBg: "bg-emerald-500",
    gradient: "from-emerald-600/20 to-emerald-800/20",
    shadowColor: "shadow-emerald-500/10",
    hoverShadowColor: "hover:shadow-emerald-500/20",
  },
];


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.1 : 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section className="py-16 px-4">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold relative inline-block pb-2">
          Servicios Innovadores
          <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400/0 via-blue-500 to-purple-400/0"></div>
        </h2>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className={`p-6 transition-all duration-300 rounded-lg bg-gradient-to-br ${card.gradient} backdrop-blur-sm hover:bg-black/40 border ${card.color} ${card.hoverColor} ${card.shadowColor} ${card.hoverShadowColor} hover:shadow-lg transform hover:-translate-y-1`}
            variants={cardVariants}
            whileHover={isReducedMotion ? {} : { scale: 1.02 }}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${card.iconBg} text-white shadow-lg`}>{card.icon}</div>
              <div>
                <h3 className="mb-3 text-xl font-semibold">{card.title}</h3>
                <p className="text-gray-300">{card.description}</p>
              </div>
            </div>

            {/* Animación del icono */}
            {!isReducedMotion && (
              <motion.div
                className="mt-4 flex justify-end"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
              >
                <div className={`p-1 rounded-full ${card.iconBg} text-white opacity-30`}>{card.icon}</div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
