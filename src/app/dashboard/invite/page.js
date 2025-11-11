"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { BASE_URL } from "@/services/config";
import {
  UserPlus,
  Upload,
  Stethoscope,
  Users,
  Clock,
  Calendar,
  DollarSign,
  Briefcase,
  Phone,
  Mail,
  User,
  MapPin,
  ChevronRight,
  Award,
  Building2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const InviteUserPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    role: "",
    profileImage: null,
  });

  const [rooms, setRooms] = useState([]);
  const [doctorFields, setDoctorFields] = useState({
    specialization: "",
    qualification: "",
    experience: "",
    availableDays: [],
    availableTime: { start: "", end: "" },
    fees: "",
    roomId: "",
  });
  const [staffFields, setStaffFields] = useState({
    designation: "",
    shiftTiming: "",
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch rooms from backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/room/all`);
        setRooms(res.data);
      } catch (error) {
        console.error("Room fetch error:", error);
        toast.error("Failed to fetch rooms");
      }
    };
    fetchRooms();
  }, []);

  // Generic change handler (including file preview)
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      const file = files && files[0];
      setFormData((prev) => ({ ...prev, profileImage: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDoctorChange = (e) => {
    const { name, value } = e.target;
    setDoctorFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvailableDaysChange = (e) => {
    const { value, checked } = e.target;
    setDoctorFields((prev) => {
      let updatedDays = [...prev.availableDays];
      if (checked) updatedDays.push(value);
      else updatedDays = updatedDays.filter((d) => d !== value);
      return { ...prev, availableDays: updatedDays };
    });
  };

  const handleStartTimeChange = (e) => {
    const value = e.target.value;
    if (value < "10:00" || value > "20:00") {
      toast.error("Start time must be between 10:00 AM and 8:00 PM");
      return;
    }
    setDoctorFields((prev) => ({
      ...prev,
      availableTime: { ...prev.availableTime, start: value },
    }));
  };

  const handleEndTimeChange = (e) => {
    const value = e.target.value;
    if (value < "10:00" || value > "20:00") {
      toast.error("End time must be between 10:00 AM and 8:00 PM");
      return;
    }
    if (doctorFields.availableTime.start && value <= doctorFields.availableTime.start) {
      toast.error("End time must be after start time");
      return;
    }
    setDoctorFields((prev) => ({
      ...prev,
      availableTime: { ...prev.availableTime, end: value },
    }));
  };

  // Submit handler: builds FormData and posts to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();

      // Append basic formData (profileImage if present)
      Object.entries(formData).forEach(([key, val]) => {
        if (key === "profileImage") {
          if (val) form.append(key, val);
        } else {
          form.append(key, val ?? "");
        }
      });

      // Append role-specific fields
      if (formData.role === "doctor") {
        Object.entries(doctorFields).forEach(([key, val]) =>
          form.append(key, typeof val === "object" ? JSON.stringify(val) : val ?? "")
        );
      }

      if (formData.role === "staff") {
        Object.entries(staffFields).forEach(([key, val]) => form.append(key, val ?? ""));
      }

      // POST to invite endpoint
      await axios.post(`${BASE_URL}/auth/invite`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("User invited successfully");

      // Reset form state
      setFormData({
        name: "",
        email: "",
        phone: "",
        gender: "",
        role: "",
        profileImage: null,
      });
      setDoctorFields({
        specialization: "",
        qualification: "",
        experience: "",
        availableDays: [],
        availableTime: { start: "", end: "" },
        fees: "",
        roomId: "",
      });
      setStaffFields({ designation: "", shiftTiming: "" });
      setImagePreview(null);
    } catch (error) {
      console.error("Invite error:", error);
      const message = error?.response?.data?.message || "Failed to invite user";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const daysOfWeek = [
    { name: "Monday", short: "Mon", color: "blue" },
    { name: "Tuesday", short: "Tue", color: "orange" },
    { name: "Wednesday", short: "Wed", color: "pink" },
    { name: "Thursday", short: "Thu", color: "blue" },
    { name: "Friday", short: "Fri", color: "orange" },
    { name: "Saturday", short: "Sat", color: "pink" },
    { name: "Sunday", short: "Sun", color: "blue" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background py-8 px-4 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header Section */}
        <div className="text-center mb-10 flex items-center gap-2">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-xl mb-6 transform hover:scale-110 transition-transform duration-300">
            <UserPlus className="w-10 h-10 text-white" />
          </div>
          <div >

          <h1 className="text-4xl sm:text-5xl font-bold text-foreground  mb-3 leading-5">
            Invite New User
          </h1>
          <p className="text-foreground/70 text-lg pl-5 ">Add a new team member to your organization</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <div className="backdrop-blur-sm bg-background/80 border border-foreground/10 rounded-2xl shadow-xl p-8 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 flex items-center justify-center border border-blue-500/20">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Basic Information</h2>
                <p className="text-sm text-foreground/60">Enter the user's personal details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Image Upload - Centered */}
              <div className="lg:col-span-3 flex justify-center">
                <div className="relative group">
                  <div className="w-30 h-30 rounded-full bg-foreground/20 p-1 shadow-2xl">
                    <div className="w-full h-full rounded-full bg-background border-2 border-foreground/10 flex items-center justify-center overflow-hidden">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Upload className="w-12 h-12 text-foreground/30" />
                      )}
                    </div>
                  </div>
                  <label className="absolute bottom-2 right-2 w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all group-hover:scale-110">
                    <Upload className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      name="profileImage"
                      onChange={handleChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>

              {/* Name */}
              <div className="group">
                <label className="flex items-center text-sm font-bold text-foreground/80 mb-3">
                  <User className="w-4 h-4 mr-2 text-blue-600" />
                  Full Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-foreground/20  outline-none transition-all bg-foreground/5 text-foreground font-medium placeholder:text-foreground/40"
                />
              </div>

              {/* Email */}
              <div className="group">
                <label className="flex items-center text-sm font-bold text-foreground/80 mb-3">
                  <Mail className="w-4 h-4 mr-2 text-orange-600" />
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-foreground/20  outline-none transition-all bg-foreground/5 text-foreground font-medium placeholder:text-foreground/40"
                />
              </div>

              {/* Phone */}
              <div className="group">
                <label className="flex items-center text-sm font-bold text-foreground/80 mb-3">
                  <Phone className="w-4 h-4 mr-2 text-pink-600" />
                  Phone Number
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-foreground/20  outline-none transition-all bg-foreground/5 text-foreground font-medium placeholder:text-foreground/40"
                />
              </div>

              {/* Gender */}
              <div className="group">
                <label className="flex items-center text-sm font-bold text-foreground/80 mb-3">
                  <User className="w-4 h-4 mr-2 text-blue-600" />
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-foreground/20  outline-none transition-all bg-foreground/5 text-foreground font-medium appearance-none cursor-pointer"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Role */}
              <div className="lg:col-span-2 group">
                <label className="flex items-center text-sm font-bold text-foreground/80 mb-3">
                  <Briefcase className="w-4 h-4 mr-2 text-orange-600" />
                  User Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-foreground/20  outline-none transition-all bg-foreground/5 text-foreground font-medium appearance-none cursor-pointer"
                >
                  <option value="">Select Role</option>
                  <option value="doctor">👨‍⚕️ Doctor</option>
                  <option value="staff">👥 Staff</option>
                </select>
              </div>
            </div>
          </div>

          {/* Doctor Details */}
          {formData.role === "doctor" && (
            <div className="backdrop-blur-sm bg-background/80 border border-foreground/10 rounded-2xl shadow-xl p-8 hover:border-orange-500/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/10 flex items-center justify-center border border-orange-500/20">
                  <Stethoscope className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Doctor Details</h2>
                  <p className="text-sm text-foreground/60">Professional information and availability</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Specialization */}
                <div className="group">
                  <label className="flex items-center text-sm font-bold text-foreground/80 mb-3">
                    <Stethoscope className="w-4 h-4 mr-2 text-blue-600" />
                    Specialization
                  </label>
                  <input
                    name="specialization"
                    placeholder="e.g., Cardiology"
                    value={doctorFields.specialization}
                    onChange={handleDoctorChange}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-foreground/20  outline-none transition-all bg-foreground/5 text-foreground font-medium placeholder:text-foreground/40"
                  />
                </div>

                {/* Qualification */}
                <div className="group">
                  <label className="flex items-center text-sm font-bold text-foreground/80 mb-3">
                    <Award className="w-4 h-4 mr-2 text-orange-600" />
                    Qualification
                  </label>
                  <input
                    name="qualification"
                    placeholder="e.g., MBBS, MD"
                    value={doctorFields.qualification}
                    onChange={handleDoctorChange}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-foreground/20  outline-none transition-all bg-foreground/5 text-foreground font-medium placeholder:text-foreground/40"
                  />
                </div>

                {/* Experience */}
                <div className="group">
                  <label className="flex items-center text-sm font-bold text-foreground/80 mb-3">
                    <Briefcase className="w-4 h-4 mr-2 text-pink-600" />
                    Experience (Years)
                  </label>
                  <input
                    name="experience"
                    placeholder="e.g., 5"
                    type="number"
                    value={doctorFields.experience}
                    onChange={handleDoctorChange}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-foreground/20  outline-none transition-all bg-foreground/5 text-foreground font-medium placeholder:text-foreground/40"
                  />
                </div>

                {/* Consultation Fee */}
                <div className="group">
                  <label className="flex items-center text-sm font-bold text-foreground/80 mb-3">
                    <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
                    Consultation Fee
                  </label>
                  <input
                    name="fees"
                    placeholder="100"
                    type="number"
                    value={doctorFields.fees}
                    onChange={handleDoctorChange}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-foreground/20  outline-none transition-all bg-foreground/5 text-foreground font-medium placeholder:text-foreground/40"
                  />
                </div>

                {/* Available Days */}
                <div className="md:col-span-2">
                  <label className="flex items-center text-sm font-bold text-foreground/80 mb-4">
                    <Calendar className="w-4 h-4 mr-2 text-orange-600" />
                    Available Days
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
                    {daysOfWeek.map((day) => {
                      const isSelected = doctorFields.availableDays.includes(day.name);
                      return (
                        <label
                          key={day.name}
                          className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            isSelected
                              ? day.color === 'blue' ? "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105" :
                                day.color === 'orange' ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105" :
                                "bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/30 scale-105"
                              : "bg-foreground/5 border-foreground/20 text-foreground hover:border-primary/50 hover:bg-foreground/10"
                          }`}
                        >
                          <input
                            type="checkbox"
                            value={day.name}
                            onChange={handleAvailableDaysChange}
                            checked={isSelected}
                            className="sr-only"
                          />
                          <span className="font-bold text-sm">{day.short}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 mt-1" />}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Start Time */}
                <div className="group">
                  <label className="flex items-center text-sm font-bold text-foreground/80 mb-3">
                    <Clock className="w-4 h-4 mr-2 text-blue-600" />
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={doctorFields.availableTime.start}
                    min="10:00"
                    max="20:00"
                    onChange={handleStartTimeChange}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-foreground/20  outline-none transition-all bg-foreground/5 text-foreground font-medium"
                  />
                  <p className="text-xs text-foreground/50 mt-2 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Between 10:00 AM - 8:00 PM
                  </p>
                </div>

                {/* End Time */}
                <div className="group">
                  <label className="flex items-center text-sm font-bold text-foreground/80 mb-3">
                    <Clock className="w-4 h-4 mr-2 text-orange-600" />
                    End Time
                  </label>
                  <input
                    type="time"
                    value={doctorFields.availableTime.end}
                    min="10:00"
                    max="20:00"
                    onChange={handleEndTimeChange}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-foreground/20  outline-none transition-all bg-foreground/5 text-foreground font-medium"
                  />
                  <p className="text-xs text-foreground/50 mt-2 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Between 10:00 AM - 8:00 PM
                  </p>
                </div>

                {/* Select Room */}
                <div className="md:col-span-2 group">
                  <label className="flex items-center text-sm font-bold text-foreground/80 mb-3">
                    <MapPin className="w-4 h-4 mr-2 text-pink-600" />
                    Assign Room
                  </label>
                  <select
                    name="roomId"
                    value={doctorFields.roomId}
                    onChange={handleDoctorChange}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-foreground/20 outline-none transition-all bg-foreground/5 text-foreground font-medium appearance-none cursor-pointer"
                  >
                    <option value="">Select Room</option>
                    {rooms.map((room) => (
                      <option key={room._id} value={room._id}>
                        Room {room.roomNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Staff Details */}
          {formData.role === "staff" && (
            <div className="backdrop-blur-sm bg-background/80 border border-foreground/10 rounded-2xl shadow-xl p-8 hover:border-pink-500/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/10 to-pink-600/10 flex items-center justify-center border border-pink-500/20">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Staff Details</h2>
                  <p className="text-sm text-foreground/60">Work information and shift timings</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Designation */}
                <div className="group">
                  <label className="flex items-center text-sm font-bold text-foreground/80 mb-3">
                    <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                    Designation
                  </label>
                  <input
                    name="designation"
                    placeholder="e.g., Nurse, Receptionist"
                    value={staffFields.designation}
                    onChange={(e) => setStaffFields((prev) => ({ ...prev, designation: e.target.value }))}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-foreground/20  outline-none transition-all bg-foreground/5 text-foreground font-medium placeholder:text-foreground/40"
                  />
                </div>

                {/* Shift Timing */}
                <div className="group">
                  <label className="flex items-center text-sm font-bold text-foreground/80 mb-3">
                    <Clock className="w-4 h-4 mr-2 text-orange-600" />
                    Shift Timing
                  </label>
                  <input
                    name="shiftTiming"
                    placeholder="e.g., 9 AM - 6 PM"
                    value={staffFields.shiftTiming}
                    onChange={(e) => setStaffFields((prev) => ({ ...prev, shiftTiming: e.target.value }))}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-foreground/20 outline-none transition-all bg-foreground/5 text-foreground font-medium placeholder:text-foreground/40"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-xl transform transition-all duration-300 ${
                loading 
                  ? "bg-foreground/20 cursor-not-allowed" 
                  : "bg-primary hover:shadow-2xl hover:scale-105 active:scale-95"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Sending Invitation...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <UserPlus className="w-6 h-6" />
                  Send Invitation
                  <ChevronRight className="w-5 h-5" />
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteUserPage;