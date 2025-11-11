'use client';
import { Calendar, Users, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2 text-sm">
    <div className={`w-3 h-3 rounded-full ${color}`}></div>
    <span className="text-gray-600">{label}</span>
  </div>
);

const EventLegendItem = ({ color, label }) => (
  <div className="flex items-center gap-1 text-xs">
    <div className={`w-2 h-2 rounded-full ${color}`}></div>
    <span className="text-gray-600">{label}</span>
  </div>
);

const CalendarDay = ({ day, selectedDate, setSelectedDate, dayDots }) => {
  const colors = dayDots[day] || [];
  return (
    <div className="aspect-square flex flex-col items-center justify-center relative">
      {day && (
        <>
          <button
            onClick={() => setSelectedDate(day)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 ${
              selectedDate === day
                ? "bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-2xl transform scale-105 ring-2 ring-indigo-200 ring-opacity-50"
                : "text-gray-800 hover:bg-gray-75 hover:shadow-lg border border-gray-200 bg-white"
            }`}
          >
            {day}
          </button>
          {colors.length > 0 && (
            <div className="absolute -bottom-1.5 flex gap-0.5">
              {colors.map((color, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full ${
                    color === "green"
                      ? "bg-emerald-400 shadow-sm"
                      : color === "blue"
                      ? "bg-blue-400 shadow-sm"
                      : "bg-amber-400 shadow-sm"
                  }`}
                ></div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

function Section1({ appointments = [] }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const currentDate = new Date();
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  const [currentMonth] = useState(`${monthName} ${year}`);

  // ✅ Dynamic Chart Data
  const chartData = useMemo(() => {
    const dayCount = {};

    appointments.forEach((appt) => {
      const date = new Date(appt.appointmentDate);
      const dayName = date.toLocaleString("default", { weekday: "long" });

      if (!dayCount[dayName]) dayCount[dayName] = { day: dayName, patient: 0, inpatient: 0 };
      dayCount[dayName].patient += 1;

      if (appt.status === "completed") dayCount[dayName].inpatient += 1;
    });

    return Object.values(dayCount);
  }, [appointments]);

  // ✅ Dynamic Calendar Dots
  const calendarDays = Array.from({ length: 5 }, (_, i) =>
    Array.from({ length: 7 }, (_, j) => {
      const dayNum = i * 7 + j + 1;
      return dayNum <= 31 ? dayNum : null;
    })
  );

  const dayDots = useMemo(() => {
    const dots = {};
    appointments.forEach((appt) => {
      const date = new Date(appt.appointmentDate);
      const day = date.getDate();
      if (!dots[day]) dots[day] = [];

      if (appt.status === "pending") dots[day].push("yellow");
      else if (appt.status === "completed") dots[day].push("green");
      else dots[day].push("blue");
    });
    return dots;
  }, [appointments]);

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const legends = [
    { color: "bg-gradient-to-r from-indigo-500 to-purple-500", label: "Patient" },
    { color: "bg-gradient-to-r from-amber-400 to-orange-400", label: "Inpatient" },
  ];
  const eventLegends = [
    { color: "bg-emerald-400", label: "Completed" },
    { color: "bg-amber-400", label: "Pending" },
    { color: "bg-blue-400", label: "Other" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
      {/* ==== Patient Statistics Card ==== */}
      <div className="lg:col-span-2 bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl">
              <Users size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Patient Statistics
              </h3>
              <p className="text-sm text-gray-600 mt-1">Weekly appointment overview & analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-6 bg-white px-6 py-3 rounded-2xl shadow-lg border border-gray-200">
            {legends.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-lg ${item.color} shadow-md`}></div>
                <span className="text-sm font-semibold text-gray-800">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-80 bg-gradient-to-b from-gray-50 to-white rounded-3xl p-6 shadow-inner border border-gray-100">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={12} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
              />
              <Bar 
                dataKey="patient" 
                fill="url(#patientGradient)" 
                radius={[12, 12, 4, 4]}
                className="shadow-lg"
              />
              <Bar 
                dataKey="inpatient" 
                fill="url(#inpatientGradient)" 
                radius={[12, 12, 4, 4]}
                className="shadow-lg"
              />
              <defs>
                <linearGradient id="patientGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <linearGradient id="inpatientGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#fcd34d" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ==== Calendar Card ==== */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-xl">
              <Calendar size={22} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Appointment Calendar</h3>
              <p className="text-sm text-gray-600 mt-1">November 2024 Schedule</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 bg-white px-4 py-3 rounded-2xl shadow-lg border border-gray-200">
            {eventLegends.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-sm`}></div>
                <span className="text-xs font-semibold text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-8 px-4 py-3 bg-white rounded-2xl shadow-lg border border-gray-200">
          <button className="p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md border border-gray-300 hover:scale-105">
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
          <span className="font-bold text-gray-900 text-lg px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl shadow-inner border">
            {currentMonth}
          </span>
          <button className="p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md border border-gray-300 hover:scale-105">
            <ChevronRight size={20} className="text-gray-700" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-4 mb-6 px-4">
          {weekDays.map((d, i) => (
            <div key={i} className="text-center text-sm font-bold text-gray-500 py-3 bg-gray-100 rounded-lg shadow-sm">
              {d}
            </div>
          ))}
        </div>

        <div className="space-y-4 mb-6 bg-white rounded-2xl p-4 shadow-inner border border-gray-200">
          {calendarDays.map((week, i) => (
            <div key={i} className="grid grid-cols-7 gap-4 px-2">
              {week.map((day, j) => (
                <CalendarDay
                  key={j}
                  day={day}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  dayDots={dayDots}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="mt-6 p-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl border border-blue-200 shadow-lg">
          <div className="text-center">
            <p className="text-base font-semibold text-gray-800">
              {selectedDate ? `Selected: November ${selectedDate}` : "Select a date to view details"}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {selectedDate ? "View appointment details and schedule" : "Click on any date to see appointment details"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Section1;