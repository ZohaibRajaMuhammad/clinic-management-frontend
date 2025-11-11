"use client";
import React, { useEffect, useState } from "react";
import TopCards from "@/components/dashboard/TopCards";
import Section1 from "@/components/dashboard/Section1";
import Section2 from "@/components/dashboard/Section2";
import { Upload, Calendar, Download, Bell, Search, Filter } from "lucide-react";
import Image from "next/image";
import { useAuthContext } from "@/context/AuthContext";
import axios from "axios";
import { BASE_URL } from "@/services/config";

export default function HospitalDashboard() {
  const [appointments, setAppointments] = useState([]);
  const { getUserDetails, token } = useAuthContext();
  const [timeRange, setTimeRange] = useState("week");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userDetails = getUserDetails();
        setUserName(userDetails.name || "User");

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
    <div className="min-h-screen bg-gray-50/30">
      {/* Professional Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2">
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
              Welcome back, <span className="text-blue-600">{userName}</span> 👋
            </h1>
            <p className="text-sm text-gray-600 font-medium">
              Here's your latest dashboard overview for the past 7 days
            </p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-3 py-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-transparent text-sm text-gray-700 focus:outline-none"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4 text-gray-600" />
              </button>
              <button className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <Bell className="h-4 w-4 text-gray-600" />
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm">
                <Download size={16} />
                <span className="text-sm font-medium">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Current Period</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Previous Period</span>
          </div>
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Top Cards with enhanced styling */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Key Metrics</h2>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
          <TopCards />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Section 1 - Takes 7 columns on large screens */}
          <div className="xl:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Appointment Overview</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                Real-time Data
              </div>
            </div>
            <Section1 appointments={appointments} />
          </div>

          {/* Section 2 - Takes 5 columns on large screens */}
          <div className="xl:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <Section2 appointments={appointments} />
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">System Status:</span>
            <span className="flex items-center gap-1 text-green-600 font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              All Systems Operational
            </span>
          </div>
          <div className="text-gray-500">
            {appointments.length} appointments loaded • v1.0.0
          </div>
        </div>
      </div>
    </div>
  );
}