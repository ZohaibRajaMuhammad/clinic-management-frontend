"use client";
import React, { useEffect, useState } from "react";
import TopCards from "@/components/dashboard/TopCards";
import Section1 from "@/components/dashboard/Section1";
import Section2 from "@/components/dashboard/Section2";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useAuthContext } from "@/context/AuthContext";
import axios from "axios";
import { BASE_URL } from "@/services/config";
// import BannerImg from "@/assets/TopBanner.png"

export default function HospitalDashboard() {
  const [appointments, setAppointments] = useState([]);
  const { getUserDetails, token } = useAuthContext();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userDetails = getUserDetails();

        let url = "";
        if (userDetails.role === "admin") {
          url = `${BASE_URL}/appointment/allAppointment`;
        } else if (userDetails.role === "doctor") {
          url = `${BASE_URL}/appointment/doctorAppointment/${userDetails.doctorId}`;
        } else if (userDetails.role === "patient") {
          url = `${BASE_URL}/appointment/pateintAppointment/${userDetails.patientId}`;
        }

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAppointments(response.data.data || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments([]);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground/80">
            Welcome back, Moiz 👋
          </h1>
          <p className="text-sm text-foreground/70 mt-1">
            there is the latest update for the last 7 days. check now
          </p>
        </div>
        <div className="flex gap-3">
          <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-foreground/70">
            <option>Week</option>
            <option>Month</option>
            <option>Year</option>
          </select>
          <button className="px-6 py-2 bg-primary text-white rounded-lg flex items-center gap-2">
            <Upload size={18} />
            Export
          </button>
        </div>
      </div> */}

     

      {/* Top Cards */}
      <TopCards />

      {/*  Section 1 */}
      <Section1 appointments={appointments} />

      {/*  Section 2 */}
      <Section2 appointments={appointments} />
    </div>
  );
}
