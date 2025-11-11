'use client'
import React, { useState } from 'react';
import { Heart, Award, Shield, Stethoscope, Brain, Eye, Activity, Baby, Menu, X, Calendar, Phone, Mail, MapPin, Clock, ChevronRight, Star } from 'lucide-react';

export default function HealthCareLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [token, setToken] = useState(false); // Mock token state

  const doctors = [
    {
      name: "Dr. Michael Chen",
      specialty: "Cardiologist",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop",
      rating: 5.0,
      reviews: 248,
      description: "15+ years of experience in cardiovascular medicine. Board-certified with expertise in preventive cardiology."
    },
    {
      name: "Dr. Sarah Williams",
      specialty: "Pediatrician",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop",
      rating: 5.0,
      reviews: 312,
      description: "Passionate about child health and development. Specialized in preventive care and childhood wellness."
    },
    {
      name: "Dr. Robert Martinez",
      specialty: "Orthopedic Surgeon",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
      rating: 5.0,
      reviews: 195,
      description: "Expert in sports medicine and joint replacement. Committed to helping patients regain mobility."
    }
  ];

  const services = [
    {
      icon: Heart,
      title: "Cardiology",
      description: "Advanced heart care with cutting-edge diagnostic technology and personalized treatment plans",
      color: "from-rose-500 to-red-600"
    },
    {
      icon: Stethoscope,
      title: "General Medicine",
      description: "Comprehensive primary care services for patients of all ages with preventive focus",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Baby,
      title: "Pediatrics",
      description: "Specialized care ensuring the healthy development of infants, children, and adolescents",
      color: "from-teal-500 to-cyan-600"
    },
    {
      icon: Brain,
      title: "Neurology",
      description: "Expert diagnosis and treatment of complex neurological conditions and disorders",
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: Eye,
      title: "Ophthalmology",
      description: "Complete eye care solutions from routine exams to advanced surgical procedures",
      color: "from-sky-500 to-blue-600"
    },
    {
      icon: Activity,
      title: "Orthopedics",
      description: "Comprehensive treatment for musculoskeletal conditions using latest techniques",
      color: "from-indigo-500 to-purple-600"
    }
  ];

  const stats = [
    { number: "15+", label: "Years Experience" },
    { number: "50K+", label: "Happy Patients" },
    { number: "100+", label: "Expert Doctors" },
    { number: "24/7", label: "Emergency Care" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-2 rounded-xl">
                <Heart className="h-7 w-7 text-white" fill="white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900">HealthCare</span>
                <p className="text-xs text-gray-500 -mt-1">Medical Center</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition font-medium">Home</a>
              <a href="#services" className="text-gray-700 hover:text-blue-600 transition font-medium">Services</a>
              <a href="#team" className="text-gray-700 hover:text-blue-600 transition font-medium">Doctors</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition font-medium">About</a>
              <div className="flex items-center space-x-3">
                {token ? (
                  <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition font-medium">
                    Dashboard
                  </button>
                ) : (
                  <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition font-medium">
                    Sign In
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-3">
                <a href="#home" className="text-gray-700 hover:text-blue-600 transition py-2 font-medium">Home</a>
                <a href="#services" className="text-gray-700 hover:text-blue-600 transition py-2 font-medium">Services</a>
                <a href="#team" className="text-gray-700 hover:text-blue-600 transition py-2 font-medium">Doctors</a>
                <a href="#about" className="text-gray-700 hover:text-blue-600 transition py-2 font-medium">About</a>
                {token ? (
                  <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition font-medium">
                    Dashboard
                  </button>
                ) : (
                  <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition font-medium">
                    Sign In
                  </button>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 left-20 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6 font-medium text-sm">
                <Shield className="h-4 w-4" />
                <span>Trusted Healthcare Since 2009</span>
              </div>
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                Your Health,
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                  Our Priority
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Experience world-class healthcare with compassionate professionals dedicated to your well-being. We combine advanced technology with personalized care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition flex items-center justify-center space-x-2 group">
                  <span>Book Appointment</span>
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition" />
                </button>
                <button className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition border-2 border-gray-200 flex items-center justify-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Emergency: (555) 123-4567</span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-6 mt-12 pt-12 border-t border-gray-200">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-3xl transform rotate-6"></div>
                <img 
                  src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=1000&fit=crop"
                  alt="Healthcare Professional"
                  className="relative rounded-3xl shadow-2xl object-cover w-full h-[600px]"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-3 rounded-xl">
                      <Clock className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">24/7 Available</div>
                      <div className="text-sm text-gray-600">Emergency Services</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4 font-medium text-sm">
              <Award className="h-4 w-4" />
              <span>Why Choose Us</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Excellence in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Healthcare</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We deliver personalized medical care with state-of-the-art facilities and compassionate professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: "Patient-Centered", desc: "Your comfort and health are our top priorities", gradient: "from-rose-500 to-red-600" },
              { icon: Award, title: "15+ Years Experience", desc: "Trusted by thousands across the region", gradient: "from-blue-500 to-cyan-600" },
              { icon: Shield, title: "Expert Medical Team", desc: "Board-certified physicians and specialists", gradient: "from-cyan-500 to-teal-600" },
              { icon: Stethoscope, title: "Advanced Technology", desc: "Latest medical equipment and facilities", gradient: "from-indigo-500 to-purple-600" }
            ].map((feature, index) => (
              <div key={index} className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl transition border border-gray-100 hover:border-transparent">
                <div className={`bg-gradient-to-br ${feature.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition shadow-lg`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4 font-medium text-sm">
              <Stethoscope className="h-4 w-4" />
              <span>Our Specialties</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Comprehensive <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Medical Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Full spectrum of healthcare services tailored to meet your unique needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 hover:shadow-2xl transition border border-gray-100">
                <div className={`bg-gradient-to-br ${service.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition shadow-lg`}>
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <a href="#" className="inline-flex items-center text-blue-600 font-semibold group-hover:gap-2 transition">
                  <span>Learn More</span>
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4 font-medium text-sm">
              <Award className="h-4 w-4" />
              <span>Medical Experts</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Specialists</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Board-certified physicians committed to delivering exceptional care
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor, index) => (
              <div key={index} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition border border-gray-100">
                <div className="relative overflow-hidden">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name}
                    className="w-full h-80 object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                  <div className="absolute top-4 right-4 bg-white rounded-xl px-3 py-2 shadow-lg">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-gray-900">{doctor.rating}</span>
                      <span className="text-sm text-gray-600">({doctor.reviews})</span>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                  <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-4">{doctor.specialty}</p>
                  <p className="text-gray-600 mb-6">{doctor.description}</p>
                  <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition flex items-center justify-center space-x-2 font-medium group">
                    <Calendar className="h-5 w-5" />
                    <span>Book Appointment</span>
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Schedule your appointment today and experience healthcare the way it should be
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition flex items-center justify-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Schedule Appointment</span>
            </button>
            <button className="bg-transparent text-white px-8 py-4 rounded-xl font-semibold border-2 border-white hover:bg-white hover:text-blue-600 transition flex items-center justify-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Call: (555) 123-4567</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-2 rounded-xl">
                  <Heart className="h-7 w-7 text-white" fill="white" />
                </div>
                <div>
                  <span className="text-2xl font-bold">HealthCare</span>
                  <p className="text-sm text-gray-400 -mt-1">Medical Center</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Delivering exceptional healthcare services with compassion, expertise, and cutting-edge technology since 2009.
              </p>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
                  <a key={social} href="#" className="bg-gray-800 p-3 rounded-lg hover:bg-blue-600 transition">
                    <div className="w-5 h-5"></div>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {['Home', 'Services', 'Doctors', 'About Us', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition flex items-center space-x-2">
                      <ChevronRight className="h-4 w-4" />
                      <span>{link}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3 text-gray-400">
                  <MapPin className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                  <span>123 Medical Center Dr.<br/>City, State 12345</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-400">
                  <Phone className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <span>(555) 123-4567</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-400">
                  <Mail className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <span>info@healthcare.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HealthCare Medical Center. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}