import React, { useState } from 'react';
import { Property, ListingType } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import { 
  X, 
  Heart, 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  ArrowRight, 
  Trash2, 
  Calendar,
  Eye,
  Building2,
  Sparkles
} from 'lucide-react';

interface MyFavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onBookViewing: (property: Property) => void;
}

export const MyFavoritesModal: React.FC<MyFavoritesModalProps> = ({
  isOpen,
  onClose,
  properties,
  onSelectProperty,
  onBookViewing
}) => {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const [filterType, setFilterType] = useState<ListingType | 'all'>('all');

  if (!isOpen) return null;

  // Filter properties that match the favoriteIds
  const favoriteProperties = properties.filter((p) => favoriteIds.includes(p.id));

  // Filter by sale / rent
  const displayedProperties = favoriteProperties.filter((p) => {
    if (filterType === 'all') return true;
    return p.type === filterType;
  });

  const saleCount = favoriteProperties.filter((p) => p.type === 'sale').length;
  const rentCount = favoriteProperties.filter((p) => p.type === 'rent').length;

  // Total valuation calculation for for-sale properties
  const totalValuation = favoriteProperties
    .filter((p) => p.type === 'sale')
    .reduce((sum, p) => sum + p.price, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      id="favorites-modal-backdrop"
    >
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full my-auto shadow-2xl border border-slate-100 overflow-hidden relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        id="favorites-modal-dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-2xs">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display">
                  My Saved Favorites
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                  {favoriteProperties.length}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Quickly compare and manage your bookmarked luxury properties.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-bar / Filters when favorites exist */}
        {favoriteProperties.length > 0 && (
          <div className="px-5 sm:px-6 py-3 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-[#08182b] text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                All ({favoriteProperties.length})
              </button>
              {saleCount > 0 && (
                <button
                  onClick={() => setFilterType('sale')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                    filterType === 'sale'
                      ? 'bg-[#08182b] text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  For Sale ({saleCount})
                </button>
              )}
              {rentCount > 0 && (
                <button
                  onClick={() => setFilterType('rent')}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                    filterType === 'rent'
                      ? 'bg-[#08182b] text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  For Rent ({rentCount})
                </button>
              )}
            </div>

            {/* Total value highlight */}
            {totalValuation > 0 && (
              <div className="text-slate-600 font-medium">
                Saved For-Sale Value:{' '}
                <span className="font-extrabold text-[#08182b]">
                  {formatCurrency(totalValuation)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {displayedProperties.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-100">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1 font-display">
                {favoriteProperties.length === 0 ? 'No Saved Properties Yet' : 'No Properties in This Category'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
                {favoriteProperties.length === 0
                  ? 'Explore our curated listings and click the heart icon on any home or apartment to bookmark it here for easy access.'
                  : 'You do not have any saved listings in this category. Switch filters above to see your other saved homes.'}
              </p>
              <button
                onClick={() => {
                  onClose();
                  const el = document.getElementById('properties-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 bg-[#08182b] hover:bg-[#162a45] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
              >
                <span>Browse Available Homes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedProperties.map((property) => (
                <div
                  key={property.id}
                  className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Image & Badges */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={property.imageUrl}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            property.type === 'sale'
                              ? 'bg-[#1d4ed8] text-white'
                              : 'bg-[#16a34a] text-white'
                          }`}
                        >
                          {property.type === 'sale' ? 'FOR SALE' : 'FOR RENT'}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/90 backdrop-blur-xs text-slate-800">
                          {property.category}
                        </span>
                      </div>

                      {/* Remove Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(property.id);
                        }}
                        title="Remove from favorites"
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-rose-600 hover:text-rose-700 flex items-center justify-center shadow-xs transition-transform active:scale-90 cursor-pointer"
                      >
                        <Heart className="w-4 h-4 fill-rose-600 text-rose-600" />
                      </button>
                    </div>

                    {/* Body Info */}
                    <div className="p-4">
                      <div className="text-lg font-extrabold text-[#08182b] font-display">
                        ${property.price.toLocaleString()}
                        {property.type === 'rent' && (
                          <span className="text-xs font-normal text-slate-500 font-sans">/mo</span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1 mt-0.5">
                        {property.location.address || property.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{property.location.city}, {property.location.stateZip}</span>
                      </p>

                      {/* Specs */}
                      <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-slate-400" />
                          <span>{property.beds} Beds</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5 text-slate-400" />
                          <span>{property.baths} Baths</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Square className="w-3.5 h-3.5 text-slate-400" />
                          <span>{property.sqft.toLocaleString()} Sq Ft</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-3 bg-slate-50/60 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectProperty(property);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onBookViewing(property);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#08182b] hover:bg-[#162a45] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-blue-300" />
                      <span>Book Viewing</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Saved properties remain in your favorites across sessions.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
