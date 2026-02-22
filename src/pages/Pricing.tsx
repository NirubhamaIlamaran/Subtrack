import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  return (
    <div className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">Choose the plan that's right for you. Start for free and upgrade as you grow.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm relative overflow-hidden"
          >
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Free Plan</h3>
              <p className="text-slate-500 text-sm">Perfect for individuals tracking basic subs.</p>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-extrabold text-slate-900">₹0</span>
              <span className="text-slate-500">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                "Up to 20 subscriptions",
                "Email reminders",
                "Basic analytics",
                "Mobile app access",
                "Community support"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-600">
                  <Check className="w-5 h-5 text-emerald-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link to="/register" className="block w-full text-center bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
              Get Started
            </Link>
          </motion.div>

          {/* Premium Plan */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-indigo-50 border-2 border-indigo-600 rounded-3xl p-8 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Coming Soon
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Premium</h3>
              <p className="text-slate-500 text-sm">Advanced tools for financial mastery.</p>
            </div>
            <div className="mb-8 opacity-50">
              <span className="text-4xl font-extrabold text-slate-900">₹199</span>
              <span className="text-slate-500">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                "Unlimited subscriptions",
                "Advanced AI insights",
                "Export reports (PDF/CSV)",
                "Priority support",
                "Multi-currency support",
                "Family sharing"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-600">
                  <Check className="w-5 h-5 text-indigo-600" />
                  {feature}
                </li>
              ))}
            </ul>
            <button disabled className="w-full bg-indigo-200 text-indigo-400 py-3 rounded-xl font-bold cursor-not-allowed">
              Coming Soon
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
