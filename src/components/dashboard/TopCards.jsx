'use client'

import { useEffect, useState } from "react"
import { Activity, Calendar, Home, Users, Clock, FileText, Stethoscope } from "lucide-react"
import { MoreVertical } from "lucide-react"
import { useAuthContext } from "@/context/AuthContext"
import axios from "axios"
import { BASE_URL } from "@/services/config"

// ------------------ ICON MAP ------------------
const iconMap = {
  "Total Patients": Calendar,
  "Total Doctors": Users,
  "Active Appointments": Activity,
  "Case Histories": Home,
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

  return (
    <div
      className={
        isGradient
          ? "bg-gradient-to-t from-primary to-primary/60 rounded-2xl p-6 text-forground relative overflow-hidden"
          : "bg-background rounded-2xl p-6 shadow-sm"
      }
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center gap-2 ${isGradient ? "" : "text-foreground/80"}`}>
          <Icon size={20} className={isGradient ? "text-white" : "text-forground"} />
          <span className={`text-sm font-medium ${isGradient ? "text-white" : "text-foreground/70"}`}>{title}</span>
        </div>
        <MoreVertical size={20} className={`cursor-pointer ${isGradient ? "text-white/70" : "text-foreground"}`} />
      </div>

      {/* Main Value */}
      <h2 className={`text-3xl font-bold ${isGradient ? "text-white" : "text-foreground"}`}>
        {value ?? "--"}
      </h2>

      {description && (
        <p className={`text-xs mt-2 ${isGradient ? "text-white/80" : "text-gray-500"}`}>
          {description}
        </p>
      )}
    </div>
  )
}

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
          // attach icon + variant dynamically
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

  if (loading) return <div>Loading dashboard...</div>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => (
        <StatCard key={i} {...card} />
      ))}
    </div>
  )
}
