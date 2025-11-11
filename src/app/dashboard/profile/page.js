'use client'
import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Edit2, Save, X, Camera, Phone, MapPin, Briefcase, Clock, Activity, Settings, Lock, Bell, Globe, RefreshCw } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';



export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({});
  const {getUserDetails} = useAuthContext()

  useEffect(() => {
    // Fetch user details dynamically
    const fetchUserData = () => {
      try {
        const details = getUserDetails();
        const joinDate = new Date(details.iat * 1000).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        const enrichedData = {
          ...details,
          phone: "+92 300 1234567",
          location: "Karachi, Pakistan",
          department: "Engineering",
          joinDate: joinDate,
          bio: "Passionate software developer and admin with expertise in full-stack development. Leading teams and building innovative solutions.",
          avatar: null
        };
        
        setUserData(enrichedData);
        setEditForm(enrichedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(userData);
  };

  const handleSave = () => {
    setUserData(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(userData);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <RefreshCw className="animate-spin" size={24} />
          <span className="text-lg">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center">
        <p className="text-foreground/60">Failed to load user data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative backdrop-blur-sm bg-background/80 border-b border-foreground/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground ">
                Profile 
              </h1>
              <p className="text-foreground/60 mt-1">Manage your account information</p>
            </div>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl"
              >
                <Edit2 className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Edit Profile</span>
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-500/30"
                >
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium">Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-3 bg-foreground/10 text-foreground rounded-xl hover:bg-foreground/20 transition-all"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium">Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Sidebar - Profile Card */}
          <div className="lg:col-span-4 space-y-6">
            {/* Main Profile Card */}
            <div className="backdrop-blur-sm bg-background/80 rounded-2xl p-8 shadow-xl border border-foreground/10">
              <div className="flex flex-col items-center">
                {/* Avatar */}
                <div className="relative mb-6">
                  <div className="w-30 h-30 rounded-full bg-foreground/30 p-1 shadow-2xl">
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                      <User className="w-12 h-12 text-foreground/60" />
                    </div>
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-2 right-2 w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all">
                      <Camera className="w-5 h-5" />
                    </button>
                  )}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-background"></div>
                </div>

                {/* Name */}
                <div className="w-full text-center mb-4">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="text-2xl font-bold text-center w-full bg-foreground/5 border-2 border-foreground/20 rounded-xl px-4 py-3 mb-3 text-foreground"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold mb-3 text-foreground">{userData.name}</h2>
                  )}
                  
                  {/* Role Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full text-sm font-semibold shadow-lg shadow-orange-500/30">
                    <Shield className="w-4 h-4" />
                    {userData.role.toUpperCase()}
                  </div>
                </div>

                {/* User ID Card */}
                <div className="w-full p-4 bg-gradient-to-r from-blue-500/10 to-pink-500/10 rounded-xl border border-primary/30">
                  <p className="text-xs text-foreground/60 mb-2 font-semibold">USER ID</p>
                  <p className="text-xs font-mono text-foreground/80 break-all">{userData.userId}</p>
                </div>
              </div>
            </div>

            {/* Account Status Card */}
            <div className="backdrop-blur-sm bg-background/80 rounded-2xl p-6 shadow-xl border border-foreground/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
                <Activity className="w-5 h-5 text-blue-600" />
                Account Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-xl border border-green-500/30">
                  <span className="text-sm font-medium text-foreground/70">Status</span>
                  <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold shadow-sm">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-xl border border-blue-500/30">
                  <span className="text-sm font-medium text-foreground/70">Verification</span>
                  <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold shadow-sm">VERIFIED</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-xl border border-orange-500/30">
                  <span className="text-sm font-medium text-foreground/70">Joined</span>
                  <span className="text-xs font-medium text-foreground/70">{userData.joinDate}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="backdrop-blur-sm bg-background/80 rounded-2xl p-6 shadow-xl border border-foreground/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
                <Settings className="w-5 h-5 text-orange-600" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 bg-foreground/5 rounded-xl hover:bg-foreground/10 transition-all text-left">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-foreground/70">Change Password</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-foreground/5 rounded-xl hover:bg-foreground/10 transition-all text-left">
                  <Bell className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-foreground/70">Notifications</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-foreground/5 rounded-xl hover:bg-foreground/10 transition-all text-left">
                  <Globe className="w-5 h-5 text-pink-600" />
                  <span className="text-sm font-medium text-foreground/70">Privacy Settings</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Personal Information */}
            <div className="backdrop-blur-sm bg-background/80 rounded-2xl p-8 shadow-xl border border-foreground/10">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-foreground">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground/60 mb-3">
                    <Mail className="w-4 h-4 text-blue-600" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full bg-foreground/5 border-2 border-foreground/20 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-foreground"
                    />
                  ) : (
                    <p className="font-medium text-foreground bg-foreground/5 px-4 py-3 rounded-xl">{userData.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground/60 mb-3">
                    <Phone className="w-4 h-4 text-orange-600" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full bg-foreground/5 border-2 border-foreground/20 rounded-xl px-4 py-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all text-foreground"
                    />
                  ) : (
                    <p className="font-medium text-foreground bg-foreground/5 px-4 py-3 rounded-xl">{userData.phone}</p>
                  )}
                </div>

                {/* Location */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground/60 mb-3">
                    <MapPin className="w-4 h-4 text-pink-600" />
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      className="w-full bg-foreground/5 border-2 border-foreground/20 rounded-xl px-4 py-3 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all text-foreground"
                    />
                  ) : (
                    <p className="font-medium text-foreground bg-foreground/5 px-4 py-3 rounded-xl">{userData.location}</p>
                  )}
                </div>

                {/* Department */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground/60 mb-3">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    Department
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.department}
                      onChange={(e) => handleChange('department', e.target.value)}
                      className="w-full bg-foreground/5 border-2 border-foreground/20 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-foreground"
                    />
                  ) : (
                    <p className="font-medium text-foreground bg-foreground/5 px-4 py-3 rounded-xl">{userData.department}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bio Section */}
            {/* <div className="backdrop-blur-sm bg-background/80 rounded-2xl p-8 shadow-xl border border-foreground/10">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-foreground">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-600 to-pink-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                About Me
              </h3>
              {isEditing ? (
                <textarea
                  value={editForm.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  rows={5}
                  className="w-full bg-foreground/5 border-2 border-foreground/20 rounded-xl px-4 py-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none text-foreground"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-foreground/80 leading-relaxed bg-foreground/5 px-6 py-4 rounded-xl">{userData.bio}</p>
              )}
            </div> */}

            {/* Activity Timeline */}
            <div className="backdrop-blur-sm bg-background/80 rounded-2xl p-8 shadow-xl border border-foreground/10">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-foreground">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                Recent Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/30">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0 shadow-lg"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Profile Updated</p>
                    <p className="text-sm text-foreground/60 mt-1">Updated personal information and settings</p>
                    <p className="text-xs text-foreground/50 mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      2 hours ago
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-xl border border-orange-500/30">
                  <div className="w-3 h-3 bg-orange-600 rounded-full mt-2 flex-shrink-0 shadow-lg"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Security Enhanced</p>
                    <p className="text-sm text-foreground/60 mt-1">Enabled two-factor authentication for added security</p>
                    <p className="text-xs text-foreground/50 mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      1 day ago
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-pink-500/10 to-pink-600/10 rounded-xl border border-pink-500/30">
                  <div className="w-3 h-3 bg-pink-600 rounded-full mt-2 flex-shrink-0 shadow-lg"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Password Changed</p>
                    <p className="text-sm text-foreground/60 mt-1">Successfully updated account password</p>
                    <p className="text-xs text-foreground/50 mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      3 days ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}