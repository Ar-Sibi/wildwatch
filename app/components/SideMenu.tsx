// src/components/SideMenu.tsx
import React from 'react';
import { NavLink } from 'react-router';

const SideMenu: React.FC = () => {
  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">WildWatch</h1>
        </div>
        
        <nav className="space-y-2">
          <NavLink 
            to="/image-upload" 
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span className="text-xl">📸</span>
            <span className="font-medium">Image Upload</span>
          </NavLink>
          
          <NavLink 
            to="/profile" 
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span className="text-xl">👤</span>
            <span className="font-medium">Profile</span>
          </NavLink>
          
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span className="text-xl">⚙️</span>
            <span className="font-medium">Settings</span>
          </NavLink>
        </nav>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">JD</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">john@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;