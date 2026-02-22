import { SignIn } from '@clerk/clerk-react';
import { motion } from 'motion/react';

export default function Login() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex justify-center"
      >
        <SignIn 
          routing="path" 
          path="/login" 
          signUpUrl="/register"
          afterSignInUrl="/app/dashboard"
          appearance={{
            elements: {
              formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-sm font-bold rounded-xl',
              card: 'shadow-xl border border-slate-100 rounded-3xl',
              headerTitle: 'text-slate-900 font-extrabold',
              headerSubtitle: 'text-slate-600',
            }
          }}
        />
      </motion.div>
    </div>
  );
}
