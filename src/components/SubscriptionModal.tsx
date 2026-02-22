import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus } from 'lucide-react';
import { useApp, Subscription } from '../context/AppContext';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  editSub?: Subscription | null;
};

export default function SubscriptionModal({ isOpen, onClose, editSub }: Props) {
  const { addSubscription, updateSubscription, currency } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Entertainment',
    cost: '',
    billing: 'Monthly' as 'Monthly' | 'Annual',
    startDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI' as 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking',
    upiId: '',
    upiProvider: 'PhonePe',
    reminderDays: 3,
  });

  useEffect(() => {
    if (editSub) {
      setFormData({
        name: editSub.name,
        category: editSub.category,
        cost: editSub.cost.toString(),
        billing: editSub.billing,
        startDate: editSub.startDate,
        paymentMethod: editSub.paymentMethod || 'UPI',
        upiId: editSub.upiId || '',
        upiProvider: 'PhonePe', // Default for now
        reminderDays: editSub.reminderDays || 3,
      });
    } else {
      setFormData({
        name: '',
        category: 'Entertainment',
        cost: '',
        billing: 'Monthly',
        startDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'UPI',
        upiId: '',
        upiProvider: 'PhonePe',
        reminderDays: 3,
      });
    }
  }, [editSub, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subData = {
      name: formData.name,
      category: formData.category,
      cost: parseFloat(formData.cost),
      billing: formData.billing,
      startDate: formData.startDate,
      nextRenewal: formData.startDate, // Simple logic for now
      status: 'Active' as const,
      paymentMethod: formData.paymentMethod,
      upiId: formData.paymentMethod === 'UPI' ? formData.upiId : undefined,
      reminderDays: formData.reminderDays,
    };

    if (editSub) {
      updateSubscription(editSub.id, subData);
    } else {
      addSubscription(subData);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {editSub ? 'Edit Subscription' : 'Add New Subscription'}
              </h2>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none dark:text-white"
                  placeholder="e.g. Netflix"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cost ({currency.symbol})</label>
                  <input
                    type="number"
                    required
                    value={formData.cost}
                    onChange={e => setFormData({ ...formData, cost: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none dark:text-white"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none dark:text-white"
                  >
                    <option>Entertainment</option>
                    <option>Software</option>
                    <option>Education</option>
                    <option>Utilities</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Billing Cycle</label>
                  <select
                    value={formData.billing}
                    onChange={e => setFormData({ ...formData, billing: e.target.value as 'Monthly' | 'Annual' })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none dark:text-white"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={e => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none dark:text-white"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Net Banking">Net Banking</option>
                  </select>
                </div>
                {formData.paymentMethod === 'UPI' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">UPI Provider</label>
                      <select
                        value={formData.upiProvider}
                        onChange={e => setFormData({ ...formData, upiProvider: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none dark:text-white"
                      >
                        <option>PhonePe</option>
                        <option>Google Pay</option>
                        <option>Paytm</option>
                        <option>Amazon Pay</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">UPI ID</label>
                      <input
                        type="text"
                        required
                        value={formData.upiId}
                        onChange={e => setFormData({ ...formData, upiId: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none dark:text-white"
                        placeholder="user@upi"
                      />
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Payment Reminder</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="14"
                    value={formData.reminderDays}
                    onChange={e => setFormData({ ...formData, reminderDays: parseInt(e.target.value) })}
                    className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <span className="text-sm font-bold text-indigo-600 min-w-[80px]">
                    {formData.reminderDays} days before
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">
                  We'll notify you {formData.reminderDays} days before the renewal date.
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2"
                >
                  {editSub ? 'Update Subscription' : 'Add Subscription'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
