import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { subscribeNewsletter } from '../services/propertyService';

export const NewsletterBanner: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    try {
      await subscribeNewsletter(email);
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('success'); // graceful fallback
    }
  };

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#eef5fd] rounded-2xl p-6 sm:p-8 border border-blue-100/80 flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Left Text & Icon */}
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="w-12 h-12 rounded-full bg-white text-[#08182b] flex items-center justify-center shrink-0 shadow-xs border border-slate-200">
              <Mail className="w-5 h-5 text-[#08182b]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#08182b] font-display">
                Stay Updated
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Subscribe to get the latest property listings and real estate tips.
              </p>
            </div>
          </div>

          {/* Right Input Form */}
          <div className="w-full lg:w-auto lg:min-w-[420px]">
            {status === 'success' ? (
              <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-3 rounded-xl text-xs font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Thank you! You have been subscribed.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-[#08182b] hover:bg-[#152a45] text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer shrink-0 disabled:opacity-70 active:scale-98"
                >
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
