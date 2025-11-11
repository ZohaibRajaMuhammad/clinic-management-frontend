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

  // Fetch users on component mount
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

  // Filter and sort users
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
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: Shield,
      },
      doctor: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: User,
      },
      staff: {
        color: "bg-orange-100 text-orange-800 border-orange-200",
        icon: Users,
      },
      patient: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: User,
      },
    };

    const config = roleConfig[role];
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border ${config.color} text-sm font-medium`}
      >
        <IconComponent size={14} />
        {role}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    return status === "active" ? (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 border border-green-200 text-sm font-medium">
        <CheckCircle size={14} />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-800 border border-red-200 text-sm font-medium">
        <XCircle size={14} />
        Inactive
      </span>
    );
  };

  const getGenderBadge = (gender) => {
    if (!gender) return "N/A";

    const genderConfig = {
      male: "bg-blue-50 text-blue-700 border-blue-200",
      female: "bg-pink-50 text-pink-700 border-pink-200",
      other: "bg-gray-50 text-gray-700 border-gray-200",
    };

    return (
      <span
        className={`px-2 py-1 rounded-md border text-xs capitalize ${
          genderConfig[gender] || genderConfig.other
        }`}
      >
        {gender}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <RefreshCw className="animate-spin" size={24} />
          <span className="text-lg">Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">
            Manage all system users and their permissions
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={fetchUsers}
              className="flex items-center gap-2 px-3 py-1 text-red-700 border border-red-300 rounded-md hover:bg-red-100 transition-colors"
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {users.length}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Users
                </p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {users.filter((u) => u.status === "active").length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Inactive Users
                </p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {users.filter((u) => u.status === "inactive").length}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <XCircle className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {users.filter((u) => u.role === "admin").length}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Shield className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative">
                <Filter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white cursor-pointer transition-colors"
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
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-colors"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    onClick={() => handleSort("name")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      User
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("email")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors hidden lg:table-cell"
                  >
                    <div className="flex items-center gap-2">
                      Email
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("role")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Role
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Gender
                  </th>
                  <th
                    onClick={() => handleSort("status")}
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Status
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Users size={48} className="mb-4 opacity-50" />
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedUsers.map((user) => (
                    <tr
                      key={user._id}
                      className={`hover:bg-gray-50 transition-colors ${
                        user.status === "inactive" ? "opacity-60" : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {user.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 lg:hidden">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-gray-400" />
                          {user.phone || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        {getGenderBadge(user.gender)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            handleStatusToggle(user._id, user.status)
                          }
                          className="transition-transform hover:scale-105"
                        >
                          {getStatusBadge(user.status)}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                            <Edit size={16} />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <Trash2 size={16} />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
