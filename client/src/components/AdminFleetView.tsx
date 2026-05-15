// Line 3: These were causing the error because they weren't used below
import { Truck, BusFront, LayoutDashboard, Settings } from 'lucide-react';

const AdminFleetView = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Admin Fleet Management</h1>
        </div>
        <button className="p-2 hover:bg-gray-200 rounded-full">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Fleet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Truck Section - Now using the 'Truck' variable */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <Truck className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Trucks</h2>
            <p className="text-3xl font-bold text-blue-600">12</p>
            <p className="text-sm text-gray-500 font-medium">Active in Fleet</p>
          </div>
        </div>

        {/* Bus Section - Now using the 'BusFront' variable */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-100 p-4 rounded-lg">
            <BusFront className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Buses</h2>
            <p className="text-3xl font-bold text-green-600">8</p>
            <p className="text-sm text-gray-500 font-medium">Active in Fleet</p>
          </div>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
        <div className="text-gray-400 text-center py-12 border-2 border-dashed border-gray-100 rounded-lg">
          No recent alerts for the fleet.
        </div>
      </div>
    </div>
  );
};

export default AdminFleetView;