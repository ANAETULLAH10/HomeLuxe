import React, { useState } from 'react';
import { X, Calculator, TrendingUp, Home, CheckCircle2, ArrowRight } from 'lucide-react';
import { PropertyCategory } from '../types';

interface HomeValuationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListProperty?: () => void;
}

export const HomeValuationModal: React.FC<HomeValuationModalProps> = ({
  isOpen,
  onClose,
  onListProperty
}) => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Beverly Hills');
  const [propertyType, setPropertyType] = useState<PropertyCategory>('House');
  const [sqft, setSqft] = useState('2400');
  const [condition, setCondition] = useState<'Excellent' | 'Good' | 'Fair'>('Excellent');
  const [valuationResult, setValuationResult] = useState<{
    estimate: number;
    rangeLow: number;
    rangeHigh: number;
    growth: string;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  if (!isOpen) return null;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    setTimeout(() => {
      const numSqft = parseInt(sqft, 10) || 2000;
      let baseRate = 350;
      if (propertyType === 'House') baseRate = 420;
      if (propertyType === 'Apartment') baseRate = 380;
      if (propertyType === 'Plot') baseRate = 75;

      const conditionMultiplier = condition === 'Excellent' ? 1.2 : condition === 'Good' ? 1.05 : 0.9;
      const estimate = Math.round(numSqft * baseRate * conditionMultiplier);
      const rangeLow = Math.round(estimate * 0.94);
      const rangeHigh = Math.round(estimate * 1.07);

      setValuationResult({
        estimate,
        rangeLow,
        rangeHigh,
        growth: '+12.5%'
      });
      setIsCalculating(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full my-auto shadow-2xl border border-slate-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Instant Home Valuation
              </h3>
              <p className="text-xs text-slate-500">
                Real-time automated property estimate based on current market trends.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto space-y-5">
          {valuationResult ? (
            <div className="space-y-5 animate-in fade-in">
              <div className="bg-[#0c2340] rounded-2xl p-6 text-white text-center shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
                  <Home className="w-4 h-4" />
                  <span>Estimated Market Value</span>
                </div>
                <div className="text-4xl font-extrabold tracking-tight">
                  ${valuationResult.estimate.toLocaleString()}
                </div>
                <div className="inline-flex items-center gap-1.5 mt-2 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{valuationResult.growth} projected annual growth</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-700/60 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Conservative Range</span>
                    <span className="font-bold text-white text-sm">${valuationResult.rangeLow.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Optimistic Range</span>
                    <span className="font-bold text-white text-sm">${valuationResult.rangeHigh.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Next Step: Ready to capitalize on this valuation?</span>
                </div>
                <p>
                  List your property directly on HomeLuxe to reach thousands of active buyers, or connect with a dedicated listing specialist.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                {onListProperty && (
                  <button
                    onClick={() => {
                      onClose();
                      onListProperty();
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0c2340] hover:bg-[#16355d] text-white py-3 rounded-xl text-xs font-bold transition-all shadow cursor-pointer"
                  >
                    <span>List This Property Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setValuationResult(null)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Recalculate
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCalculate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Property Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 123 Maple Drive"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    City / Neighborhood *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyCategory)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white cursor-pointer"
                  >
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Plot">Plot / Land</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Square Footage
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={sqft}
                    onChange={(e) => setSqft(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Overall Condition
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm cursor-pointer"
                  >
                    <option value="Excellent">Excellent / Luxury</option>
                    <option value="Good">Good / Standard</option>
                    <option value="Fair">Fair / Needs Work</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isCalculating}
                className="w-full mt-2 bg-[#0c2340] hover:bg-[#16355d] text-white py-3.5 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {isCalculating ? 'Analyzing Market Comps...' : 'Calculate Home Estimate'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
