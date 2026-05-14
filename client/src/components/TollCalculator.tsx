import { useEffect, useState } from 'react';
import { api } from '../api';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { Calculator, MapPin, Car, Truck, BusFront, CheckCircle2, Loader2 } from 'lucide-react';
import { TOLL_PLAZAS, calculateFare } from '../constants/tolls';
import type { VehicleType } from '../constants/tolls';

export default function TollCalculator() {
  // Professional tip: Sort the list for better User Experience
  const sortedPlazas = [...TOLL_PLAZAS].sort((a, b) => a.name.localeCompare(b.name));

  const [entry, setEntry] = useState(TOLL_PLAZAS[0].name);
  const [exit, setExit] = useState(TOLL_PLAZAS[1].name);
  const [vehicleType, setVehicleType] = useState<VehicleType>('car');
  const [estimatedCost, setEstimatedCost] = useState(0);
  const userVehicle = useAuthStore((state) => state.userVehicle);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setEstimatedCost(calculateFare(entry, exit, vehicleType));
  }, [entry, exit, vehicleType]);

  const handlePayment = async () => {
    if (estimatedCost === 0) {
      toast.error('Select different entry and exit plazas');
      return;
    }

    if (!userVehicle && !isAdmin) {
      toast.error('Authentication required for payment');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Authorizing HSRP Transit Fee...');

    try {
      const payload = {
        vehicleNumber: userVehicle ?? 'KA01AB1234',
        plazaName: `${entry} → ${exit}`,
        amount: estimatedCost,
        type: 'deduct',
      };

      const response = await api.post('/transactions', payload);

      if (response.status === 201) {
        toast.success('Transaction Securely Logged', { id: loadingToast });

        setTimeout(() => {
          setIsSubmitting(false);
        }, 1500);
      }
    } catch (error) {
      console.error('Payment Error:', error);
      toast.error('Auth Failure: Cloud Sync Interrupted', { id: loadingToast });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
          <Calculator className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Advanced Fare Estimator</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Vehicle Class</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
            <button
              type="button"
              onClick={() => setVehicleType('car')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
                vehicleType === 'car' ? 'bg-white shadow-sm border border-slate-200 text-blue-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Car className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold uppercase">Car / LMV</span>
            </button>

            <button
              type="button"
              onClick={() => setVehicleType('lcv')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
                vehicleType === 'lcv' ? 'bg-white shadow-sm border border-slate-200 text-blue-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Truck className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold uppercase">LCV / Mini</span>
            </button>

            <button
              type="button"
              onClick={() => setVehicleType('truck')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
                vehicleType === 'truck' ? 'bg-white shadow-sm border border-slate-200 text-blue-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <BusFront className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold uppercase">Bus / Truck</span>
            </button>

            <button
              type="button"
              onClick={() => setVehicleType('heavy')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
                vehicleType === 'heavy' ? 'bg-white shadow-sm border border-slate-200 text-blue-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Truck className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold uppercase">Multi-Axle</span>
            </button>
          </div>
        </div>

        <div className="space-y-3 relative">
          <div className="absolute left-[19px] top-[30px] bottom-[30px] w-0.5 bg-slate-100 z-0"></div>

          <div className="relative z-10 flex items-center gap-3">
            <div className="bg-white border-2 border-slate-200 w-[10px] h-[10px] rounded-full ml-[14px]"></div>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Entry Plaza</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none outline-none"
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
              >
                {sortedPlazas.map((p) => (
                  <option key={`in-${p.id}`} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <div className="bg-blue-500 border-2 border-blue-100 w-[10px] h-[10px] rounded-full ml-[14px]"></div>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Exit Plaza</label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none outline-none"
                value={exit}
                onChange={(e) => setExit(e.target.value)}
              >
                {sortedPlazas.map((p) => (
                  <option key={`out-${p.id}`} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex justify-between items-end mb-4">
            <span className="text-sm font-semibold text-slate-500 tracking-tight flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Authorized Fare
            </span>
            <span className={`text-3xl font-black tracking-tight ${estimatedCost === 0 ? 'text-slate-300' : 'text-slate-800'}`}>
              ₹{estimatedCost}
            </span>
          </div>

          <button
            type="button"
            onClick={handlePayment}
            disabled={isSubmitting || estimatedCost === 0}
            className={`w-full font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg ${
              estimatedCost === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                : isSubmitting
                  ? 'bg-slate-100 text-slate-400 cursor-wait shadow-none'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
            }`}
          >
            {estimatedCost === 0 ? (
              'Select Different Exit'
            ) : isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Authorize Payment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
