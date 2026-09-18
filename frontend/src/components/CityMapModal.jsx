import React, { useState } from 'react';
import { X, MapPin, ExternalLink, Navigation, ShieldCheck, Filter, IndianRupee, Layers, Star } from 'lucide-react';
import { getHostelPhotos } from '../utils/hostelImages';

export default function CityMapModal({ isOpen, onClose, properties, onSelectProperty }) {
  const [selectedProp, setSelectedProp] = useState(null);
  const [filterGender, setFilterGender] = useState('All');

  if (!isOpen) return null;

  const filteredProps = properties.filter((p) => {
    if (filterGender === 'All') return true;
    const typeStr = (p.type || p.name || '').toLowerCase();
    if (filterGender === 'Boys') return /boy|men|male/i.test(typeStr);
    if (filterGender === 'Girls') return /girl|ladies|women|female/i.test(typeStr);
    if (filterGender === 'Coliving') return /co-living|coliving/i.test(typeStr);
    return true;
  });

  const activeProp = selectedProp || filteredProps[0] || properties[0];
  const lat = activeProp?.latitude || 16.9891;
  const lng = activeProp?.longitude || 82.2475;
  const activePhoto = activeProp ? getHostelPhotos(activeProp) : null;

  // OpenStreetMap embed URL centered at the selected property
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.015}%2C${lat - 0.012}%2C${lng + 0.015}%2C${lat + 0.012}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl h-[88vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
      >
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Kakinada & Student Localities Map</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase font-mono border border-emerald-500/30">
                  Live Coordinates
                </span>
              </div>
              <p className="text-xs text-slate-400">Interactive geo-locations with live photo views</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter buttons */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl">
              {['All', 'Boys', 'Girls', 'Coliving'].map((g) => (
                <button
                  key={g}
                  onClick={() => setFilterGender(g)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    filterGender === g
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Map & List Split View */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left: Property Selector List (5 cols) */}
          <div className="lg:col-span-4 border-r border-slate-200 overflow-y-auto p-4 space-y-3 bg-slate-50/70">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Accommodations ({filteredProps.length})</span>
              <span className="text-[10px] text-sky-600 lowercase font-medium">Click to focus on map</span>
            </div>

            {filteredProps.map((prop) => {
              const isSelected = activeProp?.property_id === prop.property_id;
              const propPhoto = getHostelPhotos(prop);

              return (
                <div
                  key={prop.property_id}
                  onClick={() => setSelectedProp(prop)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                    isSelected
                      ? 'bg-white border-sky-500 shadow-md ring-2 ring-sky-500/20'
                      : 'bg-white hover:bg-slate-100/80 border-slate-200 shadow-sm'
                  }`}
                >
                  {/* Thumbnail */}
                  <img
                    src={propPhoto.primary}
                    alt={prop.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-200"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-extrabold text-xs text-slate-900 truncate">
                          {prop.name}
                        </h4>
                        <span className="text-[9px] font-mono font-bold px-1 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                          {prop.property_id}
                        </span>
                      </div>

                      <div className="flex items-center text-[11px] text-slate-500 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-sky-600 mr-1 shrink-0" />
                        <span className="truncate">{prop.map_landmark || prop.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-slate-100 text-[11px]">
                      <span className="font-bold text-emerald-600">
                        {prop.pricing?.split(';')[0]?.split('(')[0] || prop.pricing}
                      </span>
                      <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                        <span>{propPhoto.rating}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Embedded Interactive Map & Pin Details (8 cols) */}
          <div className="lg:col-span-8 relative flex flex-col bg-slate-100 h-full">
            
            {/* Embedded Live Map Iframe */}
            <div className="flex-1 relative w-full h-full">
              <iframe
                title="Property Map Location"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src={mapEmbedUrl}
                className="w-full h-full border-0"
              />

              {/* Floating Map Pin Badge */}
              {activeProp && (
                <div className="absolute top-4 left-4 right-4 sm:right-auto z-10 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl max-w-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={activePhoto?.primary}
                      alt={activeProp.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-sm"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 text-[9px] font-mono font-bold">
                          {activeProp.property_id}
                        </span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          ⭐ {activePhoto?.rating}
                        </span>
                      </div>
                      <h3 className="text-xs font-black text-slate-900 truncate">
                        {activeProp.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        📍 {activeProp.map_landmark || activeProp.location}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <a
                      href={activeProp.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeProp.name + ' ' + activeProp.location)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-1.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Directions</span>
                    </a>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectProperty && onSelectProperty(activeProp);
                      }}
                      className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                    >
                      View Photos
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
