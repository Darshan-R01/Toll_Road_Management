import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Clock, Wallet } from 'lucide-react';
import { api } from '../api';
import { useAuthStore } from '../store/authStore';
import TollCalculator from './TollCalculator';
import TransactionTable from './TransactionTable';

export default function UserDashboard() {
  const { userVehicle } = useAuthStore();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchMyActivity = async () => {
      try {
        const vehicleNumber = userVehicle?.trim().toUpperCase();

        if (!vehicleNumber) {
          setHistory([]);
          return;
        }

        const res = await api.get(`/transactions/${vehicleNumber}`);
        setHistory(res.data);
      } catch (err) {
        console.error('Activity sync failed');
      }
    };

    fetchMyActivity();
  }, [userVehicle]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden"
        >
          <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <p className="text-slate-400 font-medium mb-1">FASTag Balance</p>
              <h2 className="text-4xl font-bold">₹450.00</h2>
            </div>
            <Wallet className="w-8 h-8 text-blue-400" />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors relative z-10">
            + Add Money
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TollCalculator />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-2 space-y-8"
      >
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Live Activity (Cloud Synced)
          </h3>

          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-slate-400 text-sm py-10 text-center">No recent transit records found.</p>
            ) : (
              history.map((tx: any) => (
                <div key={tx._id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {tx.type === 'credit' ? <ArrowUpRight /> : <ArrowDownLeft />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-700">{tx.plazaName}</p>
                      <p className="text-xs text-slate-400">{new Date(tx.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <p className={`font-black ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <TransactionTable />
      </motion.div>
    </div>
  );
}