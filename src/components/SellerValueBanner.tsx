import React from 'react';
import { ArrowRight, TrendingUp, Home } from 'lucide-react';

interface SellerValueBannerProps {
  onOpenValuation: () => void;
}

export const SellerValueBanner: React.FC<SellerValueBannerProps> = ({ onOpenValuation }) => {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#08182b] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 items-center">
          
          {/* Left Text & CTA */}
          <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 space-y-5">
            <span className="text-xs font-bold tracking-wider uppercase text-blue-400 block font-display">
              Thinking of Selling?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-display">
              Get Maximum Value for Your Property
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-md">
              Our expert agents help you sell faster and for the best possible price.
            </p>
            <div className="pt-2">
              <button
                id="seller-banner-valuation-btn"
                onClick={onOpenValuation}
                className="inline-flex items-center gap-2.5 bg-white hover:bg-slate-50 text-[#0b192c] px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-98"
              >
                <span>Get Free Home Valuation</span>
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </div>

          {/* Right Visual with Valuation Card Overlay */}
          <div className="lg:col-span-6 relative h-72 sm:h-96 lg:h-full min-h-[340px]">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85"
              alt="Modern Luxury Living Room Interior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/25" />

            {/* Floating Value Estimate Card matching design image */}
            <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-8 sm:bottom-8 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/60 max-w-xs animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Home Value Estimate
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xl font-extrabold text-slate-900 font-display">$875,000</span>
                    <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      <TrendingUp className="w-3 h-3 mr-0.5" /> +12.5%
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Based on market trends
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
