import Image from "next/image";

function Layout({ children }) {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col md:flex-row justify-center items-center p-4">
      {/* Main Container */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[90vh]">
        
        {/* Left Side - Brand/Image Section */}
        <div className="hidden md:flex relative w-full md:w-2/5 bg-gradient-to-br from-blue-600 to-indigo-700 flex-col justify-between p-12">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-600 rounded-lg"></div>
              </div>
              <span className="text-white font-bold text-xl">ExpenseTracker</span>
            </div>
            
            <div className="mt-8">
              <h2 className="text-3xl font-bold text-white leading-tight">
                Take Control of Your
                <span className="text-blue-200"> Finances</span>
              </h2>
              <p className="text-blue-100 mt-4 text-lg">
                Smart expense tracking for a smarter financial future
              </p>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="relative h-48">
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-8 right-12 w-16 h-16 bg-white/5 rounded-full"></div>
          </div>
        </div>

        {/* Right Side - Content Section */}
        <div className="w-full md:w-3/5 flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center md:text-left mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600">
                Sign in to manage your expenses efficiently
              </p>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl p-1">
              {children}
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                © 2024 ExpenseTracker. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;