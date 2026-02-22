import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService, isSupabaseConfigured } from '../services/apiService';
import { supabase } from '../lib/supabase';
import { useUser } from '@clerk/clerk-react';

export type Subscription = {
  id: string;
  name: string;
  category: string;
  cost: number;
  billing: 'Monthly' | 'Annual';
  nextRenewal: string;
  status: 'Active' | 'Paused';
  startDate: string;
  paymentMethod?: 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking';
  upiId?: string;
  reminderDays?: number;
};

type AppContextType = {
  subscriptions: Subscription[];
  addSubscription: (sub: Omit<Subscription, 'id'>) => Promise<void>;
  updateSubscription: (id: string, sub: Partial<Subscription>) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  user: { name: string; email: string; plan: string };
  updateUser: (data: Partial<{ name: string; email: string }>) => Promise<void>;
  currency: { code: string; symbol: string };
  updateCurrency: (code: string, symbol: string) => void;
  isAddModalOpen: boolean;
  setAddModalOpen: (open: boolean) => void;
  isLoading: boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [user, setUser] = useState({ name: 'User', email: '', plan: 'Free Plan' });
  const [currency, setCurrency] = useState({ code: 'INR', symbol: '₹' });
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isClerkLoaded && clerkUser) {
      setUser({
        name: clerkUser.fullName || clerkUser.firstName || 'User',
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        plan: 'Free Plan'
      });
    }
  }, [clerkUser, isClerkLoaded]);

  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true);
      try {
        // Load theme
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
        if (savedTheme) {
          setTheme(savedTheme);
          if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }

        // Load currency
        const savedCurrency = localStorage.getItem('currency');
        if (savedCurrency) {
          setCurrency(JSON.parse(savedCurrency));
        }

        // Fetch user profile
        try {
          const profile = await apiService.user.getProfile();
          if (profile.email && profile.name !== 'Guest') {
            setUser(prev => ({ ...prev, ...profile }));
          }
        } catch (e) {
          console.warn('Supabase profile fetch failed');
        }

        // Fetch subscriptions
        const subs = await apiService.subscriptions.getAll();
        setSubscriptions(subs);

        // Set up Realtime listener
        if (isSupabaseConfigured) {
          const channel = supabase
            .channel('schema-db-changes')
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'subscriptions',
              },
              (payload) => {
                if (payload.eventType === 'INSERT') {
                  setSubscriptions((prev) => [...prev, payload.new as Subscription]);
                } else if (payload.eventType === 'UPDATE') {
                  setSubscriptions((prev) =>
                    prev.map((sub) => (sub.id === payload.new.id ? (payload.new as Subscription) : sub))
                  );
                } else if (payload.eventType === 'DELETE') {
                  setSubscriptions((prev) => prev.filter((sub) => sub.id !== payload.old.id));
                }
              }
            )
            .subscribe();

          return () => {
            supabase.removeChannel(channel);
          };
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const cleanup = initApp();
    return () => {
      cleanup.then(fn => fn?.());
    };
  }, [isClerkLoaded, clerkUser]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const updateCurrency = (code: string, symbol: string) => {
    const newCurrency = { code, symbol };
    setCurrency(newCurrency);
    localStorage.setItem('currency', JSON.stringify(newCurrency));
  };

  const addSubscription = async (sub: Omit<Subscription, 'id'>) => {
    setIsLoading(true);
    try {
      const userId = clerkUser?.id || 'anonymous';
      const newSub = await apiService.subscriptions.create(sub, userId);
      const updated = [...subscriptions, newSub];
      setSubscriptions(updated);
      localStorage.setItem('subscriptions', JSON.stringify(updated));
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubscription = async (id: string, updatedFields: Partial<Subscription>) => {
    setIsLoading(true);
    try {
      const userId = clerkUser?.id || 'anonymous';
      await apiService.subscriptions.update(id, updatedFields, userId);
      const updated = subscriptions.map(sub => sub.id === id ? { ...sub, ...updatedFields } : sub);
      setSubscriptions(updated);
      localStorage.setItem('subscriptions', JSON.stringify(updated));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSubscription = async (id: string) => {
    setIsLoading(true);
    try {
      const userId = clerkUser?.id || 'anonymous';
      await apiService.subscriptions.delete(id, userId);
      const updated = subscriptions.filter(sub => sub.id !== id);
      setSubscriptions(updated);
      localStorage.setItem('subscriptions', JSON.stringify(updated));
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (data: Partial<{ name: string; email: string }>) => {
    setIsLoading(true);
    try {
      await apiService.user.updateProfile(data);
      setUser({ ...user, ...data });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{ 
      subscriptions, 
      addSubscription, 
      updateSubscription, 
      deleteSubscription, 
      theme, 
      toggleTheme, 
      user, 
      updateUser,
      currency,
      updateCurrency,
      isAddModalOpen,
      setAddModalOpen,
      isLoading
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
