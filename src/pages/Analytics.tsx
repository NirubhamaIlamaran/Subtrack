import { motion } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Lightbulb, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

export default function Analytics() {
  const { subscriptions, currency } = useApp();
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      setIsAiLoading(true);
      try {
        const response = await apiService.ai.getSpendingInsights(subscriptions);
        setAiInsights(response.insights);
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

  const currentSpend = subscriptions
    .filter(s => s.status === 'Active')
    .reduce((acc, curr) => acc + (curr.billing === 'Monthly' ? curr.cost : curr.cost / 12), 0);

  const activeCount = subscriptions.filter(s => s.status === 'Active').length;

  const monthlyData = [
    { month: 'Nov', spend: Math.round(currentSpend * 0.8) },
    { month: 'Dec', spend: Math.round(currentSpend * 0.9) },
    { month: 'Jan', spend: Math.round(currentSpend * 0.95) },
    { month: 'Feb', spend: Math.round(currentSpend) },
  ];

  const categories = Array.from(new Set(subscriptions.map(s => s.category)));
  const categoryData = categories.map((cat, i) => ({
    name: cat,
    value: Math.round((subscriptions.filter(s => s.category === cat).length / subscriptions.length) * 100),
    color: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][i % 5]
  }));

  const staticInsights = [
    { text: `Your total monthly spending is ${currency.symbol}${Math.round(currentSpend).toLocaleString()}.`, type: "info" },
    { text: `Annual commitments: ${currency.symbol}${Math.round(currentSpend * 12).toLocaleString()} locked in current plans.`, type: "info" },
    { text: `You have ${activeCount} active subscriptions.`, type: "success" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Spending Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400">Deep dive into your subscription spending patterns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trend */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="font-bold text-slate-900 dark:text-white mb-6">Monthly Spending Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(value) => `${currency.symbol}${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="spend" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="font-bold text-slate-900 dark:text-white mb-6">Category Distribution (%)</h2>
          <div className="h-64 flex items-center">
            <div className="flex-1 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/3 space-y-4">
              {categoryData.map((item, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.name}</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{item.value}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Panel */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="font-bold text-slate-900 dark:text-white">AI Smart Insights</h2>
          </div>
          {isAiLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              Analyzing patterns...
            </div>
          )}
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {(isAiLoading ? staticInsights.map(i => i.text) : aiInsights.length > 0 ? aiInsights : staticInsights.map(i => i.text)).map((insight, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 group"
            >
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{insight}</p>
              <button className="mt-4 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                Take Action <ArrowRight className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Annual Projection */}
      <div className="bg-indigo-600 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-indigo-200 dark:shadow-none">
        <div>
          <h2 className="text-2xl font-bold mb-2">Annual Projection</h2>
          <p className="text-indigo-100 opacity-80">Based on your current active subscriptions, you will spend {currency.symbol}{(subscriptions.reduce((acc, curr) => acc + curr.cost, 0) * 12).toLocaleString()} this year.</p>
        </div>
        <div className="text-center md:text-right">
          <p className="text-4xl font-extrabold">{currency.symbol}{(subscriptions.reduce((acc, curr) => acc + curr.cost, 0) * 12).toLocaleString()}</p>
          <p className="text-sm text-indigo-200 mt-1">Estimated Total for 2026</p>
        </div>
      </div>
    </div>
  );
}
