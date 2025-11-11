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
  IdCard,
  Shield,
  BadgeCheck,
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
  const [activeStep, setActiveStep] = useState(1);

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
      setActiveStep(1);
    } catch (error) {
      console.error("Invite error:", error);
      const message = error?.response?.data?.message || "Failed to invite user";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const daysOfWeek = [
    { name: "Monday", short: "MON", color: "blue" },
    { name: "Tuesday", short: "TUE", color: "indigo" },
    { name: "Wednesday", short: "WED", color: "purple" },
    { name: "Thursday", short: "THU", color: "blue" },
    { name: "Friday", short: "FRI", color: "indigo" },
    { name: "Saturday", short: "SAT", color: "purple" },
    { name: "Sunday", short: "SUN", color: "blue" },
  ];

  const nextStep = () => {
    if (formData.name && formData.email && formData.phone && formData.gender && formData.role) {
      setActiveStep(2);
    } else {
      toast.error("Please fill all basic information fields");
    }
  };

  const prevStep = () => setActiveStep(1);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-lg border border-gray-100 mb-6">
            <UserPlus className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Invite Team Member</h1>
          <p className="text-gray-600 text-lg">Add new professionals to your healthcare team</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${activeStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                activeStep >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'
              }`}>
                1
              </div>
              <span className="ml-3 font-medium">Basic Info</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${activeStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                activeStep >= 2 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'
              }`}>
                2
              </div>
              <span className="ml-3 font-medium">Role Details</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Basic Information */}
          {activeStep === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <IdCard className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                  <p className="text-sm text-gray-600">Basic details about the team member</p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Profile Image */}
                <div className="flex justify-center">
                  <div className="relative group">
                    <div className="w-28 h-28 rounded-full bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-blue-700 transition-colors">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900 appearance-none cursor-pointer"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User Role *
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900 appearance-none cursor-pointer"
                      >
                        <option value="">Select Role</option>
                        <option value="doctor">Doctor</option>
                        <option value="staff">Staff</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Next Button */}
                <div className="flex justify-end pt-6">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
                  >
                    Continue to Details
                    <ChevronRight className="w-4 h-4 ml-2 inline" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Role-specific Details */}
          {activeStep === 2 && (
            <div className="space-y-8">
              {/* Doctor Details */}
              {formData.role === "doctor" && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Medical Professional Details</h2>
                      <p className="text-sm text-gray-600">Doctor's qualifications and availability</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Specialization */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specialization
                      </label>
                      <div className="relative">
                        <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="specialization"
                          placeholder="Cardiology, Neurology, etc."
                          value={doctorFields.specialization}
                          onChange={handleDoctorChange}
                          className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900 placeholder-gray-500"
                        />
                      </div>
                    </div>

                    {/* Qualification */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Qualification
                      </label>
                      <div className="relative">
                        <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="qualification"
                          placeholder="MBBS, MD, etc."
                          value={doctorFields.qualification}
                          onChange={handleDoctorChange}
                          className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900 placeholder-gray-500"
                        />
                      </div>
                    </div>

                    {/* Experience */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience (Years)
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="experience"
                          placeholder="5"
                          type="number"
                          value={doctorFields.experience}
                          onChange={handleDoctorChange}
                          className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900 placeholder-gray-500"
                        />
                      </div>
                    </div>

                    {/* Consultation Fee */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Consultation Fee ($)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="fees"
                          placeholder="100"
                          type="number"
                          value={doctorFields.fees}
                          onChange={handleDoctorChange}
                          className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900 placeholder-gray-500"
                        />
                      </div>
                    </div>

                    {/* Available Days */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Available Days
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                        {daysOfWeek.map((day) => {
                          const isSelected = doctorFields.availableDays.includes(day.name);
                          return (
                            <label
                              key={day.name}
                              className={`relative flex flex-col items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                value={day.name}
                                onChange={handleAvailableDaysChange}
                                checked={isSelected}
                                className="sr-only"
                              />
                              <span className="font-semibold text-sm mb-1">{day.short}</span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Start Time */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="time"
                          value={doctorFields.availableTime.start}
                          min="10:00"
                          max="20:00"
                          onChange={handleStartTimeChange}
                          className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Between 10:00 AM - 8:00 PM</p>
                    </div>

                    {/* End Time */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="time"
                          value={doctorFields.availableTime.end}
                          min="10:00"
                          max="20:00"
                          onChange={handleEndTimeChange}
                          className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Between 10:00 AM - 8:00 PM</p>
                    </div>

                    {/* Select Room */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assign Room
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          name="roomId"
                          value={doctorFields.roomId}
                          onChange={handleDoctorChange}
                          className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900 appearance-none cursor-pointer"
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
                </div>
              )}

              {/* Staff Details */}
              {formData.role === "staff" && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Staff Information</h2>
                      <p className="text-sm text-gray-600">Staff member details and schedule</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Designation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Designation
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="designation"
                          placeholder="Nurse, Receptionist, etc."
                          value={staffFields.designation}
                          onChange={(e) => setStaffFields((prev) => ({ ...prev, designation: e.target.value }))}
                          className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900 placeholder-gray-500"
                        />
                      </div>
                    </div>

                    {/* Shift Timing */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shift Timing
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="shiftTiming"
                          placeholder="9:00 AM - 6:00 PM"
                          value={staffFields.shiftTiming}
                          onChange={(e) => setStaffFields((prev) => ({ ...prev, shiftTiming: e.target.value }))}
                          className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900 placeholder-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Back
                </button>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-8 py-3 rounded-lg font-medium focus:ring-2 focus:ring-offset-2 transition-colors ${
                      loading 
                        ? "bg-gray-400 cursor-not-allowed text-white" 
                        : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm"
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending Invitation...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        Send Invitation
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default InviteUserPage;