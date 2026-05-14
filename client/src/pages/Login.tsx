import { useState } from 'react';
import { CarFront, ShieldCheck, Lock, User, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const login = useAuthStore((state) => state.login);

  const plateRegex = /^KA\d{2}[A-Z]{1,2}\d{4}$/;
  const pinRegex = /^\d{4}$/;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const inputId = id.trim().toUpperCase();
    const inputPass = pass.trim();

    if (inputId === 'ADMIN' && inputPass === 'admin123') {
      toast.success('Accessing Central Command...', {
        icon: '🛡️',
        style: { borderRadius: '12px', background: '#0f172a', color: '#fff' }
      });
      login('admin');
      return;
    }

    if (!plateRegex.test(inputId)) {
      toast.error('Invalid HSRP Format');
      return;
    }

    if (!pinRegex.test(inputPass)) {
      toast.error('Security PIN must be 4 digits');
      return;
    }

    toast.success(`Vehicle ${inputId} Verified`);
    login('user', inputId);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 font-sans">
      <Toaster />

      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[420px] bg-white/5 backdrop-blur-3xl rounded-[40px] border border-white/10 p-12 shadow-2xl relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex p-5 rounded-3xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20 mb-6 shadow-inner">
            <CarFront className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Smart-Toll</h1>
          <p className="text-slate-400 text-sm font-semibold tracking-widest uppercase opacity-70">Transit Hub • Bangalore</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {id.toLowerCase() === 'admin' && (
            <div className="animate-bounce bg-amber-100 text-amber-700 p-3 rounded-xl text-xs font-bold text-center border border-amber-200">
              ⚠️ ADMIN PORTAL ACCESS DETECTED
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-4 tracking-tighter">License Plate</label>
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                placeholder="KA 01 AA 0001"
                maxLength={10}
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-5 pl-14 pr-5 text-white font-mono text-lg placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all uppercase"
                onChange={(e) => setId(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-4 tracking-tighter">4-Digit Security PIN</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="password"
                placeholder="••••"
                maxLength={10}
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-5 pl-14 pr-5 text-white text-2xl tracking-[0.5em] placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                onChange={(e) => setPass(e.target.value)}
              />
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4 group">
            <ShieldCheck className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            Secure Authentication
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-slate-500">
          <AlertCircle className="w-4 h-4" />
          <span className="text-xs font-medium">HSRP Standard Verification Active</span>
        </div>
      </div>
    </div>
  );
}