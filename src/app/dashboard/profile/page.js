'use client'
import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Edit2, Save, X, Camera, Phone, MapPin, Briefcase, Clock, Activity, Settings, Lock, Bell, Globe, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({});
  const [activeTab, setActiveTab] = useState('profile');
  const {getUserDetails} = useAuthContext()

  useEffect(() => {
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl border border-slate-700/50 p-10 flex flex-col items-center gap-6 shadow-2xl">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin"></div>
            <RefreshCw className="absolute inset-0 m-auto text-emerald-400" size={28} />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-white text-xl mb-2">Loading Profile</h3>
            <p className="text-slate-400">Preparing your workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl border border-slate-700/50 p-10 text-center max-w-md shadow-2xl">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-red-400" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Data Loading Failed</h3>
          <p className="text-slate-400 mb-8">We encountered an issue while loading your profile information.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Enhanced Header */}
      <div className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-3">
                Account Settings
              </h1>
              <p className="text-slate-400 text-lg">Manage your professional profile and preferences</p>
            </div>
            
            <div className="flex items-center gap-4">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:from-emerald-400 hover:to-teal-400 transition-all duration-300 font-semibold shadow-lg shadow-emerald-500/25 transform hover:scale-105"
                >
                  <Edit2 size={20} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-4">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-400 hover:to-emerald-400 transition-all duration-300 font-semibold shadow-lg shadow-green-500/25"
                  >
                    <Save size={20} />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-3 px-8 py-4 bg-slate-700 text-slate-300 rounded-2xl hover:bg-slate-600 transition-all duration-300 font-semibold border border-slate-600"
                  >
                    <X size={20} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Navigation */}
          <div className="flex space-x-1 mt-10">
            {['profile', 'security', 'preferences', 'billing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-semibold text-sm capitalize transition-all duration-300 relative rounded-t-xl ${
                  activeTab === tab 
                    ? 'text-white bg-slate-800/80' 
                    : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                {tab.replace('-', ' ')}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-4 right-4 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* Enhanced Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Enhanced Profile Card */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl border border-slate-700/50 p-8 shadow-2xl">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-28 h-28 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-2xl shadow-purple-500/25">
                    {userData.name?.charAt(0) || 'U'}
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-400 transition-all duration-300 border-2 border-slate-800">
                      <Camera size={16} />
                    </button>
                  )}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-slate-800 shadow-lg"></div>
                </div>
                
                <h3 className="font-bold text-white text-xl mb-2">{userData.name}</h3>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold mb-4 border border-blue-500/30">
                  <Shield size={16} />
                  {userData.role}
                </div>
                
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">{userData.bio}</p>
                
                <div className="w-full bg-slate-700/50 rounded-2xl p-4 border border-slate-600/50">
                  <p className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wider">USER IDENTIFICATION</p>
                  <p className="text-xs font-mono text-slate-300 break-all bg-slate-800/50 rounded-lg p-3">{userData.userId}</p>
                </div>
              </div>
            </div>

            {/* Enhanced Status Card */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl border border-slate-700/50 p-8 shadow-2xl">
              <h4 className="font-bold text-white text-lg mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Activity size={20} className="text-blue-400" />
                </div>
                Account Status
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
                  <span className="text-sm font-semibold text-slate-300">Status</span>
                  <span className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold border border-green-500/30">
                    <CheckCircle size={14} />
                    ACTIVE
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                  <span className="text-sm font-semibold text-slate-300">Verification</span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold border border-blue-500/30">
                    VERIFIED
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                  <span className="text-sm font-semibold text-slate-300">Member Since</span>
                  <span className="text-xs font-semibold text-slate-400">{userData.joinDate}</span>
                </div>
              </div>
            </div>

            {/* Enhanced Quick Actions */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl border border-slate-700/50 p-8 shadow-2xl">
              <h4 className="font-bold text-white text-lg mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-600/50 rounded-xl flex items-center justify-center">
                  <Settings size={20} className="text-slate-400" />
                </div>
                Quick Actions
              </h4>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-4 p-4 text-left rounded-2xl hover:bg-slate-700/50 transition-all duration-300 border border-transparent hover:border-slate-600/50 group">
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
                    <Lock size={20} className="text-red-400" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white">Change Password</span>
                    <p className="text-xs text-slate-400">Update your security credentials</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-4 p-4 text-left rounded-2xl hover:bg-slate-700/50 transition-all duration-300 border border-transparent hover:border-slate-600/50 group">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                    <Bell size={20} className="text-yellow-400" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white">Notifications</span>
                    <p className="text-xs text-slate-400">Manage alert preferences</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-4 p-4 text-left rounded-2xl hover:bg-slate-700/50 transition-all duration-300 border border-transparent hover:border-slate-600/50 group">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <Globe size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white">Privacy Settings</span>
                    <p className="text-xs text-slate-400">Control your data visibility</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Main Content Area */}
          <div className="xl:col-span-3 space-y-8">
            
            {/* Enhanced Personal Information Card */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl border border-slate-700/50 p-10 shadow-2xl">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <User size={28} className="text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Personal Information</h2>
                  <p className="text-slate-400 text-lg">Manage your professional identity and contact details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Email Field */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-sm font-bold text-slate-300 uppercase tracking-wider">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Mail size={16} className="text-blue-400" />
                    </div>
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full px-5 py-4 bg-slate-800/50 border-2 border-slate-600/50 rounded-2xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="px-5 py-4 bg-slate-800/50 border-2 border-slate-600/50 rounded-2xl">
                      <p className="text-white font-semibold">{userData.email}</p>
                    </div>
                  )}
                </div>

                {/* Phone Field */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-sm font-bold text-slate-300 uppercase tracking-wider">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Phone size={16} className="text-green-400" />
                    </div>
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full px-5 py-4 bg-slate-800/50 border-2 border-slate-600/50 rounded-2xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="px-5 py-4 bg-slate-800/50 border-2 border-slate-600/50 rounded-2xl">
                      <p className="text-white font-semibold">{userData.phone}</p>
                    </div>
                  )}
                </div>

                {/* Location Field */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-sm font-bold text-slate-300 uppercase tracking-wider">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <MapPin size={16} className="text-orange-400" />
                    </div>
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      className="w-full px-5 py-4 bg-slate-800/50 border-2 border-slate-600/50 rounded-2xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                      placeholder="Enter your location"
                    />
                  ) : (
                    <div className="px-5 py-4 bg-slate-800/50 border-2 border-slate-600/50 rounded-2xl">
                      <p className="text-white font-semibold">{userData.location}</p>
                    </div>
                  )}
                </div>

                {/* Department Field */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-sm font-bold text-slate-300 uppercase tracking-wider">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Briefcase size={16} className="text-purple-400" />
                    </div>
                    Department
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.department}
                      onChange={(e) => handleChange('department', e.target.value)}
                      className="w-full px-5 py-4 bg-slate-800/50 border-2 border-slate-600/50 rounded-2xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                      placeholder="Enter your department"
                    />
                  ) : (
                    <div className="px-5 py-4 bg-slate-800/50 border-2 border-slate-600/50 rounded-2xl">
                      <p className="text-white font-semibold">{userData.department}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Activity Timeline */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl border border-slate-700/50 p-10 shadow-2xl">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Clock size={28} className="text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Recent Activity</h2>
                  <p className="text-slate-400 text-lg">Track your account updates and security events</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-6 p-6 bg-blue-500/10 rounded-3xl border border-blue-500/20 backdrop-blur-lg">
                  <div className="w-4 h-4 bg-blue-400 rounded-full mt-3 flex-shrink-0 shadow-lg shadow-blue-400/25"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-white text-lg">Profile Updated</p>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold border border-blue-500/30">
                        Completed
                      </span>
                    </div>
                    <p className="text-slate-300 mb-3">Updated personal information and professional settings</p>
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <Clock size={14} />
                      2 hours ago • System Update
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6 p-6 bg-orange-500/10 rounded-3xl border border-orange-500/20 backdrop-blur-lg">
                  <div className="w-4 h-4 bg-orange-400 rounded-full mt-3 flex-shrink-0 shadow-lg shadow-orange-400/25"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-white text-lg">Security Enhanced</p>
                      <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-bold border border-orange-500/30">
                        Security
                      </span>
                    </div>
                    <p className="text-slate-300 mb-3">Enabled two-factor authentication for enhanced account protection</p>
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <Clock size={14} />
                      1 day ago • Security
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-6 p-6 bg-pink-500/10 rounded-3xl border border-pink-500/20 backdrop-blur-lg">
                  <div className="w-4 h-4 bg-pink-400 rounded-full mt-3 flex-shrink-0 shadow-lg shadow-pink-400/25"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-white text-lg">Password Changed</p>
                      <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-xs font-bold border border-pink-500/30">
                        Security
                      </span>
                    </div>
                    <p className="text-slate-300 mb-3">Successfully updated account password and security credentials</p>
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <Clock size={14} />
                      3 days ago • Security
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