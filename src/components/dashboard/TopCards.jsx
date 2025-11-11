'use client'

import { useEffect, useState } from "react"
import { Activity, Calendar, Home, Users, Clock, FileText, Stethoscope, TrendingUp, MoreVertical } from "lucide-react"
import { useAuthContext } from "@/context/AuthContext"
import axios from "axios"
import { BASE_URL } from "@/services/config"

// ------------------ ICON MAP ------------------
const iconMap = {
  "Total Patients": Users,
  "Total Doctors": Stethoscope,
  "Active Appointments": Activity,
  "Case Histories": FileText,
  "Today's Appointments": Calendar,
  "Case Histories Created": FileText,
  "Total Patients Seen": Users,
  "Upcoming Appointment": Clock,
  "Assigned Doctor": Stethoscope,
  "Total Prescriptions": FileText,
  "Appointments Done": Home,
}

// ------------------ StatCard ------------------
const StatCard = ({ title, icon: Icon, value, description, variant }) => {
  const isGradient = variant === "gradient"
  
  // Professional color schemes
  const getCardStyles = () => {
    if (isGradient) {
      return {
        background: "bg-gradient-to-br from-slate-800 to-slate-900",
        text: "text-white",
        iconBg: "bg-white/10 backdrop-blur-sm",
        iconColor: "text-white",
        description: "text-slate-300",
        accent: "from-cyan-500 to-blue-500"
      }
    }
    
    const styles = [
      { 
        bg: "bg-white", 
        border: "border-l-[3px] border-l-cyan-500",
        iconBg: "bg-cyan-50",
        iconColor: "text-cyan-600",
        trend: "bg-cyan-50 text-cyan-700"
      },
      { 
        bg: "bg-white", 
        border: "border-l-[3px] border-l-emerald-500",
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
        trend: "bg-emerald-50 text-emerald-700"
      },
      { 
        bg: "bg-white", 
        border: "border-l-[3px] border-l-violet-500",
        iconBg: "bg-violet-50",
        iconColor: "text-violet-600",
        trend: "bg-violet-50 text-violet-700"
      },
      { 
        bg: "bg-white", 
        border: "border-l-[3px] border-l-amber-500",
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
        trend: "bg-amber-50 text-amber-700"
      }
    ]
    
    return styles[Math.floor(Math.random() * styles.length)]
  }

  const styles = getCardStyles()

  return (
    <div className={`group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02] ${
      isGradient 
        ? `${styles.background} shadow-2xl` 
        : `${styles.bg} ${styles.border} shadow-lg hover:shadow-xl border border-slate-100`
    }`}>
      
      {/* Animated background effect for gradient cards */}
      {isGradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      )}
      
      {/* Subtle grid pattern for professional look */}
      <div className={`absolute inset-0 opacity-[0.02] ${
        isGradient ? "bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" : ""
      }`}></div>

      <div className="relative p-6">
        {/* Header with refined spacing */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg transition-all duration-300 group-hover:scale-110 ${
              isGradient ? styles.iconBg : styles.iconBg
            }`}>
              <Icon size={22} className={isGradient ? styles.iconColor : styles.iconColor} />
            </div>
            <div>
              <span className={`text-sm font-medium tracking-wide ${
                isGradient ? "text-slate-300" : "text-slate-600"
              }`}>
                {title}
              </span>
            </div>
          </div>
          <button className={`p-1.5 rounded-lg transition-colors opacity-70 hover:opacity-100 ${
            isGradient 
              ? "hover:bg-white/10 text-slate-300" 
              : "hover:bg-slate-100 text-slate-400"
          }`}>
            <MoreVertical size={16} />
          </button>
        </div>

        {/* Main Value with enhanced typography */}
        <div className="flex items-end justify-between mb-3">
          <h2 className={`text-3xl font-bold tracking-tight bg-gradient-to-r ${
            isGradient 
              ? "text-white from-white to-slate-200" 
              : "text-slate-900 from-slate-900 to-slate-700"
          } bg-clip-text text-transparent`}>
            {value ?? "--"}
          </h2>
          {!isGradient && (
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${styles.trend}`}>
              <TrendingUp size={12} />
              <span>+12%</span>
            </div>
          )}
        </div>

        {/* Description with improved readability */}
        {description && (
          <div className={`flex items-center gap-2 text-sm ${
            isGradient ? styles.description : "text-slate-500"
          }`}>
            <div className={`w-1 h-1 rounded-full ${
              isGradient ? "bg-cyan-400" : "bg-slate-400"
            }`}></div>
            <span className="font-medium">{description}</span>
          </div>
        )}
      </div>

      {/* Sophisticated bottom accent */}
      {isGradient && (
        <div className={`h-1 bg-gradient-to-r ${styles.accent} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
        </div>
      )}
      
      {/* Hover border effect */}
      <div className={`absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-${
        isGradient ? 'white/20' : 'slate-200'
      } transition-all duration-300 pointer-events-none`}></div>
    </div>
  )
}

// ------------------ Skeleton Loader ------------------
const StatCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100 animate-pulse overflow-hidden">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-slate-200 rounded-lg"></div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 rounded w-20"></div>
        </div>
      </div>
      <div className="w-6 h-6 bg-slate-200 rounded"></div>
    </div>
    <div className="space-y-3">
      <div className="h-8 bg-slate-200 rounded w-3/4"></div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
      </div>
    </div>
    
    {/* Skeleton shimmer effect */}
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
  </div>
)

// ------------------ TopCards Component ------------------
export default function TopCards() {
  const [role, setRole] = useState("")
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const { getUserDetails, token } = useAuthContext()

  useEffect(() => {
    async function fetchData() {
      try {
        const user = getUserDetails()
        setRole(user.role)

        const res = await axios.get(`${BASE_URL}/dashboard/TopCards`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.data.success) {
          const updatedCards = res.data.cards.map((card, index) => ({
            ...card,
            icon: iconMap[card.title] || Activity,
            variant: index === 0 ? "gradient" : "",
          }))

          setCards(updatedCards)
        }
      } catch (error) {
        console.error("Error fetching top cards:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token, getUserDetails])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, i) => (
        <StatCard key={i} {...card} />
      ))}
    </div>
  )
}