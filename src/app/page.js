'use client'
import React, { useState } from 'react';
import { Heart, Award, Shield, Stethoscope, Brain, Eye, Activity, Baby, Menu, X, Calendar } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function HealthCareLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {token} = useAuthContext();
  let router = useRouter();

  const doctors = [
    {
      name: "Dr. Michael Chen",
      specialty: "Cardiologist",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
      rating: 5.0,
      description: "15+ years of experience in cardiovascular medicine. Board-certified with expertise in preventive cardiology."
    },
    {
      name: "Dr. Sarah Williams",
      specialty: "Pediatrician",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
      rating: 5.0,
      description: "Passionate about child health and development. Specialized in preventive care and childhood wellness."
    },
    {
      name: "Dr. Robert Martinez",
      specialty: "Orthopedic Surgeon",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
      rating: 5.0,
      description: "Expert in sports medicine and joint replacement. Committed to helping patients regain mobility."
    }
  ];

  const services = [
    {
      icon: Heart,
      title: "Cardiology",
      description: "Comprehensive heart care and cardiovascular disease prevention",
      color: "bg-red-500"
    },
    {
      icon: Stethoscope,
      title: "General Medicine",
      description: "Complete health checkups and preventive care for all ages",
      color: "bg-blue-500"
    },
    {
      icon: Baby,
      title: "Pediatrics",
      description: "Specialized care for infants, children, and adolescents",
      color: "bg-teal-500"
    },
    {
      icon: Brain,
      title: "Neurology",
      description: "Expert diagnosis and treatment of neurological conditions",
      color: "bg-purple-500"
    },
    {
      icon: Eye,
      title: "Ophthalmology",
      description: "Advanced eye care and vision correction services",
      color: "bg-blue-600"
    },
    {
      icon: Activity,
      title: "Orthopedics",
      description: "Treatment for bone, joint, and muscle conditions",
      color: "bg-indigo-600"
    }
  ];

  const features = [
    {
      icon: Heart,
      title: "Patient-Centered Care",
      description: "Your health and comfort are our top priorities",
      color: "bg-cyan-500"
    },
    {
      icon: Award,
      title: "15+ Years Experience",
      description: "Trusted by thousands of families in our community",
      color: "bg-blue-600"
    },
    {
      icon: Shield,
      title: "Expert Team",
      description: "Board-certified physicians and caring staff",
      color: "bg-cyan-600"
    },
    {
      icon: Stethoscope,
      title: "Advanced Technology",
      description: "State-of-the-art medical equipment and facilities",
      color: "bg-blue-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl md:text-2xl font-bold text-gray-900">
                Health<span className="text-blue-600">Care</span>
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition">Home</a>
              <a href="#services" className="text-gray-700 hover:text-blue-600 transition">Services</a>
              <a href="#team" className="text-gray-700 hover:text-blue-600 transition">Our Team</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition">About</a>
             {token ? (
                  <button onClick={() => router.push('/dashboard')} className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                  Dashboard
                </button>
                ): (
                   <button onClick={() => router.push('/login')} className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                 Login
                </button>
                )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <a href="#home" className="text-gray-700 hover:text-blue-600 transition">Home</a>
                <a href="#services" className="text-gray-700 hover:text-blue-600 transition">Services</a>
                <a href="#team" className="text-gray-700 hover:text-blue-600 transition">Our Team</a>
                <a href="#about" className="text-gray-700 hover:text-blue-600 transition">About</a>

                {token ? (
                  <button onClick={() => router.push('/dashboard')} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                  Dashboard
                </button>
                ): (
                   <button onClick={() => router.push('/login')} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                 Login
                </button>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-r from-blue-600 to-blue-400 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 rounded-full bg-white opacity-5 -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 rounded-full bg-white opacity-5 -ml-24 -mb-24"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-2 mb-4 md:mb-6">
              <Heart className="h-6 w-6 md:h-8 md:w-8" />
              <Shield className="h-5 w-5 md:h-6 md:w-6 opacity-70" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6">
              Caring for You,{' '}
              <span className="text-green-400">Every Step of the Way</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 text-blue-50">
              Compassionate healthcare delivered by experienced professionals in a modern, welcoming environment.
            </p>
            <button className="bg-white text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center space-x-2 text-base md:text-lg">
              <span>Book Appointment</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-12 md:h-20">
            <path fill="#F9FAFB" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
              Welcome to <span className="text-blue-600">HealthCare Clinic</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              We are dedicated to providing comprehensive, compassionate care to patients of all ages. Our mission is to improve the health and well-being of our community through personalized medical services.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 md:p-8 shadow-sm hover:shadow-lg transition">
                <div className={`${feature.color} w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-4 md:mb-6`}>
                  <feature.icon className="h-7 w-7 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">{feature.title}</h3>
                <p className="text-sm md:text-base text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
              Our <span className="text-blue-600">Medical Services</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive healthcare solutions tailored to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 md:p-8 hover:shadow-lg transition group">
                <div className={`${service.color} w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition`}>
                  <service.icon className="h-7 w-7 md:h-8 md:w-8 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">{service.title}</h3>
                <p className="text-sm md:text-base text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">
              Meet Our <span className="text-blue-600">Expert Team</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Our board-certified physicians are dedicated to providing you with the highest quality care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {doctors.map((doctor, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition group">
                <div className="relative">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name}
                    className="w-full h-64 sm:h-72 md:h-80 object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm md:text-base font-semibold">{doctor.rating}</span>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">{doctor.name}</h3>
                  <p className="text-base md:text-lg text-blue-600 font-semibold mb-3 md:mb-4">{doctor.specialty}</p>
                  <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">{doctor.description}</p>
                  <button className="w-full border border-gray-300 text-gray-700 px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center space-x-2">
                    <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="text-sm md:text-base">Schedule Appointment</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Heart className="h-8 w-8 text-blue-500" />
                <span className="ml-2 text-xl md:text-2xl font-bold">
                  Health<span className="text-blue-500">Care</span>
                </span>
              </div>
              <p className="text-sm md:text-base text-gray-400 mb-4">
                Providing comprehensive, compassionate care to patients of all ages since 2009.
              </p>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm md:text-base text-gray-400">
                <li><a href="#home" className="hover:text-white transition">Home</a></li>
                <li><a href="#services" className="hover:text-white transition">Services</a></li>
                <li><a href="#team" className="hover:text-white transition">Our Team</a></li>
                <li><a href="#about" className="hover:text-white transition">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm md:text-base text-gray-400">
                <li>123 Medical Center Dr.</li>
                <li>City, State 12345</li>
                <li>Phone: (555) 123-4567</li>
                <li>Email: info@healthcare.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm md:text-base text-gray-400">
            <p>&copy; 2024 HealthCare Clinic. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}