"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  CalendarCheck,
  MapPin,
  Mail,
  Phone,
  Download,
  Eye,
  Edit3,
  Trash2,
  Loader2,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  FileText,
  Plus,
  Menu,
  X,
  Pill,
  FileUp,
  StickyNote,
  ChevronRight,
  AlertCircle,
  Activity,
  RefreshCw,
  ArrowRight,
  Users,
  FileCheck,
  AlertTriangle,
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import toast from "react-hot-toast";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [activeMenu, setActiveMenu] = useState(null);
  const [showCaseHistoryModal, setShowCaseHistoryModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [caseHistoryForm, setCaseHistoryForm] = useState({
    notes: "",
    medicines: [{ name: "", dosage: "", frequency: "", duration: "" }],
    reports: [{ reportType: "", fileUrl: "", description: "" }],
  });
  const { token, getUserDetails } = useAuthContext();

  // Fetch appointments based on user role
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const userDetails = getUserDetails();
      setUser(userDetails);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Filter appointments
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientId?.userId?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.doctorId?.userId?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.roomId?.RoomName?.toLowerCase().includes(
        searchTerm.toLowerCase()
      );

    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;

    const matchesDate =
      !dateFilter ||
      new Date(appointment.appointmentDate).toDateString() ===
        new Date(dateFilter).toDateString();

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Sort appointments
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedAppointments = React.useMemo(() => {
    if (!sortConfig.key) return filteredAppointments;

    return [...filteredAppointments].sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case "patientName":
          aValue = a.patientId?.userId?.name || "";
          bValue = b.patientId?.userId?.name || "";
          break;
        case "doctorName":
          aValue = a.doctorId?.userId?.name || "";
          bValue = b.doctorId?.userId?.name || "";
          break;
        case "date":
          aValue = new Date(a.appointmentDate);
          bValue = new Date(b.appointmentDate);
          break;
        case "time":
          aValue = new Date(a.startAt);
          bValue = new Date(b.startAt);
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredAppointments, sortConfig]);

  // Cancel appointment
  const cancelAppointment = async (appointmentId) => {
    setActionLoading(appointmentId);
    try {
      await axios.put(
        `${BASE_URL}/appointment/cancel/${appointmentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchAppointments();
      setActiveMenu(null);
      toast.success("Appointment cancelled successfully!");
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Failed to cancel appointment");
    } finally {
      setActionLoading(null);
    }
  };

  // Complete appointment
  const completeAppointment = async (appointmentId) => {
    setActionLoading(appointmentId);
    try {
      await axios.put(
        `${BASE_URL}/appointment/complete/${appointmentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchAppointments();
      setActiveMenu(null);
      toast.success("Appointment completed successfully!");
    } catch (error) {
      console.error("Error completing appointment:", error);
      toast.error("Failed to complete appointment");
    } finally {
      setActionLoading(null);
    }
  };

  // Open case history modal
  const openCaseHistoryModal = (appointment) => {
    setSelectedAppointment(appointment);
    setCurrentStep(0);
    setCaseHistoryForm({
      notes: "",
      medicines: [{ name: "", dosage: "", frequency: "", duration: "" }],
      reports: [{ reportType: "", fileUrl: "", description: "" }],
    });
    setShowCaseHistoryModal(true);
    setActiveMenu(null);
  };

  // Handle case history form changes
  const handleCaseHistoryChange = (field, value) => {
    setCaseHistoryForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Add medicine field
  const addMedicine = () => {
    setCaseHistoryForm((prev) => ({
      ...prev,
      medicines: [
        ...prev.medicines,
        { name: "", dosage: "", frequency: "", duration: "" },
      ],
    }));
  };

  // Remove medicine field
  const removeMedicine = (index) => {
    setCaseHistoryForm((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index),
    }));
  };

  // Update medicine field
  const updateMedicine = (index, field, value) => {
    const updatedMedicines = [...caseHistoryForm.medicines];
    updatedMedicines[index][field] = value;
    setCaseHistoryForm((prev) => ({
      ...prev,
      medicines: updatedMedicines,
    }));
  };

  // Add report field
  const addReport = () => {
    setCaseHistoryForm((prev) => ({
      ...prev,
      reports: [
        ...prev.reports,
        { reportType: "", fileUrl: "", description: "" },
      ],
    }));
  };

  // Remove report field
  const removeReport = (index) => {
    setCaseHistoryForm((prev) => ({
      ...prev,
      reports: prev.reports.filter((_, i) => i !== index),
    }));
  };

  // Update report field
  const updateReport = (index, field, value) => {
    const updatedReports = [...caseHistoryForm.reports];
    updatedReports[index][field] = value;
    setCaseHistoryForm((prev) => ({
      ...prev,
      reports: updatedReports,
    }));
  };

  // Submit case history
  const submitCaseHistory = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BASE_URL}/doctor/createCaseHistory`,
        {
          appointmentId: selectedAppointment._id,
          doctorId: selectedAppointment.doctorId?._id,
          patientId: selectedAppointment.patientId?._id,
          ...caseHistoryForm,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message === "Case history created successfully") {
        toast.success("Case history created successfully!");
        setShowCaseHistoryModal(false);
        setSelectedAppointment(null);
        setCurrentStep(0);
      }
    } catch (error) {
      console.error("Error creating case history:", error);
      toast.error("Failed to create case history");
    }
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      booked: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
        icon: CalendarCheck,
      },
      "checked-in": {
        color: "bg-amber-50 text-amber-700 border-amber-200",
        icon: Clock,
      },
      completed: {
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: CheckCircle2,
      },
      cancelled: {
        color: "bg-red-50 text-red-700 border-red-200",
        icon: XCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.booked;
    const IconComponent = config.icon;

    return (
      <div
        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border ${config.color}`}
      >
        <IconComponent className="w-4 h-4 mr-2" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
      </div>
    );
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    );
  };

  // Action Menu Component
  const ActionMenu = ({ appointment, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="absolute right-0 top-10 z-50 bg-white border border-gray-200 rounded-lg shadow-xl py-2 w-56">
        {/* Complete Button */}
        {(user?.role === "doctor" || user?.role === "admin") &&
          (appointment.status === "booked" ||
            appointment.status === "checked-in") && (
            <button
              onClick={() => completeAppointment(appointment._id)}
              disabled={actionLoading === appointment._id}
              className="w-full flex items-center px-4 py-2.5 text-sm text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 transition-colors"
            >
              {actionLoading === appointment._id ? (
                <Loader2 className="w-4 h-4 mr-3 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-3" />
              )}
              Complete Appointment
            </button>
          )}

        {/* Cancel Button */}
        {(user?.role === "patient" || user?.role === "doctor") &&
          appointment.status === "booked" && (
            <button
              onClick={() => cancelAppointment(appointment._id)}
              disabled={actionLoading === appointment._id}
              className="w-full flex items-center px-4 py-2.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              {actionLoading === appointment._id ? (
                <Loader2 className="w-4 h-4 mr-3 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4 mr-3" />
              )}
              Cancel Appointment
            </button>
          )}

        {/* Create Case History - Doctor Only */}
        {user?.role === "doctor" && appointment.status === "completed" && (
          <button
            onClick={() => openCaseHistoryModal(appointment)}
            className="w-full flex items-center px-4 py-2.5 text-sm text-blue-700 hover:bg-blue-50 transition-colors"
          >
            <FileText className="w-4 h-4 mr-3" />
            Create Case History
          </button>
        )}

        {/* View Details */}
        <button className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          <Eye className="w-4 h-4 mr-3" />
          View Details
        </button>
      </div>
    );
  };

  // Stepper Component
  const steps = [
    { id: 0, name: "Clinical Notes", icon: StickyNote },
    { id: 1, name: "Medicines", icon: Pill },
    { id: 2, name: "Reports", icon: FileUp },
  ];

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                currentStep >= step.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <step.icon className="w-5 h-5" />
            </div>
            <span
              className={`text-sm font-medium mt-2 ${
                currentStep >= step.id ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {step.name}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-0.5 w-16 mx-4 mb-6 transition-all duration-300 ${
                currentStep > step.id ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <RefreshCw className="animate-spin" size={24} />
          <span className="text-lg">Loading appointments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Appointment Management
              </h1>
              <p className="text-gray-600 text-lg">
                {user?.role === "admin" &&
                  "Comprehensive overview of all clinic appointments"}
                {user?.role === "doctor" &&
                  "Manage your professional schedule and patient appointments"}
                {user?.role === "patient" &&
                  "Track and manage your medical appointments"}
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-3">
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-all flex items-center shadow-sm font-medium">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Appointments
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.length}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Completed
                </p>
                <p className="text-2xl font-bold text-emerald-600">
                  {appointments.filter((a) => a.status === "completed").length}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Scheduled
                </p>
                <p className="text-2xl font-bold text-amber-600">
                  {appointments.filter((a) => a.status === "booked").length}
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <CalendarCheck className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Cancelled
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {appointments.filter((a) => a.status === "cancelled").length}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by patient, doctor, reason, or room..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 font-medium"
              >
                <option value="all">All Status</option>
                <option value="booked">Scheduled</option>
                <option value="checked-in">Checked-in</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {sortedAppointments.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No appointments found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchTerm || statusFilter !== "all" || dateFilter
                  ? "No appointments match your current filters. Try adjusting your search criteria."
                  : "No appointments have been scheduled yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("patientName")}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Patient</span>
                        <SortIcon columnKey="patientName" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("doctorName")}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Doctor</span>
                        <SortIcon columnKey="doctorName" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("date")}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Date & Time</span>
                        <SortIcon columnKey="date" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Room
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Status</span>
                        <SortIcon columnKey="status" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedAppointments.map((appointment) => (
                    <tr
                      key={appointment._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Patient Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {appointment.patientId?.userId?.profileImage ? (
                            <img
                              src={appointment.patientId.userId.profileImage}
                              alt={appointment.patientId?.userId?.name}
                              className="w-10 h-10 rounded-full object-cover border border-gray-300"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm border border-blue-200">
                              {appointment.patientId?.userId?.name?.charAt(0) ||
                                "P"}
                            </div>
                          )}
                          <div className="ml-3">
                            <div className="text-sm font-semibold text-gray-900">
                              {appointment.patientId?.userId?.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {appointment.patientId?.userId?.phone ||
                                "No phone"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Doctor Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {appointment.doctorId?.userId?.profileImage ? (
                            <img
                              src={appointment.doctorId.userId.profileImage}
                              alt={appointment.doctorId?.userId?.name}
                              className="w-10 h-10 rounded-full object-cover border border-gray-300"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm border border-orange-200">
                              D
                            </div>
                          )}
                          <div className="ml-3">
                            <div className="text-sm font-semibold text-gray-900">
                              Dr. {appointment.doctorId?.userId?.name}
                            </div>
                            <div className="text-xs text-blue-600 font-medium mt-0.5">
                              {appointment.doctorId?.specialization}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Date & Time Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {new Date(
                            appointment.appointmentDate
                          ).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(appointment.startAt).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}{" "}
                          -{" "}
                          {new Date(appointment.endAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>

                      {/* Room Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {appointment.roomId ? (
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3 border border-purple-200">
                              <MapPin className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {appointment.roomId.RoomName}
                              </div>
                              <div className="text-xs text-gray-500">
                                Room #{appointment.roomId.roomNumber}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 italic">
                            Not assigned
                          </span>
                        )}
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={appointment.status} />
                      </td>

                      {/* Action Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className="relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenu(
                                activeMenu === appointment._id
                                  ? null
                                  : appointment._id
                              );
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-400" />
                          </button>

                          {activeMenu === appointment._id && (
                            <ActionMenu
                              appointment={appointment}
                              isOpen={true}
                              onClose={() => setActiveMenu(null)}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-lg border border-gray-200">
            <span className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {sortedAppointments.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {appointments.length}
              </span>{" "}
              appointments
            </span>
          </div>
        </div>
      </div>

      {/* Case History Modal */}
      {showCaseHistoryModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
            {/* Modal Header */}
            <div className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Create Case History
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Patient:</span>{" "}
                      {selectedAppointment.patientId?.userId?.name}
                    </p>
                    <span className="text-gray-400">•</span>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Doctor:</span> Dr.{" "}
                      {selectedAppointment.doctorId?.userId?.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowCaseHistoryModal(false);
                    setCurrentStep(0);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Stepper */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <StepIndicator />
            </div>

            {/* Form Content */}
            <form
              onSubmit={submitCaseHistory}
              className="overflow-y-auto max-h-[calc(90vh-200px)]"
            >
              <div className="p-6">
                {/* Step 0: Clinical Notes */}
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <label className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
                          <StickyNote className="w-4 h-4 text-white" />
                        </div>
                        Clinical Notes & Observations
                      </label>
                      <textarea
                        value={caseHistoryForm.notes}
                        onChange={(e) =>
                          handleCaseHistoryChange("notes", e.target.value)
                        }
                        rows={6}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                        placeholder="Enter detailed clinical notes, patient observations, symptoms, diagnosis, and treatment recommendations..."
                      />
                      <div className="mt-3 flex items-start gap-2 text-sm text-gray-600">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <p>
                          Include all relevant medical information, patient
                          history, and examination findings for comprehensive
                          record keeping.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Medicines */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <label className="flex items-center text-lg font-semibold text-gray-900">
                          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center mr-3">
                            <Pill className="w-4 h-4 text-white" />
                          </div>
                          Prescribed Medicines
                        </label>
                        <button
                          type="button"
                          onClick={addMedicine}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          Add Medicine
                        </button>
                      </div>

                      <div className="space-y-3">
                        {caseHistoryForm.medicines.map((medicine, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-4 border border-gray-300 rounded-lg bg-white hover:border-orange-300 transition-all"
                          >
                            <div>
                              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                                Medicine Name
                              </label>
                              <input
                                type="text"
                                placeholder="e.g., Amoxicillin"
                                value={medicine.name}
                                onChange={(e) =>
                                  updateMedicine(index, "name", e.target.value)
                                }
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                                Dosage
                              </label>
                              <input
                                type="text"
                                placeholder="e.g., 500mg"
                                value={medicine.dosage}
                                onChange={(e) =>
                                  updateMedicine(
                                    index,
                                    "dosage",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                                Frequency
                              </label>
                              <input
                                type="text"
                                placeholder="e.g., 3 times daily"
                                value={medicine.frequency}
                                onChange={(e) =>
                                  updateMedicine(
                                    index,
                                    "frequency",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                              />
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <label className="text-xs font-semibold text-gray-700 mb-1 block">
                                  Duration
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g., 7 days"
                                  value={medicine.duration}
                                  onChange={(e) =>
                                    updateMedicine(
                                      index,
                                      "duration",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                                />
                              </div>
                              {caseHistoryForm.medicines.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeMedicine(index)}
                                  className="self-end p-2 text-red-600 hover:bg-red-50 rounded transition-colors border border-red-200"
                                  title="Remove medicine"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Reports */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <label className="flex items-center text-lg font-semibold text-gray-900">
                          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center mr-3">
                            <FileUp className="w-4 h-4 text-white" />
                          </div>
                          Medical Reports & Documents
                        </label>
                        <button
                          type="button"
                          onClick={addReport}
                          className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          Add Report
                        </button>
                      </div>

                      <div className="space-y-3">
                        {caseHistoryForm.reports.map((report, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 border border-gray-300 rounded-lg bg-white hover:border-purple-300 transition-all"
                          >
                            <div>
                              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                                Report Type
                              </label>
                              <input
                                type="text"
                                placeholder="e.g., Blood Test, X-Ray"
                                value={report.reportType}
                                onChange={(e) =>
                                  updateReport(
                                    index,
                                    "reportType",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-gray-700 mb-1 block">
                                File URL
                              </label>
                              <input
                                type="text"
                                placeholder="Enter file URL or path"
                                value={report.fileUrl}
                                onChange={(e) =>
                                  updateReport(index, "fileUrl", e.target.value)
                                }
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
                              />
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <label className="text-xs font-semibold text-gray-700 mb-1 block">
                                  Description
                                </label>
                                <input
                                  type="text"
                                  placeholder="Brief description"
                                  value={report.description}
                                  onChange={(e) =>
                                    updateReport(
                                      index,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm"
                                />
                              </div>
                              {caseHistoryForm.reports.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeReport(index)}
                                  className="self-end p-2 text-red-600 hover:bg-red-50 rounded transition-colors border border-red-200"
                                  title="Remove report"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="bg-white border-t border-gray-200 p-6">
                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <ChevronDown className="w-4 h-4 rotate-90" />
                    Previous
                  </button>

                  <div className="flex-1 text-center">
                    <span className="text-sm text-gray-600 font-medium">
                      Step {currentStep + 1} of {steps.length}
                    </span>
                  </div>

                  {currentStep < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentStep(
                          Math.min(steps.length - 1, currentStep + 1)
                        )
                      }
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-medium flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Create Case History
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;