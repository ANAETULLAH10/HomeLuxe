import { 
  db, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  where 
} from '../firebase';
import { Property, ViewingBooking, AgentInquiry } from '../types';
import { INITIAL_PROPERTIES } from '../data/initialProperties';

const PROPERTIES_COLLECTION = 'properties';
const BOOKINGS_COLLECTION = 'bookings';
const LOCAL_STORAGE_KEY = 'homeluxe_cached_properties';
const LOCAL_BOOKINGS_KEY = 'homeluxe_cached_bookings';

// Local storage fallback helpers
const getCachedProperties = (): Property[] => {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure any missing initial properties are present
        const existingIds = new Set(parsed.map((p: Property) => p.id));
        const missing = INITIAL_PROPERTIES.filter(p => !existingIds.has(p.id));
        if (missing.length > 0) {
          return [...parsed, ...missing];
        }
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return INITIAL_PROPERTIES;
};

const setCachedProperties = (properties: Property[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(properties));
  } catch {
    // ignore
  }
};

const getCachedBookings = (): ViewingBooking[] => {
  try {
    const cached = localStorage.getItem(LOCAL_BOOKINGS_KEY);
    if (cached) return JSON.parse(cached);
  } catch {
    // ignore
  }
  return [];
};

const setCachedBookings = (bookings: ViewingBooking[]) => {
  try {
    localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(bookings));
  } catch {
    // ignore
  }
};

// Seed initial properties to Firestore if missing
let isSeeding = false;
export async function seedPropertiesIfMissing() {
  if (isSeeding) return;
  try {
    isSeeding = true;
    const snapshot = await getDocs(collection(db, PROPERTIES_COLLECTION));
    const existingIds = new Set(snapshot.docs.map(d => d.id));
    for (const prop of INITIAL_PROPERTIES) {
      if (!existingIds.has(prop.id)) {
        try {
          await setDoc(doc(db, PROPERTIES_COLLECTION, prop.id), prop);
        } catch {
          // ignore individual doc set failures
        }
      }
    }
  } catch {
    // ignore
  } finally {
    isSeeding = false;
  }
}

// Real-time listener for properties
export function subscribeProperties(callback: (properties: Property[]) => void) {
  // First emit cached or initial properties immediately so UI is populated with all properties without delay
  callback(getCachedProperties());

  try {
    const collRef = collection(db, PROPERTIES_COLLECTION);
    
    const unsubscribe = onSnapshot(collRef, (snapshot) => {
      const items: Property[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Property);
      });

      // If any initial properties are missing, merge them so user sees all properties immediately
      const existingIds = new Set(items.map(p => p.id));
      const missingInitial = INITIAL_PROPERTIES.filter(p => !existingIds.has(p.id));
      if (missingInitial.length > 0) {
        items.push(...missingInitial);
        seedPropertiesIfMissing().catch(() => {});
      }

      // Sort client-side to avoid requiring custom Firestore indexes
      items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setCachedProperties(items);
      callback(items);
    }, (error) => {
      console.warn('Firestore subscription fallback:', error?.message || error);
      callback(getCachedProperties());
    });

    return () => {
      try {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      } catch {
        // safely ignore any tear-down abort errors
      }
    };
  } catch {
    callback(getCachedProperties());
    return () => {};
  }
}

// Add new property listing
export async function createPropertyListing(
  propertyData: Omit<Property, 'id' | 'createdAt'>
): Promise<string> {
  const newPropData = {
    ...propertyData,
    createdAt: Date.now()
  };

  try {
    const docRef = await addDoc(collection(db, PROPERTIES_COLLECTION), newPropData);
    
    // Update local cache immediately for snappy UI
    const cached = getCachedProperties();
    const updated = [{ id: docRef.id, ...newPropData } as Property, ...cached];
    setCachedProperties(updated);
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating property in Firestore, saving locally:', error);
    const localId = 'prop-' + Date.now();
    const cached = getCachedProperties();
    const updated = [{ id: localId, ...newPropData } as Property, ...cached];
    setCachedProperties(updated);
    return localId;
  }
}

// Update existing property listing
export async function updatePropertyListing(
  propertyId: string,
  updates: Partial<Property>
): Promise<void> {
  const updateData = {
    ...updates,
    updatedAt: Date.now()
  };

  try {
    await updateDoc(doc(db, PROPERTIES_COLLECTION, propertyId), updateData);
  } catch (error) {
    console.warn('Firestore update failed, updating local cache:', error);
  }

  // Update local cache
  const cached = getCachedProperties();
  const updated = cached.map(p => p.id === propertyId ? { ...p, ...updateData } : p);
  setCachedProperties(updated);
}

// Delete property listing
export async function deletePropertyListing(propertyId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, PROPERTIES_COLLECTION, propertyId));
  } catch (error) {
    console.warn('Firestore delete failed, updating local cache:', error);
  }

  // Update local cache
  const cached = getCachedProperties();
  const updated = cached.filter(p => p.id !== propertyId);
  setCachedProperties(updated);
}

// Book a viewing
export async function bookPropertyViewing(
  bookingData: Omit<ViewingBooking, 'id' | 'createdAt' | 'status'>
): Promise<string> {
  const newBooking = {
    ...bookingData,
    status: 'confirmed' as const,
    createdAt: Date.now()
  };

  try {
    const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), newBooking);
    
    const cached = getCachedBookings();
    setCachedBookings([{ id: docRef.id, ...newBooking } as ViewingBooking, ...cached]);
    return docRef.id;
  } catch (error) {
    console.warn('Firestore booking failed, saving locally:', error);
    const localId = 'booking-' + Date.now();
    const cached = getCachedBookings();
    setCachedBookings([{ id: localId, ...newBooking } as ViewingBooking, ...cached]);
    return localId;
  }
}

// Subscribe to bookings for a user
export function subscribeUserBookings(
  userId: string,
  callback: (bookings: ViewingBooking[]) => void
) {
  // Emit local bookings filtered by userId or email
  const initialLocal = getCachedBookings().filter(b => b.userId === userId);
  callback(initialLocal);

  if (!userId) {
    return () => {};
  }

  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: ViewingBooking[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() } as ViewingBooking);
      });
      items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      callback(items);
    }, (err) => {
      console.warn('Bookings listener notice (using local data):', err?.message || err);
    });

    return () => {
      try {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      } catch {
        // safely ignore any tear-down abort errors
      }
    };
  } catch {
    return () => {};
  }
}

// Save newsletter subscription
export async function subscribeNewsletter(email: string): Promise<void> {
  try {
    await addDoc(collection(db, 'subscribers'), {
      email,
      subscribedAt: Date.now()
    });
  } catch (err) {
    console.warn('Newsletter firestore error:', err);
  }
}

// Inquiries Collection & Cache
const INQUIRIES_COLLECTION = 'inquiries';
const LOCAL_INQUIRIES_KEY = 'homeluxe_cached_inquiries';

export const getCachedInquiries = (): AgentInquiry[] => {
  try {
    const cached = localStorage.getItem(LOCAL_INQUIRIES_KEY);
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
};

export const setCachedInquiries = (inquiries: AgentInquiry[]): void => {
  try {
    localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(inquiries));
  } catch {
    // ignore
  }
};

// Send direct message / inquiry to listing agent
export async function sendAgentInquiry(
  inquiryData: Omit<AgentInquiry, 'id' | 'createdAt' | 'status'>
): Promise<string> {
  const newInquiry: Omit<AgentInquiry, 'id'> = {
    ...inquiryData,
    status: 'sent',
    createdAt: Date.now()
  };

  try {
    const docRef = await addDoc(collection(db, INQUIRIES_COLLECTION), newInquiry);
    const fullInquiry: AgentInquiry = { id: docRef.id, ...newInquiry };
    const cached = getCachedInquiries();
    setCachedInquiries([fullInquiry, ...cached]);
    return docRef.id;
  } catch (error) {
    console.warn('Firestore inquiry notice (saving to local cache):', error);
    const localId = 'inquiry-' + Date.now();
    const fullInquiry: AgentInquiry = { id: localId, ...newInquiry };
    const cached = getCachedInquiries();
    setCachedInquiries([fullInquiry, ...cached]);
    return localId;
  }
}

