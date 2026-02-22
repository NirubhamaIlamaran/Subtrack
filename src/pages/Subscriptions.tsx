import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  PauseCircle,
  PlayCircle,
  Smartphone,
  CreditCard,
  Globe,
  Building2
} from 'lucide-react';
import { useState } from 'react';
import { useApp, Subscription } from '../context/AppContext';
import SubscriptionModal from '../components/SubscriptionModal';

export default function Subscriptions() {
  const { subscriptions, deleteSubscription, updateSubscription, setAddModalOpen, currency } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);

  const filteredSubs = subscriptions.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || sub.category === categoryFilter;
    const matchesStatus = statusFilter === 'All Status' || sub.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleToggleStatus = (sub: Subscription) => {
    updateSubscription(sub.id, { status: sub.status === 'Active' ? 'Paused' : 'Active' });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Subscriptions</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and track all your recurring payments.</p>
        </div>
        <button 
          onClick={() => setAddModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none"
        >
          <Plus className="w-4 h-4" />
          Add Subscription
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
          >
            <option>All Categories</option>
            <option>Entertainment</option>
            <option>Software</option>
            <option>Education</option>
            <option>Utilities</option>
          </select>
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Paused</option>
          </select>
          <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Filter className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Subscription</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Billing</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Next Renewal</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSubs.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                        {sub.name[0]}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{sub.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{sub.category}</td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{currency.symbol}{sub.cost}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-md">
                        {sub.paymentMethod === 'UPI' && <Smartphone className="w-3.5 h-3.5 text-indigo-600" />}
                        {sub.paymentMethod === 'Credit Card' && <CreditCard className="w-3.5 h-3.5 text-amber-600" />}
                        {sub.paymentMethod === 'Debit Card' && <CreditCard className="w-3.5 h-3.5 text-emerald-600" />}
                        {sub.paymentMethod === 'Net Banking' && <Globe className="w-3.5 h-3.5 text-blue-600" />}
                        {!sub.paymentMethod && <Building2 className="w-3.5 h-3.5 text-slate-400" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{sub.paymentMethod || 'Not Set'}</span>
                        {sub.paymentMethod === 'UPI' && sub.upiId && (
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">{sub.upiId}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{sub.billing}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{sub.nextRenewal}</span>
                      {sub.reminderDays && (
                        <span className="text-[10px] text-indigo-500 font-medium">Reminder: {sub.reminderDays}d before</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      sub.status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingSub(sub)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(sub)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                      >
                        {sub.status === 'Active' ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => deleteSubscription(sub.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSubs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No subscriptions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SubscriptionModal 
        isOpen={!!editingSub} 
        onClose={() => setEditingSub(null)} 
        editSub={editingSub}
      />
    </div>
  );
}
