import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { CreditCard } from 'lucide-react';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <nav className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">SubTrack</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</Link>
              <Link to="/pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Pricing</Link>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Login</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
      <footer className="bg-slate-50 border-t border-slate-100 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              <span className="font-bold">SubTrack</span>
            </div>
            <p className="text-slate-500 text-sm">© 2026 SubTrack. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors text-sm">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors text-sm">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
