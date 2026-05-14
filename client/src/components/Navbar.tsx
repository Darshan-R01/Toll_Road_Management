import { Car, LogOut, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const navigate = useNavigate();
  const { isAdmin, userVehicle, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-600/20">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-800 leading-none">Smart-Toll Blr</h1>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-[0.24em] mt-1">Cloud Synced Transit Console</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Vehicle</p>
            <p className="font-semibold text-slate-800">{userVehicle || 'ADMIN ACCESS'}</p>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-2 rounded-full border border-amber-200">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Admin Mode</span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors font-semibold px-3 py-2 rounded-xl hover:bg-slate-50"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}