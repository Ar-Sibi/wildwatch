// src/pages/Dashboard.tsx
import React from 'react';
import CardBody from './CardBody';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardBody className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Total Users</h3>
                <p className="text-3xl font-bold">1,234</p>
                <p className="text-blue-100 text-sm mt-2">+12% from last month</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </CardBody>

          <CardBody className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Revenue</h3>
                <p className="text-3xl font-bold">$45,678</p>
                <p className="text-green-100 text-sm mt-2">+8% from last month</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </CardBody>

          <CardBody className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Orders</h3>
                <p className="text-3xl font-bold">567</p>
                <p className="text-purple-100 text-sm mt-2">+15% from last month</p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </CardBody>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <CardBody>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New user registered</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>

          <CardBody>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium">
                Add User
              </button>
              <button className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm font-medium">
                Create Report
              </button>
              <button className="p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 text-sm font-medium">
                View Analytics
              </button>
              <button className="p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 text-sm font-medium">
                Settings
              </button>
            </div>
          </CardBody>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;