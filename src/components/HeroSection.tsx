import React, { useState } from 'react';
import { 
  Search, 
  ArrowRight, 
  Play, 
  MapPin, 
  Home, 
  DollarSign, 
  Bed, 
  Bath, 
  ChevronDown 
} from 'lucide-react';
import { PropertyCategory, ListingType } from '../types';

interface HeroFilters {
  intent: ListingType | 'all';
  query: string;
  category: string;
  priceRange: string;
  beds: string;
  baths: string;
}

interface HeroSectionProps {
  onSearch: (filters: HeroFilters) => void;
  onOpenHowItWorks: () => void;
  onOpenValuation: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onOpenHowItWorks,
  onOpenValuation
}) => {
  const [intent, setIntent] = useState<ListingType | 'all'>('all');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [beds, setBeds] = useState<string>('all');
  const [baths, setBaths] = useState<string>('all');

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearch({
      intent,
      query: searchLocation,
      category: selectedCategory,
      priceRange,
      beds,
      baths
    });

    const el = document.getElementById('properties-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="hero" className="relative bg-gradient-to-b from-[#f1f5f9] via-[#eaf0f7] to-[#eaf0f7] pt-10 pb-20 lg:pt-16 lg:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Two-Column Grid: Text & Villa */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-5 z-10 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold text-[#08182b] tracking-tight leading-[1.08] font-display">
              Find Your <br />
              Perfect <span className="text-[#2563eb]">Home</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-md leading-relaxed font-normal">
              Discover exceptional properties and unlock the door to your dream home.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                id="hero-explore-btn"
                onClick={() => {
                  const el = document.getElementById('properties-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2.5 neu-btn-primary px-7 py-3.5 rounded-xl font-bold text-sm cursor-pointer"
              >
                <span>Explore Properties</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-how-it-works-btn"
                onClick={onOpenHowItWorks}
                className="inline-flex items-center gap-2.5 neu-extruded text-slate-800 px-6 py-3.5 rounded-xl font-bold text-sm cursor-pointer"
              >
                <span>How It Works</span>
                <Play className="w-3.5 h-3.5 text-blue-600 fill-blue-600 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Right Hero Image (Modern glass luxury villa with infinity pool at dusk) */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-3xl overflow-hidden neu-card p-2 aspect-[16/10]">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85"
                alt="Modern Luxury Villa Architecture with Pool"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>

        </div>

        {/* Beautiful Neumorphic Search & Filter Bar Section */}
        <div className="mt-12 lg:mt-16 relative z-20 w-full max-w-5xl mx-auto">
          
          {/* Neumorphic Tabs: All / Buy / Rent / Sell */}
          <div className="flex items-center gap-2.5 mb-3.5 ml-2 sm:ml-4">
            <button
              type="button"
              id="hero-tab-all"
              onClick={() => setIntent('all')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                intent === 'all'
                  ? 'neu-tab-active'
                  : 'neu-tab-inactive'
              }`}
            >
              All
            </button>
            <button
              type="button"
              id="hero-tab-buy"
              onClick={() => setIntent('sale')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                intent === 'sale'
                  ? 'neu-tab-active'
                  : 'neu-tab-inactive'
              }`}
            >
              Buy
            </button>
            <button
              type="button"
              id="hero-tab-rent"
              onClick={() => setIntent('rent')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                intent === 'rent'
                  ? 'neu-tab-active'
                  : 'neu-tab-inactive'
              }`}
            >
              Rent
            </button>
            <button
              type="button"
              id="hero-tab-sell"
              onClick={() => {
                onOpenValuation();
              }}
              className="neu-tab-inactive px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Sell
            </button>
          </div>

          {/* Main Neumorphic Search Card Container */}
          <div className="neu-card rounded-3xl p-5 sm:p-7 lg:p-8 relative">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              
              {/* Row 1, Col 1: LOCATION */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Location</span>
                </label>
                <div className="neu-inset rounded-2xl px-4 py-3 flex items-center gap-3">
                  <input
                    type="text"
                    id="hero-search-location"
                    placeholder="City, Neighborhood, or ZIP"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Row 1, Col 2: PROPERTY TYPE */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">
                  <Home className="w-3.5 h-3.5 text-blue-600" />
                  <span>Property Type</span>
                </label>
                <div className="neu-inset rounded-2xl px-4 py-3 flex items-center justify-between relative">
                  <select
                    id="hero-search-property-type"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-800 focus:outline-none bg-transparent cursor-pointer appearance-none pr-8"
                  >
                    <option value="all">Any Type</option>
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Plot">Plot</option>
                    <option value="Villa">Villa</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-600 absolute right-4 pointer-events-none" />
                </div>
              </div>

              {/* Row 2, Col 1: PRICE RANGE */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">
                  <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                  <span>Price Range</span>
                </label>
                <div className="neu-inset rounded-2xl px-4 py-3 flex items-center justify-between relative">
                  <select
                    id="hero-search-price-range"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-800 focus:outline-none bg-transparent cursor-pointer appearance-none pr-8"
                  >
                    <option value="all">$Min - $Max</option>
                    <option value="under500k">Under $500,000</option>
                    <option value="500k-1m">$500,000 - $1,000,000</option>
                    <option value="1m-2m">$1,000,000 - $2,000,000</option>
                    <option value="over2m">$2,000,000+</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-600 absolute right-4 pointer-events-none" />
                </div>
              </div>

              {/* Row 2, Col 2: BEDS */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">
                  <Bed className="w-3.5 h-3.5 text-blue-600" />
                  <span>Beds</span>
                </label>
                <div className="neu-inset rounded-2xl px-4 py-3 flex items-center justify-between relative">
                  <select
                    id="hero-search-beds"
                    value={beds}
                    onChange={(e) => setBeds(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-800 focus:outline-none bg-transparent cursor-pointer appearance-none pr-8"
                  >
                    <option value="all">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-600 absolute right-4 pointer-events-none" />
                </div>
              </div>

              {/* Row 3, Col 1: BATHS */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest pl-1">
                  <Bath className="w-3.5 h-3.5 text-blue-600" />
                  <span>Baths</span>
                </label>
                <div className="neu-inset rounded-2xl px-4 py-3 flex items-center justify-between relative">
                  <select
                    id="hero-search-baths"
                    value={baths}
                    onChange={(e) => setBaths(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-800 focus:outline-none bg-transparent cursor-pointer appearance-none pr-8"
                  >
                    <option value="all">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-600 absolute right-4 pointer-events-none" />
                </div>
              </div>

              {/* Row 3, Col 2: SEARCH PROPERTIES BUTTON */}
              <div className="space-y-2 flex flex-col justify-end">
                <label className="hidden md:block text-[11px] font-extrabold text-transparent uppercase tracking-widest select-none">
                  Action
                </label>
                <button
                  type="submit"
                  id="hero-search-submit-btn"
                  className="w-full neu-btn-primary py-3.5 px-6 rounded-2xl text-sm font-bold flex items-center justify-center gap-2.5 cursor-pointer h-[46px]"
                >
                  <span>Search Properties</span>
                  <Search className="w-4 h-4 text-blue-300" />
                </button>
              </div>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
