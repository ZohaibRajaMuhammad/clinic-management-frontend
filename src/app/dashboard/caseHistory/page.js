"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "@/services/config";
import { 
  Search, 
  Filter, 
  FileText, 
  User, 
  Calendar, 
  Clock,
  Stethoscope,
  Pill,
  FileUp,
  Download,
  Eye,
  Edit3,
  Trash2,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Plus,
  Loader2,
  Shield,
  Users,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Activity,
  TrendingUp,
  Zap,
  Heart,
  RefreshCw
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";

const CaseHistoryPage = () => {
  const [caseHistories, setCaseHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [expandedCard, setExpandedCard] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const { token, getUserDetails } = useAuthContext();

  // Fetch case histories based on user role
  const fetchCaseHistories = async () => {
    setLoading(true);
    try {
      const userDetails = getUserDetails();
      setUser(userDetails);

     
      
      const response = await axios.get(`${BASE_URL}/doctor/getCaseHistory`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          userId: userDetails.userId,
          role: userDetails.role
        }
      });

      setCaseHistories(response.data.caseHistories || []);
      setError("");
    } catch (err) {
      setError("Failed to fetch case histories");
      console.error("Error fetching case histories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseHistories();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Filter case histories
  const filteredCaseHistories = caseHistories.filter(history => {
    const matchesSearch = 
      history.patientId?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      history.doctorId?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      history.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = !dateFilter || 
      new Date(history.createdAt).toDateString() === new Date(dateFilter).toDateString();

    return matchesSearch && matchesDate;
  });

  // Delete case history
  const handleDeleteCase = async () => {
    if (!selectedCase) return;
    
    setActionLoading(selectedCase._id);
    try {
      await axios.delete(`${BASE_URL}/doctor/deleteCaseHistory/${selectedCase._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          userId: user._id,
          role: user.role
        }
      });
      
      setCaseHistories(caseHistories.filter(ch => ch._id !== selectedCase._id));
      setShowDeleteModal(false);
      setSelectedCase(null);
    } catch (err) {
      setError("Failed to delete case history");
      console.error("Error deleting case history:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Update case history
  const handleUpdateCase = async (e) => {
    e.preventDefault();
    if (!editForm) return;

    setActionLoading(editForm._id);
    try {
      const response = await axios.put(
        `${BASE_URL}/doctor/updateCaseHistory/${editForm._id}`,
        editForm,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            userId: user._id,
            role: user.role
          }
        }
      );

      setCaseHistories(caseHistories.map(ch => 
        ch._id === editForm._id ? response.data.caseHistory : ch
      ));
      setShowEditModal(false);
      setEditForm(null);
    } catch (err) {
      setError("Failed to update case history");
      console.error("Error updating case history:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Open edit modal
  const openEditModal = (caseHistory) => {
    setEditForm({
      _id: caseHistory._id,
      notes: caseHistory.notes || "",
      medicines: caseHistory.medicines || [],
      reports: caseHistory.reports || []
    });
    setShowEditModal(true);
    setActiveMenu(null);
  };

  // Open delete confirmation
  const openDeleteModal = (caseHistory) => {
    setSelectedCase(caseHistory);
    setShowDeleteModal(true);
    setActiveMenu(null);
  };

  // Medicine management
  const addMedicine = () => {
    setEditForm(prev => ({
      ...prev,
      medicines: [...prev.medicines, { name: "", dosage: "", frequency: "", duration: "" }]
    }));
  };

  const removeMedicine = (index) => {
    setEditForm(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index)
    }));
  };

  const updateMedicine = (index, field, value) => {
    const updatedMedicines = [...editForm.medicines];
    updatedMedicines[index][field] = value;
    setEditForm(prev => ({
      ...prev,
      medicines: updatedMedicines
    }));
  };

  // Report management
  const addReport = () => {
    setEditForm(prev => ({
      ...prev,
      reports: [...prev.reports, { reportType: "", fileUrl: "", description: "" }]
    }));
  };

  const removeReport = (index) => {
    setEditForm(prev => ({
      ...prev,
      reports: prev.reports.filter((_, i) => i !== index)
    }));
  };

  const updateReport = (index, field, value) => {
    const updatedReports = [...editForm.reports];
    updatedReports[index][field] = value;
    setEditForm(prev => ({
      ...prev,
      reports: updatedReports
    }));
  };

  // Action Menu Component
  const ActionMenu = ({ caseHistory, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="absolute right-0 top-10 z-50 bg-background border border-primary/20 rounded-2xl shadow-2xl py-2 min-w-48 backdrop-blur-xl">
        <button
          onClick={() => {
            setExpandedCard(expandedCard === caseHistory._id ? null : caseHistory._id);
            onClose();
          }}
          className="w-full flex items-center px-4 py-2.5 text-sm text-foreground/80 hover:bg-primary/10 hover:text-primary transition-all duration-200"
        >
          <Eye className="w-4 h-4 mr-3" />
          {expandedCard === caseHistory._id ? "Collapse" : "Expand Details"}
        </button>

        {(user?.role === "doctor" || user?.role === "admin") && (
          <button
            onClick={() => openEditModal(caseHistory)}
            className="w-full flex items-center px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-all duration-200"
          >
            <Edit3 className="w-4 h-4 mr-3" />
            Edit Record
          </button>
        )}

        {(user?.role === "doctor" || user?.role === "admin") && (
          <button
            onClick={() => openDeleteModal(caseHistory)}
            className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4 mr-3" />
            Delete Record
          </button>
        )}

        <button className="w-full flex items-center px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 transition-all duration-200">
          <Download className="w-4 h-4 mr-3" />
          Export PDF
        </button>
      </div>
    );
  };

  if (loading) {
    return (
     <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <RefreshCw className="animate-spin" size={24} />
          <span className="text-lg">Loading medical records...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Header */}
          <div className="mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-3xl blur-2xl"></div>
            <div className="relative bg-background/80 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 shadow-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center shadow-lg">
                    <Activity className="w-8 h-8 text-background" />
                  </div>
                  <div>
                    <h1 className="text-5xl font-bold text-foreground mb-2 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text">
                      Medical Records
                    </h1>
                    <p className="text-foreground/70 text-lg">
                      {user?.role === "admin" && "Complete overview of all patient records"}
                      {user?.role === "doctor" && "Your comprehensive patient case histories"}
                      {user?.role === "patient" && "Your complete medical journey"}
                    </p>
                  </div>
                </div>
              
              </div>
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { icon: FileText, label: "Total Cases", value: caseHistories.length, color: "from-blue-500 to-blue-600", bg: "bg-blue-500/10" },
              { icon: Pill, label: "Prescriptions", value: caseHistories.reduce((total, ch) => total + (ch.medicines?.length || 0), 0), color: "from-purple-500 to-purple-600", bg: "bg-purple-500/10" },
              { icon: FileUp, label: "Reports", value: caseHistories.reduce((total, ch) => total + (ch.reports?.length || 0), 0), color: "from-green-500 to-green-600", bg: "bg-green-500/10" },
              { icon: Users, label: "Patients", value: new Set(caseHistories.map(ch => ch.patientId?._id)).size, color: "from-orange-500 to-orange-600", bg: "bg-orange-500/10" }
            ].map((stat, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 from-primary/20 to-transparent rounded-3xl blur-xl transition-opacity duration-500"></div>
                <div className="relative bg-background/80 backdrop-blur-xl border border-primary/20 rounded-3xl p-6 hover:border-primary/40 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-4 ${stat.bg} rounded-2xl`}>
                      <stat.icon className="w-7 h-7 text-primary" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-br bg-clip-text text-transparent from-foreground to-foreground/60 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-foreground/70 text-sm font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Advanced Filters */}
          <div className="bg-background/80 backdrop-blur-xl border border-primary/20 rounded-3xl p-6 mb-10 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className="w-5 h-5 text-primary absolute left-4 top-1/2 transform -translate-y-1/2 group-hover:scale-110 transition-transform" />
                <input
                  type="text"
                  placeholder="Search patients, doctors, or medical notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-background/50 border border-primary/30 rounded-2xl text-foreground placeholder:text-foreground/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-300 hover:border-primary/50"
                />
              </div>
              
              <div className="flex gap-3">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-5 py-4 bg-background/50 border border-primary/30 rounded-2xl text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-300 hover:border-primary/50"
                />
                <button className="px-6 py-4 bg-primary/10 border border-primary/30 rounded-2xl text-primary hover:bg-primary/20 transition-all duration-300 flex items-center gap-2 font-medium">
                  <Filter className="w-5 h-5" />
                  <span className="hidden sm:inline">Filters</span>
                </button>
              </div>
            </div>
          </div>

          {/* Case Histories */}
          <div className="space-y-6">
            {filteredCaseHistories.length === 0 ? (
              <div className="text-center py-20 bg-background/60 backdrop-blur-xl border border-primary/20 rounded-3xl">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-12 h-12 text-primary/50" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">No Records Found</h3>
                <p className="text-foreground/70 max-w-md mx-auto text-lg">
                  {searchTerm || dateFilter
                    ? "Try adjusting your search filters to find what you're looking for."
                    : "No medical records have been created yet."}
                </p>
              </div>
            ) : (
              filteredCaseHistories.map((caseHistory, index) => (
                <div
                  key={caseHistory._id}
                  className="group relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative bg-background/80 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-primary/40">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                      <div className="flex-1">
                        {/* Date & Time Badges */}
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/30">
                            <Calendar className="w-4 h-4" />
                            {new Date(caseHistory.appointmentId?.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-blue-500/10 text-blue-600 rounded-full text-sm font-semibold border border-blue-500/30">
                            <Clock className="w-4 h-4" />
                            {new Date(caseHistory.appointmentId?.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                            caseHistory.appointmentId?.status === 'completed' 
                              ? 'bg-green-500/10 text-green-600 border-green-500/30'
                              : caseHistory.appointmentId?.status === 'cancelled'
                              ? 'bg-red-500/10 text-red-600 border-red-500/30'
                              : 'bg-blue-500/10 text-blue-600 border-blue-500/30'
                          }`}>
                            {caseHistory.appointmentId?.status?.toUpperCase()}
                          </div>
                        </div>

                        {/* Patient & Doctor Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Patient */}
                          <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl border border-green-500/20">
                            <div className="relative">
                              {caseHistory.patientId?.userId?.profileImage ? (
                                <img
                                  src={caseHistory.patientId.userId.profileImage}
                                  alt={caseHistory.patientId?.userId?.name}
                                  className="w-16 h-16 rounded-2xl object-cover border-2 border-green-500/30"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-background font-bold text-2xl shadow-lg">
                                  {caseHistory.patientId?.userId?.name?.charAt(0) || 'P'}
                                </div>
                              )}
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                                <Heart className="w-3 h-3 text-background" />
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-foreground/60 font-medium mb-1">PATIENT</div>
                              <h3 className="font-bold text-foreground text-lg">
                                {caseHistory.patientId?.userId?.name}
                              </h3>
                              <p className="text-foreground/70 text-sm flex items-center gap-2">
                                {caseHistory.patientId?.age && `${caseHistory.patientId.age}y`}
                                {caseHistory.patientId?.bloodGroup && (
                                  <>
                                    <span className="w-1 h-1 bg-foreground/40 rounded-full"></span>
                                    <span className="font-semibold">{caseHistory.patientId.bloodGroup}</span>
                                  </>
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Doctor */}
                          <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl border border-blue-500/20">
                            <div className="relative">
                              {caseHistory.doctorId?.userId?.profileImage ? (
                                <img
                                  src={caseHistory.doctorId.userId.profileImage}
                                  alt={caseHistory.doctorId?.userId?.name}
                                  className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/30"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-background font-bold text-2xl shadow-lg">
                                  D
                                </div>
                              )}
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-background flex items-center justify-center">
                                <Stethoscope className="w-3 h-3 text-background" />
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-foreground/60 font-medium mb-1">PHYSICIAN</div>
                              <h3 className="font-bold text-foreground text-lg">
                                Dr. {caseHistory.doctorId?.userId?.name}
                              </h3>
                              <p className="text-primary text-sm font-semibold">
                                {caseHistory.doctorId?.specialization}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Menu */}
                      <div className="relative mt-4 lg:mt-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenu(activeMenu === caseHistory._id ? null : caseHistory._id);
                          }}
                          className="p-3 hover:bg-primary/10 rounded-2xl transition-all duration-300 border border-transparent hover:border-primary/30"
                        >
                          <MoreVertical className="w-6 h-6 text-foreground/70" />
                        </button>
                        
                        <ActionMenu 
                          caseHistory={caseHistory} 
                          isOpen={activeMenu === caseHistory._id}
                          onClose={() => setActiveMenu(null)}
                        />
                      </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {[
                        { icon: Pill, count: caseHistory.medicines?.length || 0, label: "Medicines", color: "purple" },
                        { icon: FileUp, count: caseHistory.reports?.length || 0, label: "Reports", color: "blue" },
                        { icon: CheckCircle2, count: 1, label: caseHistory.appointmentId?.status || 'Status', color: "green" },
                        { icon: Zap, count: '45m', label: "Duration", color: "orange" }
                      ].map((stat, idx) => (
                        <div key={idx} className={`text-center p-4 bg-gradient-to-br from-${stat.color}-500/10 to-transparent rounded-2xl border border-${stat.color}-500/20 hover:scale-105 transition-transform duration-300`}>
                          <stat.icon className={`w-6 h-6 text-${stat.color}-600 mx-auto mb-2`} />
                          <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.count}</div>
                          <div className="text-xs text-foreground/70 font-medium">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Expandable Content */}
                    {expandedCard === caseHistory._id && (
                      <div className="border-t border-primary/20 pt-6 mt-6 space-y-6 animate-in slide-in-from-top duration-500">
                        {/* Clinical Notes */}
                        {caseHistory.notes && (
                          <div className="bg-gradient-to-br from-primary/5 to-transparent rounded-2xl p-6 border border-primary/20">
                            <h4 className="font-bold text-foreground mb-4 flex items-center gap-3 text-lg">
                              <div className="p-2 bg-primary/20 rounded-xl">
                                <Stethoscope className="w-5 h-5 text-primary" />
                              </div>
                              Clinical Assessment
                            </h4>
                            <p className="text-foreground/80 leading-relaxed">
                              {caseHistory.notes}
                            </p>
                          </div>
                        )}

                        {/* Medicines */}
                        {caseHistory.medicines && caseHistory.medicines.length > 0 && (
                          <div>
                            <h4 className="font-bold text-foreground mb-4 flex items-center gap-3 text-lg">
                              <div className="p-2 bg-purple-500/20 rounded-xl">
                                <Pill className="w-5 h-5 text-purple-600" />
                              </div>
                              Prescribed Medications ({caseHistory.medicines.length})
                            </h4>
                            <div className="grid gap-3">
                              {caseHistory.medicines.map((medicine, index) => (
                                <div key={index} className="flex items-center justify-between p-5 bg-gradient-to-r from-purple-500/10 to-transparent rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
                                  <div>
                                    <div className="font-bold text-foreground text-lg mb-1">{medicine.name}</div>
                                    <div className="flex items-center gap-3 text-sm text-foreground/70">
                                      <span className="px-3 py-1 bg-background/50 rounded-full font-medium">{medicine.dosage}</span>
                                      <span className="px-3 py-1 bg-background/50 rounded-full font-medium">{medicine.frequency}</span>
                                      <span className="px-3 py-1 bg-background/50 rounded-full font-medium">{medicine.duration}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Reports */}
                        {caseHistory.reports && caseHistory.reports.length > 0 && (
                          <div>
                            <h4 className="font-bold text-foreground mb-4 flex items-center gap-3 text-lg">
                              <div className="p-2 bg-blue-500/20 rounded-xl">
                                <FileUp className="w-5 h-5 text-blue-600" />
                              </div>
                              Medical Reports ({caseHistory.reports.length})
                            </h4>
                            <div className="grid gap-3">
                              {caseHistory.reports.map((report, index) => (
                                <div key={index} className="p-5 bg-gradient-to-r from-blue-500/10 to-transparent rounded-2xl border border-blue-500/20 hover:border-blue-500/40 transition-all">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="font-bold text-foreground text-lg mb-1">{report.reportType}</div>
                                      {report.description && (
                                        <div className="text-sm text-foreground/70 mb-3">{report.description}</div>
                                      )}
                                    </div>
                                    {report.fileUrl && (
                                      <a 
                                        href={report.fileUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-background rounded-xl hover:bg-blue-600 transition-all text-sm font-semibold shadow-lg hover:scale-105"
                                      >
                                        <Download className="w-4 h-4" />
                                        Download
                                      </a>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Appointment Timeline */}
                        <div className="bg-gradient-to-br from-orange-500/5 to-transparent rounded-2xl p-6 border border-orange-500/20">
                          <h4 className="font-bold text-foreground mb-4 flex items-center gap-3 text-lg">
                            <div className="p-2 bg-orange-500/20 rounded-xl">
                              <Calendar className="w-5 h-5 text-orange-600" />
                            </div>
                            Appointment Timeline
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-xl">
                              <Calendar className="w-4 h-4 text-primary" />
                              <div>
                                <span className="text-foreground/70 font-medium">Date: </span>
                                <span className="text-foreground font-semibold">{new Date(caseHistory.appointmentId?.appointmentDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-xl">
                              <Clock className="w-4 h-4 text-primary" />
                              <div>
                                <span className="text-foreground/70 font-medium">Time: </span>
                                <span className="text-foreground font-semibold">
                                  {new Date(caseHistory.appointmentId?.startAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} - {new Date(caseHistory.appointmentId?.endAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Expand/Collapse Button */}
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => setExpandedCard(expandedCard === caseHistory._id ? null : caseHistory._id)}
                        className="flex items-center gap-3 px-6 py-3 text-foreground/70 hover:text-foreground bg-primary/5 hover:bg-primary/10 rounded-2xl transition-all duration-300 font-semibold border border-primary/20 hover:border-primary/40"
                      >
                        {expandedCard === caseHistory._id ? (
                          <>
                            <ChevronUp className="w-5 h-5" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-5 h-5" />
                            Show Full Details
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Stats */}
          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-background/80 backdrop-blur-xl border border-primary/20 rounded-full text-foreground/70">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="font-semibold">Showing {filteredCaseHistories.length} of {caseHistories.length} medical records</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCase && (
        <div className="fixed inset-0 bg-foreground/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-background rounded-3xl p-8 w-full max-w-md border border-red-500/30 shadow-2xl animate-in zoom-in duration-300">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Delete Medical Record</h3>
              <p className="text-foreground/70 mb-8 text-lg">
                Are you sure you want to permanently delete this case history? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleDeleteCase}
                disabled={actionLoading === selectedCase._id}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-background py-4 rounded-2xl hover:from-red-700 hover:to-red-600 disabled:opacity-50 transition-all font-bold flex items-center justify-center shadow-lg hover:scale-105"
              >
                {actionLoading === selectedCase._id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Delete Forever"
                )}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-foreground/10 text-foreground py-4 rounded-2xl hover:bg-foreground/20 transition-all font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editForm && (
        <div className="fixed inset-0 bg-foreground/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-background rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-xl border-b border-primary/20 p-8 flex items-center justify-between z-10">
              <div>
                <h3 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <Edit3 className="w-8 h-8 text-primary" />
                  Edit Medical Record
                </h3>
                <p className="text-foreground/70 text-lg mt-2">Update patient information and prescriptions</p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-3 hover:bg-foreground/10 rounded-2xl transition-all duration-300"
              >
                <XCircle className="w-6 h-6 text-foreground/70" />
              </button>
            </div>

            <form onSubmit={handleUpdateCase} className="p-8 space-y-8">
              {/* Notes Section */}
              <div>
                <label className="block text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-primary" />
                  Clinical Assessment
                </label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={5}
                  className="w-full px-4 py-4 bg-background border border-primary/30 rounded-2xl text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                  placeholder="Enter detailed clinical notes and observations..."
                />
              </div>

              {/* Medicines Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-lg font-bold text-foreground flex items-center gap-2">
                    <Pill className="w-5 h-5 text-purple-600" />
                    Prescribed Medications
                  </label>
                  <button
                    type="button"
                    onClick={addMedicine}
                    className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-500/20 to-purple-500/10 text-purple-600 rounded-xl hover:from-purple-500/30 hover:to-purple-500/20 transition-all font-semibold border border-purple-500/30"
                  >
                    <Plus className="w-5 h-5" />
                    Add Medicine
                  </button>
                </div>
                
                <div className="space-y-4">
                  {editForm.medicines.map((medicine, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 border border-purple-500/20 rounded-2xl bg-purple-500/5">
                      <input
                        type="text"
                        placeholder="Medicine name"
                        value={medicine.name}
                        onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                        className="px-4 py-3 bg-background border border-primary/30 rounded-xl text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Dosage"
                        value={medicine.dosage}
                        onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                        className="px-4 py-3 bg-background border border-primary/30 rounded-xl text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Frequency"
                        value={medicine.frequency}
                        onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                        className="px-4 py-3 bg-background border border-primary/30 rounded-xl text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Duration"
                          value={medicine.duration}
                          onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                          className="flex-1 px-4 py-3 bg-background border border-primary/30 rounded-xl text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        />
                        {editForm.medicines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMedicine(index)}
                            className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reports Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-lg font-bold text-foreground flex items-center gap-2">
                    <FileUp className="w-5 h-5 text-blue-600" />
                    Medical Reports
                  </label>
                  <button
                    type="button"
                    onClick={addReport}
                    className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500/20 to-blue-500/10 text-blue-600 rounded-xl hover:from-blue-500/30 hover:to-blue-500/20 transition-all font-semibold border border-blue-500/30"
                  >
                    <Plus className="w-5 h-5" />
                    Add Report
                  </button>
                </div>
                
                <div className="space-y-4">
                  {editForm.reports.map((report, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 border border-blue-500/20 rounded-2xl bg-blue-500/5">
                      <input
                        type="text"
                        placeholder="Report type"
                        value={report.reportType}
                        onChange={(e) => updateReport(index, 'reportType', e.target.value)}
                        className="px-4 py-3 bg-background border border-primary/30 rounded-xl text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      />
                      <input
                        type="text"
                        placeholder="File URL"
                        value={report.fileUrl}
                        onChange={(e) => updateReport(index, 'fileUrl', e.target.value)}
                        className="px-4 py-3 bg-background border border-primary/30 rounded-xl text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Description"
                          value={report.description}
                          onChange={(e) => updateReport(index, 'description', e.target.value)}
                          className="flex-1 px-4 py-3 bg-background border border-primary/30 rounded-xl text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        />
                        {editForm.reports.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeReport(index)}
                            className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6 border-t border-primary/20">
                <button
                  type="submit"
                  disabled={actionLoading === editForm._id}
                  className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-background py-4 rounded-2xl hover:from-primary/90 hover:to-primary/70 disabled:opacity-50 transition-all font-bold flex items-center justify-center shadow-lg hover:scale-105"
                >
                  {actionLoading === editForm._id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Update Record"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-foreground/10 text-foreground py-4 rounded-2xl hover:bg-foreground/20 transition-all font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseHistoryPage;