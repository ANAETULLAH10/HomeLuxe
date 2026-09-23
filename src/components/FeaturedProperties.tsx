import React, { useState, useMemo } from 'react';
import { Property, PropertyCategory, ListingType } from '../types';
import { PropertyCard } from './PropertyCard';
import { useFavorites } from '../context/FavoritesContext';
import { ArrowRight, ChevronLeft, ChevronRight, SlidersHorizontal, Check } from 'lucide-react';

interface FeaturedPropertiesProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onBookViewing: (property: Property) => void;
  onEditProperty?: (property: Property) => void;
  onDeleteProperty?: (propertyId: string) => void;
  selectedTypeFilter?: ListingType | 'all';
  selectedCategoryFilter?: PropertyCategory | 'all';
  searchQuery?: string;
  onResetFilters?: () => void;
}

export const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({
  properties,
  onSelectProperty,
  onBookViewing,
  onEditProperty,
  onDeleteProperty,
  selectedTypeFilter = 'all',
  selectedCategoryFilter = 'all',
  searchQuery = '',
  onResetFilters
}) => {
  const [activeCategory, setActiveCategory] = useState<PropertyCategory | 'all'>(selectedCategoryFilter);
  const [activeType, setActiveType] = useState<ListingType | 'all'>(selectedTypeFilter);
  const { isFavorite, toggleFavorite } = useFavorites();

  // Sync state if props change
  React.useEffect(() => {
    setActiveCategory(selectedCategoryFilter);
  }, [selectedCategoryFilter]);

  React.useEffect(() => {
    setActiveType(selectedTypeFilter);
  }, [selectedTypeFilter]);

  const categories: Array<{ label: string; value: PropertyCategory | 'all' }> = [
    { label: 'All Properties', value: 'all' },
    { label: 'Houses', value: 'House' },
    { label: 'Apartments', value: 'Apartment' },
    { label: 'Plots & Land', value: 'Plot' }
  ];

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Category filter
      if (activeCategory !== 'all' && prop.category !== activeCategory) {
        return false;
      }
      // Type filter (sale or rent)
      if (activeType !== 'all' && prop.type !== activeType) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = prop.title.toLowerCase().includes(q);
        const matchCity = prop.location.city.toLowerCase().includes(q);
        const matchAddress = prop.location.address.toLowerCase().includes(q);
        const matchZip = prop.location.stateZip.toLowerCase().includes(q);
        if (!matchTitle && !matchCity && !matchAddress && !matchZip) {
          return false;
        }
      }
      return true;
    });
  }, [properties, activeCategory, activeType, searchQuery]);

  return (
    <section id="properties-section" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header - Exactly matching reference image */}
        <div className="flex items-center justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-[#2563eb] block mb-1 font-display">
              FEATURED PROPERTIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#08182b] tracking-tight font-display">
              Homes You'll Love
            </h2>
          </div>

          {/* Right Action: View All Properties */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveType('all');
                if (onResetFilters) onResetFilters();
              }}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#2563eb] hover:text-blue-800 transition-colors cursor-pointer group"
            >
              <span>View All Properties ({properties.length})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Category & Type Filter Bar with live counts */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const count = cat.value === 'all' 
                ? properties.length 
                : properties.filter(p => p.category === cat.value).length;
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => {
                    setActiveCategory(cat.value);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#08182b] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sale / Rent Filter Toggle */}
          <div className="inline-flex items-center bg-white p-1 rounded-lg border border-slate-200/80 text-xs">
            <button
              onClick={() => setActiveType('all')}
              className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                activeType === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({properties.length})
            </button>
            <button
              onClick={() => setActiveType('sale')}
              className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                activeType === 'sale'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Sale ({properties.filter(p => p.type === 'sale').length})
            </button>
            <button
              onClick={() => setActiveType('rent')}
              className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                activeType === 'rent'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              For Rent ({properties.filter(p => p.type === 'rent').length})
            </button>
          </div>
        </div>

        {/* Search / Active Filter indicator */}
        {(activeCategory !== 'all' || activeType !== 'all' || searchQuery) && (
          <div className="flex items-center justify-between bg-blue-50/70 border border-blue-100 rounded-xl px-4 py-2.5 mb-6 text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-700" />
              <span>
                Showing <strong>{filteredProperties.length}</strong> matching properties
                {activeCategory !== 'all' ? ` in ${activeCategory}` : ''}
                {activeType !== 'all' ? ` for ${activeType}` : ''}
                {searchQuery ? ` matching "${searchQuery}"` : ''}
              </span>
            </div>
            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveType('all');
                if (onResetFilters) onResetFilters();
              }}
              className="text-xs font-bold text-blue-700 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Property Grid with floating next arrow matching design mockup */}
        {filteredProperties.length > 0 ? (
          <div className="relative">
            <div id="property-grid-container" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onSelect={onSelectProperty}
                  onBookViewing={onBookViewing}
                  onEdit={onEditProperty}
                  onDelete={onDeleteProperty}
                  isFavorite={isFavorite(property.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>

            {/* Floating Navigation Arrow Button as seen on the right edge of mockup */}
            <button
              onClick={() => {
                const el = document.getElementById('property-grid-container');
                if (el) {
                  el.scrollBy({ left: 300, behavior: 'smooth' });
                }
              }}
              aria-label="Next properties"
              className="hidden xl:flex absolute -right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-[#0b192c] hover:bg-slate-50 border border-slate-200/80 shadow-lg items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 z-20"
            >
              <ChevronRight className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No properties found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              We couldn't find any properties matching your selected filters. Try resetting the criteria or browsing all categories.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveType('all');
                if (onResetFilters) onResetFilters();
              }}
              className="px-5 py-2.5 bg-[#0c2340] text-white rounded-xl text-xs font-bold hover:bg-[#16355d] transition-colors cursor-pointer"
            >
              View All Properties
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
