export const CALCUTTA_AREAS = [
  "Park Street",
  "Southern Avenue",
  "Salt Lake Sector 5",
  "Salt Lake Sector 1 & 2",
  "Hindustan Park",
  "Ballygunge",
  "New Town",
  "Gariahat",
  "Shyambazar",
  "Jadavpur",
  "College Street"
];

export const ANIMAL_MASCOTS = [
  { id: 'cat', emoji: '🐱', name: 'Mochi the Cat', title: 'Barista Apprentice' },
  { id: 'dog', emoji: '🐶', name: 'Bruno the Pup', title: 'Floor Greeter' },
  { id: 'bunny', emoji: '🐰', name: 'Bibi the Bunny', title: 'Pastry & Dessert Mate' },
  { id: 'panda', emoji: '🐼', name: 'Bao the Panda', title: 'Table Runner' },
  { id: 'fox', emoji: '🦊', name: 'Rusty the Fox', title: 'Cashier & Orders' },
  { id: 'bear', emoji: '🐻', name: 'Barnaby Bear', title: 'Brew Master' },
  { id: 'koala', emoji: '🐨', name: 'Koko the Koala', title: 'Chill Host' },
  { id: 'penguin', emoji: '🐧', name: 'Pippin Penguin', title: 'Ice Drink Specialist' },
];

export const INITIAL_USERS = [
  {
    id: 'user-rakib',
    role: 'owner',
    name: 'Rakib Hassan',
    email: 'rakib@rakibscafe.in',
    phone: '9830123456', // +91 will be prefixed
    mascot: '🐱',
    bio: 'Founder of Rakib\'s Cafe. Loving Kolkata\'s coffee culture and creating flexible student earning opportunities!',
    cafes: ['cafe-rakibs-1']
  },
  {
    id: 'user-soma',
    role: 'owner',
    name: 'Soma Roy',
    email: 'soma@whiskerscafe.in',
    phone: '9874567890',
    mascot: '🐰',
    bio: 'Cafe curator at Southern Avenue. We love student team members for our lively brunch shifts!',
    cafes: ['cafe-whiskers-2']
  },
  {
    id: 'user-ananya',
    role: 'attendant',
    name: 'Ananya Mukherjee',
    email: 'ananya.m@stxaviers.edu.in',
    phone: '9831299881',
    gender: 'Female',
    age: 19,
    address: 'Flat 3B, Ballygunge Circular Road, Kolkata - 700019',
    college: 'St. Xavier\'s College (Autonomous), Kolkata - B.Com 2nd Yr',
    mascot: '🐼',
    bio: 'Hardworking student looking for flexible weekend and evening cafe shifts. Friendly with customers and fast learner!'
  },
  {
    id: 'user-rahul',
    role: 'attendant',
    name: 'Rahul Sen',
    email: 'rahul.sen@presiuniv.ac.in',
    phone: '9051044321',
    gender: 'Male',
    age: 20,
    address: 'Block BD, Salt Lake Sector 1, Kolkata - 700064',
    college: 'Presidency University, Kolkata - English Hons',
    mascot: '🐶',
    bio: 'Passionate about coffee culture & meeting people. Punctual, polite, and great at handling rush hours.'
  }
];

export const INITIAL_CAFES = [
  {
    id: 'cafe-rakibs-1',
    ownerId: 'user-rakib',
    name: "Rakib's Cozy Cafe",
    tagline: 'Artisanal Roasts & Kolkata Nostalgia ☕',
    area: 'Park Street',
    address: '42A Park Street (Near Flurys & Oxford Bookstore), Kolkata - 700016',
    mascot: '🐱',
    coverGradient: 'from-amber-400 via-orange-300 to-rose-300',
    minHourlyWage: 120,
    description: 'A vibrant indie cafe serving handcrafted cappuccinos, Kolkata chicken cutlets, and vintage bookshelf corners.',
    rating: 4.9,
    reviewsCount: 142
  },
  {
    id: 'cafe-whiskers-2',
    ownerId: 'user-soma',
    name: 'Chai & Whiskers Cafe',
    tagline: 'Fluffy Pastries & Garden Sips 🌸',
    area: 'Southern Avenue',
    address: '18/2 Southern Avenue, Near Rabindra Sarobar Lake, Kolkata - 700029',
    mascot: '🐰',
    coverGradient: 'from-pink-300 via-rose-200 to-amber-200',
    minHourlyWage: 125,
    description: 'Breezy lake-side cafe famous for lemon tarts, freshly baked muffins, and pet-friendly outdoor seating.',
    rating: 4.8,
    reviewsCount: 98
  },
  {
    id: 'cafe-saltlake-3',
    ownerId: 'user-rakib',
    name: "Rakib's Nitro Brew Lab",
    tagline: 'Cold Brews & Tech Rush ⚡',
    area: 'Salt Lake Sector 5',
    address: 'Godrej Waterside Tower, Salt Lake Sector 5, Kolkata - 700091',
    mascot: '🦊',
    coverGradient: 'from-amber-300 via-emerald-200 to-teal-300',
    minHourlyWage: 150,
    description: 'Fast-paced tech park cafe powering Kolkata\'s techies and startup crowds with cold brews and bagels.',
    rating: 4.7,
    reviewsCount: 76
  }
];

// Helper to get formatted dates
const getRelativeDate = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_SHIFTS = [
  {
    id: 'shift-101',
    cafeId: 'cafe-rakibs-1',
    ownerId: 'user-rakib',
    cafeName: "Rakib's Cozy Cafe",
    cafeArea: "Park Street",
    cafeMascot: "🐱",
    roleName: "Evening Rush Attendant & Table Server 🐱",
    date: getRelativeDate(1), // Tomorrow
    startTime: "17:00",
    endTime: "21:00",
    durationHours: 4, // Min 3 hours enforced
    hourlyWage: 140, // Min 100 enforced
    totalEarnings: 560,
    perks: ["Free Iced Caramel Macchiato ☕", "Fresh Kolkata Chicken Puff 🥪", "Student Tip Sharing 💸"],
    dressCode: "Comfortable casuals + Dark jeans (Cute cafe apron provided!)",
    notes: "High energy Friday evening crowd! Great opportunity for friendly students to gain hospitality experience.",
    status: "open", // "open" | "booked" | "completed"
    applicant: null,
    appliedAt: null,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'shift-102',
    cafeId: 'cafe-rakibs-1',
    ownerId: 'user-rakib',
    cafeName: "Rakib's Cozy Cafe",
    cafeArea: "Park Street",
    cafeMascot: "🐱",
    roleName: "Sunday Morning Brunch Host & Water Service 🥐",
    date: getRelativeDate(2),
    startTime: "10:30",
    endTime: "14:30",
    durationHours: 4,
    hourlyWage: 125,
    totalEarnings: 500,
    perks: ["Unlimited Hot Cappuccino ☕", "Warm Chocolate Croissant 🥐", "Certificate of Cafe Hours 📜"],
    dressCode: "Smart casuals with sneakers",
    notes: "Help us seat weekend brunch guests, arrange pastry counters, and serve fresh juices.",
    status: "open",
    applicant: null,
    appliedAt: null,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'shift-103',
    cafeId: 'cafe-whiskers-2',
    ownerId: 'user-soma',
    cafeName: "Chai & Whiskers Cafe",
    cafeArea: "Southern Avenue",
    cafeMascot: "🐰",
    roleName: "Afternoon Bakery Display & Order Mate 🐰",
    date: getRelativeDate(0), // Today
    startTime: "14:00",
    endTime: "17:00",
    durationHours: 3,
    hourlyWage: 130,
    totalEarnings: 390,
    perks: ["Free Matcha Boba Cup 🧋", "Red Velvet Pastry Slice 🍰"],
    dressCode: "Pastel colored tee / shirt",
    notes: "Calm afternoon shift next to the lake. Take orders on iPad and help pack takeaway boxes.",
    status: "open",
    applicant: null,
    appliedAt: null,
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 'shift-104',
    cafeId: 'cafe-saltlake-3',
    ownerId: 'user-rakib',
    cafeName: "Rakib's Nitro Brew Lab",
    cafeArea: "Salt Lake Sector 5",
    cafeMascot: "🦊",
    roleName: "Tech Rush Hour Counter Assistant ⚡",
    date: getRelativeDate(1),
    startTime: "16:00",
    endTime: "20:00",
    durationHours: 4,
    hourlyWage: 150,
    totalEarnings: 600,
    perks: ["Unlimited Nitro Cold Brew ⚡", "Smoked Chicken Bagel 🥯", "Commute Travel Bonus (₹50) 🚕"],
    dressCode: "Black t-shirt & comfortable shoes",
    notes: "Busy tech evening rush! Super fun team of baristas. Call out order names and hand over drinks.",
    status: "open",
    applicant: null,
    appliedAt: null,
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: 'shift-105',
    cafeId: 'cafe-rakibs-1',
    ownerId: 'user-rakib',
    cafeName: "Rakib's Cozy Cafe",
    cafeArea: "Park Street",
    cafeMascot: "🐱",
    roleName: "Acoustic Night Table Attendant 🎸",
    date: getRelativeDate(0),
    startTime: "18:00",
    endTime: "21:00",
    durationHours: 3,
    hourlyWage: 135,
    totalEarnings: 405,
    perks: ["Listen to live indie music 🎶", "Free Brownie with Ice Cream 🍨", "₹100 tip share"],
    dressCode: "All black casuals",
    notes: "Special acoustic live night! Need a student attendant to bus glasses and hand menus.",
    status: "booked", // Pre-booked by Rahul Sen for immediate demonstration
    applicant: {
      userId: 'user-rahul',
      name: 'Rahul Sen',
      phone: '9051044321',
      email: 'rahul.sen@presiuniv.ac.in',
      college: 'Presidency University, Kolkata - English Hons',
      age: 20,
      gender: 'Male',
      address: 'Block BD, Salt Lake Sector 1, Kolkata - 700064',
      mascot: '🐶'
    },
    appliedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

