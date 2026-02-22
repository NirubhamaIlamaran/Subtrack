import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Shield, Zap, BarChart3 } from 'lucide-react';

export default function Landing() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6"
            >
              Track Every Subscription. <span className="text-indigo-600">Save Every Rupee.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-600 mb-10 leading-relaxed"
            >
              Stop losing money on unused services. SubTrack helps you monitor, manage, and optimize all your recurring payments in one beautiful dashboard.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link to="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
                Start Tracking for Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/pricing" className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center">
                View Pricing
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to stay in control</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Powerful tools designed to help you understand your spending habits and never miss a renewal again.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "See Monthly Spending",
                desc: "Get a clear breakdown of where your money goes each month with intuitive charts and categories."
              },
              {
                icon: Zap,
                title: "Never Miss a Renewal",
                desc: "Receive timely alerts before your subscriptions renew, giving you time to cancel if you don't need them."
              },
              {
                icon: Shield,
                title: "Smart Insights",
                desc: "Our AI analyzes your usage patterns and suggests ways to save money and consolidate services."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-900 rounded-3xl p-12 md:p-20 relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map(i => <CheckCircle2 key={i} className="w-5 h-5 text-emerald-400 fill-emerald-400" />)}
              </div>
              <blockquote className="text-3xl md:text-4xl font-medium text-white mb-8 leading-tight">
                "I didn’t realize I was spending ₹2,400/month on unused apps. SubTrack helped me find and cancel them in minutes."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-400"></div>
                <div>
                  <p className="text-white font-bold text-lg">Priya Sharma</p>
                  <p className="text-indigo-300">Student & Freelancer</p>
                </div>
              </div>
            </div>
            {/* Abstract background shape */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-800/50 -skew-x-12 translate-x-1/4"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
