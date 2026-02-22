import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Calendar as CalendarIcon,
  ChevronRight,
  Sparkles,
  Bell,
  ArrowRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UPIPaymentModal from '../components/UPIPaymentModal';
import { apiService } from '../services/apiService';

export default function Dashboard() {
  const { subscriptions, user, currency } = useApp();
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [upiModal, setUpiModal] = useState<{ isOpen: boolean; subName: string; amount: string; upiId: string }>({
    isOpen: false,
    subName: '',
    amount: '',
    upiId: ''
  });

  useEffect(() => {
    const fetchInsights = async () => {
      setIsAiLoading(true);
      try {
        const response = await apiService.ai.getSpendingInsights(subscriptions);
        setAiInsights(response.insights.slice(0, 2)); // Just show top 2 on dashboard
      } catch (error) {
        console.error('Failed to fetch AI insights:', error);
      } finally {
        setIsAiLoading(false);
      }
    };

    if (subscriptions.length > 0) {
      fetchInsights();
    }
  }, [subscriptions]);

  const monthlyTotal = subscriptions
    .filter(s => s.status === 'Active')
    .reduce((acc, curr) => acc + (curr.billing === 'Monthly' ? curr.cost : curr.cost / 12), 0);
  
  const annualTotal = monthlyTotal * 12;
  const activeCount = subscriptions.filter(s => s.status === 'Active').length;

  const summaryData = [
    { label: 'Monthly Spend', value: `${currency.symbol}${Math.round(monthlyTotal).toLocaleString()}`, trend: null, trendUp: null, icon: TrendingUp },
    { label: 'Annual Spend', value: `${currency.symbol}${Math.round(annualTotal).toLocaleString()}`, trend: null, trendUp: null, icon: TrendingDown },
    { label: 'Active Subs', value: activeCount.toString(), trend: null, trendUp: null, icon: CalendarIcon },
  ];

  const upcomingRenewals = [...subscriptions]
    .filter(s => s.status === 'Active')
    .sort((a, b) => new Date(a.nextRenewal).getTime() - new Date(b.nextRenewal).getTime())
    .slice(0, 3);

  const categories = Array.from(new Set(subscriptions.map(s => s.category)));
  const chartData = categories.map((cat, i) => ({
    name: cat,
    value: subscriptions.filter(s => s.category === cat).reduce((acc, curr) => acc + curr.cost, 0),
    color: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][i % 5]
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400">Welcome back, {user.name}. Here's what's happening with your subscriptions.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryData.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <stat.icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              {stat.trendUp !== null && (
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trendUp ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'}`}>
                  {stat.trend}
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Renewals */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h2 className="font-bold text-slate-900 dark:text-white">Upcoming Renewals</h2>
            <Link to="/app/subscriptions" className="text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {upcomingRenewals.map((sub, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400">
                    {sub.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{sub.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{sub.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-white">{currency.symbol}{sub.cost}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {(() => {
                        const nextRenewalDate = new Date(sub.nextRenewal);
                        const today = new Date();
                        const diffTime = nextRenewalDate.getTime() - today.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        return diffDays === 0 ? 'Due Today' : `Due in ${diffDays} days`;
                      })()}
                    </p>
                  </div>
                  {sub.paymentMethod === 'UPI' && (
                    <button 
                      onClick={() => setUpiModal({
                        isOpen: true,
                        subName: sub.name,
                        amount: `${currency.symbol}${sub.cost}`,
                        upiId: sub.upiId || 'merchant@upi'
                      })}
                      className="px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Pay
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spending Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <h2 className="font-bold text-slate-900 dark:text-white mb-6">Spending Breakdown</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            {chartData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{currency.symbol}{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Insights & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Insights */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="font-bold text-slate-900 dark:text-white">Smart Insights</h2>
            </div>
            {isAiLoading && <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>}
          </div>
          
          <div className="space-y-4">
            {aiInsights.length > 0 ? (
              aiInsights.map((insight, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{insight}</p>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500 italic">Analyzing your spending patterns...</p>
              </div>
            )}
            <Link to="/app/analytics" className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:gap-2 transition-all">
              View Full Analysis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Payment Reminders */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
              <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="font-bold text-slate-900 dark:text-white">Upcoming Reminders</h2>
          </div>

          <div className="space-y-4">
            {subscriptions
              .filter(s => s.status === 'Active')
              .slice(0, 2)
              .map((sub, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-500">
                      {sub.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{sub.name}</p>
                      <p className="text-[10px] text-slate-500">Reminder set for {sub.reminderDays || 3} days before</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-amber-600">
                      {(() => {
                        const nextRenewalDate = new Date(sub.nextRenewal);
                        const today = new Date();
                        const diffTime = nextRenewalDate.getTime() - today.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        return diffDays === 0 ? 'Due Today' : `Due in ${diffDays} days`;
                      })()}
                    </p>
                  </div>
                </div>
              ))}
            <button className="w-full py-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              Configure All Reminders
            </button>
          </div>
        </div>
      </div>

      <UPIPaymentModal 
        isOpen={upiModal.isOpen}
        onClose={() => setUpiModal({ ...upiModal, isOpen: false })}
        subscriptionName={upiModal.subName}
        amount={upiModal.amount}
        upiId={upiModal.upiId}
      />
    </div>
  );
}
