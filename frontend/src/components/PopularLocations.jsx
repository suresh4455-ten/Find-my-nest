import React from 'react';
import { MapPin, GraduationCap, Building2, Landmark, Compass, Navigation, Bus, Store, School } from 'lucide-react';

const KAKINADA_LOCALITIES = [
  {
    name: 'All Kakinada',
    location: 'Kakinada',
    landmark: 'Entire City',
    tag: 'All Areas',
    icon: Compass,
    color: 'from-sky-500 to-blue-600'
  },
  {
    name: 'Ramanayyapeta',
    location: 'Ramanayyapeta',
    landmark: 'Near JNTUK & Veg Market',
    tag: 'Student Hub',
    icon: GraduationCap,
    color: 'from-emerald-500 to-teal-600'
  },
  {
    name: 'Ayodhya Nagar',
    location: 'Ayodhya Nagar',
    landmark: 'Opp. Aditya Campus Road 4',
    tag: 'Colleges Hub',
    icon: School,
    color: 'from-blue-500 to-indigo-600'
  },
  {
    name: 'Bhanugudi Junction',
    location: 'Bhanugudi',
    landmark: 'Near Safe Hospital & Trends',
    tag: 'City Central',
    icon: Landmark,
    color: 'from-purple-500 to-pink-600'
  },
  {
    name: 'Venkat Nagar',
    location: 'Venkat Nagar',
    landmark: 'Opp. Pragati College',
    tag: 'Dwaraka Nagar',
    icon: Building2,
    color: 'from-amber-500 to-orange-600'
  },
  {
    name: 'Santhi Nagar / G O Colony',
    location: 'Santhi Nagar',
    landmark: 'Postal Colony & Aditya Womens',
    tag: 'Safe Locality',
    icon: Building2,
    color: 'from-teal-500 to-emerald-600'
  },
  {
    name: 'Kannayya Kapu Nagar',
    location: 'Kannayya Kapu',
    landmark: 'Main Boys PG Area',
    tag: 'Hostel Zone',
    icon: Navigation,
    color: 'from-rose-500 to-red-600'
  },
  {
    name: 'RTC Complex Area',
    location: 'RTC Complex',
    landmark: 'Central Bus Stand Area',
    tag: 'Transit Hub',
    icon: Bus,
    color: 'from-indigo-500 to-violet-600'
  }
];

export default function PopularLocations({ activeLocality, onSelectLocality }) {
  return (
    <section className="py-6">
      
      {/* Heading specialized for Kakinada */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-bold mb-2">
            <MapPin className="w-3.5 h-3.5 text-sky-600" />
            <span>Kakinada, Andhra Pradesh</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Popular Areas in Kakinada
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Explore verified student hostels and working professionals PGs across key Kakinada hubs.
          </p>
        </div>

        {activeLocality && (
          <button
            onClick={() => onSelectLocality('')}
            className="text-xs font-bold text-sky-600 hover:text-sky-800 bg-sky-50 px-3.5 py-1.5 rounded-xl border border-sky-200 mt-2 sm:mt-0"
          >
            Show All Kakinada (Reset Filter)
          </button>
        )}
      </div>

      {/* Grid / Horizontal Carousel of Kakinada Localities */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {KAKINADA_LOCALITIES.map((loc, idx) => {
          const Icon = loc.icon;
          const isSelected = activeLocality === loc.location || (loc.location === 'Kakinada' && !activeLocality);

          return (
            <button
              key={idx}
              onClick={() => onSelectLocality && onSelectLocality(loc.location === 'Kakinada' ? '' : loc.location)}
              className={`flex flex-col items-center text-center p-3.5 rounded-2xl transition-all duration-200 group border ${
                isSelected
                  ? 'bg-sky-50 border-sky-500 shadow-md ring-2 ring-sky-500/20 scale-[1.02]'
                  : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${loc.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-200 mb-2`}
              >
                <Icon className="w-6 h-6" />
              </div>

              {/* Locality Name */}
              <span className="text-xs font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
                {loc.name}
              </span>

              {/* Landmark info */}
              <span className="text-[10px] text-slate-400 font-medium line-clamp-1 mt-0.5">
                {loc.landmark}
              </span>

              {/* Tag pill */}
              <span className="mt-2 text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/80">
                {loc.tag}
              </span>
            </button>
          );
        })}
      </div>

    </section>
  );
}
