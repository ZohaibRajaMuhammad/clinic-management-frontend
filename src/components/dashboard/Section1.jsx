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
            className={`w-full h-full rounded-lg text-sm font-medium transition ${
              selectedDate === day
                ? "bg-primary text-white"
                : "text-foreground/80 hover:bg-gray-100"
            }`}
          >
            {day}
          </button>
          {colors.length > 0 && (
            <div className="absolute bottom-1 flex gap-0.5">
              {colors.map((color, idx) => (
                <div
                  key={idx}
                  className={`w-1 h-1 rounded-full ${
                    color === "green"
                      ? "bg-green-500"
                      : color === "blue"
                      ? "bg-blue-500"
                      : "bg-yellow-500"
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

      // Increase patient count
      if (!dayCount[dayName]) dayCount[dayName] = { day: dayName, patient: 0, inpatient: 0 };
      dayCount[dayName].patient += 1;

      // Example: inpatient if status === "completed"
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

      // Example: assign dot color by status
      if (appt.status === "pending") dots[day].push("yellow");
      else if (appt.status === "completed") dots[day].push("green");
      else dots[day].push("blue");
    });
    return dots;
  }, [appointments]);

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const legends = [
    { color: "bg-primary", label: "Patient" },
    { color: "bg-yellow-400", label: "Inpatient" },
  ];
  const eventLegends = [
    { color: "bg-green-500", label: "Completed" },
    { color: "bg-yellow-500", label: "Pending" },
    { color: "bg-blue-500", label: "Other" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
      {/* ==== Patient Statistics ==== */}
      <div className="lg:col-span-2 bg-background rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users size={20} className="text-teal-600" />
            <h3 className="text-lg font-semibold text-foreground">
              Patient Statistics
            </h3>
          </div>
          <div className="flex items-center gap-4">
            {legends.map((item, idx) => (
              <LegendItem key={idx} color={item.color} label={item.label} />
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <Bar dataKey="patient" fill="#315cdf" radius={[4, 4, 0, 0]} />
            <Bar dataKey="inpatient" fill="#699af0" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ==== Calendar ==== */}
      <div className="bg-background rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1">
            <Calendar size={20} className="text-teal-600" />
            <h3 className="text-md font-semibold text-foreground">Calendar</h3>
          </div>
          <div className="flex ml-2 items-center gap-4">
            {eventLegends.map((item, idx) => (
              <EventLegendItem key={idx} color={item.color} label={item.label} />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <ChevronLeft
            size={20}
            className="cursor-pointer text-foreground/70 hover:text-gray-600"
          />
          <span className="font-semibold text-foreground/90">{currentMonth}</span>
          <ChevronRight
            size={20}
            className="cursor-pointer text-foreground/70 hover:text-gray-600"
          />
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((d, i) => (
            <div key={i} className="text-center text-xs text-foreground/70 font-medium">
              {d}
            </div>
          ))}
        </div>

        <div className="space-y-2 mb-4">
          {calendarDays.map((week, i) => (
            <div key={i} className="grid grid-cols-7 gap-2">
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
      </div>
    </div>
  );
}

export default Section1;
