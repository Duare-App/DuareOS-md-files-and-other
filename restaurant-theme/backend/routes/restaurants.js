const express    = require('express');
const router     = express.Router();
const restaurants = require('../data/restaurants');
const products   = require('../data/products');

const mockPendingStores = [
  {
    id: 'r_fresh_bake', category: 'grocery',
    name: 'Fresh Bake', tagline: 'Artisan bread & daily pastries',
    emoji: '🥐', rating: 0, reviewCount: 0,
    deliveryTime: '30–45 min', deliveryFee: 40, minOrder: 100,
    promoted: false, isFeatured: false,
    tags: ['Bakery', 'Breakfast', 'Desserts'],
    bgColor: '#FFFBEB', accentColor: '#D97706',
    coverGradient: 'linear-gradient(135deg, #78350F 0%, #D97706 60%, #FCD34D 100%)',
    logoColor: '#D97706',
    menuSections: ['Breads', 'Pastries', 'Cakes'],
    applicantName: 'Fahim Rahman'
  },
  {
    id: 'r_health_plus', category: 'medicine',
    name: 'Health Plus', tagline: 'Quick vitamins and OTC medicines',
    emoji: '💊', rating: 0, reviewCount: 0,
    deliveryTime: '20–30 min', deliveryFee: 30, minOrder: 50,
    promoted: false, isFeatured: false,
    tags: ['Vitamins', 'OTC', 'Health'],
    bgColor: '#EFF6FF', accentColor: '#2563EB',
    coverGradient: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 60%, #93C5FD 100%)',
    logoColor: '#2563EB',
    menuSections: ['Vitamins', 'First Aid'],
    applicantName: 'Dr. Sarah'
  }
];

// GET /api/restaurants/pending
router.get('/pending', (req, res) => {
  res.json({ success: true, pendingStores: mockPendingStores });
});

// POST /api/restaurants/approve/:id
router.post('/approve/:id', (req, res) => {
  const storeIndex = mockPendingStores.findIndex(s => s.id === req.params.id);
  if (storeIndex === -1) {
    return res.status(404).json({ success: false, message: 'Pending store not found' });
  }
  
  const storeToApprove = mockPendingStores[storeIndex];
  mockPendingStores.splice(storeIndex, 1);
  
  // Clean up admin fields
  delete storeToApprove.applicantName;
  
  // Push to active memory array
  restaurants.push(storeToApprove);
  
  res.json({ success: true, message: 'Store approved successfully', restaurant: storeToApprove });
});

// GET /api/restaurants
// Query: ?category= &promoted=true &featured=true &limit=
router.get('/', (req, res) => {
  const { category, promoted, featured, limit } = req.query;
  let results = [...restaurants];

  if (category)           results = results.filter(r => r.category === category);
  if (promoted === 'true') results = results.filter(r => r.promoted);
  if (featured === 'true') results = results.filter(r => r.isFeatured);

  // Annotate each restaurant with product count
  results = results.map(r => ({
    ...r,
    productCount: products.filter(p => p.restaurantId === r.id).length,
  }));

  if (limit) results = results.slice(0, parseInt(limit, 10));

  res.json({ success: true, restaurants: results, total: results.length });
});

// GET /api/restaurants/:id
router.get('/:id', (req, res) => {
  const rest = restaurants.find(r => r.id === req.params.id);
  if (!rest) return res.status(404).json({ success: false, message: 'Restaurant not found' });

  res.json({
    success: true,
    restaurant: {
      ...rest,
      productCount: products.filter(p => p.restaurantId === rest.id).length,
    },
  });
});

// GET /api/restaurants/:id/products
// Query: ?search= &sort= (same sort options as products route)
router.get('/:id/products', (req, res) => {
  const rest = restaurants.find(r => r.id === req.params.id);
  if (!rest) return res.status(404).json({ success: false, message: 'Restaurant not found' });

  const { search, sort } = req.query;
  let results = products.filter(p => p.restaurantId === req.params.id);

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.tag && p.tag.toLowerCase().includes(q))
    );
  }

  switch (sort) {
    case 'price_asc':  results.sort((a, b) => a.price - b.price); break;
    case 'price_desc': results.sort((a, b) => b.price - a.price); break;
    case 'rating':     results.sort((a, b) => b.rating - a.rating); break;
    case 'name':       results.sort((a, b) => a.name.localeCompare(b.name)); break;
    default: break;
  }

  // Inject restaurantName on every product
  results = results.map(p => ({ ...p, restaurantName: rest.name, restaurantEmoji: rest.emoji }));

  res.json({ success: true, products: results, total: results.length, restaurant: rest });
});

module.exports = router;
