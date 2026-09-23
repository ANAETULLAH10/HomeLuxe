import React, { useState, useEffect } from 'react';
import { Property, PropertyCategory, ListingType } from '../types';
import { useAuth } from '../context/AuthContext';
import { createPropertyListing, updatePropertyListing } from '../services/propertyService';
import { 
  X, 
  Upload, 
  Building2, 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Square, 
  Check, 
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';

interface AddEditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyToEdit?: Property | null;
  onSuccess?: (propertyId: string) => void;
}

const PRESET_IMAGES = [
  {
    name: 'Modern Glass Villa',
    category: 'House',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Contemporary Suburban Home',
    category: 'House',
    url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Luxury High-Rise Penthouse',
    category: 'Apartment',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Modern City Loft',
    category: 'Apartment',
    url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Scenic Mountain Valley Plot',
    category: 'Plot',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Greenfield Wooded Plot',
    category: 'Plot',
    url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'
  }
];

const AVAILABLE_AMENITIES = [
  'Private Pool',
  'Smart Home System',
  'Garage / EV Charger',
  'Gated Security',
  'Balcony / Terrace',
  'Garden & Patio',
  'Central AC',
  'Hardwood Floors',
  'Waterfront View',
  'High-Speed Fiber'
];

export const AddEditPropertyModal: React.FC<AddEditPropertyModalProps> = ({
  isOpen,
  onClose,
  propertyToEdit,
  onSuccess
}) => {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PropertyCategory>('House');
  const [type, setType] = useState<ListingType>('sale');
  const [price, setPrice] = useState<string>('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateZip, setStateZip] = useState('');
  const [beds, setBeds] = useState('3');
  const [baths, setBaths] = useState('2');
  const [sqft, setSqft] = useState('2200');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState<string[]>(['Smart Home System', 'Central AC']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propertyToEdit) {
      setTitle(propertyToEdit.title);
      setCategory(propertyToEdit.category);
      setType(propertyToEdit.type);
      setPrice(propertyToEdit.price.toString());
      setAddress(propertyToEdit.location.address);
      setCity(propertyToEdit.location.city);
      setStateZip(propertyToEdit.location.stateZip);
      setBeds(propertyToEdit.beds.toString());
      setBaths(propertyToEdit.baths.toString());
      setSqft(propertyToEdit.sqft.toString());
      setImageUrl(propertyToEdit.imageUrl);
      setDescription(propertyToEdit.description);
      setAmenities(propertyToEdit.amenities || []);
    } else {
      // Reset form
      setTitle('');
      setCategory('House');
      setType('sale');
      setPrice('750000');
      setAddress('');
      setCity('');
      setStateZip('CA 90210');
      setBeds('3');
      setBaths('2');
      setSqft('2200');
      setImageUrl(PRESET_IMAGES[0].url);
      setDescription('');
      setAmenities(['Smart Home System', 'Central AC']);
    }
    setError(null);
  }, [propertyToEdit, isOpen]);

  if (!isOpen) return null;

  const toggleAmenity = (item: string) => {
    if (amenities.includes(item)) {
      setAmenities(amenities.filter(a => a !== item));
    } else {
      setAmenities([...amenities, item]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || !address.trim() || !city.trim()) {
      setError('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
    const numericBeds = category === 'Plot' ? 0 : parseInt(beds, 10) || 0;
    const numericBaths = category === 'Plot' ? 0 : parseFloat(baths) || 0;
    const numericSqft = parseInt(sqft, 10) || (category === 'Plot' ? 10000 : 1800);

    const propertyPayload = {
      title: title.trim(),
      description: description.trim() || `Stunning ${category.toLowerCase()} situated in ${city}. Beautifully appointed with spacious interiors and top-tier finishes.`,
      category,
      type,
      price: numericPrice,
      location: {
        address: address.trim(),
        city: city.trim(),
        stateZip: stateZip.trim() || 'USA'
      },
      beds: numericBeds,
      baths: numericBaths,
      sqft: numericSqft,
      imageUrl: imageUrl.trim() || PRESET_IMAGES[0].url,
      sellerId: user ? user.uid : 'demo',
      sellerName: user?.displayName || 'HomeLuxe Seller',
      sellerEmail: user?.email || 'contact@homeluxe.com',
      sellerPhone: '(800) 123-4567',
      amenities
    };

    try {
      if (propertyToEdit) {
        await updatePropertyListing(propertyToEdit.id, propertyPayload);
        if (onSuccess) onSuccess(propertyToEdit.id);
      } else {
        const newId = await createPropertyListing(propertyPayload);
        if (onSuccess) onSuccess(newId);
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full my-auto shadow-2xl border border-slate-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0c2340] text-white flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {propertyToEdit ? 'Edit Property Listing' : 'List Your Property for Sale or Rent'}
              </h3>
              <p className="text-xs text-slate-500">
                Provide details and photos to showcase your property to buyers.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto space-y-6">
          
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {/* Title & Category & Type */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Property Title / Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Modern Sunset Luxury Villa"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white cursor-pointer"
                >
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Plot">Plot / Land</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Listing Purpose *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('sale')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      type === 'sale'
                        ? 'bg-[#0c2340] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    For Sale
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('rent')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      type === 'rent'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    For Rent
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Price & Location */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Price ({type === 'sale' ? 'Total USD' : 'USD / Month'}) *
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  required
                  min="1"
                  placeholder={type === 'sale' ? '850000' : '3200'}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 123 Maple Drive"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Beverly Hills"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Specs: Beds, Baths, Sqft */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {category === 'Plot' ? 'Beds (N/A)' : 'Bedrooms'}
              </label>
              <input
                type="number"
                disabled={category === 'Plot'}
                min="0"
                value={category === 'Plot' ? '0' : beds}
                onChange={(e) => setBeds(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm disabled:opacity-40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {category === 'Plot' ? 'Baths (N/A)' : 'Bathrooms'}
              </label>
              <input
                type="number"
                step="0.5"
                disabled={category === 'Plot'}
                min="0"
                value={category === 'Plot' ? '0' : baths}
                onChange={(e) => setBaths(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm disabled:opacity-40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {category === 'Plot' ? 'Lot Sq Ft' : 'Total Sq Ft'} *
              </label>
              <input
                type="number"
                required
                min="100"
                value={sqft}
                onChange={(e) => setSqft(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Image Selection & Preview */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-700">
              Property Photo (Image URL or Choose Preset) *
            </label>
            
            <div className="flex gap-2">
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            {/* Quick 1-click photo presets */}
            <div>
              <p className="text-[11px] text-slate-500 font-medium mb-1.5">
                Quick Architectural Presets:
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all cursor-pointer ${
                      imageUrl === preset.url ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200 hover:opacity-80'
                    }`}
                    title={preset.name}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Live Preview */}
            {imageUrl && (
              <div className="mt-2 relative rounded-2xl overflow-hidden aspect-[16/8] border border-slate-200 bg-slate-100">
                <img src={imageUrl} alt="Listing Preview" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                  Live Preview
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Property Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe the architecture, views, renovation, and unique selling points..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white resize-none"
            />
          </div>

          {/* Amenities Multi-Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Key Amenities & Features
            </label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_AMENITIES.map((amenity) => {
                const isSelected = amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-700 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#0c2340] hover:bg-[#16355d] text-white px-7 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Saving Property...' : (propertyToEdit ? 'Save Changes' : 'Publish Listing')}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
