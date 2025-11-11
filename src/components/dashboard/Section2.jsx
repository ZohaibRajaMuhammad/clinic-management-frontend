'use client';
import {
  MoreVertical,
  ChevronDown,
  ArrowUpRight,
  Calendar,
  User,
  Stethoscope,
  MapPin,
  Clock
} from "lucide-react";
import { useMemo } from "react";
import { useRouter } from "next/navigation"; 

// =================== REUSABLE TASK ROW ===================
const TaskRow = ({ task, index }) => (
  <tr className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 group">
    <td className="py-6 px-6">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center group-hover:border-blue-500 transition-colors">
          <span className="text-gray-700 text-sm font-bold">{index + 1}</span>
        </div>
      </div>
    </td>
    <td className="py-6 px-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm">
          <User className="w-5 h-5 text-slate-600" />
        </div>
        <div>
          <p className="text-base font-semibold text-gray-900">{task.patientName}</p>
          <p className="text-sm text-gray-500 mt-1">ID: {task.id?.slice(-8)}</p>
        </div>
      </div>
    </td>
    <td className="py-6 px-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
          <Stethoscope className="w-4 h-4 text-blue-600" />
        </div>
        <span className="text-sm font-medium text-gray-800">{task.doctorName}</span>
      </div>
    </td>
    <td className="py-6 px-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
          <MapPin className="w-4 h-4 text-emerald-600" />
        </div>
        <span className="text-sm font-medium text-gray-800">{task.roomNumber}</span>
      </div>
    </td>
    <td className="py-6 px-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center border border-purple-100">
          <Clock className="w-4 h-4 text-purple-600" />
        </div>
        <div>
          <span className="text-sm font-medium text-gray-800 block">{task.date}</span>
          <span className="text-xs text-gray-500">10:00 AM</span>
        </div>
      </div>
    </td>
    <td className="py-6 px-6">
      <div className={`inline-flex items-center px-4 py-2.5 rounded-2xl text-sm font-semibold ${task.statusColor} border-0 shadow-sm min-w-[120px] justify-center`}>
        <div className={`w-2.5 h-2.5 rounded-full mr-3 ${
          task.status === 'completed' ? 'bg-green-500' :
          task.status === 'booked' ? 'bg-blue-500' :
          task.status === 'checked-in' ? 'bg-amber-500' :
          'bg-red-500'
        }`}></div>
        <span className="capitalize">{task.status}</span>
      </div>
    </td>
    <td className="py-6 px-6">
      <button className="group p-3 rounded-2xl bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-sm">
        <MoreVertical className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
      </button>
    </td>
  </tr>
);

const Section2 = ({ appointments = [] }) => {
  const router = useRouter();

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort(
      (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
    );
  }, [appointments]);

  const tableData = useMemo(() => {
    const getStatusColor = (status) => {
      const colors = {
        booked: "bg-blue-100 text-blue-800",
        "checked-in": "bg-amber-100 text-amber-800",
        completed: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
      };
      return colors[status] || "bg-gray-100 text-gray-800";
    };

    return sortedAppointments.map((apt) => ({
      id: apt._id,
      patientName: apt.patientId?.userId?.name || "N/A",
      doctorName: apt.doctorId?.userId?.name || "N/A",
      roomNumber: apt.roomId?.roomNumber || "—",
      date: new Date(apt.appointmentDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: apt.status || "pending",
      statusColor: getStatusColor(apt.status),
    }));
  }, [sortedAppointments]);

  const topFive = tableData.slice(0, 5);

  return (
    <div className="mt-8">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        {/* ==== Modern Header ==== */}
        <div className="px-8 py-7 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Appointment Schedule
                </h2>
                <p className="text-gray-600 text-sm mt-1.5">
                  Manage and track patient appointments efficiently
                </p>
              </div>
            </div>

            {/* 🔘 Modern Action Button */}
            <button
              onClick={() => router.push("/dashboard/appointments")}
              className="group flex items-center gap-3 px-6 py-3.5 bg-white border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 rounded-2xl text-gray-700 font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
            >
              View All Records
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* ==== Enhanced Table ==== */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-gray-200">
                {[
                  { label: "Order", icon: null },
                  { label: "Patient Information", icon: User },
                  { label: "Medical Professional", icon: Stethoscope },
                  { label: "Location", icon: MapPin },
                  { label: "Schedule", icon: Clock },
                  { label: "Appointment Status", icon: null },
                  { label: "Options", icon: null },
                ].map((header, i) => (
                  <th
                    key={i}
                    className="text-left py-5 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-2.5">
                      {header.icon && <header.icon className="w-4 h-4" />}
                      {header.label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topFive.length > 0 ? (
                topFive.map((t, idx) => (
                  <TaskRow key={t.id} task={t} index={idx} />
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-16">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-5 border border-gray-200">
                        <Calendar className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-700 text-lg font-semibold mb-2">No appointments scheduled</p>
                      <p className="text-gray-500 text-sm max-w-md">
                        There are no upcoming appointments. New appointments will appear here once scheduled.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ==== Enhanced Mobile Cards ==== */}
        <div className="md:hidden space-y-4 p-6">
          {topFive.length > 0 ? (
            topFive.map((task, index) => (
              <div key={task.id} className="bg-white rounded-3xl border-2 border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center border border-slate-200">
                      <span className="text-gray-700 font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{task.patientName}</p>
                      <p className="text-sm text-gray-500 mt-1">ID: {task.id?.slice(-8)}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-2xl text-xs font-semibold ${task.statusColor}`}>
                    {task.status}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                      <Stethoscope className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium">Dr. {task.doctorName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="font-medium">Room {task.roomNumber}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center border border-purple-100">
                      <Clock className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <span className="font-medium block">{task.date}</span>
                      <span className="text-gray-500 text-xs">10:00 AM</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-200">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-700 font-semibold mb-2">No appointments</p>
              <p className="text-gray-500 text-sm">Schedule new appointments to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Section2;