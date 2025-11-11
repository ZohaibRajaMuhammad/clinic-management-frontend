"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Clock,
  Star,
  MapPin,
  Award,
  Users,
  Phone,
  Mail,
  Heart,
  Shield,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Video,
  MessageSquare,
  CheckCircle2,
  X,
  Search,
  Building2,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Filter,
  Eye,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { BASE_URL } from "@/services/config";
import { useAuthContext } from "@/context/AuthContext";
import axios from "axios";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    appointmentDate: "",
    startAt: "",
    endAt: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { getUserDetails } = useAuthContext();
  const [availableSlots, setAvailableSlots] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/doctor/getall`);
        setDoctors(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load doctors");
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesTab =
      activeTab === "all" ||
      doctor.specialization?.toLowerCase().includes(activeTab.toLowerCase());

    const matchesSearch =
      doctor.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const specializations = [
    ...new Set(doctors.map((doc) => doc.specialization)),
  ];

  const openModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
    setFormData({
      appointmentDate: "",
      startAt: "",
      endAt: "",
      reason: "",
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      appointmentDate: "",
      startAt: "",
      endAt: "",
      reason: "",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateTime = (start, end) => {
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    const startTime = startH + startM / 60;
    const endTime = endH + endM / 60;
    if (startTime < 10 || endTime > 20 || startTime >= endTime) return false;
    return true;
  };

  const handleBook = async () => {
    if (
      !formData.appointmentDate ||
      !formData.startAt ||
      !formData.endAt ||
      !formData.reason
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!validateTime(formData.startAt, formData.endAt)) {
      toast.error("Clinic hours are between 10:00 AM and 8:00 PM");
      return;
    }

    const user = getUserDetails();
    let userId = user?.userId;
    let pateintId = user?.patientId;

    setLoading(true);
    const loadingToast = toast.loading("Booking appointment...");

    try {
      const payload = {
        patientId: pateintId,
        doctorId: selectedDoctor._id,
        roomId: selectedDoctor.roomId,
        appointmentDate: formData.appointmentDate,
        startAt: formData.startAt,
        endAt: formData.endAt,
        reason: formData.reason,
        createdBy: userId,
      };

      const res = await axios.post(`${BASE_URL}/appointment/create`, payload);

      toast.success("Appointment booked successfully!", { id: loadingToast });
      setAvailableSlots([]);
      setTimeout(() => closeModal(), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong", {
        id: loadingToast,
      });

      if (err.response?.data?.availableSlots) {
        setAvailableSlots(err.response.data.availableSlots);
      }
    } finally {
      setLoading(false);
    }
  };

  const convertTo24Hour = (time) => {
    const [t, modifier] = time.split(" ");
    let [hours, minutes] = t.split(":");
    hours = parseInt(hours, 10);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Professional Header Component
  const ProfessionalHeader = () => (
    <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-3xl p-8 mb-8">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="relative z-10 text-center">
        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 mb-6 border border-white/20">
          <Stethoscope className="w-6 h-6 text-white" />
          <span className="text-white/90 font-semibold text-lg">Medical Professionals</span>
        </div>
        <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
          Find Your Expert <span className="text-blue-300">Healthcare Provider</span>
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
          Connect with board-certified specialists dedicated to your health and well-being
        </p>
      </div>
    </div>
  );

  // Stats Overview Component
  const StatsOverview = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {[
        {
          icon: <Users className="w-6 h-6" />,
          value: `${doctors.length}+`,
          label: "Expert Doctors",
          gradient: "from-blue-600 to-cyan-600",
        },
        {
          icon: <Award className="w-6 h-6" />,
          value: "98%",
          label: "Success Rate",
          gradient: "from-emerald-600 to-green-600",
        },
        {
          icon: <Heart className="w-6 h-6" />,
          value: "25K+",
          label: "Patients Served",
          gradient: "from-rose-600 to-pink-600",
        },
        {
          icon: <GraduationCap className="w-6 h-6" />,
          value: "15+",
          label: "Years Experience",
          gradient: "from-purple-600 to-indigo-600",
        },
      ].map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
        >
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
            {stat.icon}
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
          <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  );

  // Enhanced Search and Filter Component
  const SearchAndFilter = () => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div className="flex-1 w-full">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by doctor name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
            />
          </div>
        </div>
        
        <div className="flex gap-3 w-full lg:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "all"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Specialties
            </button>
            {specializations.map((spec) => (
              <button
                key={spec}
                onClick={() => setActiveTab(spec)}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === spec
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Professional Doctor Card Component
  const DoctorCard = ({ doctor }) => {
    const isExpanded = expandedRow === doctor._id;

    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
        {/* Main Card Content */}
        <div className="p-8">
          <div className="flex flex-col xl:flex-row gap-8 items-start">
            {/* Doctor Avatar and Basic Info */}
            <div className="flex items-start gap-6 flex-1 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg group-hover:border-blue-100 transition-colors">
                  <img
                    src={doctor.userId?.profileImage || "/api/placeholder/96/96"}
                    alt={doctor.userId?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      Dr. {doctor.userId?.name}
                    </h3>
                    <p className="text-lg text-blue-600 font-semibold mb-1">{doctor.specialization}</p>
                    <p className="text-gray-600 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      {doctor.qualification}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full mb-2">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-gray-900">4.8</span>
                      <span className="text-gray-600 text-sm">(120)</span>
                    </div>
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      Available Today
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-blue-50 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Experience</div>
                    <div className="font-bold text-gray-900">{doctor.experience}</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Consultation</div>
                    <div className="font-bold text-gray-900">Rs:{doctor.fees}</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Patients</div>
                    <div className="font-bold text-gray-900">850+</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openModal(doctor)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group/btn"
                  >
                    <Calendar className="w-5 h-5" />
                    Book Appointment
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => toggleRow(doctor._id)}
                    className="p-4 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200 text-gray-600 hover:text-gray-900"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-t border-gray-200 p-8 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Availability Section */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  Availability Schedule
                </h4>
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="text-sm text-gray-600 mb-2 font-medium">Available Days</div>
                    <div className="font-semibold text-gray-900">{doctor.availableDays?.join(", ")}</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="text-sm text-gray-600 mb-2 font-medium">Consultation Hours</div>
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      {doctor.availableTime?.start} - {doctor.availableTime?.end}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  Contact Information
                </h4>
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="text-sm text-gray-600 mb-2 font-medium">Phone Number</div>
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-600" />
                      {doctor.userId.phone}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="text-sm text-gray-600 mb-2 font-medium">Email Address</div>
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-orange-600" />
                      {doctor.userId.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Services Offered */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  Services & Features
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-200">
                    <Video className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-gray-900">Video Call</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-200">
                    <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-gray-900">In-Person</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-200">
                    <Heart className="w-6 h-6 text-rose-600 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-gray-900">Follow-up</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-200">
                    <Shield className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-gray-900">Insurance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Professional Header */}
        <ProfessionalHeader />

        {/* Stats Overview */}
        <StatsOverview />

        {/* Search and Filters */}
        <SearchAndFilter />

        {/* Doctors Grid */}
        <div className="space-y-6 mb-12">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="w-24 h-24 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6">
                <Stethoscope className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Doctors Found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We couldn't find any doctors matching your criteria. Try adjusting your search terms or filters.
              </p>
            </div>
          )}
        </div>

        {/* Clinic Information Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-3">Clinic Hours</h3>
              <p className="text-white/80 font-medium">10:00 AM - 8:00 PM</p>
              <p className="text-white/80 font-medium">Monday - Saturday</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-3">Emergency Contact</h3>
              <p className="text-white/80 font-medium">+1 (555) 123-4567</p>
              <p className="text-white/80 font-medium">24/7 Available</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-3">Our Location</h3>
              <p className="text-white/80 font-medium">123 Health Street</p>
              <p className="text-white/80 font-medium">Medical City, MC 12345</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 relative">
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-3xl font-bold text-white mb-4">Schedule Appointment</h2>
              <div className="flex items-center gap-4">
                <img
                  src={selectedDoctor?.userId?.profileImage || "/api/placeholder/60/60"}
                  alt={selectedDoctor?.userId?.name}
                  className="w-16 h-16 rounded-2xl ring-2 ring-white/30"
                />
                <div>
                  <p className="font-bold text-xl text-white">Dr. {selectedDoctor?.userId?.name}</p>
                  <p className="text-white/90">{selectedDoctor?.specialization}</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-240px)]">
              <div>
                <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Appointment Date
                </label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-gray-50 text-gray-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startAt"
                    value={formData.startAt}
                    onChange={handleChange}
                    className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-gray-50 text-gray-900 font-medium"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endAt"
                    value={formData.endAt}
                    onChange={handleChange}
                    className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-gray-50 text-gray-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-bold text-gray-700 mb-3">
                  <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                  Reason for Visit
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Please describe your symptoms or reason for consultation..."
                  rows="4"
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-gray-50 text-gray-900 font-medium resize-none placeholder:text-gray-500"
                ></textarea>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">Important Information</p>
                    <p className="text-sm text-gray-700">
                      Our clinic operates from 10:00 AM to 8:00 PM, Monday through Saturday. 
                      Please ensure your appointment falls within these hours for proper scheduling.
                    </p>
                  </div>
                </div>
              </div>

              {availableSlots.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 animate-fade-in">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-600" />
                    Alternative Available Slots
                  </h4>
                  <p className="text-sm text-gray-700 mb-4">
                    The selected time is unavailable. Please choose from these available slots:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {availableSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            startAt: convertTo24Hour(slot.startAt),
                            endAt: convertTo24Hour(slot.endAt),
                          });
                          toast.success(`Selected ${slot.startAt} - ${slot.endAt}`, { icon: "⏰" });
                        }}
                        className="px-4 py-3 rounded-xl border border-amber-300 bg-white text-gray-900 font-semibold hover:bg-amber-50 transition-all duration-200 text-sm"
                      >
                        {slot.startAt} - {slot.endAt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-gray-200">
              <button
                onClick={handleBook}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Appointment...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Confirm Appointment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;