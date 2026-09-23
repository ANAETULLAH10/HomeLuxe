import React, { useState } from 'react';
import { Property } from '../types';
import { Bed, Bath, Square, Heart, MapPin, Edit3, Trash2, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  onBookViewing: (property: Property) => void;
  onEdit?: (property: Property) => void;
  onDelete?: (propertyId: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (propertyId: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onBookViewing,
  onEdit,
  onDelete,
  isFavorite,
  onToggleFavorite
}) => {
  const { user } = useAuth();
  const { isFavorite: checkIsFavorite, toggleFavorite } = useFavorites();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isFav = isFavorite !== undefined ? isFavorite : checkIsFavorite(property.id);

  // Check if current user is the owner/seller
  const isOwner = user && (user.uid === property.sellerId || property.sellerId === 'demo');

  const formatPrice = (price: number, type: 'sale' | 'rent') => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);

    return type === 'rent' ? `${formatted} /mo` : formatted;
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(property.id);
    } else {
      toggleFavorite(property.id);
    }
  };

  return (
    <div 
      id={`property-card-${property.id}`}
      onClick={() => onSelect(property)}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
    >
      {/* Property Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={property.imageUrl}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Fallback image if broken
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Status Badge - Exactly matching reference image */}
        <div className="absolute top-3 left-3">
          <span 
            className={`px-2.5 py-1 rounded text-[11px] font-bold tracking-wider uppercase shadow-xs ${
              property.type === 'sale' 
                ? 'bg-[#1d4ed8] text-white' 
                : 'bg-[#16a34a] text-white'
            }`}
          >
            {property.type === 'sale' ? 'FOR SALE' : 'FOR RENT'}
          </span>
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={handleHeartClick}
          aria-label={isFav ? "Remove from favorites" : "Save to favorites"}
          title={isFav ? "Remove from favorites" : "Save to favorites"}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-xs flex items-center justify-center transition-all duration-200 shadow-sm cursor-pointer active:scale-90 ${
            isFav 
              ? 'bg-white text-rose-600 ring-2 ring-rose-100 hover:bg-rose-50' 
              : 'bg-white/85 hover:bg-white text-slate-700 hover:text-rose-600'
          }`}
        >
          <Heart 
            className={`w-4 h-4 transition-transform duration-200 ${
              isFav ? 'text-rose-600 fill-rose-600 scale-110' : 'text-slate-700'
            }`} 
          />
        </button>
      </div>

      {/* Property Details - Clean layout matching reference image */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Price */}
          <div className="text-[21px] font-extrabold text-[#08182b] tracking-tight font-display flex items-baseline gap-1">
            <span>{property.type === 'rent' ? `$${property.price.toLocaleString()}` : `$${property.price.toLocaleString()}`}</span>
            {property.type === 'rent' && (
              <span className="text-xs font-semibold text-slate-500 font-sans">/mo</span>
            )}
          </div>

          {/* Title / Main Street Address */}
          <h3 className="text-[15px] font-bold text-slate-900 mt-1 group-hover:text-blue-600 transition-colors line-clamp-1 font-display">
            {property.location.address || property.title}
          </h3>

          {/* City / State Location */}
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
            {property.location.city}, {property.location.stateZip}
          </p>

          {/* Specs: Beds, Baths, Sqft exactly styled as in mockup */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{property.beds} Beds</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{property.baths} Baths</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{property.sqft.toLocaleString()} Sq Ft</span>
            </div>
          </div>
        </div>

        {/* Hover / Owner bar */}
        <div className="mt-3 pt-2 flex items-center justify-between gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookViewing(property);
            }}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer py-0.5"
          >
            <span>Book Tour</span>
            <span className="text-sm">→</span>
          </button>

          {/* Owner Edit / Delete controls */}
          {isOwner && onEdit && onDelete && (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onEdit(property)}
                title="Edit listing"
                className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              {confirmDelete ? (
                <div className="flex items-center gap-1 bg-red-50 p-0.5 rounded">
                  <button
                    onClick={() => onDelete(property.id)}
                    className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.5 rounded"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="text-[10px] text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  title="Delete listing"
                  className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
