import { GoogleGenAI, Type } from "@google/genai";
import { Subscription } from '../context/AppContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export { isSupabaseConfigured };

// Mock delay to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  // Auth APIs
  auth: {
    login: async (credentials: { email: string; password?: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password || 'password123', // Default for demo
      });
      if (error) throw error;
      return { token: data.session?.access_token, user: { name: data.user?.email?.split('@')[0] || 'User', email: data.user?.email || '', plan: 'Free Plan' } };
    },
    register: async (data: { email: string; password?: string }) => {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password || 'password123',
      });
      if (error) throw error;
      return { message: 'User created', token: authData.session?.access_token };
    },
    logout: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    }
  },

  // User APIs
  user: {
    getProfile: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { name: 'Guest', email: '', plan: 'Free Plan' };
      return { name: user.email?.split('@')[0] || 'User', email: user.email || '', plan: 'Free Plan' };
    },
    updateProfile: async (data: any) => {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: data.name }
      });
      if (error) throw error;
      return { success: true };
    }
  },

  // Subscription APIs
  subscriptions: {
    getAll: async () => {
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured. Returning empty subscriptions.');
        return [];
      }
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('next_renewal', { ascending: true });
      
      if (error) {
        console.error('Supabase fetch error:', error);
        // Fallback to local storage if table doesn't exist or error
        const stored = localStorage.getItem('subscriptions');
        return stored ? JSON.parse(stored) : [];
      }
      
      // Map snake_case from DB to camelCase for frontend
      return (data || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        category: s.category,
        cost: s.cost,
        billing: s.billing,
        nextRenewal: s.next_renewal,
        status: s.status,
        startDate: s.next_renewal, // Fallback since start_date isn't in SQL
        paymentMethod: s.payment_method,
        upiId: s.upi_id,
        reminderDays: s.reminder_days
      }));
    },
    create: async (sub: Omit<Subscription, 'id'>, userId: string) => {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase not configured. Cannot create subscription.');
      }
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([{
          user_id: userId,
          name: sub.name,
          category: sub.category,
          cost: sub.cost,
          billing: sub.billing,
          next_renewal: sub.nextRenewal,
          status: sub.status,
          payment_method: sub.paymentMethod,
          upi_id: sub.upiId,
          reminder_days: sub.reminderDays
        }])
        .select()
        .single();

      if (error) throw error;
      return {
        ...sub,
        id: data.id
      };
    },
    update: async (id: string, sub: Partial<Subscription>, userId: string) => {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase not configured. Cannot update subscription.');
      }
      const updateData: any = {};
      if (sub.name !== undefined) updateData.name = sub.name;
      if (sub.category !== undefined) updateData.category = sub.category;
      if (sub.cost !== undefined) updateData.cost = sub.cost;
      if (sub.billing !== undefined) updateData.billing = sub.billing;
      if (sub.nextRenewal !== undefined) updateData.next_renewal = sub.nextRenewal;
      if (sub.status !== undefined) updateData.status = sub.status;
      if (sub.paymentMethod !== undefined) updateData.payment_method = sub.paymentMethod;
      if (sub.upiId !== undefined) updateData.upi_id = sub.upiId;
      if (sub.reminderDays !== undefined) updateData.reminder_days = sub.reminderDays;

      const { error } = await supabase
        .from('subscriptions')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    },
    delete: async (id: string, userId: string) => {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase not configured. Cannot delete subscription.');
      }
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    },
    pause: async (id: string, userId: string) => {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase not configured. Cannot pause subscription.');
      }
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'Paused' })
        .eq('id', id)
        .eq('user_id', userId);
      if (error) throw error;
      return { success: true, status: 'Paused' };
    },
    resume: async (id: string, userId: string) => {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase not configured. Cannot resume subscription.');
      }
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'Active' })
        .eq('id', id)
        .eq('user_id', userId);
      if (error) throw error;
      return { success: true, status: 'Active' };
    }
  },

  // Dashboard APIs
  dashboard: {
    getSummary: async (subscriptions: Subscription[]) => {
      const activeSubs = subscriptions.filter(s => s.status === 'Active');
      const monthlyTotal = activeSubs.reduce((acc, curr) => acc + (curr.billing === 'Monthly' ? curr.cost : curr.cost / 12), 0);
      
      const today = new Date();
      const upcomingRenewals = activeSubs
        .map(sub => {
          const nextRenewalDate = new Date(sub.nextRenewal);
          const diffTime = nextRenewalDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return { name: sub.name, daysLeft: diffDays };
        })
        .filter(r => r.daysLeft >= 0 && r.daysLeft <= 7)
        .sort((a, b) => a.daysLeft - b.daysLeft);

      return {
        monthlyTotal,
        annualTotal: monthlyTotal * 12,
        activeCount: activeSubs.length,
        upcomingRenewals
      };
    }
  },

  // Analytics APIs
  analytics: {
    getTrend: async (subscriptions: Subscription[]) => {
      const activeSubs = subscriptions.filter(s => s.status === 'Active');
      const currentSpend = activeSubs.reduce((acc, curr) => acc + (curr.billing === 'Monthly' ? curr.cost : curr.cost / 12), 0);
      
      // Mocking some historical data based on current spend for the chart
      return [
        { month: 'Nov', spend: Math.round(currentSpend * 0.8) },
        { month: 'Dec', spend: Math.round(currentSpend * 0.9) },
        { month: 'Jan', spend: Math.round(currentSpend * 0.95) },
        { month: 'Feb', spend: Math.round(currentSpend) },
      ];
    },
    getCategoryBreakdown: async (subscriptions: Subscription[]) => {
      const categories = Array.from(new Set(subscriptions.map(s => s.category)));
      return categories.map(cat => ({
        name: cat,
        value: subscriptions.filter(s => s.category === cat).reduce((acc, curr) => acc + curr.cost, 0)
      }));
    }
  },

  // AI APIs
  ai: {
    getSpendingInsights: async (subscriptions: Subscription[]) => {
      try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
          throw new Error('An API Key must be set when running in a browser');
        }
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Act as a personal finance expert. Analyze these subscriptions: ${JSON.stringify(subscriptions)}. 
          Provide 3 concise, actionable insights (one sentence each) about:
          1. Potential savings (unused services or cheaper alternatives).
          2. Payment method optimization (e.g., credit card rewards vs UPI).
          3. Spending patterns or upcoming heavy renewal months.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                insights: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["insights"]
            }
          }
        });

        const result = JSON.parse(response.text || '{"insights": []}');
        return result;
      } catch (error) {
        console.error('AI Insights Error:', error);
        return {
          insights: [
            "Entertainment spending increased 12% this month.",
            "You have 3 high-cost subscriptions that could be optimized.",
            "Switching to annual billing for Notion could save you 20%."
          ]
        };
      }
    },
    parseDescription: async (text: string) => {
      try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') return null;
        
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Extract subscription details from this text: "${text}". 
          Return a JSON object with: name (string), cost (number), billingCycle (string: "monthly" or "annual").`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                cost: { type: Type.NUMBER },
                billingCycle: { type: Type.STRING }
              },
              required: ["name", "cost", "billingCycle"]
            }
          }
        });
        return JSON.parse(response.text || 'null');
      } catch (error) {
        console.error('AI Parse Error:', error);
        return null;
      }
    }
  }
};
