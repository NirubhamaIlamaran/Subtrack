import { motion } from 'motion/react';
import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Moon, 
  Sun, 
  Trash2,
  Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Settings() {
  const { user, updateUser, theme, toggleTheme, currency, updateCurrency } = useApp();
  const [reminders, setReminders] = useState(true);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const handleSaveProfile = () => {
    updateUser({ name, email });
    alert('Profile updated successfully!');
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const symbol = code === 'INR' ? '₹' : code === 'USD' ? '$' : '€';
    updateCurrency(code, symbol);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your account preferences and notification settings.</p>
      </div>

      {/* Profile Section */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Profile Information
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-2xl">
              {name[0]}
            </div>
            <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">Change Avatar</button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
              />
            </div>
          </div>
          <button 
            onClick={handleSaveProfile}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
          >
            Save Changes
          </button>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Notification Preferences
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Email Reminders</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Receive alerts before your subscriptions renew.</p>
            </div>
            <button 
              onClick={() => setReminders(!reminders)}
              className={`w-12 h-6 rounded-full transition-colors relative ${reminders ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${reminders ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Reminder Days</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">How many days before renewal should we notify you?</p>
            </div>
            <select defaultValue="3 days before" className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white">
              <option>1 day before</option>
              <option>3 days before</option>
              <option>7 days before</option>
            </select>
          </div>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            App Preferences
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Currency</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Set your default currency for tracking.</p>
            </div>
            <select 
              value={currency.code}
              onChange={handleCurrencyChange}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Appearance</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Switch between light and dark mode.</p>
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button 
                onClick={() => theme === 'dark' && toggleTheme()}
                className={`p-2 rounded-md transition-all ${theme === 'light' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button 
                onClick={() => theme === 'light' && toggleTheme()}
                className={`p-2 rounded-md transition-all ${theme === 'dark' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-red-100 dark:border-red-900/30">
          <h2 className="font-bold text-red-900 dark:text-red-400 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
            Danger Zone
          </h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-red-900 dark:text-red-400">Delete Account</p>
              <p className="text-sm text-red-700 dark:text-red-500">Permanently remove all your data and subscriptions.</p>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
