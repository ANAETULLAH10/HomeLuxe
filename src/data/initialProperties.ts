import { Property } from '../types';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'Modern Luxury Villa',
    description: 'An architectural marvel featuring floor-to-ceiling glass walls, infinity swimming pool, expansive open concept living area, designer kitchen with Italian marble, and breathtaking landscaped grounds.',
    category: 'House',
    type: 'sale',
    price: 850000,
    location: {
      address: '123 Maple Drive',
      city: 'Beverly Hills',
      stateZip: 'CA 90210'
    },
    beds: 4,
    baths: 3,
    sqft: 2450,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    additionalImages: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80'
    ],
    featured: true,
    sellerId: 'demo',
    sellerName: 'David Sterling',
    sellerEmail: 'david.sterling@homeluxe.com',
    sellerPhone: '(800) 123-4567',
    amenities: ['Private Pool', 'Smart Home System', 'Sub-Zero Appliances', '2-Car Garage', 'Wine Cellar', 'Security System'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3
  },
  {
    id: 'prop-2',
    title: 'Suburban Contemporary Estate',
    description: 'Refined craftsmanship meets modern convenience in this masterfully designed family estate. Boasts a gourmet chef kitchen, home theater, primary master suite with spa bath, and a tranquil backyard patio.',
    category: 'House',
    type: 'sale',
    price: 620000,
    location: {
      address: '456 Oak Avenue',
      city: 'Austin',
      stateZip: 'TX 78701'
    },
    beds: 3,
    baths: 2,
    sqft: 1890,
    imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1600573472591-ee6c563aaec9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80'
    ],
    featured: true,
    sellerId: 'demo',
    sellerName: 'Elena Rostova',
    sellerEmail: 'elena.rostova@homeluxe.com',
    sellerPhone: '(800) 123-4568',
    amenities: ['Hardwood Floors', 'Covered Patio', 'EV Charger', 'Fenced Yard', 'Fireplace', 'Energy Star Rated'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5
  },
  {
    id: 'prop-3',
    title: 'The Grand Horizon Penthouse',
    description: 'A luminous luxury condominium offering panoramic bay views, private elevator access, 10-foot ceilings, bespoke custom cabinetry, and access to five-star resort amenities including rooftop infinity pool.',
    category: 'Apartment',
    type: 'rent',
    price: 3200,
    location: {
      address: '789 Pine Street, Unit 5B',
      city: 'Miami',
      stateZip: 'FL 33101'
    },
    beds: 2,
    baths: 2,
    sqft: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
    ],
    featured: true,
    sellerId: 'demo',
    sellerName: 'Marcus Vance',
    sellerEmail: 'marcus.vance@homeluxe.com',
    sellerPhone: '(800) 123-4569',
    amenities: ['Balcony View', '24/7 Concierge', 'Fitness Center', 'Valet Parking', 'Rooftop Lounge', 'Pet Friendly'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1
  },
  {
    id: 'prop-4',
    title: 'Ocean View Coastal Mansion',
    description: 'Spectacular coastal residence perched above the Pacific shore. Offers unmatched panoramic sea views, seamless indoor-outdoor living, private guest house, fire pit terrace, and direct beach access.',
    category: 'House',
    type: 'sale',
    price: 1250000,
    location: {
      address: '321 Ocean View Drive',
      city: 'San Diego',
      stateZip: 'CA 92101'
    },
    beds: 2,
    baths: 4,
    sqft: 3100,
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80'
    ],
    featured: true,
    sellerId: 'demo',
    sellerName: 'Sarah Jenkins',
    sellerEmail: 'sarah.jenkins@homeluxe.com',
    sellerPhone: '(800) 123-4570',
    amenities: ['Oceanfront Access', 'Heated Pool', 'Outdoor Kitchen', 'Guest Casita', 'Solar Powered', 'Smart Security'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7
  },
  {
    id: 'prop-5',
    title: 'Sunset Valley Residential Plot',
    description: 'Prime build-ready residential plot situated in an exclusive gated enclave. Complete with approved architectural plans, connected utilities (water, gas, high-speed fiber), and majestic mountain backdrops.',
    category: 'Plot',
    type: 'sale',
    price: 450000,
    location: {
      address: '88 Meadowland Ridge',
      city: 'Boulder',
      stateZip: 'CO 80302'
    },
    beds: 0,
    baths: 0,
    sqft: 12500,
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'
    ],
    featured: true,
    sellerId: 'demo',
    sellerName: 'David Sterling',
    sellerEmail: 'david.sterling@homeluxe.com',
    sellerPhone: '(800) 123-4567',
    amenities: ['Permits Approved', 'Utilities at Lot Line', 'Mountain Views', 'Paved Road Access', 'Survey Completed'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2
  },
  {
    id: 'prop-6',
    title: 'Skyline Panorama Loft',
    description: 'Ultra-modern urban loft in the heart of the cultural district. Features double-height exposed beam ceilings, industrial polished concrete floors, custom minimalist kitchen, and private terrace.',
    category: 'Apartment',
    type: 'sale',
    price: 895000,
    location: {
      address: '550 5th Avenue, Suite 34A',
      city: 'New York',
      stateZip: 'NY 10036'
    },
    beds: 3,
    baths: 3,
    sqft: 2100,
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502005229762-ee1b2b813135?auto=format&fit=crop&w=800&q=80'
    ],
    featured: false,
    sellerId: 'demo',
    sellerName: 'Marcus Vance',
    sellerEmail: 'marcus.vance@homeluxe.com',
    sellerPhone: '(800) 123-4569',
    amenities: ['Doorman', 'Private Storage', 'City Skyline Views', 'Wine Fridge', 'In-Unit Washer/Dryer'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4
  },
  {
    id: 'prop-7',
    title: 'Pinecrest Vista Commercial & Residential Plot',
    description: 'Generous 0.57-acre zoned multi-use plot with dual road frontage. Ideal for a luxury custom home build or boutique residential duplex. Flat terrain with gentle slope, mature cedar trees, and peaceful surroundings.',
    category: 'Plot',
    type: 'sale',
    price: 720000,
    location: {
      address: '104 Aspen Ridge Way',
      city: 'Seattle',
      stateZip: 'WA 98101'
    },
    beds: 0,
    baths: 0,
    sqft: 25000,
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
    ],
    featured: false,
    sellerId: 'demo',
    sellerName: 'Elena Rostova',
    sellerEmail: 'elena.rostova@homeluxe.com',
    sellerPhone: '(800) 123-4568',
    amenities: ['Zoned R-2 Mixed', 'Mature Trees', 'Dual Road Access', 'Topographic Map Ready', 'Subdivision Potential'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6
  },
  {
    id: 'prop-8',
    title: 'Mediterranean Villa with Private Oasis',
    description: 'Graceful Mediterranean-inspired retreat featuring clay tile roofing, arched breezeways, heated salt-water pool, outdoor fire lounge, and lush citrus groves.',
    category: 'House',
    type: 'rent',
    price: 4500,
    location: {
      address: '742 Evergreen Terrace',
      city: 'Scottsdale',
      stateZip: 'AZ 85251'
    },
    beds: 4,
    baths: 4,
    sqft: 2800,
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ],
    featured: false,
    sellerId: 'demo',
    sellerName: 'Sarah Jenkins',
    sellerEmail: 'sarah.jenkins@homeluxe.com',
    sellerPhone: '(800) 123-4570',
    amenities: ['Heated Saltwater Pool', 'Outdoor Kitchen & Grill', 'Custom Walk-In Closets', 'Gated Community', 'Courtyard'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8
  }
];
