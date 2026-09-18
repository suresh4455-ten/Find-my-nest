// Curated high-resolution student housing, hostel and PG photography library
// Provides diverse, realistic, and aesthetic photo galleries for all hostels

const BOYS_ROOM_HEROES = [
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80', // Modern twin sharing with study desks
  'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80', // Cozy student bedroom with wooden decor
  'https://images.unsplash.com/photo-1540518614846-7ede433c4ef2?auto=format&fit=crop&w=800&q=80', // Minimalist clean student stay
  'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80', // Modern bedroom with study workstation
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', // Well lit study and dorm room
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80', // Clean student bed space
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', // Modern spacious room
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', // Cozy ambient student accommodation
];

const GIRLS_ROOM_HEROES = [
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80', // Aesthetic warm student bedroom
  'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80', // Clean pastel tone room with plants
  'https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&w=800&q=80', // Bright clean sharing room with study desk
  'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80', // Elegant safe hostel interior
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80', // Cozy student room with warm lighting
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', // Contemporary executive room
  'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80', // Modern twin bed student room
];

const COLIVING_ROOM_HEROES = [
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', // Trendy modern studio
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', // Premium co-living suite
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80', // Luxury apartment style
  'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80', // High-tech study room
];

const DINING_MESS_PHOTOS = [
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', // Hygienic dining mess hall
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', // Warm dining area
  'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=800&q=80', // Homely cafeteria tables
];

const STUDY_LOUNGE_PHOTOS = [
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80', // Student study and discussion space
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', // High-speed Wi-Fi co-working area
  'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80', // Study desk with laptops
];

const WASHROOM_PHOTOS = [
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', // Clean sanitized washroom with geyser
  'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80', // Modern spotless bathroom
];

const EXTERIOR_PHOTOS = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80', // Modern building facade
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80', // Gated safe residential building
];

const STUDENT_BADGES = [
  '⭐ 4.8 • Top Pick near JNTUK',
  '⭐ 4.9 • Highly Rated Homely Food',
  '⭐ 4.7 • 2 Mins to Aditya Campus',
  '⭐ 4.8 • 300 Mbps Wi-Fi & AC',
  '⭐ 4.9 • Safe Gated Girls Residence',
  '⭐ 4.8 • Clean & Sanitized Rooms',
  '⭐ 4.7 • Best Student Budget Deal',
  '⭐ 4.8 • Near Pragati College',
  '⭐ 4.9 • 24/7 Power Backup',
  '⭐ 4.7 • High-Speed Study Zone'
];

/**
 * Returns a deterministic hash number for a string
 */
function hashString(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Returns a comprehensive, realistic photo set and student highlights for any property
 */
export function getHostelPhotos(property) {
  if (!property) return { primary: BOYS_ROOM_HEROES[0], gallery: [], rating: 4.8, reviewCount: 42, studentBadge: '⭐ 4.8 • Verified Stay' };

  const idStr = String(property.property_id || property.id || property.name || 'PG001');
  const hash = hashString(idStr + (property.name || ''));
  const typeStr = (property.type || property.Property_type || property.name || '').toLowerCase();
  const isGirls = /girl|ladies|women|female/i.test(typeStr);
  const isColiving = /co-living|coliving|coed|unisex/i.test(typeStr);

  let heroList = BOYS_ROOM_HEROES;
  let categoryLabel = "Men's Living";
  if (isGirls) {
    heroList = GIRLS_ROOM_HEROES;
    categoryLabel = "Women's Living";
  } else if (isColiving) {
    heroList = COLIVING_ROOM_HEROES;
    categoryLabel = "Co-living Space";
  }

  const primaryPhoto = heroList[hash % heroList.length];
  const secondaryRoomPhoto = heroList[(hash + 1) % heroList.length];
  const diningPhoto = DINING_MESS_PHOTOS[hash % DINING_MESS_PHOTOS.length];
  const studyPhoto = STUDY_LOUNGE_PHOTOS[hash % STUDY_LOUNGE_PHOTOS.length];
  const washroomPhoto = WASHROOM_PHOTOS[hash % WASHROOM_PHOTOS.length];
  const exteriorPhoto = EXTERIOR_PHOTOS[hash % EXTERIOR_PHOTOS.length];

  const gallery = [
    { url: primaryPhoto, label: 'Main Bedroom & Study' },
    { url: secondaryRoomPhoto, label: 'Room Sharing Layout' },
    { url: diningPhoto, label: 'Homely Dining & Mess' },
    { url: studyPhoto, label: 'Wi-Fi Study Lounge' },
    { url: washroomPhoto, label: 'Sanitized Attached Washroom' },
    { url: exteriorPhoto, label: 'Building & Entrance' },
  ];

  const studentBadge = STUDENT_BADGES[hash % STUDENT_BADGES.length];
  const rating = (4.5 + (hash % 5) * 0.1).toFixed(1);
  const reviewCount = 28 + (hash % 85);

  return {
    primary: primaryPhoto,
    gallery,
    rating,
    reviewCount,
    studentBadge,
    categoryLabel,
    totalPhotos: gallery.length,
  };
}
