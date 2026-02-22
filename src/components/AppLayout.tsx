import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  BarChart3, 
  Calendar as CalendarIcon, 
  FileText, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Plus,
  Moon,
  Sun,
  X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useClerk, UserButton } from '@clerk/clerk-react';
import { useApp } from '../context/AppContext';
import SubscriptionModal from './SubscriptionModal';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/app/dashboard' },
  { icon: CreditCard, label: 'Subscriptions', path: '/app/subscriptions' },
  { icon: BarChart3, label: 'Analytics', path: '/app/analytics' },
  { icon: CalendarIcon, label: 'Calendar', path: '/app/calendar' },
  { icon: FileText, label: 'Reports', path: '/app/reports' },
  { icon: Settings, label: 'Settings', path: '/app/settings' },
];

export default function AppLayout() {
  const { signOut } = useClerk();
  const location = useLocation();
  const { user, theme, toggleTheme, isAddModalOpen, setAddModalOpen, isLoading, subscriptions } = useApp();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const notifications = (subscriptions || [])
    .filter(sub => sub.status === 'Active' && sub.reminderDays)
    .map(sub => {
      const nextRenewalDate = new Date(sub.nextRenewal);
      const today = new Date();
      const diffTime = nextRenewalDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= (sub.reminderDays || 3) && diffDays >= 0) {
        return {
          id: sub.id,
          title: `${sub.name} Renewal`,
          message: `Your ${sub.name} subscription will renew in ${diffDays} days.`,
          time: diffDays === 0 ? 'Today' : `${diffDays} days left`,
          unread: true
        };
      }
      return null;
    })
    .filter(Boolean) as any[];

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/login';
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col hidden md:flex">
        <div className="p-6">
          <Link to="/app/dashboard" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">SubTrack</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors mb-2"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search subscriptions..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Theme Toggle in Header */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors relative rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                      <button onClick={() => setIsNotificationsOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div key={n.id} className="p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-sm font-bold text-slate-900 dark:text-white">{n.title}</p>
                              {n.unread && <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>}
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{n.message}</p>
                            <p className="text-[10px] text-slate-400">{n.time}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-slate-500 text-sm">
                          No new notifications
                        </div>
                      )}
                    </div>
                    <div className="p-3 text-center border-t border-slate-100 dark:border-slate-800">
                      <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Mark all as read</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-slate-500">{user.plan}</p>
              </div>
              <UserButton afterSignOutUrl="/login" />
            </div>
            
            <button 
              onClick={() => setAddModalOpen(true)}
              className="hidden sm:flex bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors items-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              <Plus className="w-4 h-4" />
              Add New
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-950 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/50 backdrop-blur-[1px] z-40 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading data...</p>
              </div>
            </div>
          )}
          <Outlet />
        </main>
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal 
        isOpen={isAddModalOpen} 
        onClose={() => setAddModalOpen(false)} 
      />
    </div>
  );
}
