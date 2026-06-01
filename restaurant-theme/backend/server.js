const express = require('express');
const cors = require('cors');
const productsRouter     = require('./routes/products');
const ordersRouter      = require('./routes/orders');
const restaurantsRouter = require('./routes/restaurants');
const allProducts       = require('./data/products');
const restaurants       = require('./data/restaurants');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

app.use('/api/products',     productsRouter);
app.use('/api/orders',       ordersRouter);
app.use('/api/restaurants',  restaurantsRouter);

// Cross-restaurant featured products (Best Seller / Popular / Hot)
app.get('/api/featured-products', (req, res) => {
  const FEATURED_TAGS = ['Best Seller', 'Popular', 'Hot', 'Fan Favourite', 'Traditional', 'Express'];
  const limit = parseInt(req.query.limit || '8', 10);
  const category = req.query.category;

  let featured = allProducts.filter(p => p.tag && FEATURED_TAGS.includes(p.tag));
  
  if (category) {
    featured = featured.filter(p => p.category === category);
  }

  featured = featured
    .map(p => {
      const rest = restaurants.find(r => r.id === p.restaurantId);
      return { ...p, restaurantName: rest?.name || '', restaurantEmoji: rest?.emoji || '' };
    })
    .slice(0, limit);
    
  res.json({ success: true, products: featured });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '🚀 Duare API is running!', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════╗');
  console.log('║   🛵  Duare Backend  দুয়ারে API    ║');
  console.log('╠════════════════════════════════════╣');
  console.log(`║  ✅ Running at http://localhost:${PORT}  ║`);
  console.log(`║  📦 API: http://localhost:${PORT}/api   ║`);
  console.log('╚════════════════════════════════════╝');
  console.log('');
});
