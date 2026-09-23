import React from 'react';
import { X, Search, Calendar, Key, CheckCircle, ArrowRight } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExplore: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose, onExplore }) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: '01',
      icon: Search,
      title: 'Browse & Filter Verified Listings',
      desc: 'Filter luxury houses, penthouses, modern apartments, and premium plots by price, location, bedrooms, and amenities with zero hassle.'
    },
    {
      num: '02',
      icon: Calendar,
      title: 'Schedule a Tour in 60 Seconds',
      desc: 'Choose between an in-person walkthrough or live video tour with a dedicated agent at the exact time slot that suits your schedule.'
    },
    {
      num: '03',
      icon: Key,
      title: 'Close & Secure Your Dream Property',
      desc: 'Get transparent guidance, verified paperwork, market valuation comparables, and end-to-end support until you receive the keys.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full my-auto shadow-2xl border border-slate-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">
              How HomeLuxe Works
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-11 h-11 rounded-xl bg-[#0c2340] text-white flex items-center justify-center shrink-0 font-extrabold text-sm shadow-xs">
                    <Icon className="w-5 h-5 text-blue-200" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-blue-700 tracking-wider">
                      STEP {step.num}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              onClose();
              onExplore();
            }}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#0c2340] hover:bg-[#16355d] text-white py-3.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
          >
            <span>Start Exploring Properties</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
