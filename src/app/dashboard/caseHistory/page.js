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
  RefreshCw,
  ArrowRight,
  Building,
  BadgeDollarSign,
  ClipboardList
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
      <div className="absolute right-0 top-10 z-50 bg-white border border-gray-200 rounded-lg shadow-xl py-2 min-w-48">
        <button
          onClick={() => {
            setExpandedCard(expandedCard === caseHistory._id ? null : caseHistory._id);
            onClose();
          }}
          className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Eye className="w-4 h-4 mr-3" />
          {expandedCard === caseHistory._id ? "Collapse" : "Expand Details"}
        </button>

        {(user?.role === "doctor" || user?.role === "admin") && (
          <button
            onClick={() => openEditModal(caseHistory)}
            className="w-full flex items-center px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Edit3 className="w-4 h-4 mr-3" />
            Edit Record
          </button>
        )}

        {(user?.role === "doctor" || user?.role === "admin") && (
          <button
            onClick={() => openDeleteModal(caseHistory)}
            className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-3" />
            Delete Record
          </button>
        )}

        <button className="w-full flex items-center px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 transition-colors">
          <Download className="w-4 h-4 mr-3" />
          Export PDF
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <RefreshCw className="animate-spin" size={24} />
          <span className="text-lg">Loading medical records...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Records</h1>
                <p className="text-gray-600">
                  {user?.role === "admin" && "Complete overview of all patient records"}
                  {user?.role === "doctor" && "Your comprehensive patient case histories"}
                  {user?.role === "patient" && "Your complete medical journey"}
                </p>
              </div>
              <div className="mt-4 lg:mt-0 flex items-center gap-4">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Cases</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{caseHistories.length}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Prescriptions</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {caseHistories.reduce((total, ch) => total + (ch.medicines?.length || 0), 0)}
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Pill className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Medical Reports</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {caseHistories.reduce((total, ch) => total + (ch.reports?.length || 0), 0)}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <FileUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unique Patients</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {new Set(caseHistories.map(ch => ch.patientId?._id)).size}
                  </p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search patients, doctors, or medical notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              
              <div className="flex gap-3">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
                <button className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
              </div>
            </div>
          </div>

          {/* Case Histories List */}
          <div className="space-y-4">
            {filteredCaseHistories.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Records Found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {searchTerm || dateFilter
                    ? "Try adjusting your search filters to find what you're looking for."
                    : "No medical records have been created yet."}
                </p>
              </div>
            ) : (
              filteredCaseHistories.map((caseHistory, index) => (
                <div
                  key={caseHistory._id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            <Calendar className="w-4 h-4" />
                            {new Date(caseHistory.appointmentId?.appointmentDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                            <Clock className="w-4 h-4" />
                            {new Date(caseHistory.appointmentId?.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            caseHistory.appointmentId?.status === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : caseHistory.appointmentId?.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {caseHistory.appointmentId?.status?.charAt(0).toUpperCase() + caseHistory.appointmentId?.status?.slice(1)}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Patient Info */}
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <User className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Patient</p>
                              <p className="font-semibold text-gray-900">
                                {caseHistory.patientId?.userId?.name || 'Unknown'}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                {caseHistory.patientId?.age && <span>{caseHistory.patientId.age}y</span>}
                                {caseHistory.patientId?.bloodGroup && (
                                  <>
                                    <span>•</span>
                                    <span className="font-medium">{caseHistory.patientId.bloodGroup}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Doctor Info */}
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Stethoscope className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Physician</p>
                              <p className="font-semibold text-gray-900">
                                Dr. {caseHistory.doctorId?.userId?.name || 'Unknown'}
                              </p>
                              <p className="text-sm text-blue-600 font-medium mt-1">
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
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                        
                        <ActionMenu 
                          caseHistory={caseHistory} 
                          isOpen={activeMenu === caseHistory._id}
                          onClose={() => setActiveMenu(null)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg mx-auto mb-2">
                          <Pill className="w-5 h-5 text-purple-600" />
                        </div>
                        <p className="text-lg font-bold text-gray-900">{caseHistory.medicines?.length || 0}</p>
                        <p className="text-sm text-gray-600">Medicines</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mx-auto mb-2">
                          <FileUp className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-lg font-bold text-gray-900">{caseHistory.reports?.length || 0}</p>
                        <p className="text-sm text-gray-600">Reports</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mx-auto mb-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <p className="text-lg font-bold text-gray-900">1</p>
                        <p className="text-sm text-gray-600">Visit</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg mx-auto mb-2">
                          <Clock className="w-5 h-5 text-orange-600" />
                        </div>
                        <p className="text-lg font-bold text-gray-900">45m</p>
                        <p className="text-sm text-gray-600">Duration</p>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Content */}
                  {expandedCard === caseHistory._id && (
                    <div className="p-6 border-t border-gray-200 bg-gray-50">
                      <div className="space-y-6">
                        {/* Clinical Notes */}
                        {caseHistory.notes && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <Stethoscope className="w-5 h-5 text-blue-600" />
                              Clinical Assessment
                            </h4>
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                              <p className="text-gray-700 leading-relaxed">{caseHistory.notes}</p>
                            </div>
                          </div>
                        )}

                        {/* Medicines */}
                        {caseHistory.medicines && caseHistory.medicines.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <Pill className="w-5 h-5 text-purple-600" />
                              Prescribed Medications ({caseHistory.medicines.length})
                            </h4>
                            <div className="grid gap-3">
                              {caseHistory.medicines.map((medicine, index) => (
                                <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <p className="font-medium text-gray-900 mb-2">{medicine.name}</p>
                                      <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                          {medicine.dosage}
                                        </span>
                                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                          {medicine.frequency}
                                        </span>
                                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                          {medicine.duration}
                                        </span>
                                      </div>
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
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <FileUp className="w-5 h-5 text-blue-600" />
                              Medical Reports ({caseHistory.reports.length})
                            </h4>
                            <div className="grid gap-3">
                              {caseHistory.reports.map((report, index) => (
                                <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900 mb-1">{report.reportType}</p>
                                      {report.description && (
                                        <p className="text-gray-600 text-sm mb-3">{report.description}</p>
                                      )}
                                    </div>
                                    {report.fileUrl && (
                                      <a 
                                        href={report.fileUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
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
                      </div>
                    </div>
                  )}

                  {/* Expand/Collapse Button */}
                  <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
                    <button
                      onClick={() => setExpandedCard(expandedCard === caseHistory._id ? null : caseHistory._id)}
                      className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-700 font-medium py-2 transition-colors"
                    >
                      {expandedCard === caseHistory._id ? (
                        <>
                          <ChevronUp className="w-5 h-5" />
                          Show Less Details
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
              ))
            )}
          </div>

          {/* Footer Stats */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="font-medium">Showing {filteredCaseHistories.length} of {caseHistories.length} medical records</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Medical Record</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to permanently delete this case history? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteCase}
                disabled={actionLoading === selectedCase._id}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium flex items-center justify-center"
              >
                {actionLoading === selectedCase._id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Delete Forever"
                )}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                  Edit Medical Record
                </h3>
                <p className="text-gray-600 text-sm mt-1">Update patient information and prescriptions</p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleUpdateCase} className="p-6 space-y-6">
              {/* Notes Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-blue-600" />
                  Clinical Assessment
                </label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                  placeholder="Enter detailed clinical notes and observations..."
                />
              </div>

              {/* Medicines Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Pill className="w-4 h-4 text-purple-600" />
                    Prescribed Medications
                  </label>
                  <button
                    type="button"
                    onClick={addMedicine}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Medicine
                  </button>
                </div>
                
                <div className="space-y-3">
                  {editForm.medicines.map((medicine, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <input
                        type="text"
                        placeholder="Medicine name"
                        value={medicine.name}
                        onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Dosage"
                        value={medicine.dosage}
                        onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Frequency"
                        value={medicine.frequency}
                        onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Duration"
                          value={medicine.duration}
                          onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                          className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        />
                        {editForm.medicines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMedicine(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
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
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FileUp className="w-4 h-4 text-blue-600" />
                    Medical Reports
                  </label>
                  <button
                    type="button"
                    onClick={addReport}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Report
                  </button>
                </div>
                
                <div className="space-y-3">
                  {editForm.reports.map((report, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <input
                        type="text"
                        placeholder="Report type"
                        value={report.reportType}
                        onChange={(e) => updateReport(index, 'reportType', e.target.value)}
                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="File URL"
                        value={report.fileUrl}
                        onChange={(e) => updateReport(index, 'fileUrl', e.target.value)}
                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Description"
                          value={report.description}
                          onChange={(e) => updateReport(index, 'description', e.target.value)}
                          className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        />
                        {editForm.reports.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeReport(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={actionLoading === editForm._id}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium flex items-center justify-center"
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
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
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