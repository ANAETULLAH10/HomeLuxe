import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { 
  Building2, 
  PlusCircle, 
  User, 
  LogOut, 
  Calendar, 
  Home, 
  Heart,
  Menu, 
  X, 
  ChevronDown 
} from 'lucide-react';
import { PropertyCategory, ListingType } from '../types';

interface NavbarProps {
  onSelectListings: (type?: ListingType, category?: PropertyCategory) => void;
  onOpenAddListing: () => void;
  onOpenMyBookings: () => void;
  onOpenMyListings: () => void;
  onOpenValuation: () => void;
  onOpenFavorites?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectListings,
  onOpenAddListing,
  onOpenMyBookings,
  onOpenMyListings,
  onOpenValuation,
  onOpenFavorites
}) => {
  const { user, openAuthModal, logout } = useAuth();
  const { favoritesCount, openFavoritesModal } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [buyDropdownOpen, setBuyDropdownOpen] = useState(false);

  const handleOpenFavorites = () => {
    if (onOpenFavorites) {
      onOpenFavorites();
    } else {
      openFavoritesModal();
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="homeluxe-brand-logo"
          >
            <div className="w-10 h-10 rounded-xl bg-[#08182b] flex items-center justify-center text-white shadow-xs group-hover:bg-[#162a45] transition-colors">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-wider text-[#08182b] leading-none font-display">
                HOMELUXE
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 font-semibold uppercase mt-0.5">
                Real Estate
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-slate-700">
            <button 
              onClick={() => scrollToSection('hero')}
              className="text-[#08182b] font-bold transition-colors cursor-pointer relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600"
            >
              Home
            </button>

            {/* Buy with category dropdown */}
            <div className="relative" onMouseLeave={() => setBuyDropdownOpen(false)}>
              <button 
                onClick={() => {
                  onSelectListings('sale');
                  scrollToSection('properties-section');
                }}
                onMouseEnter={() => setBuyDropdownOpen(true)}
                className="flex items-center gap-1 hover:text-blue-700 transition-colors cursor-pointer py-1"
              >
                <span>Buy</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
              {buyDropdownOpen && (
                <div 
                  className="absolute top-full left-0 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={() => setBuyDropdownOpen(true)}
                >
                  <button
                    onClick={() => {
                      onSelectListings('sale', 'House');
                      scrollToSection('properties-section');
                      setBuyDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    Houses For Sale
                  </button>
                  <button
                    onClick={() => {
                      onSelectListings('sale', 'Apartment');
                      scrollToSection('properties-section');
                      setBuyDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    Apartments For Sale
                  </button>
                  <button
                    onClick={() => {
                      onSelectListings('sale', 'Plot');
                      scrollToSection('properties-section');
                      setBuyDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    Plots & Land For Sale
                  </button>
                </div>
              )}
            </div>

            <button 
              onClick={() => {
                if (user) {
                  onOpenAddListing();
                } else {
                  onOpenValuation();
                }
              }}
              className="hover:text-blue-700 transition-colors cursor-pointer py-1"
            >
              Sell
            </button>

            <button 
              onClick={() => {
                onSelectListings('rent');
                scrollToSection('properties-section');
              }}
              className="hover:text-blue-700 transition-colors cursor-pointer py-1"
            >
              Rent
            </button>

            <button 
              onClick={() => {
                onSelectListings();
                scrollToSection('properties-section');
              }}
              className="hover:text-blue-700 transition-colors cursor-pointer py-1"
            >
              Listings
            </button>

            <button 
              onClick={() => scrollToSection('why-choose-us')}
              className="hover:text-blue-700 transition-colors cursor-pointer py-1"
            >
              About Us
            </button>

            <button 
              onClick={() => scrollToSection('contact-footer')}
              className="hover:text-blue-700 transition-colors cursor-pointer py-1"
            >
              Contact
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Favorites Button */}
            <button
              id="nav-quick-favorites-btn"
              onClick={handleOpenFavorites}
              aria-label="View saved properties"
              title="My Favorites"
              className="relative p-2 sm:px-3 sm:py-2 rounded-xl text-slate-700 hover:text-rose-600 hover:bg-rose-50/80 transition-all cursor-pointer flex items-center gap-1.5 border border-slate-200/80 hover:border-rose-200"
            >
              <div className="relative flex items-center justify-center">
                <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-colors ${favoritesCount > 0 ? 'text-rose-600 fill-rose-500' : 'text-slate-600'}`} />
                {favoritesCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-50">
                    {favoritesCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-slate-800 hidden sm:inline">
                Favorites
              </span>
              {favoritesCount > 0 && (
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* List Your Property Button */}
            <button
              id="nav-list-property-btn"
              onClick={() => {
                if (user) {
                  onOpenAddListing();
                } else {
                  openAuthModal('signin');
                }
              }}
              className="hidden sm:inline-flex items-center gap-2 bg-[#08182b] hover:bg-[#162a45] text-white px-4 lg:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-xs hover:shadow cursor-pointer active:scale-98"
            >
              <PlusCircle className="w-4 h-4 text-blue-300" />
              <span>List Your Property</span>
            </button>

            {/* Auth / Profile Area */}
            {user ? (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="User avatar" 
                      className="w-8 h-8 rounded-full object-cover border border-slate-300"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate hidden md:inline-block">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Profile Dropdown */}
                {userMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.displayName || 'HomeLuxe Member'}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          onOpenAddListing();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4 text-blue-600" />
                        <span>Add New Listing</span>
                      </button>

                      <button
                        onClick={() => {
                          onOpenMyListings();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Home className="w-4 h-4 text-indigo-600" />
                        <span>My Properties</span>
                      </button>

                      <button
                        onClick={() => {
                          onOpenMyBookings();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span>My Booked Viewings</span>
                      </button>

                      <button
                        id="user-menu-favorites-btn"
                        onClick={() => {
                          handleOpenFavorites();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-700 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                          <span>My Favorites</span>
                        </div>
                        {favoritesCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-700">
                            {favoritesCount}
                          </span>
                        )}
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="nav-signin-btn"
                  onClick={() => openAuthModal('signin')}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
                <button
                  id="nav-signup-btn"
                  onClick={() => openAuthModal('signup')}
                  className="hidden md:inline-flex items-center px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                onSelectListings('sale');
                scrollToSection('properties-section');
              }}
              className="px-3 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg text-left"
            >
              Buy Homes
            </button>
            <button
              onClick={() => {
                onSelectListings('rent');
                scrollToSection('properties-section');
              }}
              className="px-3 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg text-left"
            >
              Rent Homes
            </button>
            <button
              onClick={() => {
                onSelectListings(undefined, 'Plot');
                scrollToSection('properties-section');
              }}
              className="px-3 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg text-left"
            >
              Plots & Land
            </button>
            <button
              onClick={() => {
                onOpenValuation();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg text-left"
            >
              Free Valuation
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                if (user) {
                  onOpenAddListing();
                } else {
                  openAuthModal('signin');
                }
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#0c2340] text-white py-3 rounded-lg text-sm font-semibold"
            >
              <PlusCircle className="w-4 h-4 text-blue-300" />
              <span>List Your Property</span>
            </button>

            <button
              id="mobile-my-favorites-btn"
              onClick={() => {
                handleOpenFavorites();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 text-sm font-medium transition-colors"
            >
              <div className="flex items-center gap-2">
                <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'text-rose-600 fill-rose-600' : 'text-rose-600'}`} />
                <span className="font-semibold">My Saved Favorites</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-200/80 text-rose-800">
                {favoritesCount} saved
              </span>
            </button>

            {user && (
              <button
                onClick={() => {
                  onOpenMyBookings();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-emerald-50 text-emerald-800 py-2.5 rounded-lg text-sm font-medium"
              >
                <Calendar className="w-4 h-4" />
                <span>My Booked Viewings</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
