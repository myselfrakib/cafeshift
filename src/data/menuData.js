export const FOOD_CATEGORIES = [
  { id: 'burger', name: 'Burger', emoji: '🍔', icon: 'Burger' },
  { id: 'pizza', name: 'Pizza', emoji: '🍕', icon: 'Pizza' },
  { id: 'chicken', name: 'Chicken', emoji: '🍗', icon: 'Drumstick' },
  { id: 'fries', name: 'Fries', emoji: '🍟', icon: 'FrenchFries' },
  { id: 'drink', name: 'Drink', emoji: '🥤', icon: 'CupSoda' },
];

export const FEATURED_COMBO = {
  id: 'combo-spicy-burger',
  tag: 'Limited Time Offer',
  title: 'Spicy Burger',
  highlight: 'Combo',
  discount: '20% OFF',
  price: 8.99,
  originalPrice: 11.99,
  rating: 4.9,
  image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80',
  description: 'Signature crispy spicy burger served with golden seasoned french fries and an ice-cold fizzy beverage.'
};

export const POPULAR_ITEMS = [
  {
    id: 'food-spicy-chicken',
    name: 'Spicy Chicken Burger',
    category: 'burger',
    price: 6.49,
    rating: 4.8,
    reviewsCount: 120,
    tag: 'Spicy',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    description: 'Crispy spicy chicken patty with fresh lettuce, tomato, onion and our special sauce.',
    isFavorite: true,
    customizations: {
      sizes: ['Regular', 'Large', 'X Large'],
      addOns: [
        { id: 'cheese', name: 'Add Cheese', price: 0.99, default: true },
        { id: 'patty', name: 'Extra Patty', price: 2.49, default: false },
        { id: 'bacon', name: 'Add Bacon', price: 1.49, default: true },
      ]
    }
  },
  {
    id: 'food-cheese-burger',
    name: 'Cheese Burger',
    category: 'burger',
    price: 5.49,
    rating: 4.7,
    reviewsCount: 95,
    tag: null,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    description: 'Classic grilled beef patty topped with melted cheddar, crisp pickles, tomato slices, and smoky burger sauce.',
    isFavorite: false,
    customizations: {
      sizes: ['Regular', 'Large', 'X Large'],
      addOns: [
        { id: 'cheese', name: 'Add Cheese', price: 0.99, default: true },
        { id: 'patty', name: 'Extra Patty', price: 2.49, default: false },
        { id: 'bacon', name: 'Add Bacon', price: 1.49, default: false },
      ]
    }
  },
  {
    id: 'food-double-beef',
    name: 'Double Beef Burger',
    category: 'burger',
    price: 7.49,
    rating: 4.9,
    reviewsCount: 184,
    tag: 'Popular',
    image: 'https://images.unsplash.com/photo-1582196016295-f8c8bd4b3e99?auto=format&fit=crop&w=800&q=80',
    description: 'Double flame-grilled beef patties with double melted cheddar, caramelized onions, and crisp smoked beef strips.',
    isFavorite: false,
    customizations: {
      sizes: ['Regular', 'Large', 'X Large'],
      addOns: [
        { id: 'cheese', name: 'Add Cheese', price: 0.99, default: true },
        { id: 'patty', name: 'Extra Patty', price: 2.49, default: true },
        { id: 'bacon', name: 'Add Bacon', price: 1.49, default: true },
      ]
    }
  },
  {
    id: 'food-crispy-fries',
    name: 'Crispy Golden Fries',
    category: 'fries',
    price: 3.99,
    rating: 4.6,
    reviewsCount: 88,
    tag: 'Hot',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
    description: 'Double-fried hand-cut golden fries tossed in sea salt, paprika, and served with house garlic aioli.',
    isFavorite: true,
    customizations: {
      sizes: ['Regular', 'Large'],
      addOns: [
        { id: 'cheese', name: 'Add Melted Cheese', price: 1.29, default: false },
        { id: 'jalapeno', name: 'Jalapeño Dust', price: 0.49, default: true },
      ]
    }
  },
  {
    id: 'food-artisan-pizza',
    name: 'Truffle & Pepperoni Slice',
    category: 'pizza',
    price: 5.99,
    rating: 4.8,
    reviewsCount: 142,
    tag: 'Chef Pick',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    description: 'Woodfired sourdough crust topped with San Marzano tomatoes, buffalo mozzarella, and aged pepperoni.',
    isFavorite: false,
    customizations: {
      sizes: ['Single Slice', '10 Inch', '14 Inch'],
      addOns: [
        { id: 'cheese', name: 'Extra Mozzarella', price: 1.49, default: true },
        { id: 'chili', name: 'Hot Chili Honey', price: 0.79, default: true },
      ]
    }
  },
  {
    id: 'food-cold-brew',
    name: 'Iced Caramel Cold Brew',
    category: 'drink',
    price: 4.49,
    rating: 4.9,
    reviewsCount: 210,
    tag: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    description: 'Slow-dripped single origin coffee with Madagascar vanilla syrup, chilled whole milk, and salted caramel foam.',
    isFavorite: true,
    customizations: {
      sizes: ['Regular (350ml)', 'Large (500ml)'],
      addOns: [
        { id: 'oatmilk', name: 'Oat Milk Sub', price: 0.75, default: false },
        { id: 'boba', name: 'Add Tapioca Boba', price: 0.99, default: false },
        { id: 'extra_shot', name: 'Extra Espresso Shot', price: 1.00, default: true },
      ]
    }
  }
];
