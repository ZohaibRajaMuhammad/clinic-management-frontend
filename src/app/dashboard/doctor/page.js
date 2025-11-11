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
  TrendingUp,
  CheckCircle2,
  X,
  Search,
  Filter,
  Building2,
  Sparkles,
  ArrowRight,
  AlertCircle,
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

  const getSpecializationIcon = (spec) => {
    const icons = {
      Cardiology: "❤️",
      Dermatology: "🔬",
      Neurology: "🧠",
      Pediatrics: "👶",
      Orthopedics: "🦴",
      Dentistry: "🦷",
    };
    return icons[spec] || "👨‍⚕️";
  };

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

  // Stats Cards
  const StatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[
        {
          icon: <Users className="w-7 h-7" />,
          title: "Expert Doctors",
          value: doctors.length || "50+",
          color: "from-blue-600 to-blue-700",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/20",
        },
        {
          icon: <Calendar className="w-7 h-7" />,
          title: "Appointments",
          value: "10K+",
          color: "from-orange-600 to-orange-700",
          bgColor: "bg-orange-500/10",
          borderColor: "border-orange-500/20",
        },
        {
          icon: <Star className="w-7 h-7" />,
          title: "Satisfaction Rate",
          value: "98%",
          color: "from-pink-600 to-pink-700",
          bgColor: "bg-pink-500/10",
          borderColor: "border-pink-500/20",
        },
        {
          icon: <Award className="w-7 h-7" />,
          title: "Years Experience",
          value: "25+",
          color: "from-blue-600 to-purple-600",
          bgColor: "bg-purple-500/10",
          borderColor: "border-purple-500/20",
        },
      ].map((stat, index) => (
        <div
          key={index}
          className={`backdrop-blur-sm bg-background/80 border ${stat.borderColor} rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 group`}
        >
          <div
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}
          >
            {stat.icon}
          </div>
          <h3 className="text-3xl font-bold text-foreground mb-1">
            {stat.value}
          </h3>
          <p className="text-sm text-foreground/70 font-medium">{stat.title}</p>
        </div>
      ))}
    </div>
  );

  // Specialization Filter
  const SpecializationFilter = () => (
    <div className="backdrop-blur-sm bg-background/80 border border-foreground/10 rounded-2xl p-6 mb-8 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 flex items-center justify-center border border-blue-500/20">
            <Stethoscope className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Filter by Specialization
            </h3>
            <p className="text-sm text-foreground/60">
              Find the right specialist for you
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 text-foreground/40 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-foreground/5 border border-foreground/20 rounded-xl text-foreground placeholder:text-foreground/40 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-medium"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === "all"
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
              : "bg-foreground/5 text-foreground hover:bg-foreground/10 border border-foreground/20"
          }`}
        >
          All Doctors
        </button>
        {specializations.map((spec) => (
          <button
            key={spec}
            onClick={() => setActiveTab(spec)}
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
              activeTab === spec
                ? "bg-gradient-to-r from-orange-600 to-pink-600 text-white shadow-lg shadow-orange-500/30"
                : "bg-foreground/5 text-foreground hover:bg-foreground/10 border border-foreground/20"
            }`}
          >
            <span>{getSpecializationIcon(spec)}</span>
            {spec}
          </button>
        ))}
      </div>
    </div>
  );

  // Doctor Card Component
  const DoctorCard = ({ doctor }) => {
    const isExpanded = expandedRow === doctor._id;

    return (
      <div className="backdrop-blur-sm bg-background/80 border border-foreground/10 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-lg group">
        {/* Main Content */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
            {/* Left: Doctor Info */}
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-foreground/10 group-hover:border-blue-500/50 transition-colors">
                  <img
                    src={
                      doctor.userId?.profileImage || "/api/placeholder/80/80"
                    }
                    alt={doctor.userId?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background shadow-lg"></div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground text-xl group-hover:text-blue-600 transition-colors mb-1">
                  Dr. {doctor.userId?.name}
                </h3>
                <p className="text-sm text-foreground/70 flex items-center gap-1.5 mb-1 font-medium">
                  <Stethoscope className="w-4 h-4 text-blue-600" />
                  {doctor.specialization}
                </p>
                <p className="text-sm text-foreground/60 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-orange-600" />
                  {doctor.qualification}
                </p>
              </div>
            </div>

            {/* Right: Status & Rating */}
            <div className="flex lg:flex-col items-start lg:items-end gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/30 text-green-600 rounded-full text-sm font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Available
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="text-lg font-bold text-foreground">4.8</span>
                <span className="text-sm text-foreground/60">(120)</span>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-blue-500/5 rounded-xl border border-blue-500/20">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-foreground/60 font-medium">
                  Experience
                </p>
                <p className="text-sm font-bold text-foreground">
                  {doctor.experience} 
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-orange-500/5 rounded-xl border border-orange-500/20">
              <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-foreground/60 font-medium">
                  Consultation
                </p>
                <p className="text-sm font-bold text-foreground">
                  Rs:{doctor.fees}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-pink-500/5 rounded-xl border border-pink-500/20">
              <div className="w-10 h-10 rounded-lg bg-pink-600 flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-foreground/60 font-medium">
                  Patients
                </p>
                <p className="text-sm font-bold text-foreground">850+</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => openModal(doctor)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl flex items-center justify-center gap-2 group/btn"
            >
              <Calendar className="w-4 h-4" />
              Schedule Appointment
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => toggleRow(doctor._id)}
              className="p-3.5 hover:bg-foreground/10 rounded-xl transition-colors border border-foreground/20"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="bg-gradient-to-br from-blue-500/5 via-orange-500/5 to-pink-500/5 border-t border-foreground/10 p-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Availability */}
              <div className="space-y-3">
                <h4 className="font-bold text-foreground text-sm mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Availability Schedule
                </h4>
                <div className="space-y-2">
                  <div className="bg-background rounded-lg p-3 border border-foreground/10">
                    <p className="text-xs text-foreground/60 mb-1 font-medium">
                      Available Days
                    </p>
                    <p className="font-semibold text-foreground text-sm">
                      {doctor.availableDays?.join(", ")}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3 border border-foreground/10 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <div>
                      <p className="text-xs text-foreground/60 font-medium">
                        Timing
                      </p>
                      <p className="font-semibold text-foreground text-sm">
                        {doctor.availableTime?.start} -{" "}
                        {doctor.availableTime?.end}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <h4 className="font-bold text-foreground text-sm mb-3 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-600" />
                  Contact Information
                </h4>
                <div className="space-y-2">
                  <div className="bg-background rounded-lg p-3 border border-foreground/10 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-foreground/60 font-medium">
                        Phone
                      </p>
                      <p className="font-semibold text-foreground text-sm">
                        {doctor.userId.phone}
                      </p>
                    </div>
                  </div>
                  <div className="bg-background rounded-lg p-3 border border-foreground/10 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-orange-600" />
                    <div>
                      <p className="text-xs text-foreground/60 font-medium">
                        Email
                      </p>
                      <p className="font-semibold text-foreground text-sm">
                        {doctor.userId.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="space-y-3">
                <h4 className="font-bold text-foreground text-sm mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-600" />
                  Services Offered
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-600 rounded-lg text-xs font-semibold flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    Video Call
                  </span>
                  <span className="px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-600 rounded-lg text-xs font-semibold flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    In-Person
                  </span>
                  <span className="px-3 py-1.5 bg-pink-500/10 border border-pink-500/30 text-pink-600 rounded-lg text-xs font-semibold flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    Follow-up
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

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
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-boldtext-foreground mb-3">
            Our Medical Experts
          </h1>
          <p className="text-foreground/70 text-lg">
            Connect with experienced healthcare professionals
          </p>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Specialization Filter */}
        <SpecializationFilter />

        {/* Doctors Grid */}
        <div className="space-y-6 mb-8">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))
          ) : (
            <div className="text-center py-20 backdrop-blur-sm bg-background/80 border border-foreground/10 rounded-2xl">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                No Doctors Found
              </h3>
              <p className="text-foreground/60">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className="backdrop-blur-sm bg-background/80 border border-foreground/10 rounded-2xl p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-foreground mb-2 text-lg">
                Clinic Hours
              </h3>
              <p className="text-sm text-foreground/70 font-medium">
                10:00 AM - 8:00 PM
              </p>
              <p className="text-sm text-foreground/70 font-medium">
                Monday - Saturday
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-foreground mb-2 text-lg">
                Emergency
              </h3>
              <p className="text-sm text-foreground/70 font-medium">
                +1 (555) 123-4567
              </p>
              <p className="text-sm text-foreground/70 font-medium">
                24/7 Available
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-600 to-pink-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-foreground mb-2 text-lg">
                Location
              </h3>
              <p className="text-sm text-foreground/70 font-medium">
                123 Health Street
              </p>
              <p className="text-sm text-foreground/70 font-medium">
                Medical City, MC 12345
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-background w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden border border-foreground/10">
            {/* Modal Header */}
            <div className=" text-foreground bg-primary/5 p-6 relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-9 h-9 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold mb-3">Book Appointment</h2>
              <div className="flex items-center gap-3">
                <img
                  src={
                    selectedDoctor?.userId?.profileImage ||
                    "/api/placeholder/50/50"
                  }
                  alt={selectedDoctor?.userId?.name}
                  className="w-14 h-14 rounded-xl ring-2 ring-foreground/30"
                />
                <div>
                  <p className="font-bold text-lg">
                    Dr. {selectedDoctor?.userId?.name}
                  </p>
                  <p className="text-sm text-foreground/80">
                    {selectedDoctor?.specialization}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-240px)]">
              <div>
                <label className="flex items-center text-sm font-bold text-foreground/80 mb-3">
                  <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                  Appointment Date
                </label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-foreground/20  outline-none transition-all bg-foreground/5 text-foreground font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-bold text-foreground/80 mb-3">
                    <Clock className="w-4 h-4 mr-2 text-orange-600" />
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startAt"
                    value={formData.startAt}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-foreground/20  outline-none transition-all bg-foreground/5 text-foreground font-medium"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-bold text-foreground/80 mb-3">
                    <Clock className="w-4 h-4 mr-2 text-pink-600" />
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endAt"
                    value={formData.endAt}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-foreground/20  outline-none transition-all bg-foreground/5 text-foreground font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-bold text-foreground/80 mb-3">
                  <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                  Reason for Appointment
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Please describe your symptoms or reason for visit..."
                  rows="4"
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-foreground/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-foreground/5 text-foreground font-medium resize-none placeholder:text-foreground/40"
                ></textarea>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-foreground mb-1">
                      Clinic Hours Notice
                    </p>
                    <p className="text-xs text-foreground/70">
                      Our clinic is open from 10:00 AM to 8:00 PM, Monday
                      through Saturday. Please schedule your appointment within
                      these hours.
                    </p>
                  </div>
                </div>
              </div>

              {availableSlots.length > 0 && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 animate-fade-in">
                  <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    Available Time Slots
                  </h4>
                  <p className="text-sm text-foreground/70 mb-4">
                    {`This time slot is already booked. Please select another available slot:`}
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
                          toast.success(
                            `Selected ${slot.startAt} - ${slot.endAt}`,
                            { icon: "⏰" }
                          );
                        }}
                        className={`px-4 py-2.5 rounded-lg border text-sm font-semibold transition-all duration-200 
            bg-background hover:bg-orange-500/10 border-orange-500/30 
            text-foreground hover:text-orange-600`}
                      >
                        {slot.startAt} - {slot.endAt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-foreground/10">
              <button
                onClick={handleBook}
                disabled={loading}
                className="w-full bg-primary/90 cursor-pointer  text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Booking Appointment...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Confirm Appointment
                    <ArrowRight className="w-5 h-5" />
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
