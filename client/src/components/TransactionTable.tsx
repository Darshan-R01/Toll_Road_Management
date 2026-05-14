import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

type Transaction = {
  _id: string;
  vehicleNumber: string;
  plazaName: string;
  amount: number;
  type: 'deduct' | 'credit';
  timestamp: string;
};

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/transactions')
      .then(res => setTransactions(res.data))
      .catch(err => console.error('Could not load transactions', err));
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Live Activity (from Cloud)</h2>
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <p className="text-slate-400 text-center py-10">No transactions found in MongoDB Atlas.</p>
        ) : (
          transactions.map((tx) => (
            <div key={tx._id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {tx.type === 'credit' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{tx.plazaName}</p>
                  <p className="text-sm text-slate-500">{new Date(tx.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <span className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-slate-800'}`}>
                {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}