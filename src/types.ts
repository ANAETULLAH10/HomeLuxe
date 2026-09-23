export type PropertyCategory = 'House' | 'Apartment' | 'Plot';
export type ListingType = 'sale' | 'rent';

export interface PropertyLocation {
  address: string;
  city: string;
  stateZip: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  category: PropertyCategory;
  type: ListingType;
  price: number;
  location: PropertyLocation;
  beds: number;
  baths: number;
  sqft: number;
  imageUrl: string;
  additionalImages?: string[];
  featured?: boolean;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone?: string;
  amenities: string[];
  createdAt: number;
  updatedAt?: number;
}

export type TourType = 'in-person' | 'video';
export type BookingStatus = 'confirmed' | 'pending' | 'cancelled';

export interface ViewingBooking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  propertyImage: string;
  propertyPrice: number;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  sellerId?: string;
  date: string;
  timeSlot: string;
  tourType: TourType;
  notes?: string;
  status: BookingStatus;
  createdAt: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber?: string;
  photoURL?: string | null;
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  isDemoSession?: boolean;
}

export interface UserFavorite {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: number;
}

export interface AgentInquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  propertyImage: string;
  propertyPrice: number;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone?: string;
  senderId?: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  subject: string;
  message: string;
  hasPreApproval?: boolean;
  requestCallback?: boolean;
  createdAt: number;
  status: 'sent' | 'read' | 'replied';
}
