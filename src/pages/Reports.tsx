import { motion } from 'motion/react';
import { 
  FileText, 
  Download, 
  Mail, 
  ChevronRight, 
  Calendar as CalendarIcon,
  BarChart3,
  FileSpreadsheet,
  FileJson
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function Reports() {
  const { currency, subscriptions } = useApp();

  const activeSubs = subscriptions.filter(s => s.status === 'Active');
  const monthlyTotal = activeSubs.reduce((acc, curr) => acc + (curr.billing === 'Monthly' ? curr.cost : curr.cost / 12), 0);
  
  const categories = Array.from(new Set(activeSubs.map(s => s.category)));
  const topCategory = categories.length > 0 
    ? categories.reduce((a, b) => 
        activeSubs.filter(s => s.category === a).length >= activeSubs.filter(s => s.category === b).length ? a : b
      )
    : 'None';

  const today = new Date();
  const upcomingRenewalsCount = activeSubs.filter(sub => {
    const nextRenewalDate = new Date(sub.nextRenewal);
    const diffTime = nextRenewalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  }).length;

  const currentMonthName = today.toLocaleString('default', { month: 'long', year: 'numeric' });

  const reports = [
    { month: currentMonthName, total: `${currency.symbol}${Math.round(monthlyTotal).toLocaleString()}`, topCategory, renewals: upcomingRenewalsCount },
  ];

  const exportToPDF = () => {
    if (subscriptions.length === 0) {
      alert('No subscriptions to export.');
      return;
    }
    try {
      const doc = new jsPDF();
      doc.text('Subscription Report', 14, 15);
      
      const tableData = subscriptions.map(sub => [
        sub.name,
        sub.category,
        `${currency.symbol}${sub.cost}`,
        sub.billing,
        sub.nextRenewal,
        sub.status
      ]);

      (doc as any).autoTable({
        head: [['Name', 'Category', 'Cost', 'Billing', 'Next Renewal', 'Status']],
        body: tableData,
        startY: 20,
      });

      doc.save('subscriptions-report.pdf');
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('Failed to export PDF. Please check console for details.');
    }
  };

  const exportToExcel = () => {
    if (subscriptions.length === 0) {
      alert('No subscriptions to export.');
      return;
    }
    try {
      const worksheet = XLSX.utils.json_to_sheet(subscriptions.map(sub => ({
        Name: sub.name,
        Category: sub.category,
        Cost: sub.cost,
        Currency: currency.code,
        Billing: sub.billing,
        'Next Renewal': sub.nextRenewal,
        Status: sub.status,
        'Payment Method': sub.paymentMethod,
        'UPI ID': sub.upiId
      })));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Subscriptions');
      XLSX.writeFile(workbook, 'subscriptions-report.xlsx');
    } catch (error) {
      console.error('Excel Export Error:', error);
      alert('Failed to export Excel. Please check console for details.');
    }
  };

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(subscriptions);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'subscriptions-report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Financial Reports</h1>
          <p className="text-slate-500 dark:text-slate-400">Download and export your subscription history.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={exportToExcel}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export Excel
          </button>
          <button 
            onClick={exportToPDF}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none"
          >
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Current Month Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Current Month: February 2026
          </h2>
        </div>
        <div className="p-8 grid md:grid-cols-3 gap-8">
          <div className="space-y-1">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Total Spending</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{currency.symbol}{Math.round(monthlyTotal).toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Highest Category</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{topCategory}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Upcoming Renewals</p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{upcomingRenewalsCount}</p>
          </div>
        </div>
      </div>

      {/* Past Reports */}
      <div className="space-y-4">
        <h2 className="font-bold text-slate-900 dark:text-white">Past Monthly Reports</h2>
        <div className="grid gap-4">
          {reports.map((report, i) => (
            <motion.div 
              key={i}
              whileHover={{ x: 5 }}
              className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
                  <FileText className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{report.month}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Total: {report.total} • {report.renewals} renewals</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <Download className="w-5 h-5" />
                </button>
                <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </button>
                <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Summary Section */}
      <div className="bg-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-200 dark:shadow-none">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-bold">AI Monthly Summary</h2>
          </div>
          <p className="text-indigo-100 leading-relaxed max-w-2xl">
            "In February, your spending remained stable compared to January. However, your Entertainment costs are 15% higher than the average user in your demographic. We've identified two subscriptions that haven't been used in the last 30 days."
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-800 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
      </div>
    </div>
  );
}
