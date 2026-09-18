import React, { useState } from 'react';
import { 
  X, ShieldCheck, AlertTriangle, MapPin, Phone, Mail, CheckCircle2, 
  IndianRupee, BedDouble, Clock, Utensils, Wifi, ExternalLink, 
  ChevronLeft, ChevronRight, Star, MessageSquare, Compass, Shield, Sparkles
} from 'lucide-react';
import { getHostelPhotos } from '../utils/hostelImages';

export default function PropertyDetailModal({ property, onClose }) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!property) return null;

  const isVerified = property.is_verified === true || property.is_verified === 'True' || property.is_verified === 1;
  const photoData = getHostelPhotos(property);
  const gallery = photoData.gallery || [{ url: photoData.primary, label: 'Hostel View' }];
  const currentPhoto = gallery[activePhotoIdx] || gallery[0];

  const amenities = property.amenities ? property.amenities.split(',').map(a => a.trim()).filter(Boolean) : [];
  const rules = property.rules ? property.rules.split(';').map(r => r.trim()).filter(Boolean) : [];

  const handlePrevPhoto = (e) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNextPhoto = (e) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  // Clean phone number for tel: and whatsapp:
  const rawPhone = property.phone || property.Contact || '';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col"
      >
        
        {/* Sticky Header with Close Button */}
        <div className="sticky top-0 z-20 px-6 py-4 bg-white/95 backdrop-blur-md border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-900 text-white">
              {property.property_id || property.id}
            </span>
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
              {property.type || property.Property_type || 'Student PG & Hostel'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">

          {/* Interactive Photo Gallery Hero */}
          <div className="space-y-3">
            <div className="relative h-64 sm:h-80 w-full rounded-3xl overflow-hidden bg-slate-950 shadow-inner group">
              <img
                src={currentPhoto.url}
                alt={currentPhoto.label}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Navigation Arrows */}
              <button
                onClick={handlePrevPhoto}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer shadow-md"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNextPhoto}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer shadow-md"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Photo Label Pill */}
              <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-2 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{currentPhoto.label}</span>
                <span className="text-slate-400 text-[10px]">({activePhotoIdx + 1}/{gallery.length})</span>
              </div>

              {/* Verified Badge */}
              <div className="absolute top-3 right-3">
                {isVerified ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shadow-md">
                    <ShieldCheck className="w-4 h-4" /> Official Verified
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center gap-1 shadow-md">
                    <AlertTriangle className="w-4 h-4" /> Public Directory
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail selector strip */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {gallery.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`relative h-16 w-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activePhotoIdx === idx
                      ? 'border-sky-500 ring-2 ring-sky-400/30 scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[8px] font-bold text-center py-0.5 truncate px-1">
                    {photo.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Title & Ratings Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <div className="flex items-center bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs font-black">
                <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600 mr-1" />
                <span>{photoData.rating}</span>
                <span className="text-slate-400 font-medium ml-1">({photoData.reviewCount} student reviews)</span>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                {photoData.studentBadge}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {property.name || property.Business_Name}
            </h2>

            <div className="flex items-center text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              <MapPin className="w-4 h-4 text-sky-600 mr-1.5 shrink-0" />
              <span>{property.address || property.location || property.Location}</span>
            </div>
          </div>

          {/* Unverified Disclaimer Alert */}
          {!isVerified && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs leading-relaxed flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Public Directory Listing:</span> Pricing and availability are subject to direct confirmation with the property owner.
              </div>
            </div>
          )}

          {/* Pricing and Room Sharing Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-sky-50/90 border border-sky-100">
              <div className="text-[11px] font-bold text-sky-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5" />
                <span>Monthly Rent & Deposit</span>
              </div>
              <div className="text-base sm:text-lg font-extrabold text-sky-950">
                {property.pricing || property.Monthly_rent || 'Confirm with property'}
              </div>
              {property.Security_deposit && (
                <div className="text-xs text-slate-500 mt-1">
                  Deposit: {property.Security_deposit}
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5 text-indigo-600" />
                <span>Room Types Available</span>
              </div>
              <div className="text-sm font-bold text-slate-800">
                {property.room_types || property.Room_types || 'Single, Double, Triple sharing'}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Status: {property.availability || 'Subject to vacancy query'}
              </div>
            </div>
          </div>

          {/* Student Proximity & College Hubs */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
            <div className="flex items-center gap-2 mb-2 text-xs font-extrabold text-sky-400 uppercase tracking-wider">
              <Compass className="w-4 h-4 text-sky-400" />
              <span>Nearby Academic Landmarks & Hubs</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px]">Location Hub</span>
                <span className="font-bold">{property.location || 'Kakinada'}</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px]">Prime Landmark</span>
                <span className="font-bold truncate block">{property.map_landmark || 'Central Kakinada'}</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px]">Student Rating</span>
                <span className="font-bold text-amber-400">⭐ {photoData.rating} / 5.0</span>
              </div>
            </div>
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                Included Amenities & Facilities
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center text-xs font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-2 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules & Curfew */}
          {rules.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                Hostel Rules & Curfew Timings
              </h4>
              <div className="space-y-1.5">
                {rules.map((rule, idx) => (
                  <div key={idx} className="flex items-start text-xs text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/80">
                    <Clock className="w-3.5 h-3.5 text-sky-600 mr-2 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Map Location Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span>Verified Map Location</span>
              </h4>
              {property.latitude && (
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {property.latitude}° N, {property.longitude}° E
                </span>
              )}
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner h-44 relative bg-slate-100">
              {property.latitude && property.longitude ? (
                <iframe
                  title="Property Map Location"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(property.longitude) - 0.008}%2C${parseFloat(property.latitude) - 0.006}%2C${parseFloat(property.longitude) + 0.008}%2C${parseFloat(property.latitude) + 0.006}&layer=mapnik&marker=${property.latitude}%2C${property.longitude}`}
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  Location: {property.location}, Kakinada
                </div>
              )}
            </div>
            {property.map_landmark && (
              <p className="text-xs text-slate-500 mt-1.5 font-medium">
                📍 <strong>Landmark:</strong> {property.map_landmark}
              </p>
            )}
          </div>

          {/* Direct Student Contact Actions */}
          <div className="p-4 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
            <div className="text-xs space-y-1 w-full sm:w-auto">
              <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-bold">Contact Management</span>
              <div className="flex items-center gap-2 font-mono font-bold text-sm text-emerald-400">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{property.phone || property.Contact || 'Not publicly verified'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {cleanPhone && (
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
              )}

              <a
                href={property.google_maps_url || property.Google_Maps || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((property.name || '') + ' ' + (property.location || 'Kakinada'))}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
