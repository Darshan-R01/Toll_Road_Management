import { useEffect, useState } from 'react';
import { LayoutDashboard, CarFront, IndianRupee, Activity, Clock, ShieldAlert } from 'lucide-react';
import { api } from '../api';

type SystemSummary = {
  revenue: number;
  activeFleet: number;
  count: number;
};

type VehicleStat = {
  _id: string; // vehicleNumber
  totalTollsPassed: number;
  totalSpent: number;
  lastSeen: string;
};

const AdminFleetView = () => {
  const [summary, setSummary] = useState<SystemSummary | null>(null);
  const [vehicleStats, setVehicleStats] = useState<VehicleStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, statsRes] = await Promise.all([
          api.get('/admin/system-summary'),
          api.get('/admin/vehicle-stats')
        ]);
        setSummary(summaryRes.data);
        setVehicleStats(statsRes.data);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Admin Fleet Management</h1>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Dynamic Fleet Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Total Revenue */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-emerald-100 p-4 rounded-lg">
                <IndianRupee className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Total Revenue</h2>
                <p className="text-3xl font-bold text-emerald-600">₹{summary?.revenue || 0}</p>
                <p className="text-sm text-gray-500 font-medium">Collected to date</p>
              </div>
            </div>

            {/* Active Fleet */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-blue-100 p-4 rounded-lg">
                <CarFront className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Active Fleet</h2>
                <p className="text-3xl font-bold text-blue-600">{summary?.activeFleet || 0}</p>
                <p className="text-sm text-gray-500 font-medium">Unique Vehicles</p>
              </div>
            </div>

            {/* Total Transactions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="bg-purple-100 p-4 rounded-lg">
                <Activity className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Transactions</h2>
                <p className="text-3xl font-bold text-purple-600">{summary?.count || 0}</p>
                <p className="text-sm text-gray-500 font-medium">Total Passes</p>
              </div>
            </div>

          </div>

          {/* Detailed Vehicle Data Table */}
          <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Active Vehicles Activity
            </h3>
            
            <div className="overflow-x-auto">
              {vehicleStats.length === 0 ? (
                <div className="text-gray-400 text-center py-12 border-2 border-dashed border-gray-100 rounded-lg flex flex-col items-center gap-2">
                  <ShieldAlert className="w-8 h-8 text-slate-300" />
                  <p>No recent vehicle activity found in the system.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-sm uppercase tracking-wider text-slate-500">
                      <th className="pb-4 font-bold">Vehicle Number</th>
                      <th className="pb-4 font-bold">Total Tolls Passed</th>
                      <th className="pb-4 font-bold">Total Spent</th>
                      <th className="pb-4 font-bold">Last Seen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicleStats.map((stat) => (
                      <tr key={stat._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="py-4 font-semibold text-slate-800">{stat._id}</td>
                        <td className="py-4 text-slate-600 font-medium">{stat.totalTollsPassed} Passes</td>
                        <td className="py-4 text-emerald-600 font-bold">₹{stat.totalSpent}</td>
                        <td className="py-4 text-slate-500 text-sm">
                          {new Date(stat.lastSeen).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminFleetView;