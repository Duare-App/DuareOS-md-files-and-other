const products = [
  // ============================== GROCERY — Meena Bazar ==============================
  {
    id: 'GR001', restaurantId: 'r_meena_bazar', category: 'grocery', name: 'Miniket Rice',
    description: 'Premium aromatic long-grain rice, perfect for everyday Bangladeshi meals. Sourced from finest farms.',
    price: 450, unit: '5kg bag', emoji: '🍚', rating: 4.7, reviews: 1240, tag: 'Best Seller', inStock: true,
    menuSection: 'Rice & Grains',
    variations: [
      { key: '2.5kg', label: '2.5 kg', price: 225 }, { key: '5kg', label: '5 kg', price: 450 },
      { key: '10kg', label: '10 kg', price: 850 },   { key: '25kg', label: '25 kg', price: 1950 },
    ], defaultVariation: '5kg',
  },
  {
    id: 'GR002', restaurantId: 'r_meena_bazar', category: 'grocery', name: 'Nazirshail Rice',
    description: 'Traditional fragrant rice from northern Bangladesh, ideal for special occasions and biriyani.',
    price: 520, unit: '5kg bag', emoji: '🍚', rating: 4.6, reviews: 890, tag: null, inStock: true,
    menuSection: 'Rice & Grains',
    variations: [
      { key: '2.5kg', label: '2.5 kg', price: 265 }, { key: '5kg', label: '5 kg', price: 520 },
      { key: '10kg', label: '10 kg', price: 980 },
    ], defaultVariation: '5kg',
  },
  {
    id: 'GR003', restaurantId: 'r_meena_bazar', category: 'grocery', name: 'Masur Dal',
    description: 'Red lentils rich in protein — the cornerstone of everyday dal dishes across Bangladesh.',
    price: 110, unit: '1kg', emoji: '🫘', rating: 4.5, reviews: 567, tag: null, inStock: true,
    menuSection: 'Dal & Legumes',
    variations: [
      { key: '500g', label: '500 g', price: 60 }, { key: '1kg', label: '1 kg', price: 110 },
      { key: '2kg', label: '2 kg', price: 200 },
    ], defaultVariation: '1kg',
  },
  {
    id: 'GR004', restaurantId: 'r_meena_bazar', category: 'grocery', name: 'Mug Dal',
    description: 'Yellow moong dal with a mild taste, nutritious and easy to digest for all ages.',
    price: 130, unit: '1kg', emoji: '🫘', rating: 4.4, reviews: 432, tag: null, inStock: true,
    menuSection: 'Dal & Legumes',
    variations: [
      { key: '500g', label: '500 g', price: 70 }, { key: '1kg', label: '1 kg', price: 130 },
      { key: '2kg', label: '2 kg', price: 240 },
    ], defaultVariation: '1kg',
  },
  {
    id: 'GR005', restaurantId: 'r_meena_bazar', category: 'grocery', name: 'Mustard Oil',
    description: 'Pure cold-pressed mustard oil — the soul of authentic Bangladeshi cooking. Adds that signature flavour.',
    price: 180, unit: '1 litre', emoji: '🫙', rating: 4.8, reviews: 2100, tag: 'Popular', inStock: true,
    menuSection: 'Cooking Oils',
    variations: [
      { key: '500ml', label: '500 ml', price: 95 }, { key: '1L', label: '1 L', price: 180 },
      { key: '5L', label: '5 L', price: 850 },
    ], defaultVariation: '1L',
  },
  {
    id: 'GR006', restaurantId: 'r_meena_bazar', category: 'grocery', name: 'Soybean Oil',
    description: 'Refined soybean oil — light, healthy, and perfect for everyday frying and cooking.',
    price: 165, unit: '1 litre', emoji: '🫙', rating: 4.3, reviews: 765, tag: null, inStock: true,
    menuSection: 'Cooking Oils',
    variations: [
      { key: '500ml', label: '500 ml', price: 85 }, { key: '1L', label: '1 L', price: 165 },
      { key: '5L', label: '5 L', price: 780 },
    ], defaultVariation: '1L',
  },
  { id: 'GR017', restaurantId: 'r_meena_bazar', category: 'grocery', name: 'White Sugar',      description: 'Pure granulated white sugar — essential pantry staple for sweets, tea, and cooking.', price: 120, unit: '1kg',       emoji: '🍬', rating: 4.1, reviews: 340,  tag: null,    inStock: true, menuSection: 'Pantry Staples' },
  { id: 'GR018', restaurantId: 'r_meena_bazar', category: 'grocery', name: 'Iodized Salt',     description: 'Clean white iodized salt for healthy everyday cooking. A must-have for every kitchen.', price: 30, unit: '500g',      emoji: '🧂', rating: 4.0, reviews: 230,  tag: null,    inStock: true, menuSection: 'Pantry Staples' },
  { id: 'GR019', restaurantId: 'r_meena_bazar', category: 'grocery', name: 'Ripe Banana',      description: "Sweet, ripe bananas sourced fresh from Sylhet's lush gardens. A perfect healthy snack.", price: 80, unit: '12 pieces', emoji: '🍌', rating: 4.5, reviews: 890,  tag: 'Fresh', inStock: true, menuSection: 'Fresh Produce' },
  { id: 'GR020', restaurantId: 'r_meena_bazar', category: 'grocery', name: 'Green Chili',      description: "Fresh spicy green chilis — the secret ingredient that gives Bangladeshi food its iconic heat.", price: 40, unit: '250g', emoji: '🌶️', rating: 4.3, reviews: 560,  tag: null,    inStock: true, menuSection: 'Fresh Produce' },

  // ============================== GROCERY — Fresh Mart ==============================
  { id: 'GR007', restaurantId: 'r_fresh_mart', category: 'grocery', name: 'Fresh Potato',    description: "Farm-fresh potatoes from Munshiganj — Bangladesh's potato heartland.", price: 45,  unit: '1kg',       emoji: '🥔', rating: 4.4, reviews: 890,  tag: 'Fresh', inStock: true, menuSection: 'Vegetables' },
  { id: 'GR008', restaurantId: 'r_fresh_mart', category: 'grocery', name: 'Fresh Onion',     description: 'Pungent and fresh onions — the base of nearly every Bangladeshi curry.',    price: 55,  unit: '1kg',       emoji: '🧅', rating: 4.2, reviews: 1100, tag: null,    inStock: true, menuSection: 'Vegetables' },
  { id: 'GR009', restaurantId: 'r_fresh_mart', category: 'grocery', name: 'Fresh Tomato',    description: 'Juicy, ripe tomatoes for curries, salads, soups, and chutneys.',           price: 60,  unit: '1kg',       emoji: '🍅', rating: 4.5, reviews: 430,  tag: 'Fresh', inStock: true, menuSection: 'Vegetables' },
  { id: 'GR010', restaurantId: 'r_fresh_mart', category: 'grocery', name: 'Garlic',          description: 'Whole garlic bulbs bursting with flavour — essential for every kitchen.',    price: 80,  unit: '250g',      emoji: '🧄', rating: 4.6, reviews: 780,  tag: null,    inStock: true, menuSection: 'Vegetables' },
  { id: 'GR011', restaurantId: 'r_fresh_mart', category: 'grocery', name: 'Fresh Ginger',    description: 'Aromatic fresh ginger root for curries or brewing a warming adha-cha.',     price: 70,  unit: '250g',      emoji: '🫚', rating: 4.4, reviews: 560,  tag: null,    inStock: true, menuSection: 'Vegetables' },
  { id: 'GR012', restaurantId: 'r_fresh_mart', category: 'grocery', name: 'Broiler Chicken', description: 'Fresh dressed chicken from certified local farms. Cleaned and ready to cook.', price: 220, unit: '1kg',     emoji: '🐔', rating: 4.3, reviews: 1560, tag: 'Fresh', inStock: true, menuSection: 'Meat & Poultry' },
  { id: 'GR013', restaurantId: 'r_fresh_mart', category: 'grocery', name: 'Beef (Bone-in)',  description: 'Premium quality beef for bhuna, curry, and kebabs. Freshly cut.',          price: 700, unit: '1kg',       emoji: '🥩', rating: 4.5, reviews: 890,  tag: null,    inStock: true, menuSection: 'Meat & Poultry' },
  { id: 'GR014', restaurantId: 'r_fresh_mart', category: 'grocery', name: 'Farm Eggs',       description: 'Fresh deshi eggs from free-range chickens — rich in protein.',            price: 140, unit: '12 pieces', emoji: '🥚', rating: 4.7, reviews: 2340, tag: 'Best Seller', inStock: true, menuSection: 'Dairy & Eggs' },
  { id: 'GR015', restaurantId: 'r_fresh_mart', category: 'grocery', name: 'Fresh Milk',      description: 'Pure pasteurized full-cream milk from local dairy farms. No preservatives.', price: 85, unit: '1 litre',  emoji: '🥛', rating: 4.6, reviews: 1230, tag: null,    inStock: true, menuSection: 'Dairy & Eggs' },
  { id: 'GR016', restaurantId: 'r_fresh_mart', category: 'grocery', name: 'Bread Loaf',      description: 'Soft, freshly baked sandwich bread from local bakeries.',                  price: 45,  unit: '400g loaf', emoji: '🍞', rating: 4.2, reviews: 650,  tag: null,    inStock: true, menuSection: 'Bakery' },

  // ============================== MEDICINE — Popular Pharma ==============================
  {
    id: 'MED001', restaurantId: 'r_popular_pharma', category: 'medicine', name: 'Napa (Paracetamol 500mg)',
    description: 'Paracetamol 500mg — relieves fever, headache, and mild to moderate pain. Most trusted OTC drug in BD.',
    price: 12, unit: '10 tablets', emoji: '💊', rating: 4.8, reviews: 5600, tag: 'Most Trusted', inStock: true,
    menuSection: 'Pain & Fever',
    variations: [
      { key: '10tab',  label: '10 tablets',  price: 12 },
      { key: '50tab',  label: '50 tablets',  price: 55 },
      { key: '100tab', label: '100 tablets', price: 105 },
    ], defaultVariation: '10tab',
  },
  { id: 'MED002', restaurantId: 'r_popular_pharma', category: 'medicine', name: 'Napa Extra (665mg)',       description: 'Extended-release paracetamol 665mg for stronger and longer-lasting relief.',       price: 15,  unit: '10 tablets',   emoji: '💊', rating: 4.7, reviews: 3400, tag: null,           inStock: true, menuSection: 'Pain & Fever' },
  { id: 'MED003', restaurantId: 'r_popular_pharma', category: 'medicine', name: 'Seclo 20mg (Omeprazole)',  description: 'Proton-pump inhibitor — treats acid reflux, gastritis, and stomach ulcers.',     price: 40,  unit: '10 capsules',  emoji: '💊', rating: 4.6, reviews: 2100, tag: 'Prescription', inStock: true, menuSection: 'Digestive Health' },
  {
    id: 'MED004', restaurantId: 'r_popular_pharma', category: 'medicine', name: 'Vitamin C 500mg',
    description: 'High-dose Vitamin C tablets to boost immunity, fight colds, and provide antioxidant protection.',
    price: 50, unit: '30 tablets', emoji: '🟡', rating: 4.5, reviews: 1890, tag: 'Best Seller', inStock: true,
    menuSection: 'Vitamins & Supplements',
    variations: [
      { key: '30tab',  label: '30 tablets',  price: 50  },
      { key: '60tab',  label: '60 tablets',  price: 90  },
      { key: '100tab', label: '100 tablets', price: 145 },
    ], defaultVariation: '30tab',
  },
  { id: 'MED005', restaurantId: 'r_popular_pharma', category: 'medicine', name: 'Zinc 10mg Tablet',         description: 'Essential zinc mineral to support immunity, wound healing, and overall health.',      price: 35,  unit: '30 tablets',   emoji: '💊', rating: 4.4, reviews: 1200, tag: null,       inStock: true, menuSection: 'Vitamins & Supplements' },
  {
    id: 'MED006', restaurantId: 'r_popular_pharma', category: 'medicine', name: 'ORS Saline Packet',
    description: 'WHO-formula oral rehydration salts — the first line treatment for diarrhea and dehydration.',
    price: 25, unit: '1 packet (1L)', emoji: '💧', rating: 4.7, reviews: 3400, tag: 'Essential', inStock: true,
    menuSection: 'Digestive Health',
    variations: [
      { key: '1pack',  label: '1 packet',   price: 25  },
      { key: '5pack',  label: '5 packets',  price: 115 },
      { key: '10pack', label: '10 packets', price: 220 },
    ], defaultVariation: '1pack',
  },
  { id: 'MED007', restaurantId: 'r_popular_pharma', category: 'medicine', name: 'Antacid Plus',              description: 'Fast-acting antacid tablets for instant relief from acidity, heartburn, indigestion.', price: 45, unit: '12 tablets', emoji: '💊', rating: 4.3, reviews: 890,  tag: null,    inStock: true, menuSection: 'Digestive Health' },
  { id: 'MED008', restaurantId: 'r_popular_pharma', category: 'medicine', name: 'Tofex Cough Syrup',         description: 'Effective cough suppressant syrup for dry cough — soothes the throat.',             price: 80, unit: '100ml bottle',emoji: '🧪', rating: 4.5, reviews: 1100, tag: null,    inStock: true, menuSection: 'Cold & Cough' },

  // ============================== MEDICINE — MediPlus ==============================
  { id: 'MED009', restaurantId: 'r_mediplus', category: 'medicine', name: 'Sterile Bandage Roll',    description: 'Medical-grade sterile cotton bandage for wound dressing, sprains, and support.',          price: 60,   unit: '5 metre roll',  emoji: '🩹', rating: 4.2, reviews: 450,  tag: null,            inStock: true, menuSection: 'First Aid' },
  { id: 'MED010', restaurantId: 'r_mediplus', category: 'medicine', name: 'Hand Sanitizer',          description: '70% isopropyl alcohol gel sanitizer — kills 99.9% of bacteria and viruses on contact.',   price: 90,   unit: '200ml bottle',  emoji: '🧴', rating: 4.6, reviews: 2300, tag: 'Popular',       inStock: true, menuSection: 'First Aid' },
  { id: 'MED011', restaurantId: 'r_mediplus', category: 'medicine', name: 'Digital Thermometer',     description: 'Fast, accurate digital thermometer readings in 10 seconds. Beep alert when done.',         price: 250,  unit: '1 piece',       emoji: '🌡️', rating: 4.7, reviews: 1560, tag: null,            inStock: true, menuSection: 'Medical Devices' },
  { id: 'MED012', restaurantId: 'r_mediplus', category: 'medicine', name: 'BP Monitor (Automatic)',  description: 'Automatic upper-arm blood pressure monitor with irregular heartbeat detection & memory.',  price: 1800, unit: '1 device',      emoji: '❤️‍🩹', rating: 4.5, reviews: 780,  tag: 'Medical Device', inStock: true, menuSection: 'Medical Devices' },
  { id: 'MED013', restaurantId: 'r_mediplus', category: 'medicine', name: 'Multivitamin Daily',      description: 'Comprehensive daily multivitamin with 23 essential vitamins and minerals.',                price: 350,  unit: '30 tablets',    emoji: '💊', rating: 4.6, reviews: 1340, tag: 'Popular',       inStock: true, menuSection: 'Supplements' },
  { id: 'MED014', restaurantId: 'r_mediplus', category: 'medicine', name: 'Calcium + Vitamin D3',    description: 'Calcium 500mg with Vitamin D3 for strong bones, teeth, and muscle function.',             price: 120,  unit: '30 tablets',    emoji: '💊', rating: 4.4, reviews: 670,  tag: null,            inStock: true, menuSection: 'Supplements' },
  { id: 'MED015', restaurantId: 'r_mediplus', category: 'medicine', name: 'Betadine Antiseptic',     description: 'Betadine povidone-iodine antiseptic cream for safe treatment of minor wounds and burns.',  price: 75,   unit: '30g tube',      emoji: '🧴', rating: 4.5, reviews: 890,  tag: null,            inStock: true, menuSection: 'First Aid' },

  // ============================== RESTAURANT — Dhaka Kitchen ==============================
  {
    id: 'RES001', restaurantId: 'r_dhaka_kitchen', category: 'restaurant', name: 'Kacchi Biriyani',
    description: 'Authentic slow-cooked mutton biriyani with fragrant basmati, caramelized onions, saffron, and boiled egg.',
    price: 280, unit: '1 full portion', emoji: '🍛', rating: 4.9, reviews: 4500, tag: 'Fan Favourite', inStock: true, prepTime: '45 min',
    menuSection: 'Biriyani',
    variations: [{ key: 'regular', label: 'Regular', price: 280 }, { key: 'executive', label: 'Executive (large)', price: 380 }],
    defaultVariation: 'regular',
  },
  {
    id: 'RES002', restaurantId: 'r_dhaka_kitchen', category: 'restaurant', name: 'Chicken Biriyani',
    description: 'Aromatic chicken biriyani with premium basmati, ghee, whole spices, and raita. Comfort in every bite.',
    price: 180, unit: '1 portion', emoji: '🍛', rating: 4.8, reviews: 6700, tag: 'Best Seller', inStock: true, prepTime: '30 min',
    menuSection: 'Biriyani',
    variations: [
      { key: 'half', label: 'Half', price: 120 }, { key: 'full', label: 'Full', price: 180 },
      { key: 'family', label: 'Family (3p)', price: 320 },
    ], defaultVariation: 'full',
  },
  { id: 'RES003',  restaurantId: 'r_dhaka_kitchen', category: 'restaurant', name: 'Beef Halim',      description: 'Traditional Dhaka-style beef halim — slow-cooked with lentils, wheat, and warming spices.', price: 120, unit: '1 bowl',    emoji: '🥣', rating: 4.7, reviews: 3200, tag: 'Popular',     inStock: true, prepTime: '15 min', menuSection: 'Curries & Stews' },
  { id: 'RES007',  restaurantId: 'r_dhaka_kitchen', category: 'restaurant', name: 'Hilsa Fish Curry', description: "Bangladesh's national fish — Ilish in mustard paste and green chili. Pure soul food.",      price: 350, unit: '1 portion',emoji: '🐟', rating: 4.9, reviews: 1560, tag: 'Traditional', inStock: true, prepTime: '25 min', menuSection: 'Curries & Stews' },
  { id: 'RES009',  restaurantId: 'r_dhaka_kitchen', category: 'restaurant', name: 'Khichuri (Veg)',   description: 'Classic Bengali comfort food — rice and lentils cooked together with warming spices.',        price: 120, unit: '1 portion',emoji: '🥘', rating: 4.5, reviews: 890,  tag: '🌿 Veg',     inStock: true, prepTime: '20 min', menuSection: 'Rice Dishes' },
  { id: 'RES016',  restaurantId: 'r_dhaka_kitchen', category: 'restaurant', name: 'Veg Fried Rice',   description: 'Wok-tossed basmati rice with seasonal vegetables, eggs, soy sauce, and sesame oil.',        price: 180, unit: '1 plate',  emoji: '🍚', rating: 4.4, reviews: 1890, tag: '🌿 Veg',     inStock: true, prepTime: '20 min', menuSection: 'Rice Dishes' },

  // ============================== RESTAURANT — Kabab Palace ==============================
  { id: 'RES004', restaurantId: 'r_kabab_palace', category: 'restaurant', name: 'Chicken Roast',  description: 'Tender half-chicken marinated in aromatic spices, slow-roasted to perfection.',              price: 280, unit: '½ chicken', emoji: '🍗', rating: 4.6, reviews: 2100, tag: null,           inStock: true, prepTime: '25 min', menuSection: 'Roasts & Kababs' },
  { id: 'RES005', restaurantId: 'r_kabab_palace', category: 'restaurant', name: 'Chicken Rezala', description: 'Mughal-heritage white curry — chicken in rich yogurt, cashew, and rose water gravy.',         price: 220, unit: '1 portion', emoji: '🍲', rating: 4.7, reviews: 1890, tag: "Chef's Special",inStock: true, prepTime: '30 min', menuSection: 'Curries' },
  { id: 'RES006', restaurantId: 'r_kabab_palace', category: 'restaurant', name: 'Mutton Curry',   description: 'Slow-cooked mutton in bold, aromatic spice gravy. Fall-off-the-bone tender.',                 price: 320, unit: '1 portion', emoji: '🍲', rating: 4.8, reviews: 2340, tag: null,           inStock: true, prepTime: '40 min', menuSection: 'Curries' },
  { id: 'RES008', restaurantId: 'r_kabab_palace', category: 'restaurant', name: 'Prawn Masala',   description: 'Juicy prawns cooked in a rich spicy onion-tomato masala. Best with steamed rice.',            price: 380, unit: '1 portion', emoji: '🦐', rating: 4.7, reviews: 1230, tag: null,           inStock: true, prepTime: '30 min', menuSection: 'Seafood' },

  // ============================== RESTAURANT — Street Eats BD ==============================
  { id: 'RES010', restaurantId: 'r_street_eats', category: 'restaurant', name: 'Chicken Shawarma',  description: 'Bangladeshi-style chicken wrap with garlic mayo, pickles, and fresh veggies.',              price: 120, unit: '1 roll',    emoji: '🌯', rating: 4.6, reviews: 3400, tag: 'Popular',     inStock: true, prepTime: '15 min', menuSection: 'Wraps & Rolls' },
  { id: 'RES013', restaurantId: 'r_street_eats', category: 'restaurant', name: 'Crispy Fries',      description: 'Golden-fried crispy potato fries served with ketchup and mayo dipping sauces.',             price: 80,  unit: '1 serving', emoji: '🍟', rating: 4.3, reviews: 4500, tag: 'Snack',       inStock: true, prepTime: '10 min', menuSection: 'Snacks & Street Food' },
  { id: 'RES014', restaurantId: 'r_street_eats', category: 'restaurant', name: 'Fuchka (Pani Puri)', description: 'Iconic Dhaka street food — crispy semolina shells with spiced chickpeas, tamarind water.',  price: 80,  unit: '10 pieces', emoji: '🟤', rating: 4.8, reviews: 8900, tag: 'Street Food',inStock: true, prepTime: '5 min',  menuSection: 'Snacks & Street Food' },
  { id: 'RES015', restaurantId: 'r_street_eats', category: 'restaurant', name: 'Chotpoti',           description: 'Tangy and spicy chickpea street snack with boiled egg, tamarind chutney, coriander.',       price: 70,  unit: '1 bowl',    emoji: '🥗', rating: 4.6, reviews: 3200, tag: 'Street Food',inStock: true, prepTime: '5 min',  menuSection: 'Snacks & Street Food' },

  // ============================== RESTAURANT — Fast Bites ==============================
  { id: 'RES011', restaurantId: 'r_fast_bites', category: 'restaurant', name: 'Beef Burger',   description: 'Juicy double-patty beef burger with fresh lettuce, tomato, cheese, and our signature sauce.', price: 180, unit: '1 piece',          emoji: '🍔', rating: 4.5, reviews: 2100, tag: null, inStock: true, prepTime: '20 min', menuSection: 'Burgers' },
  { id: 'RES012', restaurantId: 'r_fast_bites', category: 'restaurant', name: 'Chicken Pizza', description: 'Hand-stretched pizza with grilled chicken, mozzarella, capsicum, and tomato sauce. 8-inch.', price: 380, unit: '8 inch (6 slices)', emoji: '🍕', rating: 4.4, reviews: 1560, tag: null, inStock: true, prepTime: '35 min', menuSection: 'Pizza' },

  // ============================== RESTAURANT — The Sip House ==============================
  { id: 'RES017', restaurantId: 'r_sip_house', category: 'restaurant', name: 'Chicken Chow Mein', description: 'Stir-fried egg noodles with chicken, fresh vegetables, and savory soy-based sauce.',        price: 200, unit: '1 plate',       emoji: '🍜', rating: 4.5, reviews: 2100, tag: 'Popular',    inStock: true, prepTime: '20 min', menuSection: 'Chinese Dishes' },
  { id: 'RES018', restaurantId: 'r_sip_house', category: 'restaurant', name: 'Cold Coffee Shake', description: 'Thick blended cold coffee with vanilla ice cream, milk, and a caramel drizzle.',           price: 120, unit: '1 large glass', emoji: '☕', rating: 4.7, reviews: 1600, tag: 'Refreshing', inStock: true, prepTime: '5 min',  menuSection: 'Cold Drinks & Juices' },
  { id: 'RES019', restaurantId: 'r_sip_house', category: 'restaurant', name: 'Mango Lassi',       description: 'Creamy blended alphonso mango with sweet yogurt and a pinch of cardamom.',                price: 100, unit: '1 glass',       emoji: '🥭', rating: 4.8, reviews: 2300, tag: 'Seasonal',   inStock: true, prepTime: '5 min',  menuSection: 'Cold Drinks & Juices' },
  {
    id: 'RES020', restaurantId: 'r_sip_house', category: 'restaurant', name: 'Soft Drink',
    description: 'Your choice of chilled Coke, Pepsi, 7Up, Sprite, or Mojo. Ice cold and refreshing.',
    price: 60, unit: '325ml can', emoji: '🥤', rating: 4.0, reviews: 5600, tag: null, inStock: true, prepTime: '2 min',
    menuSection: 'Cold Drinks & Juices',
    variations: [
      { key: '250ml', label: '250 ml',       price: 40 },
      { key: '325ml', label: '325 ml can',   price: 60 },
      { key: '500ml', label: '500 ml bottle',price: 85 },
    ], defaultVariation: '325ml',
  },

  // ============================== LAUNDRY — CleanQuick ==============================
  { id: 'LAU001', restaurantId: 'r_cleanquick', category: 'laundry', name: 'Shirt — Wash & Iron',  description: 'Professional wash and crisp iron for formal and casual shirts.',           price: 30,  unit: 'per piece', emoji: '👔', rating: 4.6, reviews: 890,  tag: 'Popular',   inStock: true, turnaround: '24 hours', menuSection: 'Everyday Wash' },
  { id: 'LAU002', restaurantId: 'r_cleanquick', category: 'laundry', name: 'Pants — Wash & Iron',  description: 'Full wash and precision ironing for trousers, dress pants, and chinos.',  price: 40,  unit: 'per piece', emoji: '👖', rating: 4.5, reviews: 670,  tag: null,        inStock: true, turnaround: '24 hours', menuSection: 'Everyday Wash' },
  { id: 'LAU003', restaurantId: 'r_cleanquick', category: 'laundry', name: 'T-Shirt Wash',         description: 'Gentle machine wash for t-shirts, polos, and casual tops.',               price: 20,  unit: 'per piece', emoji: '👕', rating: 4.4, reviews: 1200, tag: null,        inStock: true, turnaround: '24 hours', menuSection: 'Everyday Wash' },
  {
    id: 'LAU011', restaurantId: 'r_cleanquick', category: 'laundry', name: 'Express Wash (6 hrs)',
    description: 'Urgent 6-hour turnaround wash for when you need clothes back fast. Same-day service.',
    price: 80, unit: 'per kg', emoji: '⚡', rating: 4.5, reviews: 890, tag: 'Express', inStock: true, turnaround: '6 hours',
    menuSection: 'Express Services',
    variations: [
      { key: '1kg', label: '1 kg', price: 80  },
      { key: '2kg', label: '2 kg', price: 150 },
      { key: '5kg', label: '5 kg', price: 350 },
    ], defaultVariation: '1kg',
  },
  { id: 'LAU012', restaurantId: 'r_cleanquick', category: 'laundry', name: 'De-staining Service', description: 'Expert stain removal for curry, ink, oil, and wine stains.',              price: 200, unit: 'per piece', emoji: '✨', rating: 4.8, reviews: 340,  tag: 'Specialist',inStock: true, turnaround: '48 hours', menuSection: 'Specialist Care' },

  // ============================== LAUNDRY — DryClean Pro ==============================
  { id: 'LAU004', restaurantId: 'r_dryclean_pro', category: 'laundry', name: 'Suit — Dry Clean',     description: 'Expert dry cleaning for your 2-piece or 3-piece formal suit. Pressed and bagged.',     price: 250, unit: 'per suit',     emoji: '🤵', rating: 4.8, reviews: 340,  tag: 'Premium',  inStock: true, turnaround: '48 hours', menuSection: 'Formal Wear' },
  { id: 'LAU005', restaurantId: 'r_dryclean_pro', category: 'laundry', name: 'Saree — Dry Clean',     description: 'Delicate dry cleaning for silk, georgette, or chiffon sarees with gentle care.',       price: 200, unit: 'per piece',    emoji: '🥻', rating: 4.7, reviews: 560,  tag: 'Delicate', inStock: true, turnaround: '48 hours', menuSection: 'Traditional Wear' },
  { id: 'LAU006', restaurantId: 'r_dryclean_pro', category: 'laundry', name: 'Jacket / Sweater Wash', description: 'Careful low-temperature wash for woolen jackets, cardigans, and sweaters.',           price: 150, unit: 'per piece',    emoji: '🧥', rating: 4.5, reviews: 230,  tag: null,       inStock: true, turnaround: '36 hours', menuSection: 'Formal Wear' },
  { id: 'LAU007', restaurantId: 'r_dryclean_pro', category: 'laundry', name: 'Blanket Deep Wash',     description: 'Heavy-duty deep clean for thick blankets, quilts, and comforters. Fresh and fluffy.', price: 350, unit: 'per piece',    emoji: '🛏️', rating: 4.6, reviews: 450,  tag: 'Heavy',    inStock: true, turnaround: '48 hours', menuSection: 'Household Linen' },
  { id: 'LAU008', restaurantId: 'r_dryclean_pro', category: 'laundry', name: 'Bedsheet Set Wash',     description: 'Complete wash and iron for a bedsheet set (1 sheet + 2 pillowcases).',               price: 120, unit: 'per full set', emoji: '🛏️', rating: 4.4, reviews: 380,  tag: null,       inStock: true, turnaround: '24 hours', menuSection: 'Household Linen' },
  { id: 'LAU009', restaurantId: 'r_dryclean_pro', category: 'laundry', name: 'Curtain Wash',          description: 'Professional laundry for window curtains — keeps fabric colours bright.',            price: 180, unit: 'per pair',     emoji: '🏠', rating: 4.3, reviews: 210,  tag: null,       inStock: true, turnaround: '48 hours', menuSection: 'Household Linen' },
  { id: 'LAU010', restaurantId: 'r_dryclean_pro', category: 'laundry', name: 'Shoe Deep Clean',       description: 'Hand-cleaning and polishing for leather shoes, sneakers, and canvas kicks.',         price: 150, unit: 'per pair',     emoji: '👟', rating: 4.7, reviews: 670,  tag: 'Trending', inStock: true, turnaround: '24 hours', menuSection: 'Shoes & Accessories' },

  // ============================== ELECTRONICS — TechZone BD ==============================
  {
    id: 'ELC001', restaurantId: 'r_techzone_bd', category: 'electronics', name: 'Apple iPhone 15',
    description: 'iPhone 15 with A16 Bionic chip, 48MP main camera, USB-C, Dynamic Island. Multiple storage options.',
    price: 145000, unit: '1 piece', emoji: '📱', rating: 4.9, reviews: 2340, tag: 'Premium', inStock: true, brand: 'Apple', warranty: '1 year official',
    menuSection: 'Smartphones',
    variations: [
      { key: '128gb', label: '128 GB', price: 145000 }, { key: '256gb', label: '256 GB', price: 162000 },
      { key: '512gb', label: '512 GB', price: 188000 },
    ], defaultVariation: '128gb',
  },
  {
    id: 'ELC002', restaurantId: 'r_techzone_bd', category: 'electronics', name: 'Samsung Galaxy S24',
    description: 'Samsung flagship with Galaxy AI, 50MP triple camera, Snapdragon 8 Gen 3, 25W fast charge.',
    price: 85000, unit: '1 piece', emoji: '📱', rating: 4.8, reviews: 1890, tag: 'Hot', inStock: true, brand: 'Samsung', warranty: '1 year official',
    menuSection: 'Smartphones',
    variations: [
      { key: '128gb', label: '128 GB', price: 85000 }, { key: '256gb', label: '256 GB', price: 95000 },
    ], defaultVariation: '128gb',
  },
  {
    id: 'ELC003', restaurantId: 'r_techzone_bd', category: 'electronics', name: 'Xiaomi Redmi 12',
    description: 'Redmi 12 with 90Hz FHD+ display, 50MP AI triple camera, 5000mAh battery.',
    price: 19999, unit: '1 piece', emoji: '📱', rating: 4.5, reviews: 3400, tag: 'Budget Pick', inStock: true, brand: 'Xiaomi', warranty: '1 year official',
    menuSection: 'Smartphones',
    variations: [
      { key: '64gb',  label: '64 GB',  price: 17999 }, { key: '128gb', label: '128 GB', price: 19999 },
    ], defaultVariation: '128gb',
  },
  { id: 'ELC004', restaurantId: 'r_techzone_bd', category: 'electronics', name: 'Realme C55',            description: 'Realme C55 with Mini Capsule display, 64MP camera, Helio G88, and 5000mAh battery.',   price: 17999, unit: '1 piece', emoji: '📱', rating: 4.4, reviews: 2100, tag: null,          inStock: true, brand: 'Realme',   warranty: '1 year',          menuSection: 'Smartphones' },
  { id: 'ELC005', restaurantId: 'r_techzone_bd', category: 'electronics', name: 'HP Laptop (Core i5)',   description: 'HP 15.6" laptop — Intel Core i5 12th gen, 8GB DDR4, 512GB SSD, Windows 11.',         price: 58000, unit: '1 piece', emoji: '💻', rating: 4.6, reviews: 1230, tag: 'Best Value', inStock: true, brand: 'HP',       warranty: '1 year',          menuSection: 'Laptops' },
  { id: 'ELC006', restaurantId: 'r_techzone_bd', category: 'electronics', name: 'ASUS VivoBook OLED',    description: 'ASUS VivoBook 15.6" OLED — Core i5 12th gen, 16GB RAM, 512GB SSD.',                  price: 65000, unit: '1 piece', emoji: '💻', rating: 4.7, reviews: 890,  tag: 'OLED',       inStock: true, brand: 'ASUS',     warranty: '2 years',         menuSection: 'Laptops' },
  { id: 'ELC016', restaurantId: 'r_techzone_bd', category: 'electronics', name: 'Amazfit Bip 3 Watch',   description: 'Amazfit Bip 3 smartwatch — heart rate, SpO2, sleep tracking, 14-day battery.',         price: 8500,  unit: '1 piece', emoji: '⌚', rating: 4.5, reviews: 1340, tag: 'Trending',   inStock: true, brand: 'Amazfit',  warranty: '1 year',          menuSection: 'Tablets & Wearables' },
  { id: 'ELC017', restaurantId: 'r_techzone_bd', category: 'electronics', name: 'Samsung Galaxy Tab A8', description: 'Samsung 10.5" tablet — 32GB, 3GB RAM, TFT LCD, 7040mAh battery.',                    price: 28000, unit: '1 piece', emoji: '📟', rating: 4.6, reviews: 670,  tag: null,         inStock: true, brand: 'Samsung',  warranty: '1 year official', menuSection: 'Tablets & Wearables' },

  // ============================== ELECTRONICS — Gadget World ==============================
  { id: 'ELC007', restaurantId: 'r_gadget_world', category: 'electronics', name: 'JBL GO 3 Speaker',       description: 'JBL GO 3 bold portable speaker — waterproof IP67, 5 hours playtime, powerful bass.',   price: 3500,  unit: '1 piece', emoji: '🔊', rating: 4.7, reviews: 2300, tag: 'Popular',     inStock: true, brand: 'JBL',        warranty: '1 year',   menuSection: 'Audio & Speakers' },
  { id: 'ELC008', restaurantId: 'r_gadget_world', category: 'electronics', name: 'Sony In-Ear Headphones', description: 'Sony MDR-EX15AP wired earphones with built-in mic — clear sound, comfortable fit.',    price: 1200,  unit: '1 piece', emoji: '🎧', rating: 4.4, reviews: 1890, tag: null,          inStock: true, brand: 'Sony',       warranty: '6 months', menuSection: 'Audio & Speakers' },
  { id: 'ELC009', restaurantId: 'r_gadget_world', category: 'electronics', name: 'TP-Link Archer Router',  description: 'TP-Link Archer C6 AC1200 dual-band WiFi 5 router — fast, stable internet.',           price: 2800,  unit: '1 piece', emoji: '📡', rating: 4.6, reviews: 1560, tag: 'Best Seller', inStock: true, brand: 'TP-Link',    warranty: '3 years',  menuSection: 'Networking' },
  { id: 'ELC010', restaurantId: 'r_gadget_world', category: 'electronics', name: 'Romoss Power Bank 20K',  description: 'Romoss 20000mAh power bank — 22.5W fast charging, USB-A + USB-C dual output.',         price: 1800,  unit: '1 piece', emoji: '🔋', rating: 4.5, reviews: 3400, tag: 'Popular',     inStock: true, brand: 'Romoss',     warranty: '1 year',   menuSection: 'Power & Charging' },
  { id: 'ELC011', restaurantId: 'r_gadget_world', category: 'electronics', name: 'Anker 65W GaN Charger',  description: 'Compact Anker GaN 65W USB-C charger compatible with laptops, phones, and tablets.',    price: 1200,  unit: '1 piece', emoji: '🔌', rating: 4.6, reviews: 1200, tag: null,          inStock: true, brand: 'Anker',      warranty: '18 months',menuSection: 'Power & Charging' },
  { id: 'ELC012', restaurantId: 'r_gadget_world', category: 'electronics', name: 'HDMI 2.0 Cable (3m)',    description: 'Premium 4K@60Hz HDMI 2.0 cable with gold-plated connectors. Supports HDR and ARC.',    price: 350,   unit: '3 metre', emoji: '🔗', rating: 4.3, reviews: 780,  tag: null,          inStock: true, brand: 'Generic Pro',warranty: '6 months', menuSection: 'PC Accessories' },
  { id: 'ELC013', restaurantId: 'r_gadget_world', category: 'electronics', name: 'HAVIT Mech. Keyboard',   description: 'Wired USB 87-key TKL mechanical keyboard with RGB backlight and tactile switches.',     price: 1800,  unit: '1 piece', emoji: '⌨️', rating: 4.5, reviews: 560,  tag: null,          inStock: true, brand: 'HAVIT',      warranty: '1 year',   menuSection: 'PC Accessories' },
  { id: 'ELC014', restaurantId: 'r_gadget_world', category: 'electronics', name: 'Logitech M235 Mouse',    description: 'Logitech M235 wireless mouse — smooth tracking, 12-month battery life.',               price: 1200,  unit: '1 piece', emoji: '🖱️', rating: 4.6, reviews: 2100, tag: 'Popular',     inStock: true, brand: 'Logitech',   warranty: '1 year',   menuSection: 'PC Accessories' },
  { id: 'ELC015', restaurantId: 'r_gadget_world', category: 'electronics', name: 'Logitech Full HD Webcam', description: '1080p Full HD webcam with built-in mic. Plug-and-play for Zoom and Teams calls.',      price: 2500,  unit: '1 piece', emoji: '📸', rating: 4.4, reviews: 890,  tag: null,          inStock: true, brand: 'Logitech',   warranty: '1 year',   menuSection: 'PC Accessories' },
  { id: 'ELC018', restaurantId: 'r_gadget_world', category: 'electronics', name: 'Philips Air Purifier',   description: 'Philips AC1215 — covers 63m², 3-stage HEPA filtration, real-time air quality sensor.', price: 12000, unit: '1 device',emoji: '💨', rating: 4.7, reviews: 450,  tag: 'Healthy Home',inStock: true, brand: 'Philips',    warranty: '2 years',  menuSection: 'Smart Home' },
  { id: 'ELC019', restaurantId: 'r_gadget_world', category: 'electronics', name: 'Philips Electric Kettle', description: 'Philips 1.5L stainless steel kettle — rapid boil 2200W, auto shut-off.',             price: 1800,  unit: '1 piece', emoji: '🫖', rating: 4.5, reviews: 1230, tag: null,          inStock: true, brand: 'Philips',    warranty: '2 years',  menuSection: 'Smart Home' },
  { id: 'ELC020', restaurantId: 'r_gadget_world', category: 'electronics', name: 'Smart WiFi LED Bulb',    description: '9W smart WiFi LED — 16M colour options, voice control (Alexa/Google), app-controlled.', price: 650,   unit: '1 piece', emoji: '💡', rating: 4.4, reviews: 890,  tag: 'Smart Home',  inStock: true, brand: 'Syska Smart',warranty: '2 years',  menuSection: 'Smart Home' },
];

module.exports = products;
