import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Bell, 
  CheckCircle2, 
  ArrowRight, 
  Plus,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const steps = [
  {
    title: "Add your first subscription",
    description: "Let's start by adding one service you pay for. We'll handle the rest.",
    icon: CreditCard,
  },
  {
    title: "Set reminder preferences",
    description: "When should we notify you before a renewal? Never miss a payment again.",
    icon: Bell,
  },
  {
    title: "Ready to go!",
    description: "Your dashboard is ready. Start saving money today.",
    icon: Sparkles,
  }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { addSubscription, currency } = useApp();

  const handleAddQuickSub = (name: string, cost: number) => {
    addSubscription({
      name,
      cost,
      category: 'Entertainment',
      billing: 'Monthly',
      startDate: new Date().toISOString().split('T')[0],
      nextRenewal: new Date().toISOString().split('T')[0],
      status: 'Active'
    });
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/app/dashboard');
    }
  };

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-200">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= currentStep ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-xl border border-slate-100 dark:border-slate-800"
          >
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-8">
              <StepIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
              {steps[currentStep].title}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
              {steps[currentStep].description}
            </p>

            {currentStep === 0 && (
              <div className="space-y-4 mb-10">
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleAddQuickSub('Netflix', 649)}
                    className="p-4 border-2 border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-left group"
                  >
                    <p className="font-bold text-indigo-900 dark:text-indigo-100">Netflix</p>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400">{currency.symbol}649/mo</p>
                  </button>
                  <button 
                    onClick={() => handleAddQuickSub('Spotify', 119)}
                    className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl text-left hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    <p className="font-bold text-slate-900 dark:text-white">Spotify</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{currency.symbol}119/mo</p>
                  </button>
                  <button 
                    onClick={() => handleAddQuickSub('Amazon Prime', 1499)}
                    className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl text-left hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    <p className="font-bold text-slate-900 dark:text-white">Amazon Prime</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{currency.symbol}1499/yr</p>
                  </button>
                  <button className="p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                    <Plus className="w-4 h-4" /> Custom
                  </button>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4 mb-10">
                {['1 day before', '3 days before', '7 days before'].map((option, i) => (
                  <button 
                    key={i}
                    onClick={nextStep}
                    className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                      i === 1 ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <span className={`font-bold ${i === 1 ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-900 dark:text-white'}`}>{option}</span>
                    {i === 1 && <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
                  </button>
                ))}
              </div>
            )}

            {currentStep === 2 && (
              <div className="mb-10 text-center py-8">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-indigo-400 blur-2xl opacity-20 animate-pulse"></div>
                  <CheckCircle2 className="w-24 h-24 text-indigo-600 dark:text-indigo-400 relative z-10" />
                </div>
                <p className="mt-6 text-slate-500 dark:text-slate-400">You're all set to take control of your finances.</p>
              </div>
            )}

            <button 
              onClick={nextStep}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              {currentStep === steps.length - 1 ? 'Go to Dashboard' : 'Continue'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
