import React, { useState, useEffect } from 'react';
import { Property } from '../types';
import { useAuth } from '../context/AuthContext';
import { sendAgentInquiry } from '../services/propertyService';
import { 
  X, 
  Mail, 
  Phone, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  ShieldCheck, 
  MapPin, 
  Building, 
  Sparkles,
  ExternalLink,
  DollarSign
} from 'lucide-react';

interface ContactAgentModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

const INQUIRY_TOPICS = [
  { id: 'general', label: 'General Inquiry', prefix: 'I would like more information about' },
  { id: 'tour', label: 'Request Private Tour', prefix: 'I would like to schedule an exclusive private viewing of' },
  { id: 'disclosures', label: 'Pricing & Disclosures', prefix: 'Could you please send me the seller disclosures, HOA rules, and price history for' },
  { id: 'financing', label: 'Financing Options', prefix: 'I have questions regarding financing, tax estimates, and closing costs for' },
  { id: 'offer', label: 'Make an Offer', prefix: 'I am interested in preparing an offer for' }
];

export const ContactAgentModal: React.FC<ContactAgentModalProps> = ({
  property,
  isOpen,
  onClose
}) => {
  const { user } = useAuth();

  const [selectedTopic, setSelectedTopic] = useState('general');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [message, setMessage] = useState('');
  const [hasPreApproval, setHasPreApproval] = useState(false);
  const [requestCallback, setRequestCallback] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Generate prefilled text based on property and topic
  const generatePrefilledMessage = (prop: Property, topicId: string, name: string) => {
    const topic = INQUIRY_TOPICS.find(t => t.id === topicId) || INQUIRY_TOPICS[0];
    const priceFormatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(prop.price) + (prop.type === 'rent' ? '/mo' : '');

    const signoff = name.trim() ? name.trim() : 'Prospective Buyer';

    return `Hello ${prop.sellerName},

${topic.prefix} "${prop.title}" (${prop.location.address}, ${prop.location.city}), listed at ${priceFormatted}.

Could you please confirm if this property is currently available and share any additional details, seller disclosures, and upcoming viewing opportunities?

Best regards,
${signoff}`;
  };

  // Reset and pre-populate when property or user changes
  useEffect(() => {
    if (isOpen && property) {
      setSubmittedInquiryId(null);
      setError(null);
      
      const defaultName = user?.displayName || '';
      const defaultEmail = user?.email || '';
      setSenderName(defaultName);
      setSenderEmail(defaultEmail);
      
      const prefilled = generatePrefilledMessage(property, 'general', defaultName);
      setMessage(prefilled);
      setSelectedTopic('general');
      setHasPreApproval(false);
      setRequestCallback(false);
    }
  }, [isOpen, property, user]);

  if (!isOpen || !property) return null;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(property.price) + (property.type === 'rent' ? ' /mo' : '');

  const handleTopicChange = (topicId: string) => {
    setSelectedTopic(topicId);
    if (property) {
      setMessage(generatePrefilledMessage(property, topicId, senderName));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!senderEmail.trim() || !senderEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!message.trim()) {
      setError('Please write a message to the agent.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const topicObj = INQUIRY_TOPICS.find(t => t.id === selectedTopic);
      const subjectTitle = topicObj 
        ? `${topicObj.label} - ${property.title}` 
        : `Inquiry regarding ${property.title}`;

      const inquiryId = await sendAgentInquiry({
        propertyId: property.id,
        propertyTitle: property.title,
        propertyAddress: `${property.location.address}, ${property.location.city}, ${property.location.stateZip}`,
        propertyImage: property.imageUrl,
        propertyPrice: property.price,
        sellerId: property.sellerId,
        sellerName: property.sellerName,
        sellerEmail: property.sellerEmail,
        sellerPhone: property.sellerPhone,
        senderId: user ? user.uid : undefined,
        senderName: senderName.trim(),
        senderEmail: senderEmail.trim(),
        senderPhone: senderPhone.trim() || undefined,
        subject: subjectTitle,
        message: message.trim(),
        hasPreApproval,
        requestCallback
      });

      setSubmittedInquiryId(inquiryId);
    } catch (err: any) {
      setError(err?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-xl w-full my-auto shadow-2xl border border-slate-100 overflow-hidden relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0c2340] text-white flex items-center justify-center shadow-xs">
              <MessageSquare className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Contact Listing Agent
              </h3>
              <p className="text-xs text-slate-500">
                Direct inquiry to {property.sellerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {submittedInquiryId ? (
          <div className="p-6 sm:p-8 text-center space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/60">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-extrabold text-slate-900">
                Message Successfully Sent!
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Your inquiry has been delivered directly to <strong className="text-slate-900 font-semibold">{property.sellerName}</strong>. A confirmation has been recorded for this listing.
              </p>
            </div>

            {/* Recipient Details & Immediate Direct Contact Options */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100 text-left space-y-3">
              <p className="text-xs uppercase tracking-wider font-bold text-slate-400">Agent Contact Information</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#0c2340] text-white flex items-center justify-center font-bold text-base shadow-xs">
                  {property.sellerName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{property.sellerName}</p>
                  <p className="text-xs text-slate-500 truncate">{property.sellerEmail}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                {property.sellerPhone && (
                  <a 
                    href={`tel:${property.sellerPhone}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:border-blue-500 hover:text-blue-700 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span className="truncate">Call: {property.sellerPhone}</span>
                  </a>
                )}
                <a 
                  href={`mailto:${property.sellerEmail}?subject=${encodeURIComponent(`Inquiry regarding ${property.title}`)}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:border-blue-500 hover:text-blue-700 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span className="truncate">Email Directly</span>
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSubmittedInquiryId(null);
                  setMessage(generatePrefilledMessage(property, selectedTopic, senderName));
                }}
                className="flex-1 py-3 px-4 border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
              >
                Send Another Note
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-[#0c2340] hover:bg-[#16355d] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[82vh] overflow-y-auto">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center justify-between animate-shake">
                <span>{error}</span>
                <button 
                  type="button" 
                  onClick={() => setError(null)} 
                  className="text-rose-500 hover:text-rose-700 text-sm font-bold"
                >
                  ×
                </button>
              </div>
            )}

            {/* Property & Agent Summary Banner */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img 
                  src={property.imageUrl} 
                  alt={property.title}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200" 
                />
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {property.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    {property.location.address}, {property.location.city}
                  </p>
                  <p className="text-xs font-bold text-[#0c2340] mt-0.5">
                    {formattedPrice}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 border-l border-slate-200/70 pl-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Agent
                </span>
                <span className="text-xs font-bold text-slate-800 block">
                  {property.sellerName}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              </div>
            </div>

            {/* Quick Topic Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Select Inquiry Subject</span>
                <span className="text-[11px] text-blue-600 font-normal flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Auto-updates message
                </span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {INQUIRY_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleTopicChange(topic.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedTopic === topic.id
                        ? 'bg-[#0c2340] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {topic.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sender Contact Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={senderName}
                  onChange={(e) => {
                    setSenderName(e.target.value);
                  }}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="jane@example.com"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number <span className="text-slate-400 font-normal">(Optional for faster response)</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Pre-filled Message Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Your Message to {property.sellerName} <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400 font-medium">
                  Pre-filled & editable
                </span>
              </div>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message to the agent here..."
                className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent leading-relaxed transition-all"
              />
            </div>

            {/* Helper Checkboxes */}
            <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100 space-y-2 text-xs">
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasPreApproval}
                  onChange={(e) => setHasPreApproval(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>I have mortgage pre-approval / proof of funds ready</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={requestCallback}
                  onChange={(e) => setRequestCallback(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Please call me via phone regarding this listing</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#0c2340] hover:bg-[#16355d] text-white px-7 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-blue-300" />
                    <span>Send Message to Agent</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
