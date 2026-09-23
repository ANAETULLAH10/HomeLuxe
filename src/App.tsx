import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FavoritesProvider, useFavorites } from './context/FavoritesContext';
import { CheckCircle, X, Heart } from 'lucide-react';
import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturePillars } from './components/FeaturePillars';
import { FeaturedProperties } from './components/FeaturedProperties';
import { SellerValueBanner } from './components/SellerValueBanner';
import { WhyChooseUs } from './components/WhyChooseUs';
import { NewsletterBanner } from './components/NewsletterBanner';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { PropertyDetailsModal } from './components/PropertyDetailsModal';
import { BookViewingModal } from './components/BookViewingModal';
import { AddEditPropertyModal } from './components/AddEditPropertyModal';
import { MyBookingsModal } from './components/MyBookingsModal';
import { MyListingsModal } from './components/MyListingsModal';
import { MyFavoritesModal } from './components/MyFavoritesModal';
import { HomeValuationModal } from './components/HomeValuationModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { Property, PropertyCategory, ListingType } from './types';
import { subscribeProperties, deletePropertyListing } from './services/propertyService';

const MainApp: React.FC = () => {
  const { user, openAuthModal, authNotice, clearAuthNotice } = useAuth();
  const { 
    isFavoritesModalOpen, 
    openFavoritesModal, 
    closeFavoritesModal,
    favoriteFeedback,
    clearFavoriteFeedback 
  } = useFavorites();

  // Auto-dismiss authNotice after 6s
  useEffect(() => {
    if (authNotice) {
      const timer = setTimeout(() => {
        clearAuthNotice();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [authNotice, clearAuthNotice]);

  // Properties State
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<ListingType | 'all'>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<PropertyCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [activePropertyModal, setActivePropertyModal] = useState<Property | null>(null);
  const [bookingProperty, setBookingProperty] = useState<Property | null>(null);
  const [isAddListingOpen, setIsAddListingOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isMyListingsOpen, setIsMyListingsOpen] = useState(false);
  const [isValuationOpen, setIsValuationOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  // Subscribe to real-time property listings
  useEffect(() => {
    const unsubscribe = subscribeProperties((data) => {
      setProperties(data);
    });
    return () => unsubscribe();
  }, []);

  // Handle Search from Hero
  const handleHeroSearch = (filters: {
    intent: ListingType | 'all';
    query: string;
    category: string;
    priceRange: string;
    beds: string;
    baths: string;
  }) => {
    setSelectedTypeFilter(filters.intent);
    setSelectedCategoryFilter(filters.category as any);
    setSearchQuery(filters.query);
  };

  // Nav filters
  const handleSelectListings = (type?: ListingType, category?: PropertyCategory) => {
    setSelectedTypeFilter(type || 'all');
    setSelectedCategoryFilter(category || 'all');
    setSearchQuery('');
  };

  // Delete handler
  const handleDeleteProperty = async (propertyId: string) => {
    try {
      await deletePropertyListing(propertyId);
      // Remove from active modal if open
      if (activePropertyModal?.id === propertyId) {
        setActivePropertyModal(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Open add listing with auth check
  const handleOpenAddListing = () => {
    if (!user) {
      openAuthModal('signin');
    } else {
      setPropertyToEdit(null);
      setIsAddListingOpen(true);
    }
  };

  // Open edit listing
  const handleEditProperty = (prop: Property) => {
    setPropertyToEdit(prop);
    setIsAddListingOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white relative">
      {/* Toast Notification for Auth Notice */}
      {authNotice && (
        <div className="fixed top-4 right-4 z-50 max-w-md bg-[#0c2340] text-white p-3.5 rounded-2xl shadow-xl border border-blue-900 flex items-start gap-3 animate-in slide-in-from-top-3 duration-300">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed font-medium flex-1">
            {authNotice}
          </div>
          <button 
            onClick={clearAuthNotice}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner with trust badges and phone */}
      <TopBar onOpenValuation={() => setIsValuationOpen(true)} />

      {/* Main Navbar */}
      <Navbar
        onSelectListings={handleSelectListings}
        onOpenAddListing={handleOpenAddListing}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        onOpenMyListings={() => setIsMyListingsOpen(true)}
        onOpenValuation={() => setIsValuationOpen(true)}
        onOpenFavorites={openFavoritesModal}
      />

      {/* Hero Section with Search bar */}
      <HeroSection
        onSearch={handleHeroSearch}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenValuation={() => setIsValuationOpen(true)}
      />

      {/* 4 Feature Pillars matching design */}
      <FeaturePillars />

      {/* Featured Properties: Filterable by House, Apartment, Plot */}
      <FeaturedProperties
        properties={properties}
        onSelectProperty={(prop) => setActivePropertyModal(prop)}
        onBookViewing={(prop) => setBookingProperty(prop)}
        onEditProperty={handleEditProperty}
        onDeleteProperty={handleDeleteProperty}
        selectedTypeFilter={selectedTypeFilter}
        selectedCategoryFilter={selectedCategoryFilter}
        searchQuery={searchQuery}
        onResetFilters={() => {
          setSelectedTypeFilter('all');
          setSelectedCategoryFilter('all');
          setSearchQuery('');
        }}
      />

      {/* Seller Value Banner */}
      <SellerValueBanner onOpenValuation={() => setIsValuationOpen(true)} />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Newsletter Subscription Banner */}
      <NewsletterBanner />

      {/* Footer */}
      <Footer
        onSelectListings={handleSelectListings}
        onOpenValuation={() => setIsValuationOpen(true)}
      />

      {/* Interactive Modals */}
      <AuthModal />

      <PropertyDetailsModal
        property={activePropertyModal}
        onClose={() => setActivePropertyModal(null)}
        onBookViewing={(prop) => {
          setActivePropertyModal(null);
          setBookingProperty(prop);
        }}
        onEdit={handleEditProperty}
        onDelete={handleDeleteProperty}
      />

      <BookViewingModal
        property={bookingProperty}
        onClose={() => setBookingProperty(null)}
        onViewMyBookings={() => setIsMyBookingsOpen(true)}
      />

      <AddEditPropertyModal
        isOpen={isAddListingOpen}
        onClose={() => {
          setIsAddListingOpen(false);
          setPropertyToEdit(null);
        }}
        propertyToEdit={propertyToEdit}
      />

      <MyBookingsModal
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
      />

      <MyListingsModal
        isOpen={isMyListingsOpen}
        onClose={() => setIsMyListingsOpen(false)}
        properties={properties}
        onOpenAddListing={handleOpenAddListing}
        onEditListing={handleEditProperty}
        onDeleteListing={handleDeleteProperty}
        onSelectProperty={(prop) => setActivePropertyModal(prop)}
      />

      <HomeValuationModal
        isOpen={isValuationOpen}
        onClose={() => setIsValuationOpen(false)}
        onListProperty={handleOpenAddListing}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onExplore={() => {
          const el = document.getElementById('properties-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* My Favorites Modal */}
      <MyFavoritesModal
        isOpen={isFavoritesModalOpen}
        onClose={closeFavoritesModal}
        properties={properties}
        onSelectProperty={(prop) => setActivePropertyModal(prop)}
        onBookViewing={(prop) => setBookingProperty(prop)}
      />

      {/* Toast Notification for Favorite toggles */}
      {favoriteFeedback && (
        <aside 
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#08182b] text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-3 animate-in slide-in-from-bottom-3 duration-300"
        >
          <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          </div>
          <div className="text-xs font-medium flex-1">
            {favoriteFeedback.message}
          </div>
          <button
            onClick={() => {
              clearFavoriteFeedback();
              openFavoritesModal();
            }}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 underline cursor-pointer shrink-0"
          >
            View
          </button>
          <button
            onClick={clearFavoriteFeedback}
            aria-label="Dismiss notification"
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <MainApp />
      </FavoritesProvider>
    </AuthProvider>
  );
}
