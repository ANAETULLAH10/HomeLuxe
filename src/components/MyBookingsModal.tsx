import React, { useEffect, useState } from 'react';
import { ViewingBooking } from '../types';
import { useAuth } from '../context/AuthContext';
import { subscribeUserBookings } from '../services/propertyService';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  UserCheck, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPropertyId?: (propertyId: string) => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  onClose,
  onSelectPropertyId
}) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<ViewingBooking[]>([]);

  useEffect(() => {
    if (!isOpen || !user) return;
    const unsubscribe = subscribeUserBookings(user.uid, (data) => {
      setBookings(data);
    });
    return () => unsubscribe();
  }, [isOpen, user]);

  if (!isOpen) return null;

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
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                My Booked Viewings
              </h3>
              <p className="text-xs text-slate-500">
                Manage upcoming property tours and appointments.
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

        {/* List of Bookings */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-4">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div 
                key={booking.id}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-xs transition-shadow"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={booking.propertyImage}
                    alt={booking.propertyTitle}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mb-1 uppercase tracking-wide">
                      <CheckCircle2 className="w-3 h-3" />
                      {booking.status}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {booking.propertyTitle}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {booking.propertyAddress}
                    </p>
                  </div>
                </div>

                {/* Date, Time & Format */}
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 text-xs space-y-1 sm:text-right shrink-0 w-full sm:w-auto">
                  <div className="flex items-center sm:justify-end gap-1.5 font-bold text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center sm:justify-end gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{booking.timeSlot}</span>
                  </div>
                  <div className="flex items-center sm:justify-end gap-1.5 text-slate-600 font-medium">
                    {booking.tourType === 'video' ? (
                      <span className="inline-flex items-center gap-1 text-purple-700">
                        <Video className="w-3 h-3" /> Live Video
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-blue-700">
                        <UserCheck className="w-3 h-3" /> In-Person
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-700">No scheduled viewings yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Explore our featured homes and click "Book Viewing" to schedule your first tour!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0c2340] text-white text-xs font-bold rounded-xl hover:bg-[#16355d] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
