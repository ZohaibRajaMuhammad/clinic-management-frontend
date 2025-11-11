'use client';
import {
  MoreVertical,
  Search,
  ChevronDown,
} from "lucide-react";
import { useMemo } from "react";
import { useRouter } from "next/navigation"; 

// =================== REUSABLE TASK ROW ===================
const TaskRow = ({ task, index }) => (
  <tr className="border-b border-gray-100 hover:bg-gray-50">
    <td className="py-4 px-4 text-sm text-gray-900">{index + 1}</td>
    <td className="py-4 px-4 text-sm font-medium text-gray-900">
      {task.patientName}
    </td>
    <td className="py-4 px-4 text-sm text-gray-600">{task.doctorName}</td>
    <td className="py-4 px-4 text-sm text-gray-900">{task.roomNumber}</td>
    <td className="py-4 px-4 text-sm text-gray-900">{task.date}</td>
    <td className="py-4 px-4">
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${task.statusColor}`}
      >
        {task.status}
      </span>
    </td>
    <td className="py-4 px-4">
      <button className="text-gray-400 hover:text-gray-600">
        <MoreVertical className="w-5 h-5" />
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
        booked: "bg-blue-100 text-blue-700",
        "checked-in": "bg-blue-100 text-blue-700 border border-blue-400",
        completed: "bg-green-100 text-green-700 border border-green-400",
        cancelled: "bg-red-100 text-red-700 border border-red-400",
      };
      return colors[status] || "bg-gray-100 text-gray-700";
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

  // ✅ Show only top 5
  const topFive = tableData.slice(0, 5);

  return (
    <div className="mt-4">
      <div className="bg-background rounded-2xl shadow-sm p-6">
        {/* ==== Header ==== */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Latest Appointments
          </h2>

          {/* 🔘 "See All" Button */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => router.push("/dashboard/appointments")}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 whitespace-nowrap"
            >
              See All
            </button>
          </div>
        </div>

        {/* ==== Table ==== */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {[
                  "No",
                  "Patient Name",
                  "Doctor",
                  "Room",
                  "Date",
                  "Status",
                  "Actions",
                ].map((header, i) => (
                  <th
                    key={i}
                    className="text-left py-3 px-4 text-sm font-medium text-gray-500"
                  >
                    {header}
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
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Section2;
