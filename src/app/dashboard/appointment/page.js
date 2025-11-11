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
        color: "bg-blue-500/10 text-blue-600 border-blue-500/30",
        icon: CalendarCheck,
        bgColor: "bg-blue-500",
      },
      "checked-in": {
        color: "bg-orange-500/10 text-orange-600 border-orange-500/30",
        icon: Clock,
        bgColor: "bg-orange-500",
      },
      completed: {
        color: "bg-green-500/10 text-green-600 border-green-500/30",
        icon: CheckCircle2,
        bgColor: "bg-green-500",
      },
      cancelled: {
        color: "bg-red-500/10 text-red-600 border-red-500/30",
        icon: XCircle,
        bgColor: "bg-red-500",
      },
    };

    const config = statusConfig[status] || statusConfig.booked;
    const IconComponent = config.icon;

    return (
      <div
        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${config.color}`}
      >
        <div className={`w-2 h-2 rounded-full ${config.bgColor} mr-2`}></div>
        <IconComponent className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
      </div>
    );
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="w-4 h-4 text-foreground/40" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4 text-primary" />
    ) : (
      <ChevronDown className="w-4 h-4 text-primary" />
    );
  };

  // Action Menu Component
  const ActionMenu = ({ appointment, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="absolute right-0 top-8 z-50 bg-background border border-foreground/10 rounded-xl shadow-2xl py-2 min-w-48 animate-in fade-in slide-in-from-top-2 duration-200">
        {/* Complete Button */}
        {(user?.role === "doctor" || user?.role === "admin") &&
          (appointment.status === "booked" ||
            appointment.status === "checked-in") && (
            <button
              onClick={() => completeAppointment(appointment._id)}
              disabled={actionLoading === appointment._id}
              className="w-full flex items-center px-4 py-2.5 text-sm text-green-600 hover:bg-green-500/10 disabled:opacity-50 transition-colors font-medium"
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
              className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-500/10 disabled:opacity-50 transition-colors font-medium"
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
            className="w-full flex items-center px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-500/10 transition-colors font-medium"
          >
            <FileText className="w-4 h-4 mr-3" />
            Create Case History
          </button>
        )}

        {/* View Details */}
        <button className="w-full flex items-center px-4 py-2.5 text-sm text-foreground/70 hover:bg-foreground/5 transition-colors font-medium">
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
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                currentStep >= step.id
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                  : "bg-foreground/10 text-foreground/40"
              }`}
            >
              <step.icon className="w-5 h-5" />
            </div>
            <span
              className={`text-xs font-medium mt-2 ${
                currentStep >= step.id
                  ? "text-foreground"
                  : "text-foreground/40"
              }`}
            >
              {step.name}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-0.5 w-24 mx-4 mb-6 transition-all duration-300 ${
                currentStep > step.id ? "bg-blue-600" : "bg-foreground/10"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  if (loading) {
    return (
     <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <RefreshCw className="animate-spin" size={24} />
          <span className="text-lg">Loading appointments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background py-8 px-4 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "700ms" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1000ms" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        {/* <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-orange-500 to-pink-600 bg-clip-text text-transparent mb-2">
                Appointment Management
              </h1>
              <p className="text-foreground/70 text-lg">
                {user?.role === "admin" &&
                  "Comprehensive overview of all clinic appointments"}
                {user?.role === "doctor" &&
                  "Manage your professional schedule and patient appointments"}
                {user?.role === "patient" &&
                  "Track and manage your medical appointments"}
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center shadow-lg shadow-blue-500/30 font-medium">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </button>
            </div>
          </div>
        </div> */}

        <div className="mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-3xl blur-2xl"></div>
          <div className="relative bg-background/80 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-200 rounded-2xl flex items-center justify-center shadow-lg">
                  <Activity className="w-8 h-8 text-background" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text">
                    Appointment Management
                  </h1>
                  <p className="text-foreground/70 text-lg">
                    {user?.role === "admin" &&
                      "Complete overview of all patient records"}
                    {user?.role === "doctor" &&
                      "Your comprehensive patient case histories"}
                    {user?.role === "patient" &&
                      "Your complete medical journey"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="backdrop-blur-sm bg-background/80 border border-foreground/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-lg group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70 mb-1">
                  Total Appointments
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {appointments.length}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl group-hover:scale-110 transition-transform">
                <Calendar className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="backdrop-blur-sm bg-background/80 border border-foreground/10 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300 shadow-sm hover:shadow-lg group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70 mb-1">
                  Completed
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {appointments.filter((a) => a.status === "completed").length}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </div>

          <div className="backdrop-blur-sm bg-background/80 border border-foreground/10 rounded-2xl p-6 hover:border-orange-500/50 transition-all duration-300 shadow-sm hover:shadow-lg group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70 mb-1">
                  Scheduled
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {appointments.filter((a) => a.status === "booked").length}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl group-hover:scale-110 transition-transform">
                <CalendarCheck className="w-7 h-7 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="backdrop-blur-sm bg-background/80 border border-foreground/10 rounded-2xl p-6 hover:border-red-500/50 transition-all duration-300 shadow-sm hover:shadow-lg group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground/70 mb-1">
                  Cancelled
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {appointments.filter((a) => a.status === "cancelled").length}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-xl group-hover:scale-110 transition-transform">
                <XCircle className="w-7 h-7 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <div className="backdrop-blur-sm bg-background/80 border border-foreground/10 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="w-5 h-5 text-foreground/40 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by patient, doctor, reason, or room..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-foreground/5 border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3.5 bg-foreground/5 border border-foreground/20 rounded-xl text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-300 font-medium"
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
                className="px-4 py-3.5 bg-foreground/5 border border-foreground/20 rounded-xl text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-300 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="backdrop-blur-sm bg-background/80 border border-foreground/10 rounded-2xl overflow-hidden ">
          {sortedAppointments.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                No appointments found
              </h3>
              <p className="text-foreground/70 max-w-md mx-auto">
                {searchTerm || statusFilter !== "all" || dateFilter
                  ? "No appointments match your current filters. Try adjusting your search criteria."
                  : "No appointments have been scheduled yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-foreground/10 bg-gradient-to-r from-blue-500/5 via-orange-500/5 to-pink-500/5">
                    <th
                      className="px-6 py-4 text-left text-xs font-bold text-foreground/80 uppercase tracking-wider cursor-pointer hover:bg-foreground/10 transition-colors"
                      onClick={() => handleSort("patientName")}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Patient</span>
                        <SortIcon columnKey="patientName" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-bold text-foreground/80 uppercase tracking-wider cursor-pointer hover:bg-foreground/10 transition-colors"
                      onClick={() => handleSort("doctorName")}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Doctor</span>
                        <SortIcon columnKey="doctorName" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-bold text-foreground/80 uppercase tracking-wider cursor-pointer hover:bg-foreground/10 transition-colors"
                      onClick={() => handleSort("date")}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Date & Time</span>
                        <SortIcon columnKey="date" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-foreground/80 uppercase tracking-wider">
                      Room
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-bold text-foreground/80 uppercase tracking-wider cursor-pointer hover:bg-foreground/10 transition-colors"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center space-x-2">
                        <span>Status</span>
                        <SortIcon columnKey="status" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-foreground/80 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/10">
                  {sortedAppointments.map((appointment) => (
                    <tr
                      key={appointment._id}
                      className="hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-pink-500/5 transition-all duration-200 group"
                    >
                      {/* Patient Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {appointment.patientId?.userId?.profileImage ? (
                            <>
                              <img
                                src={appointment.patientId.userId.profileImage}
                                alt={appointment.patientId?.userId?.name}
                                className="w-11 h-11 rounded-full object-cover border-2 border-foreground/10 group-hover:border-blue-500/50 transition-colors"
                              />
                              <div className="pl-2 text-sm font-bold text-foreground group-hover:text-blue-600 transition-colors">
                                {appointment.patientId?.userId?.name}
                              </div>
                            </>
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center text-blue-600 font-bold text-lg border-2 border-blue-500/30">
                              {appointment.patientId?.userId?.name?.charAt(0) ||
                                "P"}
                              <div className="ml-4">
                                <div className="text-sm font-bold text-foreground group-hover:text-blue-600 transition-colors">
                                  {appointment.patientId?.userId?.name}
                                </div>
                                <div className="text-xs text-foreground/60 mt-0.5 flex items-center">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {appointment.patientId?.userId?.phone ||
                                    "No phone"}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Doctor Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {appointment.doctorId?.userId?.profileImage ? (
                            <img
                              src={appointment.doctorId.userId.profileImage}
                              alt={appointment.doctorId?.userId?.name}
                              className="w-11 h-11 rounded-full object-cover border-2 border-foreground/10 group-hover:border-orange-500/50 transition-colors"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center text-orange-600 font-bold text-lg border-2 border-orange-500/30">
                              D
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-bold text-foreground group-hover:text-orange-600 transition-colors">
                              Dr. {appointment.doctorId?.userId?.name}
                            </div>
                            <div className="text-xs text-primary font-semibold mt-0.5">
                              {appointment.doctorId?.specialization}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Date & Time Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-foreground">
                          {new Date(
                            appointment.appointmentDate
                          ).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="flex items-center text-xs text-foreground/60 mt-1 font-medium">
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
                            <div className="w-9 h-9 rounded-lg bg-pink-500/10 flex items-center justify-center mr-3 border border-pink-500/20">
                              <MapPin className="w-4 h-4 text-pink-600" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-foreground">
                                {appointment.roomId.RoomName}
                              </div>
                              <div className="text-xs text-foreground/60 font-medium">
                                Room #{appointment.roomId.roomNumber}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-foreground/50 italic">
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
                            className="p-2.5 hover:bg-foreground/10 rounded-lg transition-colors group"
                          >
                            <MoreVertical className="w-5 h-5 text-foreground/60 group-hover:text-foreground" />
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
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-foreground/5 rounded-full border border-foreground/10">
            <span className="text-sm font-medium text-foreground/70">
              Showing{" "}
              <span className="font-bold text-foreground">
                {sortedAppointments.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-foreground">
                {appointments.length}
              </span>{" "}
              appointments
            </span>
          </div>
        </div>
      </div>

      {/* Case History Modal */}
      {showCaseHistoryModal && selectedAppointment && (
        <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-background rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl border border-foreground/10">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500/10 via-orange-500/10 to-pink-500/10 backdrop-blur-sm border-b border-foreground/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-orange-500 to-pink-600 bg-clip-text text-transparent">
                    Create Case History
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-sm text-foreground/70 font-medium">
                      <span className="text-foreground font-semibold">
                        Patient:
                      </span>{" "}
                      {selectedAppointment.patientId?.userId?.name}
                    </p>
                    <span className="text-foreground/40">•</span>
                    <p className="text-sm text-foreground/70 font-medium">
                      <span className="text-foreground font-semibold">
                        Doctor:
                      </span>{" "}
                      Dr. {selectedAppointment.doctorId?.userId?.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowCaseHistoryModal(false);
                    setCurrentStep(0);
                  }}
                  className="p-2.5 hover:bg-foreground/10 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-foreground/70" />
                </button>
              </div>
            </div>

            {/* Stepper */}
            <div className="p-6 bg-foreground/5">
              <StepIndicator />
            </div>

            {/* Form Content */}
            <form
              onSubmit={submitCaseHistory}
              className="overflow-y-auto max-h-[calc(90vh-280px)]"
            >
              <div className="p-6">
                {/* Step 0: Clinical Notes */}
                {currentStep === 0 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-5 duration-300">
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6">
                      <label className="flex items-center text-base font-bold text-foreground mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center mr-3">
                          <StickyNote className="w-5 h-5 text-white" />
                        </div>
                        Clinical Notes & Observations
                      </label>
                      <textarea
                        value={caseHistoryForm.notes}
                        onChange={(e) =>
                          handleCaseHistoryChange("notes", e.target.value)
                        }
                        rows={8}
                        className="w-full px-4 py-3 bg-background border-2 border-foreground/20 rounded-xl text-foreground focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                        placeholder="Enter detailed clinical notes, patient observations, symptoms, diagnosis, and treatment recommendations..."
                      />
                      <div className="mt-3 flex items-start gap-2 text-xs text-foreground/60">
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
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-5 duration-300">
                    <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <label className="flex items-center text-base font-bold text-foreground">
                          <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center mr-3">
                            <Pill className="w-5 h-5 text-white" />
                          </div>
                          Prescribed Medicines
                        </label>
                        <button
                          type="button"
                          onClick={addMedicine}
                          className="flex items-center gap-2 px-4 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/30 font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          Add Medicine
                        </button>
                      </div>

                      <div className="space-y-4">
                        {caseHistoryForm.medicines.map((medicine, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5 border-2 border-foreground/10 rounded-xl bg-background hover:border-orange-500/30 transition-all"
                          >
                            <div>
                              <label className="text-xs font-semibold text-foreground/70 mb-2 block">
                                Medicine Name
                              </label>
                              <input
                                type="text"
                                placeholder="e.g., Amoxicillin"
                                value={medicine.name}
                                onChange={(e) =>
                                  updateMedicine(index, "name", e.target.value)
                                }
                                className="w-full px-3 py-2.5 bg-foreground/5 border border-foreground/20 rounded-lg text-foreground focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm font-medium"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-foreground/70 mb-2 block">
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
                                className="w-full px-3 py-2.5 bg-foreground/5 border border-foreground/20 rounded-lg text-foreground focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm font-medium"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-foreground/70 mb-2 block">
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
                                className="w-full px-3 py-2.5 bg-foreground/5 border border-foreground/20 rounded-lg text-foreground focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm font-medium"
                              />
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <label className="text-xs font-semibold text-foreground/70 mb-2 block">
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
                                  className="w-full px-3 py-2.5 bg-foreground/5 border border-foreground/20 rounded-lg text-foreground focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm font-medium"
                                />
                              </div>
                              {caseHistoryForm.medicines.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeMedicine(index)}
                                  className="self-end p-2.5 text-red-600 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/20"
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
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-5 duration-300">
                    <div className="bg-pink-500/5 border border-pink-500/20 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <label className="flex items-center text-base font-bold text-foreground">
                          <div className="w-10 h-10 rounded-lg bg-pink-600 flex items-center justify-center mr-3">
                            <FileUp className="w-5 h-5 text-white" />
                          </div>
                          Medical Reports & Documents
                        </label>
                        <button
                          type="button"
                          onClick={addReport}
                          className="flex items-center gap-2 px-4 py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all shadow-lg shadow-pink-500/30 font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          Add Report
                        </button>
                      </div>

                      <div className="space-y-4">
                        {caseHistoryForm.reports.map((report, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 border-2 border-foreground/10 rounded-xl bg-background hover:border-pink-500/30 transition-all"
                          >
                            <div>
                              <label className="text-xs font-semibold text-foreground/70 mb-2 block">
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
                                className="w-full px-3 py-2.5 bg-foreground/5 border border-foreground/20 rounded-lg text-foreground focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm font-medium"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-foreground/70 mb-2 block">
                                File URL
                              </label>
                              <input
                                type="text"
                                placeholder="Enter file URL or path"
                                value={report.fileUrl}
                                onChange={(e) =>
                                  updateReport(index, "fileUrl", e.target.value)
                                }
                                className="w-full px-3 py-2.5 bg-foreground/5 border border-foreground/20 rounded-lg text-foreground focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm font-medium"
                              />
                            </div>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <label className="text-xs font-semibold text-foreground/70 mb-2 block">
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
                                  className="w-full px-3 py-2.5 bg-foreground/5 border border-foreground/20 rounded-lg text-foreground focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none text-sm font-medium"
                                />
                              </div>
                              {caseHistoryForm.reports.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeReport(index)}
                                  className="self-end p-2.5 text-red-600 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/20"
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
              <div className="sticky bottom-0 bg-background border-t border-foreground/10 p-6">
                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="px-6 py-3 bg-foreground/10 text-foreground rounded-xl hover:bg-foreground/20 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <ChevronDown className="w-4 h-4 rotate-90" />
                    Previous
                  </button>

                  <div className="flex-1 text-center">
                    <span className="text-sm text-foreground/60 font-medium">
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
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg shadow-blue-500/30 flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-medium shadow-lg shadow-green-500/30 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
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
