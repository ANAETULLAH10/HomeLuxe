import React, { useState } from 'react';
import { Property, TourType } from '../types';
import { useAuth } from '../context/AuthContext';
import { bookPropertyViewing } from '../services/propertyService';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  UserCheck, 
  Phone, 
  Mail, 
  CheckCircle2, 
  MapPin, 
  FileText 
} from 'lucide-react';

interface BookViewingModalProps {
  property: Property | null;
  onClose: () => void;
  onViewMyBookings?: () => void;
}

export const BookViewingModal: React.FC<BookViewingModalProps> = ({
  property,
  onClose,
  onViewMyBookings
}) => {
  const { user } = useAuth();

  // Tomorrow's date formatted as YYYY-MM-DD
  const defaultDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [date, setDate] = useState(defaultDate);
  const [timeSlot, setTimeSlot] = useState('11:00 AM');
  const [tourType, setTourType] = useState<TourType>('in-person');
  const [userName, setUserName] = useState(user?.displayName || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [userPhone, setUserPhone] = useState('');
  const [notes, setNotes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      if (!userName && user.displayName) setUserName(user.displayName);
      if (!userEmail && user.email) setUserEmail(user.email);
    }
  }, [user]);

  if (!property) return null;

  const timeSlots = [
    '09:30 AM',
    '11:00 AM',
    '01:30 PM',
    '03:00 PM',
    '04:30 PM',
    '06:00 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookingId = await bookPropertyViewing({
        propertyId: property.id,
        propertyTitle: property.title,
        propertyAddress: `${property.location.address}, ${property.location.city}`,
        propertyImage: property.imageUrl,
        propertyPrice: property.price,
        userId: user ? user.uid : 'guest-' + Date.now(),
        userName: userName.trim() || 'Valued Buyer',
        userEmail: userEmail.trim(),
        userPhone: userPhone.trim() || '(800) 123-4567',
        sellerId: property.sellerId,
        date,
        timeSlot,
        tourType,
        notes: notes.trim()
      });

      setBookingSuccess(bookingId);
    } catch (err) {
      console.error('Error booking viewing:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full my-auto shadow-2xl border border-slate-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Schedule Property Viewing
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
          
          {bookingSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-2xl font-extrabold text-slate-900">
                Viewing Scheduled!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto">
                Your viewing for <strong>{property.title}</strong> has been successfully booked for{' '}
                <strong>{date} at {timeSlot}</strong>.
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5 max-w-sm mx-auto">
                <p className="text-slate-500">Booking Confirmation Reference:</p>
                <p className="font-mono font-bold text-blue-700 text-sm">{bookingSuccess}</p>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-slate-600">
                  <span>Tour Type:</span>
                  <span className="font-bold capitalize">{tourType} Tour</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
                {onViewMyBookings && (
                  <button
                    onClick={() => {
                      onClose();
                      onViewMyBookings();
                    }}
                    className="px-5 py-2.5 bg-blue-50 text-blue-700 font-bold rounded-xl text-xs hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    View in My Bookings
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#0c2340] text-white font-bold rounded-xl text-xs hover:bg-[#16355d] transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Selected Property Preview */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <img
                  src={property.imageUrl}
                  alt={property.title}
                  className="w-16 h-14 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {property.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    {property.location.address}, {property.location.city}
                  </p>
                  <p className="text-xs font-extrabold text-blue-700 mt-0.5">
                    ${property.price.toLocaleString()} {property.type === 'rent' ? '/mo' : ''}
                  </p>
                </div>
              </div>

              {/* Tour Type Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Preferred Tour Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTourType('in-person')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      tourType === 'in-person'
                        ? 'bg-[#0c2340] text-white border-[#0c2340] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>In-Person Tour</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTourType('video')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      tourType === 'video'
                        ? 'bg-[#0c2340] text-white border-[#0c2340] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Live Video Tour</span>
                  </button>
                </div>
              </div>

              {/* Date & Time Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white cursor-pointer"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Buyer Contact Information */}
              <div className="space-y-3 pt-1">
                <label className="block text-xs font-bold text-slate-700">
                  Your Contact Information
                </label>

                <div>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number (e.g. 555-0199)"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    rows={2}
                    placeholder="Special requests or questions for the agent (optional)..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0c2340] hover:bg-[#16355d] text-white py-3.5 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Confirming Appointment...' : 'Confirm Viewing Appointment'}
              </button>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
