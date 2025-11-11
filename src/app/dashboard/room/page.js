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
  RefreshCw
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

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber.toString().includes(searchTerm) ||
                         (room.RoomName && room.RoomName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getRoomFeatures = (roomNumber) => {
    const features = [
      { icon: Wifi, name: 'WiFi' },
      { icon: Tv, name: 'TV' },
      { icon: Snowflake, name: 'AC' },
      { icon: Bath, name: 'Private Bath' }
    ];
    
    // VIP rooms get extra features
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
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      textColor: 'text-white'
    };
    if (roomNumber <= 20) return { 
      type: 'Deluxe', 
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      textColor: 'text-white'
    };
    return { 
      type: 'Standard', 
      color: 'bg-primary/20 text-primary border border-primary/30',
      textColor: 'text-primary'
    };
  };

  const getStatusColors = (status) => {
    return status === 'available' 
      ? {
          bg: 'bg-green-500/20',
          text: 'text-green-600 dark:text-green-400',
          border: 'border-green-400/30',
          hover: 'hover:bg-green-500/30'
        }
      : {
          bg: 'bg-red-500/20',
          text: 'text-red-600 dark:text-red-400',
          border: 'border-red-400/30',
          hover: 'hover:bg-red-500/30'
        };
  };

  if (loading) {
    return (
     <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <RefreshCw className="animate-spin" size={24} />
          <span className="text-lg">Loading rooms...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Building className="text-primary" size={32} />
            <h1 className="text-4xl font-bold text-foreground">Room Management</h1>
          </div>
          <p className="text-foreground/70 text-lg">Manage and monitor all rooms in the facility</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-background border border-foreground/10 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/70 text-sm font-medium">Total Rooms</p>
                <p className="text-3xl font-bold text-foreground mt-2">{rooms.length}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <Building className="text-primary" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-background border border-foreground/10 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/70 text-sm font-medium">Available</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                  {rooms.filter(room => room.status === 'available').length}
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-xl">
                <DoorOpen className="text-green-600 dark:text-green-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-background border border-foreground/10 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/70 text-sm font-medium">Occupied</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
                  {rooms.filter(room => room.status === 'occupied').length}
                </p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-xl">
                <DoorClosed className="text-red-600 dark:text-red-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-background border border-foreground/10 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/70 text-sm font-medium">VIP Suites</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                  {rooms.filter(room => room.roomNumber <= 10).length}
                </p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <Crown className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-background border border-foreground/10 rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" size={20} />
              <input
                type="text"
                placeholder="Search by room number or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-foreground/20 rounded-xl text-foreground placeholder-foreground/50 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              />
            </div>

            {/* Filters and Create Button */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" size={16} />
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 bg-background border border-foreground/20 rounded-xl text-foreground focus:ring-2 focus:ring-primary focus:border-primary appearance-none cursor-pointer transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                </select>
              </div>

              {/* Create Room Button - Only for Admin */}
              {user?.role === 'admin' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-primary/25"
                >
                  <Plus size={20} />
                  Create Room
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRooms.length === 0 ? (
            <div className="col-span-full bg-background border border-foreground/10 rounded-2xl p-12 text-center shadow-sm">
              <DoorOpen className="mx-auto text-foreground/50 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-foreground mb-2">No rooms found</h3>
              <p className="text-foreground/70">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredRooms.map((room) => {
              const roomType = getRoomType(room.roomNumber);
              const features = getRoomFeatures(room.roomNumber);
              const statusColors = getStatusColors(room.status);
              
              return (
                <div 
                  key={room._id} 
                  className={`bg-background border rounded-2xl p-6 shadow-sm transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg ${
                    room.status === 'available' 
                      ? 'border-green-400/30 hover:border-green-400/50' 
                      : 'border-red-400/30 hover:border-red-400/50'
                  }`}
                >
                  {/* Room Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${roomType.color} ${roomType.textColor}`}>
                          {roomType.type}
                        </span>
                        {room.roomNumber <= 10 && (
                          <Crown size={16} className="text-yellow-500" />
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">
                        Room {room.roomNumber}
                      </h3>
                      {room.RoomName && (
                        <p className="text-foreground/70 text-sm mt-1">{room.RoomName}</p>
                      )}
                    </div>
                    
                    {/* Status Badge */}
                    <button
                      onClick={() => handleStatusToggle(room._id, room.status)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border transition-all ${statusColors.bg} ${statusColors.text} ${statusColors.border} ${statusColors.hover}`}
                    >
                      {room.status === 'available' ? (
                        <>
                          <CheckCircle size={14} />
                          Available
                        </>
                      ) : (
                        <>
                          <XCircle size={14} />
                          Occupied
                        </>
                      )}
                    </button>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <div className="grid grid-cols-4 gap-2">
                      {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center">
                          <div className="p-2 bg-foreground/5 rounded-lg mb-1">
                            <feature.icon size={16} className="text-foreground/70" />
                          </div>
                          <span className="text-xs text-foreground/70">{feature.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-foreground/10">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(room)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-500/20 border border-blue-400/30 transition-all"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      
                      {/* Delete Button - Only for Admin */}
                      {user?.role === 'admin' && (
                        <button 
                          onClick={() => handleDeleteRoom(room._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-500/20 border border-red-400/30 transition-all"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      )}
                    </div>
                    
                    <span className="text-xs text-foreground/50">
                      Updated {new Date(room.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-2xl p-6 w-full max-w-md border border-foreground/20 shadow-xl">
            <h3 className="text-xl font-bold text-foreground mb-4">Create New Room</h3>
            <form onSubmit={handleCreateRoom}>
              <div className="space-y-4">
                <div>
                  <label className="block text-foreground/70 text-sm font-medium mb-2">
                    Room Number
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-foreground/20 rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-foreground/70 text-sm font-medium mb-2">
                    Room Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.RoomName}
                    onChange={(e) => setFormData({...formData, RoomName: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-foreground/20 rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="e.g., Presidential Suite"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-all"
                >
                  Create Room
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-foreground/10 text-foreground py-2 rounded-lg hover:bg-foreground/20 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {showEditModal && selectedRoom && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-2xl p-6 w-full max-w-md border border-foreground/20 shadow-xl">
            <h3 className="text-xl font-bold text-foreground mb-4">Edit Room {selectedRoom.roomNumber}</h3>
            <form onSubmit={handleUpdateRoom}>
              <div className="space-y-4">
                <div>
                  <label className="block text-foreground/70 text-sm font-medium mb-2">
                    Room Number
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-foreground/20 rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-foreground/70 text-sm font-medium mb-2">
                    Room Name
                  </label>
                  <input
                    type="text"
                    value={formData.RoomName}
                    onChange={(e) => setFormData({...formData, RoomName: e.target.value})}
                    className="w-full px-3 py-2 bg-background border border-foreground/20 rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-all"
                >
                  Update Room
                </button>
                <button
                  type="button"
                  onClick={() => {setShowEditModal(false); setFormData({
    roomNumber: '',
    RoomName: ''
  })} }
                  className="flex-1 bg-foreground/10 text-foreground py-2 rounded-lg hover:bg-foreground/20 transition-all"
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

export default RoomsPage;