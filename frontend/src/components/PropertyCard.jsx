import React from 'react';
import { ShieldCheck, AlertTriangle, MapPin, IndianRupee, BedDouble, Wifi, Utensils, Wind, Camera, Star, ExternalLink, Heart } from 'lucide-react';
import { getHostelPhotos } from '../utils/hostelImages';

export default function PropertyCard({ property, onSelect }) {
  const isVerified = property.is_verified === true || property.is_verified === 'True' || property.is_verified === 1;

  // Extract amenities
  const rawAmenities = property.amenities || '';
  const hasWifi = /wifi|wi-fi|internet/i.test(rawAmenities);
  const hasFood = /food|meals|biryani|curry/i.test(rawAmenities);
  const hasAC = /ac|air condition/i.test(rawAmenities);

  // Dynamic photo & student meta
  const photoData = getHostelPhotos(property);

  // Gender / Category badge
  const typeStr = (property.type || property.Property_type || property.name || '').toLowerCase();
  let genderLabel = 'Co-living';
  let genderBadgeClass = 'bg-purple-100 text-purple-700 border-purple-200';
  if (/boy|men|male/i.test(typeStr)) {
    genderLabel = "Boys / Men's";
    genderBadgeClass = 'bg-blue-100 text-blue-700 border-blue-200';
  } else if (/girl|ladies|women|female/i.test(typeStr)) {
    genderLabel = "Girls / Ladies";
    genderBadgeClass = 'bg-pink-100 text-pink-700 border-pink-200';
  }

  return (
    <div
      onClick={() => onSelect && onSelect(property)}
      className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col group hover:-translate-y-1"
    >
      {/* Card Image Header */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-900">
        <img
          src={photoData.primary}
          alt={property.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.95] group-hover:brightness-100"
        />

        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          {/* Gender tag */}
          <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md ${genderBadgeClass}`}>
            {genderLabel}
          </span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-900/80 text-white backdrop-blur-sm border border-white/10">
            {property.property_id || property.id}
          </span>
        </div>

        {/* Top Right: Verified / Public Directory & Photos count */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-10">
          {isVerified ? (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600/95 text-white text-[11px] font-extrabold shadow-md backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Official</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/95 text-white text-[11px] font-extrabold shadow-md backdrop-blur-sm">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Public Directory</span>
            </div>
          )}

          {/* Photo Count Pill */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-md border border-white/20">
            <Camera className="w-3 h-3 text-sky-400" />
            <span>{photoData.totalPhotos} Photos</span>
          </div>
        </div>

        {/* Student Special Highlight Tag */}
        <div className="absolute bottom-12 left-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-slate-950/70 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-amber-400/20">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{photoData.studentBadge}</span>
          </span>
        </div>

        {/* Price Overlay Banner */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-white border border-white/10 z-10">
          <div className="flex items-center text-xs font-bold text-emerald-400">
            <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
            <span className="text-sm font-extrabold">{property.pricing || property.Monthly_rent || 'Confirm with property'}</span>
          </div>
          <span className="text-[10px] text-slate-300 font-medium">/ month</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating and Reviews */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1">
              <div className="flex items-center bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200 text-xs font-black">
                <Star className="w-3 h-3 fill-emerald-600 text-emerald-600 mr-0.5" />
                <span>{photoData.rating}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                ({photoData.reviewCount} student reviews)
              </span>
            </div>
            <span className="text-[11px] font-bold text-sky-600">
              {property.location || 'Kakinada'}
            </span>
          </div>

          {/* Property Name */}
          <h3 className="text-base font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
            {property.name || property.Business_Name}
          </h3>

          {/* Landmark location */}
          <div className="flex items-center text-xs text-slate-500 mt-1 mb-2.5">
            <MapPin className="w-3.5 h-3.5 text-sky-600 mr-1 shrink-0" />
            <span className="line-clamp-1 font-medium">
              {property.map_landmark || property.address || property.location}
            </span>
          </div>

          {/* Room types */}
          <div className="flex items-center text-xs text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70 mb-3">
            <BedDouble className="w-3.5 h-3.5 mr-1.5 text-indigo-500 shrink-0" />
            <span className="line-clamp-1 font-semibold">{property.room_types || property.Room_types || 'Single, Double, Triple sharing'}</span>
          </div>

          {/* Feature Badges */}
          <div className="flex items-center gap-1.5 mb-3 text-xs text-slate-600 flex-wrap">
            {hasWifi && (
              <span className="flex items-center gap-1 bg-sky-50 text-sky-700 px-2.5 py-0.5 rounded-lg border border-sky-200/60 font-medium text-[11px]">
                <Wifi className="w-3 h-3 text-sky-600" /> Free Wi-Fi
              </span>
            )}
            {hasFood && (
              <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-lg border border-amber-200/60 font-medium text-[11px]">
                <Utensils className="w-3 h-3 text-amber-600" /> Homely Food
              </span>
            )}
            {hasAC && (
              <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-lg border border-emerald-200/60 font-medium text-[11px]">
                <Wind className="w-3 h-3 text-emerald-600" /> AC Available
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <a
            href={property.google_maps_url || property.Google_Maps || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((property.name || '') + ' ' + (property.location || 'Kakinada'))}`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-bold text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-xl border border-sky-200 flex items-center gap-1 transition-all"
            title="Open Live Google Maps"
          >
            <MapPin className="w-3 h-3 text-sky-600" />
            <span>Map</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
          </a>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect && onSelect(property);
            }}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <span>View Photos & Info</span>
          </button>
        </div>
      </div>
    </div>
  );
}
