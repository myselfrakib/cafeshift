import { CALCUTTA_AREAS } from '../data/seedData';

// Google Maps API Key from Firebase Config
const GOOGLE_MAPS_API_KEY = "AIzaSyCTB7d1-tjzU3DG0tvmkh1lWiZcmba10XI";

// Indexed directory of iconic & popular Kolkata cafes for instant zero-latency suggestions
export const KOLKATA_CAFE_DIRECTORY = [
  {
    name: "Roastery Coffee House",
    area: "Hindustan Park",
    address: "70B, Hindustan Park, Gariahat, Kolkata, West Bengal 700029",
    description: "Specialty coffee roastery in a heritage Calcutta courtyard serving manual brews and comfort brunch.",
    photoUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 140
  },
  {
    name: "Blue Tokai Coffee Roasters - Park Street",
    area: "Park Street",
    address: "Park Center Building, 24 Park Street, Park Street area, Kolkata, West Bengal 700016",
    description: "India's premier specialty coffee chain roasting 100% Arabica estates with pour-overs and cold brews.",
    photoUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 150
  },
  {
    name: "Blue Tokai Coffee Roasters - Southern Avenue",
    area: "Southern Avenue",
    address: "56A, Hemanta Mukherjee Sarani, Lake Market, Kalighat, Kolkata, West Bengal 700029",
    description: "Serene cafe facing the Southern Avenue lakes with single-origin pour-overs and artisanal sourdough.",
    photoUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 150
  },
  {
    name: "Blue Tokai Coffee Roasters - Salt Lake",
    area: "Salt Lake Sector 5",
    address: "Ground Floor, Godrej Genesis, EP Block, Sector V, Bidhannagar, Kolkata, West Bengal 700091",
    description: "Bustling IT hub cafe serving tech professionals and college interns with premium espresso brews.",
    photoUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 140
  },
  {
    name: "8th Day Cafe & Bakery - Park Circus",
    area: "Park Street",
    address: "Arcadia, 6, West Range, Mullick Bazar, Park Circus, Kolkata, West Bengal 700017",
    description: "American-style specialty cafe famed for house bagels, cinnamon rolls, and handcrafted espresso.",
    photoUrl: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 135
  },
  {
    name: "8th Day Cafe & Bakery - Southern Avenue",
    area: "Southern Avenue",
    address: "11, Jatin Bagchi Rd, Hindustan Park, Gariahat, Kolkata, West Bengal 700029",
    description: "Cozy community space with fresh bakes, nitro cold brew, and quiet reading nooks.",
    photoUrl: "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 135
  },
  {
    name: "Sienna Store & Cafe",
    area: "Hindustan Park",
    address: "49/1, Hindustan Park, Gariahat, Kolkata, West Bengal 700029",
    description: "Celebrated artisan cafe with farm-to-table seasonal menus, handcrafted pottery, and pour-overs.",
    photoUrl: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 145
  },
  {
    name: "The Daily Cafe",
    area: "Ballygunge",
    address: "5, Satyen Dutta Rd, Deshapriya Park, Kalighat, Kolkata, West Bengal 700029",
    description: "Aesthetic pastel cafe serving gourmet toasts, specialty coffees, and healthy smoothie bowls.",
    photoUrl: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 140
  },
  {
    name: "Flurys - Heritage Tearoom",
    area: "Park Street",
    address: "18A, Park Street, Park Street area, Kolkata, West Bengal 700071",
    description: "Historic tearoom established in 1927, iconic for English breakfasts, rum balls, and Darjeeling teas.",
    photoUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 160
  },
  {
    name: "Craft Coffee Experience Centre - Park Street",
    area: "Park Street",
    address: "26, Camac Street, Elgin, Kolkata, West Bengal 700016",
    description: "Immersive coffee lab with siphon bars, cold brew towers, and barista workshops.",
    photoUrl: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 140
  },
  {
    name: "Craft Coffee - Salt Lake",
    area: "Salt Lake Sector 1 & 2",
    address: "AB 24, 4th Ave, AB Block, Sector 1, Bidhannagar, Kolkata, West Bengal 700064",
    description: "Quiet green neighborhood roastery with garden seating and artisanal pour-overs.",
    photoUrl: "https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 130
  },
  {
    name: "Cafe Ekante - Eco Park",
    area: "New Town",
    address: "Eco Island, Eco Park, Major Arterial Road(South-East), Action Area II, New Town, Kolkata 700156",
    description: "Scenic lakeside restaurant and cafe nestled on an island in Eco Park, New Town.",
    photoUrl: "https://images.unsplash.com/photo-1464979681340-bdd28a61699e?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 135
  },
  {
    name: "Artsy - Coffee & Culture",
    area: "Ballygunge",
    address: "230/B, Acharya Jagadish Chandra Bose Rd, Sreepally, Bhowanipore, Kolkata, West Bengal 700020",
    description: "Intimate indie cafe and art gallery celebrating local artists, nitro coffee, and books.",
    photoUrl: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 130
  },
  {
    name: "Mrs. Magpie - Southern Avenue",
    area: "Southern Avenue",
    address: "570, Lake Terrace Rd, Extension, Keyatala, Kolkata, West Bengal 700029",
    description: "Whimsical fairy-tale cafe loved for delicate cupcakes, hot chocolate, and afternoon teas.",
    photoUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 125
  },
  {
    name: "Indian Coffee House - College Street",
    area: "College Street",
    address: "15, Bankim Chatterjee St, College Square, Kolkata, West Bengal 700073",
    description: "Legendary intellectual landmark where Calcutta's scholars, poets, and students gather for filter coffee.",
    photoUrl: "https://images.unsplash.com/photo-1529892485617-25f63cd7b1e9?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 120
  },
  {
    name: "Cha Bar - Oxford Bookstore",
    area: "Park Street",
    address: "Oxford Bookstore, 17, Park Street, Taltala, Kolkata, West Bengal 700016",
    description: "Calcutta's quintessential book cafe featuring over 60 varieties of tea and bookish discussions.",
    photoUrl: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 125
  },
  {
    name: "Starbucks Coffee - Park Street",
    area: "Park Street",
    address: "57A, Park Mansions, Park Street, Taltala, Kolkata, West Bengal 700016",
    description: "Grand flagship store inside historic Park Mansions with high ceilings and global coffee roasts.",
    photoUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 160
  },
  {
    name: "Starbucks Coffee - Sector 5",
    area: "Salt Lake Sector 5",
    address: "Infinity Benchmark, Plot G-1, Block EP & GP, Sector V, Salt Lake, Kolkata, West Bengal 700091",
    description: "High-energy tech corridor Starbucks catering to corporate teams and young college attendants.",
    photoUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 160
  },
  {
    name: "The Bikers Cafe - Elgin",
    area: "Ballygunge",
    address: "Platinum Mall, 31, Elgin Rd, Sreepally, Bhowanipore, Kolkata, West Bengal 700020",
    description: "Motorcycle-themed diner with hearty pancakes, espresso roasts, and high-energy ambiance.",
    photoUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 135
  },
  {
    name: "Piccadilly Square - Elgin",
    area: "Ballygunge",
    address: "15B, Sarat Bose Rd, Rowland Row, Ballygunge, Kolkata, West Bengal 700020",
    description: "European-inspired cafe famous for Belgian waffles, crepes, gelato, and gourmet coffees.",
    photoUrl: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 130
  },
  {
    name: "Bunaphile Cafe - Hindustan Park",
    area: "Hindustan Park",
    address: "72, Hindustan Park, Gariahat, Kolkata, West Bengal 700029",
    description: "Heritage courtyard cafe known for pour-over coffee, cheesecakes, and cozy vintage ambience.",
    photoUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 135
  },
  {
    name: "Bunaphile - Southern Avenue",
    area: "Southern Avenue",
    address: "Lake View Rd, Lake Market, Kalighat, Kolkata, West Bengal 700029",
    description: "Calm specialty cafe with artisanal coffees and breakfast plates near Rabindra Sarobar Lake.",
    photoUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 135
  },
  {
    name: "Wise Owl The Coffee Shop - Hindustan Park",
    area: "Hindustan Park",
    address: "66/2, Purna Das Rd, Golpark, Hindustan Park, Gariahat, Kolkata, West Bengal 700029",
    description: "Open-air garden coffee shop serving hearty breakfast platters, cold coffees, and shakes.",
    photoUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 125
  },
  {
    name: "Terminal_11 - Salt Lake",
    area: "Salt Lake Sector 1 & 2",
    address: "BF 11, 1st Ave, BF Block, Sector 1, Bidhannagar, Kolkata, West Bengal 700064",
    description: "Music & book lounge cafe offering pour-overs, pizzas, and a relaxed student co-working environment.",
    photoUrl: "https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 130
  },
  {
    name: "Karma Kettle Tea Room - Ballygunge",
    area: "Ballygunge",
    address: "4, Swinhoe St, Ekdalia, Ballygunge, Kolkata, West Bengal 700019",
    description: "Boutique tea room pairing artisanal blends with gourmet scones and high-tea desserts.",
    photoUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 135
  },
  {
    name: "Cafe Mezzuna - Forum Mall Elgin",
    area: "Ballygunge",
    address: "Forum Mall, 10/3, Elgin Rd, Lala Lajpat Rai Sarani, Kolkata, West Bengal 700020",
    description: "Contemporary Mediterranean cafe serving gourmet pizzas, pastas, and premium roasts.",
    photoUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 145
  },
  {
    name: "Chaayos - Sector 5",
    area: "Salt Lake Sector 5",
    address: "Ground Floor, RDB Boulevard, Plot K-1, Sector V, Salt Lake, Kolkata, West Bengal 700091",
    description: "High-energy chai & snack hub serving tech interns, university students, and corporate teams.",
    photoUrl: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 130
  },
  {
    name: "Cafe Coffee Day - Godrej Waterside",
    area: "Salt Lake Sector 5",
    address: "Godrej Waterside, Tower 1, Block DP, Sector V, Salt Lake, Kolkata, West Bengal 700091",
    description: "Fast-paced tech park coffee shop with high footfall and flexible hourly student barista shifts.",
    photoUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 125
  },
  {
    name: "Barista Coffee - Park Street",
    area: "Park Street",
    address: "18, Park Street, Park Street area, Kolkata, West Bengal 700071",
    description: "Classic Italian roast espresso cafe in the heart of Park Street corridor.",
    photoUrl: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 130
  },
  {
    name: "Cafe Positive - Jodhpur Park",
    area: "Jadavpur",
    address: "11/1, Jodhpur Park Rd, Jodhpur Park, Kolkata, West Bengal 700068",
    description: "Asia's first cafe run entirely by HIV-positive youths, serving specialty coffee and homemade bakes.",
    photoUrl: "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 130
  },
  {
    name: "Mitra Cafe - Shyambazar",
    area: "Shyambazar",
    address: "47, Jatindra Mohan Ave, Raja Nabakrishna St, Sovabazar, Shyambazar, Kolkata, West Bengal 700005",
    description: "Century-old heritage Calcutta dining and snack institution famous for cutlets and cabin tea.",
    photoUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 120
  },
  {
    name: "Godrej Waterside Tower - IT Hub",
    area: "Salt Lake Sector 5",
    address: "Block DP, Sector V, Bidhannagar, Kolkata, West Bengal 700091",
    description: "Premier IT tech hub in Sector 5 housing multinational offices, cafes, and food courts.",
    photoUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 130
  },
  {
    name: "Godrej Genesis - Sector 5",
    area: "Salt Lake Sector 5",
    address: "EP Block, Sector V, Bidhannagar, Kolkata, West Bengal 700091",
    description: "Major corporate and commercial building in Sector 5 with ground floor cafes and student workforce.",
    photoUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 140
  },
  {
    name: "Infinity Benchmark - Sector 5",
    area: "Salt Lake Sector 5",
    address: "Plot G-1, Block EP & GP, Sector V, Salt Lake, Kolkata, West Bengal 700091",
    description: "Prominent green commercial high-rise in Sector 5 with specialty cafes and dining.",
    photoUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 150
  },
  {
    name: "Park Center - 24 Park Street",
    area: "Park Street",
    address: "24, Park Street, Mullick Bazar, Park Street area, Kolkata, West Bengal 700016",
    description: "Iconic commercial landmark on Park Street housing premier cafes, bistros, and bookstores.",
    photoUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 145
  },
  {
    name: "Camac Street Commercial Corridor",
    area: "Park Street",
    address: "Camac Street, Elgin, Kolkata, West Bengal 700016",
    description: "Central Kolkata shopping and dining avenue filled with coffee roasters, banks, and cafes.",
    photoUrl: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 135
  },
  {
    name: "City Centre 1 - Salt Lake",
    area: "Salt Lake Sector 1 & 2",
    address: "DC Block, Sector 1, Bidhannagar, Kolkata, West Bengal 700064",
    description: "Beloved open-air mall designed by Charles Correa with food courts, cafes, and open plazas.",
    photoUrl: "https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 130
  },
  {
    name: "City Centre 2 - New Town",
    area: "New Town",
    address: "Major Arterial Road, Action Area II, New Town, Kolkata, West Bengal 700157",
    description: "Flagship retail and cafe destination in New Town Rajarhat close to Kolkata Airport.",
    photoUrl: "https://images.unsplash.com/photo-1464979681340-bdd28a61699e?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 135
  },
  {
    name: "Eco Park - New Town",
    area: "New Town",
    address: "Major Arterial Road(South-East), Action Area II, New Town, Kolkata 700156",
    description: "Sprawling 480-acre urban park with scenic lake cafes, promenade dining, and event hubs.",
    photoUrl: "https://images.unsplash.com/photo-1464979681340-bdd28a61699e?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 130
  },
  {
    name: "Deshapriya Park & Lake Market",
    area: "Southern Avenue",
    address: "Deshapriya Park, Kalighat, Kolkata, West Bengal 700029",
    description: "South Kolkata's vibrant cultural neighborhood filled with artisanal cafes and boutiques.",
    photoUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 135
  },
  {
    name: "Quest Mall - Ballygunge",
    area: "Ballygunge",
    address: "33, Syed Amir Ali Ave, Park Circus, Beck Bagan, Ballygunge, Kolkata, West Bengal 700017",
    description: "Luxury shopping destination with premium cafes, bakeries, and gourmet coffee chains.",
    photoUrl: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 150
  },
  {
    name: "South City Mall - Prince Anwar Shah Rd",
    area: "Jadavpur",
    address: "375, Prince Anwar Shah Rd, South City Complex, Jodhpur Park, Kolkata, West Bengal 700068",
    description: "South Kolkata's largest shopping and entertainment complex with numerous cafes.",
    photoUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    minHourlyWage: 140
  }
];

// Helper: match any address/locality text to the closest CALCUTTA_AREAS item
export function matchKolkataArea(text) {
  if (!text || typeof text !== 'string') return CALCUTTA_AREAS[0];
  const t = text.toLowerCase();

  if (t.includes('sector 5') || t.includes('sector v') || t.includes('ep block') || t.includes('gp block') || t.includes('godrej genesis') || t.includes('techno india')) {
    return 'Salt Lake Sector 5';
  }
  if (t.includes('salt lake') || t.includes('bidhannagar') || t.includes('sector 1') || t.includes('sector 2') || t.includes('sector 3') || t.includes('city centre 1') || t.includes('karunamoyee') || t.includes('ultadanga')) {
    return 'Salt Lake Sector 1 & 2';
  }
  if (t.includes('park street') || t.includes('camac street') || t.includes('mullick bazar') || t.includes('park circus') || t.includes('middleton') || t.includes('taltala') || t.includes('russell street')) {
    return 'Park Street';
  }
  if (t.includes('southern avenue') || t.includes('lake terrace') || t.includes('lake market') || t.includes('hemanta mukherjee') || t.includes('kalighat') || t.includes('rabindra sarobar')) {
    return 'Southern Avenue';
  }
  if (t.includes('hindustan park') || t.includes('dover lane') || t.includes('singhi park') || t.includes('monoharpukur')) {
    return 'Hindustan Park';
  }
  if (t.includes('ballygunge') || t.includes('elgin') || t.includes('sarat bose') || t.includes('deshapriya') || t.includes('minto park') || t.includes('bhowanipore') || t.includes('rowland')) {
    return 'Ballygunge';
  }
  if (t.includes('new town') || t.includes('rajarhat') || t.includes('action area') || t.includes('eco park') || t.includes('chinar park') || t.includes('city centre 2')) {
    return 'New Town';
  }
  if (t.includes('gariahat') || t.includes('golpark') || t.includes('fernhill') || t.includes('ekdalia')) {
    return 'Gariahat';
  }
  if (t.includes('shyambazar') || t.includes('hatibagan') || t.includes('shobhabazar') || t.includes('bagbazar') || t.includes('sovabazar')) {
    return 'Shyambazar';
  }
  if (t.includes('jadavpur') || t.includes('dhakuria') || t.includes('santoshpur') || t.includes('jodhpur park') || t.includes('selimpur')) {
    return 'Jadavpur';
  }
  if (t.includes('college street') || t.includes('college square') || t.includes('bowbazar') || t.includes('sealdah') || t.includes('mg road') || t.includes('cr avenue')) {
    return 'College Street';
  }

  // Fallback to first area
  return CALCUTTA_AREAS[0];
}

// Check if Google Maps is already loaded in the environment
export function loadGoogleMapsScript() {
  if (typeof window !== 'undefined' && window.google?.maps?.places) {
    return Promise.resolve(window.google.maps);
  }
  return Promise.resolve(null);
}

/**
 * Smart Search: Fast local match across Kolkata Cafe Directory & Landmarks,
 * with live OpenStreetMap/Nominatim typeahead search without API key restrictions.
 */
export async function searchPlacesAndCafes(query) {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim().toLowerCase();
  const queryTerms = q.split(/\s+/).filter(Boolean);

  // 1. Instant match from Kolkata Cafe Directory & Landmarks
  const localMatches = KOLKATA_CAFE_DIRECTORY.filter(cafe => {
    const nameLower = cafe.name.toLowerCase();
    const addrLower = cafe.address.toLowerCase();
    const areaLower = cafe.area.toLowerCase();
    return queryTerms.every(term => 
      nameLower.includes(term) || 
      addrLower.includes(term) || 
      areaLower.includes(term)
    );
  }).map(c => ({
    ...c,
    source: 'Kolkata Directory',
    formattedAddress: c.address,
    locality: c.area
  }));

  // 2. Live OpenStreetMap Search for Kolkata places & streets
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' Kolkata')}&addressdetails=1&countrycodes=in&limit=6`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept-Language': 'en' }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const osmResults = await res.json();
      const mappedOsm = (osmResults || []).map(r => ({
        name: r.name || r.display_name.split(',')[0],
        area: matchKolkataArea(r.display_name),
        address: r.display_name,
        formattedAddress: r.display_name,
        description: `Located in ${matchKolkataArea(r.display_name)}, Kolkata.`,
        source: 'Kolkata Place Data'
      }));

      const merged = [...localMatches];
      mappedOsm.forEach(o => {
        if (!merged.some(m => m.name.toLowerCase() === o.name.toLowerCase() || m.address.toLowerCase() === o.address.toLowerCase())) {
          merged.push(o);
        }
      });
      return merged.slice(0, 10);
    }
  } catch (osmErr) {
    // If network fails or times out, localMatches handles it instantly
  }

  return localMatches.slice(0, 10);
}

/**
 * Fetch Current GPS Location of Owner and Reverse Geocode to Kolkata Street Address
 */
export async function fetchCurrentLocationAddress() {
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported by your browser.');
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // OpenStreetMap Reverse Geocode (free, accurate, zero API key errors)
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3500);

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            { signal: controller.signal, headers: { 'Accept-Language': 'en' } }
          );
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            const fullAddress = data.display_name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}, Kolkata`;
            const matchedArea = matchKolkataArea(fullAddress);
            return resolve({
              latitude,
              longitude,
              address: fullAddress,
              area: matchedArea,
              displayName: fullAddress
            });
          }
        } catch (osmErr) {
          console.warn('Reverse geocode notice:', osmErr);
        }

        // Coordinate fallback if reverse geocoding request is offline
        resolve({
          latitude,
          longitude,
          address: `Kolkata Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
          area: matchKolkataArea('Park Street'),
          displayName: `Kolkata Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
        });
      },
      (error) => {
        let msg = 'Could not retrieve your location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow location access in your browser.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please try again.';
        }
        reject(new Error(msg));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
}

