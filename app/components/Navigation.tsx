import React from 'react';
import { Link, useLocation } from 'react-router';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">WildWatch</h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <Link
              to="/"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                location.pathname === '/'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              📸 Image Upload
            </Link>
            <Link
              to="/video-upload"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                location.pathname === '/video-upload'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              🎬 Video Upload
            </Link>
            <Link
              to="/analytics"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                location.pathname === '/analytics'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              📊 Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation; 