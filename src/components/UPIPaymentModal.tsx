import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Loader2, Smartphone } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  subscriptionName: string;
  amount: string;
  upiId: string;
};

export default function UPIPaymentModal({ isOpen, onClose, subscriptionName, amount, upiId }: Props) {
  const [step, setStep] = useState<'qr' | 'waiting' | 'success'>('qr');

  const handlePay = () => {
    setStep('waiting');
    setTimeout(() => {
      setStep('success');
    }, 3000);
  };

  const handleClose = () => {
    setStep('qr');
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
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-600" />
                UPI Payment
              </h2>
              <button onClick={handleClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 text-center">
              {step === 'qr' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="mb-6">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Paying for</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{subscriptionName}</p>
                    <p className="text-2xl font-extrabold text-indigo-600 mt-1">{amount}</p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl inline-block mb-6 border-2 border-slate-100 dark:border-slate-700">
                    {/* Mock QR Code */}
                    <div className="w-48 h-48 bg-white p-2 rounded-lg flex items-center justify-center">
                      <div className="w-full h-full bg-slate-900 rounded flex flex-wrap p-1">
                        {Array.from({ length: 100 }).map((_, i) => (
                          <div key={i} className={`w-[10%] h-[10%] ${Math.random() > 0.5 ? 'bg-white' : 'bg-slate-900'}`} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                    Scan this QR code with any UPI app or pay to <br />
                    <span className="font-bold text-slate-900 dark:text-white">{upiId}</span>
                  </p>

                  <button
                    onClick={handlePay}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
                  >
                    I've Paid via App
                  </button>
                </motion.div>
              )}

              {step === 'waiting' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12"
                >
                  <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Verifying Payment</h3>
                  <p className="text-slate-500 dark:text-slate-400">Please wait while we confirm your transaction...</p>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12"
                >
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-emerald-400 blur-2xl opacity-20 animate-pulse"></div>
                    <CheckCircle2 className="w-20 h-20 text-emerald-500 relative z-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment Successful!</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-8">Your subscription has been renewed successfully.</p>
                  <button
                    onClick={handleClose}
                    className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all"
                  >
                    Back to Dashboard
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
