import { useEffect, useState } from 'react';
import { api } from '../api';
import { Activity, ShieldCheck, Zap, BarChart3, Car, Truck, BusFront, Download, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type VehicleStat = {
  _id: string;
  totalTollsPassed: number;
  totalSpent: number;
  lastSeen: string;
};

type SystemSummary = {
  revenue: number;
  activeFleet: number;
  count: number;
};

export default function AdminFleetView() {
  const [transactions, setTransactions] = useState<VehicleStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SystemSummary>({ revenue: 0, activeFleet: 0, count: 0 });
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchLiveStream = async () => {
      try {
        const [vehicleStats, systemSummary] = await Promise.all([
          api.get('/admin/vehicle-stats'),
          api.get('/admin/system-summary')
        ]);

        setTransactions(vehicleStats.data);
        setSummary(systemSummary.data);
      } catch (err) {
        console.error('Stream interrupted');
      } finally {
        setLoading(false);
      }
    };

    fetchLiveStream();
  }, []);

  const downloadReport = async () => {
    setIsExporting(true);
    const toastId = toast.loading('Compiling 7-Day Audit Data...');

    try {
      const { data } = await api.get('/admin/recent-transactions');

      if (data.length === 0) {
        toast.error('No transactions found in the last 7 days', { id: toastId });
        setIsExporting(false);
        return;
      }

      const doc = new jsPDF();

      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42);
      doc.text('Smart-Toll Bangalore Authority', 14, 22);

      doc.setFontSize(11);
      doc.setTextColor(100, 116, 139);
      doc.text('Official Enterprise Transit Audit - Past 7 Days', 14, 30);
      doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 14, 36);

      const tableColumns = ['Date & Time (IST)', 'Vehicle HSRP', 'Transit Route / Plaza', 'Type', 'Amount Paid'];
      const tableRows = data.map((tx: any) => [
        new Date(tx.timestamp).toLocaleString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit', hour12: true,
          timeZone: 'Asia/Kolkata'
        }),
        tx.vehicleNumber,
        tx.plazaName,
        tx.type === 'deduct' ? 'TOLL FEE' : 'RECHARGE',
        `Rs. ${Number(tx.amount).toFixed(2)}`
      ]);

      autoTable(doc, {
        head: [tableColumns],
        body: tableRows,
        startY: 45,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 4, font: 'helvetica' },
        headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
          4: { halign: 'right', fontStyle: 'bold', textColor: [15, 23, 42] }
        }
      });

      doc.save(`BLR_Transit_Audit_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Secure PDF Downloaded', { id: toastId });
    } catch (error) {
      console.error('PDF Error:', error);
      toast.error('Audit Generation Failed', { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* System Health Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-8 rounded-[32px] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>

        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            Central Command <span className="text-blue-500 text-sm font-mono bg-blue-500/10 px-2 py-1 rounded">v2.0.4</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">Live Transit Intelligence • Bangalore Cluster</p>
        </div>

        <div className="flex gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Network Live</span>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Fleet', val: summary.activeFleet.toString(), icon: Car, color: 'text-blue-400' },
          { label: 'Total Revenue', val: `₹${summary.revenue.toLocaleString('en-IN')}`, icon: Zap, color: 'text-amber-400' },
          { label: 'System Uptime', val: '99.9%', icon: Activity, color: 'text-emerald-400' },
          { label: 'Transactions', val: summary.count.toString(), icon: ShieldCheck, color: 'text-indigo-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <stat.icon className={`w-6 h-6 ${stat.color} mb-4`} />
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Fleet Monitoring Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-slate-400" />
            Live Transit Stream
          </h3>
          <button
            onClick={downloadReport}
            disabled={isExporting}
            className={`text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm ${
              isExporting
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 active:scale-[0.98]'
            }`}
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Compiling...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export 7-Day Audit (PDF)
              </>
            )}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vehicle Number</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Plaza</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fee Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td className="px-6 py-8 text-center text-slate-400" colSpan={4}>
                    Syncing with live stream...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td className="px-6 py-8 text-center text-slate-400" colSpan={4}>
                    No live fleet data available.
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-700">{transaction._id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-600">Toll Count: {transaction.totalTollsPassed}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">{new Date(transaction.lastSeen).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-black text-slate-800">₹{transaction.totalSpent.toLocaleString('en-IN')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
