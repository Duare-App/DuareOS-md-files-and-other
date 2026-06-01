const express     = require('express');
const router      = express.Router();
const products    = require('../data/products');
const restaurants = require('../data/restaurants');

// Helper: inject restaurantName onto a product
const withRestaurant = (p) => {
  const r = restaurants.find(r => r.id === p.restaurantId);
  return r ? { ...p, restaurantName: r.name, restaurantEmoji: r.emoji } : p;
};

// GET /api/products?category=grocery&search=rice&sort=price_asc&restaurantId=r_meena_bazar
router.get('/', (req, res) => {
  const { category, search, sort, restaurantId } = req.query;
  let result = [...products];

  if (category)      result = result.filter(p => p.category === category.toLowerCase().trim());
  if (restaurantId)  result = result.filter(p => p.restaurantId === restaurantId);

  if (search) {
    const q = search.toLowerCase().trim();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.tag && p.tag.toLowerCase().includes(q))
    );
  }

  switch (sort) {
    case 'price_asc':  result.sort((a, b) => a.price - b.price); break;
    case 'price_desc': result.sort((a, b) => b.price - a.price); break;
    case 'rating':     result.sort((a, b) => b.rating - a.rating); break;
    case 'name':       result.sort((a, b) => a.name.localeCompare(b.name)); break;
    default: break;
  }

  res.json({ success: true, count: result.length, products: result.map(withRestaurant) });
});

// GET /api/products/categories/summary
router.get('/categories/summary', (req, res) => {
  const cats = ['grocery', 'medicine', 'restaurant', 'laundry', 'electronics'];
  const summary = cats.map(cat => ({
    category: cat,
    count: products.filter(p => p.category === cat).length,
  }));
  res.json({ success: true, summary });
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, product });
});

module.exports = router;
