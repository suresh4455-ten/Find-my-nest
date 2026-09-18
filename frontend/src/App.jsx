import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PopularLocations from './components/PopularLocations';
import PropertyCard from './components/PropertyCard';
import ChatBox from './components/ChatBox';
import PropertyDetailModal from './components/PropertyDetailModal';
import AboutModal from './components/AboutModal';
import LoginModal from './components/LoginModal';
import FloatingAiButton from './components/FloatingAiButton';
import CityMapModal from './components/CityMapModal';
import { Search, Building, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'chat'
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('findmyhostel_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeLocality, setActiveLocality] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All'); // 'All' | 'Boys' | 'Girls' | 'AC' | 'Food' | 'Budget'
  const [searchTerm, setSearchTerm] = useState('');
  const propertiesSectionRef = useRef(null);

  // Sync user state to localStorage
  const handleLogin = (authedUser) => {
    setUser(authedUser);
    localStorage.setItem('findmyhostel_user', JSON.stringify(authedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('findmyhostel_user');
  };

  // Fetch properties from backend
  useEffect(() => {
    fetch('http://localhost:8000/api/properties')
      .then((res) => res.json())
      .then((data) => {
        if (data.properties) {
          setProperties(data.properties);
        }
      })
      .catch((err) => console.error('Failed to load properties:', err));
  }, []);

  // Filter properties logic for Explore view
  const filteredProperties = properties.filter((p) => {
    // Locality filter
    if (activeLocality) {
      const loc = `${p.location || ''} ${p.address || ''} ${p.name || ''}`.toLowerCase();
      if (!loc.includes(activeLocality.toLowerCase())) return false;
    }

    // Text search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const combined = `${p.name || ''} ${p.location || ''} ${p.address || ''} ${p.type || ''} ${p.amenities || ''}`.toLowerCase();
      if (!combined.includes(term)) return false;
    }

    // Category chips filter
    const typeStr = (p.type || p.name || '').toLowerCase();
    const amenStr = (p.amenities || '').toLowerCase();
    const pricingStr = (p.pricing || p.Monthly_rent || '').toLowerCase();

    if (activeCategoryFilter === 'Boys') {
      if (!/boy|men|male/i.test(typeStr)) return false;
    } else if (activeCategoryFilter === 'Girls') {
      if (!/girl|ladies|women|female/i.test(typeStr)) return false;
    } else if (activeCategoryFilter === 'AC') {
      if (!/ac|air condition/i.test(amenStr) && !/ac/i.test(typeStr)) return false;
    } else if (activeCategoryFilter === 'Food') {
      if (!/food|meals|biryani|curry/i.test(amenStr)) return false;
    } else if (activeCategoryFilter === 'Budget') {
      if (!/₹[456],\d{3}/i.test(pricingStr) && !/4,\d{3}|5,\d{3}|6,\d{3}/i.test(pricingStr)) return false;
    }

    return true;
  });

  const handleHeroSearch = ({ location, gender }) => {
    if (location) {
      setActiveLocality(location);
      setSearchTerm(location);
    } else {
      setActiveLocality('');
      setSearchTerm('');
    }

    if (gender === 'Men') setActiveCategoryFilter('Boys');
    else if (gender === 'Women') setActiveCategoryFilter('Girls');
    else setActiveCategoryFilter('All');

    // Smooth scroll down to the properties section
    setTimeout(() => {
      propertiesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const clearAllFilters = () => {
    setActiveLocality('');
    setActiveCategoryFilter('All');
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-sky-500/20 selection:text-sky-700 relative">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAbout={() => setAboutOpen(true)}
        user={user}
        onOpenLogin={() => setLoginOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        {/* VIEW 1: EXPLORE STAYS (HOME) */}
        {activeTab === 'explore' && (
          <div className="space-y-6">
            
            {/* 1. Hero Section Banner with Capsule Search & Map Trigger */}
            <HeroSection
              onSearch={handleHeroSearch}
              onOpenChat={() => setActiveTab('chat')}
              onOpenAbout={() => setAboutOpen(true)}
              onOpenMap={() => setMapOpen(true)}
            />

            {/* 2. Popular Localities Bar */}
            <PopularLocations
              activeLocality={activeLocality}
              onSelectLocality={(loc) => {
                const newLoc = loc === activeLocality ? '' : loc;
                setActiveLocality(newLoc);
                setSearchTerm(newLoc);
                if (newLoc) {
                  setTimeout(() => {
                    propertiesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
            />

            {/* 3. Filter Chips & Quick Controls */}
            <div ref={propertiesSectionRef} className="pt-6 border-t border-slate-200">
              
              {/* Active Search / Locality Filter Banner */}
              {(activeLocality || searchTerm || activeCategoryFilter !== 'All') && (
                <div className="mb-5 p-3.5 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-900">
                    <Search className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>
                      Active Search Filter: 
                      {activeLocality && <span className="ml-1 px-2 py-0.5 rounded bg-sky-200 text-sky-800">Area: {activeLocality}</span>}
                      {searchTerm && searchTerm !== activeLocality && <span className="ml-1 px-2 py-0.5 rounded bg-sky-200 text-sky-800">Keyword: "{searchTerm}"</span>}
                      {activeCategoryFilter !== 'All' && <span className="ml-1 px-2 py-0.5 rounded bg-sky-200 text-sky-800">Category: {activeCategoryFilter}</span>}
                      <span className="ml-2 font-normal text-sky-700">({filteredProperties.length} hostels found)</span>
                    </span>
                  </div>
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 bg-white px-3 py-1 rounded-xl border border-sky-300 shadow-sm transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Clear Search</span>
                  </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                
                {/* Category Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                  {[
                    { id: 'All', label: 'All Hostels & PGs' },
                    { id: 'Boys', label: "Boys / Men's" },
                    { id: 'Girls', label: "Girls / Ladies" },
                    { id: 'Food', label: 'Food Included' },
                    { id: 'AC', label: 'AC Rooms' },
                    { id: 'Budget', label: 'Budget (Under ₹7k)' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategoryFilter(cat.id)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 border ${
                        activeCategoryFilter === cat.id
                          ? 'bg-sky-600 text-white border-sky-600 shadow-md scale-105'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Properties Count */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-slate-500">
                    Showing {filteredProperties.length} Accommodations
                  </span>
                </div>

              </div>

              {/* 4. Properties Grid */}
              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProperties.map((prop, idx) => (
                    <PropertyCard
                      key={idx}
                      property={prop}
                      onSelect={(p) => setSelectedProperty(p)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200 shadow-sm">
                  <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-700">No properties found matching "{activeLocality || searchTerm}"</h3>
                  <p className="text-xs text-slate-400 mt-1">Try resetting the search or exploring other localities in Kakinada.</p>
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    View All Kakinada Hostels
                  </button>
                </div>
              )}

            </div>

          </div>
        )}

        {/* VIEW 2: AI ASSISTANT CHAT */}
        {activeTab === 'chat' && (
          <div className="animate-fade-in">
            <ChatBox
              properties={properties}
              onSelectProperty={(p) => setSelectedProperty(p)}
            />
          </div>
        )}

      </main>

      {/* Floating AI Assistant Button (Bottom Right) */}
      <FloatingAiButton
        activeTab={activeTab}
        onToggleChat={() => setActiveTab(activeTab === 'chat' ? 'explore' : 'chat')}
      />

      {/* Property Details Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />

      {/* About Platform Modal */}
      <AboutModal
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
      />

      {/* Interactive City Map Modal */}
      <CityMapModal
        isOpen={mapOpen}
        onClose={() => setMapOpen(false)}
        properties={properties}
        onSelectProperty={(p) => setSelectedProperty(p)}
      />

      {/* Professional Login Modal */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

    </div>
  );
}


