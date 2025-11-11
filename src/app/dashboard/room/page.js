'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus,
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  DoorOpen,
  DoorClosed,
  Users,
  Building,
  CheckCircle,
  XCircle,
  MoreVertical,
  Star,
  Crown,
  Wifi,
  Tv,
  Coffee,
  Car,
  Bath,
  Snowflake,
  Dumbbell,
  Utensils,
  RefreshCw,
  ChevronDown,
  LayoutGrid,
  List
} from 'lucide-react';
import { BASE_URL } from '@/services/config';
import { useAuthContext } from '@/context/AuthContext';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('roomNumber');
  const [formData, setFormData] = useState({
    roomNumber: '',
    RoomName: ''
  });
  const {getUserDetails} = useAuthContext()

  // Fetch user details and rooms
  useEffect(() => {
    fetchUserDetails();
    fetchRooms();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const userDetails = await getUserDetails();
      setUser(userDetails);
    } catch (err) {
      console.error('Error fetching user details:', err);
    }
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/room/all`);
      setRooms(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch rooms');
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/room/create`, {
        roomNumber: parseInt(formData.roomNumber),
        RoomName: formData.RoomName
      });
      setRooms([...rooms, response.data.room]);
      setShowCreateModal(false);
      setFormData({ roomNumber: '', RoomName: '' });
    } catch (err) {
      setError('Failed to create room');
      console.error('Error creating room:', err);
    }
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${BASE_URL}/room/update/${selectedRoom._id}`, {
        roomNumber: parseInt(formData.roomNumber),
        RoomName: formData.RoomName
      });
      setRooms(rooms.map(room => 
        room._id === selectedRoom._id ? response.data : room
      ));
      setShowEditModal(false);
      setSelectedRoom(null);
      setFormData({ roomNumber: '', RoomName: '' });
    } catch (err) {
      setError('Failed to update room');
      console.error('Error updating room:', err);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await axios.delete(`${BASE_URL}/room/delete/${roomId}`);
        setRooms(rooms.filter(room => room._id !== roomId));
      } catch (err) {
        setError('Failed to delete room');
        console.error('Error deleting room:', err);
      }
    }
  };

  const handleStatusToggle = async (roomId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'available' ? 'occupied' : 'available';
      const response = await axios.put(`/api/rooms/update/${roomId}`, { 
        status: newStatus 
      });
      setRooms(rooms.map(room => 
        room._id === roomId ? response.data : room
      ));
    } catch (err) {
      setError('Failed to update room status');
      console.error('Error updating room:', err);
    }
  };

  const openEditModal = (room) => {
    setSelectedRoom(room);
    setFormData({
      roomNumber: room.roomNumber.toString(),
      RoomName: room.RoomName || ''
    });
    setShowEditModal(true);
  };

  // Filter and sort rooms
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber.toString().includes(searchTerm) ||
                         (room.RoomName && room.RoomName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'roomNumber') return a.roomNumber - b.roomNumber;
    if (sortBy === 'status') return a.status.localeCompare(b.status);
    return 0;
  });

  const getRoomFeatures = (roomNumber) => {
    const features = [
      { icon: Wifi, name: 'WiFi' },
      { icon: Tv, name: 'TV' },
      { icon: Snowflake, name: 'AC' },
      { icon: Bath, name: 'Private Bath' }
    ];
    
    if (roomNumber <= 10) {
      features.push(
        { icon: Coffee, name: 'Coffee Maker' },
        { icon: Dumbbell, name: 'Gym Access' },
        { icon: Utensils, name: 'Breakfast' }
      );
    }
    
    return features.slice(0, 4);
  };

  const getRoomType = (roomNumber) => {
    if (roomNumber <= 10) return { 
      type: 'VIP Suite', 
      color: 'from-purple-600 to-pink-600',
      bgColor: 'bg-gradient-to-r from-purple-600 to-pink-600',
      textColor: 'text-white'
    };
    if (roomNumber <= 20) return { 
      type: 'Deluxe', 
      color: 'from-blue-600 to-cyan-600',
      bgColor: 'bg-gradient-to-r from-blue-600 to-cyan-600',
      textColor: 'text-white'
    };
    return { 
      type: 'Standard', 
      color: 'from-gray-600 to-gray-700',
      bgColor: 'bg-gradient-to-r from-gray-600 to-gray-700',
      textColor: 'text-white'
    };
  };

  const getStatusColors = (status) => {
    return status === 'available' 
      ? {
          bg: 'bg-emerald-50 dark:bg-emerald-950/20',
          text: 'text-emerald-700 dark:text-emerald-300',
          border: 'border-emerald-200 dark:border-emerald-800',
          icon: 'text-emerald-500'
        }
      : {
          bg: 'bg-rose-50 dark:bg-rose-950/20',
          text: 'text-rose-700 dark:text-rose-300',
          border: 'border-rose-200 dark:border-rose-800',
          icon: 'text-rose-500'
        };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <RefreshCw className="animate-spin" size={24} />
          <span className="text-lg font-medium">Loading rooms...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Room Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and monitor all rooms in the facility
              </p>
            </div>
            {user?.role === 'admin' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                Add Room
              </button>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Rooms</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{rooms.length}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Building className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {rooms.filter(room => room.status === 'available').length}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                <DoorOpen className="text-emerald-600 dark:text-emerald-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Occupied</p>
                <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                  {rooms.filter(room => room.status === 'occupied').length}
                </p>
              </div>
              <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-xl">
                <DoorClosed className="text-rose-600 dark:text-rose-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">VIP Suites</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                  {rooms.filter(room => room.roomNumber <= 10).length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Crown className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer transition-all"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                  </select>
                </div>

                <div className="relative">
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-4 pr-8 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer transition-all"
                  >
                    <option value="roomNumber">Sort by Number</option>
                    <option value="status">Sort by Status</option>
                  </select>
                </div>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-gray-600 shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-gray-600 shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Rooms Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRooms.length === 0 ? (
              <div className="col-span-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-12 text-center shadow-sm">
                <DoorOpen className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No rooms found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredRooms.map((room) => {
                const roomType = getRoomType(room.roomNumber);
                const features = getRoomFeatures(room.roomNumber);
                const statusColors = getStatusColors(room.status);
                
                return (
                  <div 
                    key={room._id} 
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    {/* Room Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${roomType.bgColor} flex items-center justify-center text-white font-bold text-sm`}>
                          {room.roomNumber}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Room {room.roomNumber}
                          </h3>
                          {room.RoomName && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm">{room.RoomName}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {room.roomNumber <= 10 && (
                          <Crown size={18} className="text-yellow-500" />
                        )}
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}>
                          {room.status === 'available' ? 'Available' : 'Occupied'}
                        </div>
                      </div>
                    </div>

                    {/* Room Type */}
                    <div className="mb-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${roomType.color} text-white`}>
                        {roomType.type}
                      </span>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <feature.icon size={14} className="text-gray-600 dark:text-gray-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">{feature.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(room)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        
                        {user?.role === 'admin' && (
                          <button 
                            onClick={() => handleDeleteRoom(room._id)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleStatusToggle(room._id, room.status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          room.status === 'available'
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                            : 'bg-rose-500 hover:bg-rose-600 text-white'
                        }`}
                      >
                        {room.status === 'available' ? 'Mark Occupied' : 'Mark Available'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* List View */
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Room</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Features</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredRooms.map((room) => {
                    const roomType = getRoomType(room.roomNumber);
                    const features = getRoomFeatures(room.roomNumber);
                    const statusColors = getStatusColors(room.status);
                    
                    return (
                      <tr key={room._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg ${roomType.bgColor} flex items-center justify-center text-white font-bold text-sm`}>
                              {room.roomNumber}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                Room {room.roomNumber}
                              </div>
                              {room.RoomName && (
                                <div className="text-sm text-gray-500 dark:text-gray-400">{room.RoomName}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${roomType.color} text-white`}>
                            {roomType.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}>
                            {room.status === 'available' ? (
                              <>
                                <CheckCircle size={14} className="mr-1" />
                                Available
                              </>
                            ) : (
                              <>
                                <XCircle size={14} className="mr-1" />
                                Occupied
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            {features.slice(0, 3).map((feature, index) => (
                              <feature.icon key={index} size={16} className="text-gray-400" title={feature.name} />
                            ))}
                            {features.length > 3 && (
                              <span className="text-xs text-gray-500">+{features.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(room)}
                              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                              title="Edit room"
                            >
                              <Edit size={16} />
                            </button>
                            
                            {user?.role === 'admin' && (
                              <button 
                                onClick={() => handleDeleteRoom(room._id)}
                                className="p-2 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                                title="Delete room"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleStatusToggle(room._id, room.status)}
                              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                                room.status === 'available'
                                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                  : 'bg-rose-500 hover:bg-rose-600 text-white'
                              }`}
                            >
                              {room.status === 'available' ? 'Occupy' : 'Vacate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create New Room</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateRoom}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Room Number
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                    className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter room number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Room Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.RoomName}
                    onChange={(e) => setFormData({...formData, RoomName: e.target.value})}
                    className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="e.g., Presidential Suite"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {showEditModal && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Edit Room {selectedRoom.roomNumber}
              </h3>
              <button
                onClick={() => {setShowEditModal(false); setFormData({ roomNumber: '', RoomName: '' })}}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateRoom}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Room Number
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                    className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Room Name
                  </label>
                  <input
                    type="text"
                    value={formData.RoomName}
                    onChange={(e) => setFormData({...formData, RoomName: e.target.value})}
                    className="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => {setShowEditModal(false); setFormData({ roomNumber: '', RoomName: '' })}}
                  className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all"
                >
                  Update Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsPage;