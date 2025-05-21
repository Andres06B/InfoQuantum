"use client"

import { motion } from "framer-motion"
import { MonitorSmartphone, PieChart, Server, Repeat, TrendingUp, Smartphone, Ban, Cloud, GitBranch, Hotel, Layout, Plug } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function QuantumSection() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")
  const isReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)")

const features = [
  {
    title: "Adaptado al Sector Hotelero",
    description: "Diseñado específicamente para hoteles, hostales y alojamientos tipo Airbnb con necesidades de digitalización inmediata.",
    color: "from-blue-700 to-cyan-500",
    icon: <Hotel className="w-8 h-8" />,
  },
  {
    title: "Plataforma SaaS Accesible",
    description: "Disponible desde cualquier dispositivo sin instalaciones complejas, ideal para establecimientos con pocos recursos tecnológicos.",
    color: "from-purple-700 to-violet-500",
    icon: <Cloud className="w-8 h-8" />,
  },
  {
    title: "Reducción de Errores Manuales",
    description: "Minimiza problemas comunes como sobreasignaciones y errores en facturación al reemplazar procesos tradicionales.",
    color: "from-rose-600 to-pink-400",
    icon: <Ban className="w-8 h-8" />,
  },
  {
    title: "Diseño Modular con Angular",
    description: "Componentes altamente reutilizables y una interfaz responsiva gracias al uso de Angular y Tailwind CSS.",
    color: "from-amber-600 to-orange-400",
    icon: <Layout className="w-8 h-8" />,
  },
  {
    title: "Control Colaborativo con GitHub",
    description: "Control de versiones y trabajo en equipo estructurado a través de ramas y buenas prácticas en Git.",
    color: "from-gray-700 to-slate-500",
    icon: <GitBranch className="w-8 h-8" />,
  },
  {
    title: "Integración con Herramientas Externas",
    description: "Incorpora herramientas como Power BI y Weka para ofrecer funcionalidades avanzadas sin desarrollos desde cero.",
    color: "from-green-600 to-emerald-400",
    icon: <Plug className="w-8 h-8" />,
  },
];


  const getGridCols = () => {
    if (isMobile) return "grid-cols-1"
    if (isTablet) return "grid-cols-2"
    return "grid-cols-3"
  }

  return (
    <section className="py-20 px-4">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl sm:text-5xl font-bold relative inline-block pb-3">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Tecnología Quantum
          </span>
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/0 via-blue-400 to-purple-500/0 rounded-full"></div>
        </h2>
        <p className="mt-6 text-xl text-white max-w-3xl mx-auto">
          La revolución digital para la gestión hotelera del siglo XXI
        </p>
      </motion.div>

      <div className={`grid gap-8 ${getGridCols()} max-w-7xl mx-auto`}>
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="group perspective-1000"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: isMobile ? index * 0.05 : index * 0.1,
              ease: "backOut"
            }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={isReducedMotion ? {} : { y: -5 }}
          >
            <div className={`relative h-full p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 group-hover:border-white/30 transition-all duration-500 shadow-lg hover:shadow-xl overflow-hidden`}>
              {/* Icono con efecto */}
              <div className={`mb-6 w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${feature.color} shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300 text-white`}>
                {feature.icon}
              </div>
              
              {/* Contenido */}
              <h3 className="text-2xl font-bold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-300">
                {feature.description}
              </p>
              
              {/* Efecto de partículas sutiles */}
              {!isReducedMotion && (
                <>
                  <motion.div 
                    className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-400"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: [0, 0.4, 0] }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.3
                    }}
                  />
                  <motion.div 
                    className="absolute bottom-8 left-6 w-1.5 h-1.5 rounded-full bg-purple-400"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: [0, 0.3, 0] }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      delay: index * 0.3 + 0.5
                    }}
                  />
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}