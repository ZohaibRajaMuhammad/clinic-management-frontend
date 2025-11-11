'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  ArrowUpDown,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  Shield,
  CheckCircle,
  XCircle,
  RefreshCw,
  Users,
  Activity,
  MoreVertical,
  Download,
  Plus,
  Eye,
  Calendar,
  MapPin
} from "lucide-react";
import { BASE_URL } from "@/services/config";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/dashboard/users`);
      setUsers(response.data.users);
      setError("");
    } catch (err) {
      setError("Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${BASE_URL}/dashboard/users/${userId}`);
        setUsers(users.filter((user) => user._id !== userId));
      } catch (err) {
        setError("Failed to delete user");
        console.error("Error deleting user:", err);
      }
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await axios.put(`${BASE_URL}/dashboard/users/${userId}`, {
        status: newStatus,
      });

      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (err) {
      setError("Failed to update user status");
      console.error("Error updating user:", err);
    }
  };

  const filteredAndSortedUsers = users
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "createdAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: {
        color: "bg-purple-100 text-purple-800 border border-purple-200",
        icon: Shield,
      },
      doctor: {
        color: "bg-blue-100 text-blue-800 border border-blue-200",
        icon: User,
      },
      staff: {
        color: "bg-amber-100 text-amber-800 border border-amber-200",
        icon: Users,
      },
      patient: {
        color: "bg-emerald-100 text-emerald-800 border border-emerald-200",
        icon: User,
      },
    };

    const config = roleConfig[role] || roleConfig.patient;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${config.color} text-xs font-medium`}
      >
        <IconComponent size={12} />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    return status === "active" ? (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-100 text-green-800 border border-green-200 text-xs font-medium">
        <CheckCircle size={12} />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 border border-gray-200 text-xs font-medium">
        <XCircle size={12} />
        Inactive
      </span>
    );
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-3 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <p className="text-base font-medium text-slate-700">Loading User Data</p>
            <p className="text-sm text-slate-500">Preparing your dashboard</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900">
              User Management
            </h1>
            <p className="text-slate-600 text-sm">
              Manage and monitor all system users in one place
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-white rounded-lg border border-slate-200 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "grid" 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  <div className={`rounded-sm ${viewMode === "grid" ? "bg-blue-600" : "bg-slate-400"}`}></div>
                  <div className={`rounded-sm ${viewMode === "grid" ? "bg-blue-600" : "bg-slate-400"}`}></div>
                  <div className={`rounded-sm ${viewMode === "grid" ? "bg-blue-600" : "bg-slate-400"}`}></div>
                  <div className={`rounded-sm ${viewMode === "grid" ? "bg-blue-600" : "bg-slate-400"}`}></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "list" 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <div className="w-4 h-4 flex flex-col gap-0.5">
                  <div className={`h-1 rounded ${viewMode === "list" ? "bg-blue-600" : "bg-slate-400"}`}></div>
                  <div className={`h-1 rounded ${viewMode === "list" ? "bg-blue-600" : "bg-slate-400"}`}></div>
                  <div className={`h-1 rounded ${viewMode === "list" ? "bg-blue-600" : "bg-slate-400"}`}></div>
                </div>
              </button>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-all duration-200 text-sm font-medium">
              <Download size={16} />
              <span>Export</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-sm">
              <Plus size={16} />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="text-red-500" size={16} />
              </div>
              <div>
                <p className="font-medium text-red-800 text-sm">{error}</p>
              </div>
            </div>
            <button
              onClick={fetchUsers}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors text-sm"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { 
              label: "Total Users", 
              value: users.length, 
              change: "+12%",
              icon: Users,
              color: "blue"
            },
            { 
              label: "Active Users", 
              value: users.filter((u) => u.status === "active").length,
              change: "+5%",
              icon: CheckCircle,
              color: "green"
            },
            { 
              label: "Inactive Users", 
              value: users.filter((u) => u.status === "inactive").length,
              change: "-2%",
              icon: XCircle,
              color: "slate"
            },
            { 
              label: "Admin Users", 
              value: users.filter((u) => u.role === "admin").length,
              change: "+0%",
              icon: Shield,
              color: "purple"
            }
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            const colorClasses = {
              blue: "bg-blue-500",
              green: "bg-green-500",
              slate: "bg-slate-500",
              purple: "bg-purple-500"
            };
            
            return (
              <div key={index} className="bg-white rounded-xl p-4 border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                    <p className={`text-xs font-medium ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${colorClasses[stat.color]} rounded-xl flex items-center justify-center`}>
                    <IconComponent className="text-white" size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-slate-900 placeholder-slate-500 text-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer transition-all duration-200 text-slate-900 text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="staff">Staff</option>
                  <option value="patient">Patient</option>
                </select>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-all duration-200 text-slate-900 text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Display */}
        {viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredAndSortedUsers.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl p-12 text-center border border-slate-200">
                <Users size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-semibold text-slate-500 mb-2">No users found</p>
                <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredAndSortedUsers.map((user) => (
                <div key={user._id} className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-200 overflow-hidden group">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={user.name}
                            className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            {getInitials(user.name)}
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {user.name}
                          </h3>
                          <p className="text-sm text-slate-500">{user.role}</p>
                        </div>
                      </div>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail size={14} className="text-slate-400" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone size={14} className="text-slate-400" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {getRoleBadge(user.role)}
                        <button
                          onClick={() => handleStatusToggle(user._id, user.status)}
                          className="transition-transform hover:scale-105 active:scale-95"
                        >
                          {getStatusBadge(user.status)}
                        </button>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200">
                          <Eye size={14} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-all duration-200">
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-200"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {[
                      { key: "name", label: "User", sortable: true },
                      { key: "email", label: "Contact", sortable: true },
                      { key: "role", label: "Role", sortable: true },
                      { key: "status", label: "Status", sortable: true },
                      { key: "actions", label: "", sortable: false }
                    ].map((column) => (
                      <th
                        key={column.key}
                        onClick={() => column.sortable && handleSort(column.key)}
                        className={`px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider ${
                          column.sortable ? "cursor-pointer hover:bg-slate-200 transition-colors" : ""
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          {column.label}
                          {column.sortable && <ArrowUpDown size={12} className="text-slate-500" />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredAndSortedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <Users size={48} className="mb-3 opacity-30" />
                          <p className="text-base font-semibold text-slate-500 mb-1">No users found</p>
                          <p className="text-slate-400 text-sm">Try adjusting your search criteria</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {user.profileImage ? (
                              <img
                                src={user.profileImage}
                                alt={user.name}
                                className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                                {getInitials(user.name)}
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                                {user.name}
                              </div>
                              {user.phone && (
                                <div className="text-sm text-slate-500 flex items-center gap-1">
                                  <Phone size={12} />
                                  {user.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-slate-900 flex items-center gap-2">
                            <Mail size={14} className="text-slate-400" />
                            {user.email}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleStatusToggle(user._id, user.status)}
                            className="transition-transform hover:scale-105 active:scale-95"
                          >
                            {getStatusBadge(user.status)}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200">
                              <Eye size={14} />
                            </button>
                            <button className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-all duration-200">
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-200"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer */}
            {filteredAndSortedUsers.length > 0 && (
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-slate-600">
                  <div className="mb-2 sm:mb-0">
                    Showing <span className="font-semibold">{filteredAndSortedUsers.length}</span> of{" "}
                    <span className="font-semibold">{users.length}</span> users
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors text-sm">
                      Previous
                    </button>
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 text-sm">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;