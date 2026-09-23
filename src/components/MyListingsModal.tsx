import React from 'react';
import { Property } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Home, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  MapPin, 
  DollarSign 
} from 'lucide-react';

interface MyListingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  onOpenAddListing: () => void;
  onEditListing: (property: Property) => void;
  onDeleteListing: (propertyId: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const MyListingsModal: React.FC<MyListingsModalProps> = ({
  isOpen,
  onClose,
  properties,
  onOpenAddListing,
  onEditListing,
  onDeleteListing,
  onSelectProperty
}) => {
  const { user } = useAuth();

  if (!isOpen) return null;

  // Filter properties owned by user or demo
  const userListings = properties.filter(
    (p) => user && (p.sellerId === user.uid || p.sellerId === 'demo')
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full my-auto shadow-2xl border border-slate-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                My Listed Properties
              </h3>
              <p className="text-xs text-slate-500">
                Manage your active property listings, pricing, and details.
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
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-4">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-bold text-slate-700">
              {userListings.length} Active {userListings.length === 1 ? 'Listing' : 'Listings'}
            </span>
            <button
              onClick={() => {
                onClose();
                onOpenAddListing();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0c2340] text-white text-xs font-bold rounded-lg hover:bg-[#16355d] transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-blue-300" />
              <span>Add New Property</span>
            </button>
          </div>

          {userListings.length > 0 ? (
            <div className="space-y-3">
              {userListings.map((prop) => (
                <div 
                  key={prop.id}
                  className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-xs transition-shadow"
                >
                  <div 
                    onClick={() => {
                      onClose();
                      onSelectProperty(prop);
                    }}
                    className="flex items-center gap-3.5 min-w-0 cursor-pointer flex-1"
                  >
                    <img
                      src={prop.imageUrl}
                      alt={prop.title}
                      className="w-16 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          prop.type === 'sale' ? 'bg-[#0c2340] text-white' : 'bg-emerald-600 text-white'
                        }`}>
                          {prop.type === 'sale' ? 'For Sale' : 'For Rent'}
                        </span>
                        <span className="text-[11px] text-slate-500 font-semibold">{prop.category}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 truncate hover:text-blue-700">
                        {prop.title}
                      </h4>
                      <p className="text-xs text-blue-800 font-extrabold mt-0.5">
                        ${prop.price.toLocaleString()} {prop.type === 'rent' ? '/mo' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onClose();
                        onEditListing(prop);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this listing?')) {
                          onDeleteListing(prop.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Home className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-700">You haven't listed any properties yet</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4 max-w-xs mx-auto">
                Ready to sell or rent out your property? List it on HomeLuxe to reach thousands of buyers.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenAddListing();
                }}
                className="px-5 py-2.5 bg-[#0c2340] text-white text-xs font-bold rounded-xl hover:bg-[#16355d] transition-colors cursor-pointer"
              >
                Create First Listing
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0c2340] text-white text-xs font-bold rounded-xl hover:bg-[#16355d] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
