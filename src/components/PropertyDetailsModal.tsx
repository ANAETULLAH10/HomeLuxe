import React, { useState } from 'react';
import { Property } from '../types';
import { 
  X, 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  Calendar, 
  Check, 
  Phone, 
  Mail, 
  Share2, 
  Calculator,
  ShieldCheck,
  Edit3,
  Trash2,
  Heart,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { ContactAgentModal } from './ContactAgentModal';

interface PropertyDetailsModalProps {
  property: Property | null;
  onClose: () => void;
  onBookViewing: (property: Property) => void;
  onContactAgent?: (property: Property) => void;
  onEdit?: (property: Property) => void;
  onDelete?: (propertyId: string) => void;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  property,
  onClose,
  onBookViewing,
  onContactAgent,
  onEdit,
  onDelete
}) => {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const isFav = property ? isFavorite(property.id) : false;

  React.useEffect(() => {
    if (property) {
      setSelectedImage(property.imageUrl);
    }
  }, [property]);

  if (!property) return null;

  const isOwner = user && (user.uid === property.sellerId || property.sellerId === 'demo');

  const allImages = [property.imageUrl, ...(property.additionalImages || [])];

  const formatPrice = (price: number, type: 'sale' | 'rent') => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
    return type === 'rent' ? `${formatted} /mo` : formatted;
  };

  // Simple Mortgage calculation
  const principal = property.price * (1 - downPaymentPercent / 100);
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = 30 * 12;
  const monthlyMortgage = property.type === 'sale'
    ? (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    : property.price;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full my-auto shadow-2xl border border-slate-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Close and Share */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
              property.type === 'sale' ? 'bg-[#0c2340] text-white' : 'bg-emerald-600 text-white'
            }`}>
              {property.type === 'sale' ? 'FOR SALE' : 'FOR RENT'}
            </span>
            <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-md text-xs font-semibold">
              {property.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onContactAgent) {
                  onContactAgent(property);
                } else {
                  setIsContactModalOpen(true);
                }
              }}
              className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 ring-1 ring-blue-200/80 transition-all cursor-pointer text-xs font-bold flex items-center gap-1.5 shadow-2xs"
              title="Contact Listing Agent"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
              <span>Contact Agent</span>
            </button>

            <button
              onClick={() => property && toggleFavorite(property.id)}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer text-xs font-semibold flex items-center gap-1.5 ${
                isFav 
                  ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 ring-1 ring-rose-200' 
                  : 'text-slate-600 hover:text-rose-600 hover:bg-slate-100'
              }`}
              title={isFav ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart className={`w-4 h-4 transition-transform active:scale-90 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isFav ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-xs font-medium flex items-center gap-1.5"
              title="Share property link"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copied ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="max-h-[80vh] overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Main Photo & Thumbnails */}
          <div className="space-y-3">
            <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 shadow-xs border border-slate-200">
              <img
                src={selectedImage || property.imageUrl}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImage === img ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title, Price, Location */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b192c] tracking-tight font-display">
                {property.title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{property.location.address}, {property.location.city}, {property.location.stateZip}</span>
              </div>
            </div>

            <div className="sm:text-right">
              <div className="text-3xl font-extrabold text-[#0b192c] font-display">
                {formatPrice(property.price, property.type)}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {property.type === 'sale' 
                  ? `$${Math.round(property.price / (property.sqft || 1)).toLocaleString()} / sq ft`
                  : 'Includes all maintenance fees'}
              </p>
            </div>
          </div>

          {/* Key Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {property.category === 'Plot' ? (
              <>
                <div className="flex items-center gap-2.5">
                  <Square className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 font-bold">Total Area</p>
                    <p className="text-sm font-bold text-slate-900">{property.sqft.toLocaleString()} Sq Ft</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 font-bold">Acreage</p>
                    <p className="text-sm font-bold text-slate-900">{(property.sqft / 43560).toFixed(2)} Acres</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 font-bold">Title Status</p>
                    <p className="text-sm font-bold text-slate-900">Clear & Insured</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 font-bold">Zoning</p>
                    <p className="text-sm font-bold text-slate-900">Residential Ready</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2.5">
                  <Bed className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 font-bold">Bedrooms</p>
                    <p className="text-sm font-bold text-slate-900">{property.beds} Beds</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Bath className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 font-bold">Bathrooms</p>
                    <p className="text-sm font-bold text-slate-900">{property.baths} Baths</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Square className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 font-bold">Living Space</p>
                    <p className="text-sm font-bold text-slate-900">{property.sqft.toLocaleString()} Sq Ft</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 font-bold">Year Built</p>
                    <p className="text-sm font-bold text-slate-900">2023</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2">
              Property Description
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Amenities & Highlights */}
          {property.amenities && property.amenities.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-3">
                Key Features & Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {property.amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mortgage / Monthly Cost Estimator */}
          {property.type === 'sale' && (
            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-700" />
                  <h2 className="text-sm font-bold text-slate-900">Estimated Monthly Payment</h2>
                </div>
                <span className="text-xl font-extrabold text-blue-800">
                  ${Math.round(monthlyMortgage).toLocaleString()} <span className="text-xs font-normal text-slate-500">/mo</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1 text-slate-600">
                    <span>Down Payment ({downPaymentPercent}%)</span>
                    <span className="font-bold">${((property.price * downPaymentPercent) / 100).toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full accent-blue-700"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-slate-600">
                    <span>Interest Rate</span>
                    <span className="font-bold">{interestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    step="0.25"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full accent-blue-700"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Seller / Agent Contact Card */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#0c2340] text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                {property.sellerName.charAt(0)}
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Listing Agent / Seller</p>
                <h3 className="text-base font-bold text-slate-900">{property.sellerName}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-blue-600" /> {property.sellerPhone || '(800) 123-4567'}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-blue-600" /> {property.sellerEmail}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full lg:w-auto">
              <button
                type="button"
                onClick={() => {
                  if (onContactAgent) {
                    onContactAgent(property);
                  } else {
                    setIsContactModalOpen(true);
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
              >
                <MessageSquare className="w-4 h-4 text-blue-100" />
                <span>Contact Agent</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBookViewing(property);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0c2340] hover:bg-[#16355d] active:scale-95 text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer shrink-0"
              >
                <Calendar className="w-4 h-4 text-blue-300" />
                <span>Book Property Viewing</span>
              </button>
            </div>
          </div>

          {/* Owner Actions */}
          {isOwner && onEdit && onDelete && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">You are the seller of this listing</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onEdit(property);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Listing</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this property listing?')) {
                      onDelete(property.id);
                      onClose();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Listing</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Contact Agent Modal with Pre-filled message */}
      <ContactAgentModal
        property={property}
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};
