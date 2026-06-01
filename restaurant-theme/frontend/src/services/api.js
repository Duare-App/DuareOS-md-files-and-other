import allProducts from '../data/products';
import restaurantsData from '../data/restaurants';

// MOCK DATA STORAGE
let restaurants = [...restaurantsData];
let orders = [];

// Helper: Simulate network delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// --- RESTAURANTS --- //

export const getRestaurants = async (params = {}) => {
  await delay();
  const { category, promoted, featured, limit } = params;
  let results = [...restaurants];

  if (category) results = results.filter(r => r.category === category);
  if (promoted === 'true') results = results.filter(r => r.promoted);
  if (featured === 'true') results = results.filter(r => r.isFeatured);

  results = results.map(r => ({
    ...r,
    productCount: allProducts.filter(p => p.restaurantId === r.id).length,
  }));

  if (limit) results = results.slice(0, parseInt(limit, 10));
  
  return { success: true, restaurants: results, total: results.length };
};

export const getRestaurantById = async (id) => {
  await delay();
  const rest = restaurants.find(r => r.id === id);
  if (!rest) throw new Error('Restaurant not found');
  
  return {
    success: true,
    restaurant: {
      ...rest,
      productCount: allProducts.filter(p => p.restaurantId === rest.id).length,
    },
  };
};

export const getRestaurantProducts = async (restaurantId, params = {}) => {
  await delay();
  const rest = restaurants.find(r => r.id === restaurantId);
  if (!rest) throw new Error('Restaurant not found');

  const { search, sort } = params;
  let results = allProducts.filter(p => p.restaurantId === restaurantId);

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.tag && p.tag.toLowerCase().includes(q))
    );
  }

  if (sort) {
    if (sort === 'price_asc') results.sort((a,b) => a.price - b.price);
    else if (sort === 'price_desc') results.sort((a,b) => b.price - a.price);
    else if (sort === 'rating') results.sort((a,b) => b.rating - a.rating);
    else if (sort === 'name') results.sort((a,b) => a.name.localeCompare(b.name));
  }

  results = results.map(p => ({ ...p, restaurantName: rest.name, restaurantEmoji: rest.emoji }));
  return { success: true, products: results, total: results.length, restaurant: rest };
};


// --- FEATURED PRODUCTS --- //

export const getFeaturedProducts = async (params = {}) => {
  await delay();
  const FEATURED_TAGS = ['Best Seller', 'Popular', 'Hot', 'Fan Favourite', 'Traditional', 'Express'];
  const limit = parseInt(params.limit || '8', 10);
  const category = params.category;

  let featured = allProducts.filter(p => p.tag && FEATURED_TAGS.includes(p.tag));
  
  if (category) {
    featured = featured.filter(p => p.category === category);
  }

  featured = featured.map(p => {
    const rest = restaurants.find(r => r.id === p.restaurantId);
    return { ...p, restaurantName: rest?.name || '', restaurantEmoji: rest?.emoji || '' };
  }).slice(0, limit);
    
  return { success: true, products: featured };
};


// --- ORDERS --- //

function generateOrderId() {
  return `DU-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2,5).toUpperCase()}`;
}
function getDominantCategory(items) {
  const c = {};
  items.forEach(i => { c[i.category] = (c[i.category] || 0) + i.quantity; });
  return Object.entries(c).sort((a,b) => b[1]-a[1])[0]?.[0] || 'grocery';
}

const DELIVERY_TIMES = {
  grocery: '45–60 minutes', medicine: '30–45 minutes', restaurant: '30–45 minutes',
  laundry: '24–48 hours', electronics: '2–4 hours',
};
const DELIVERY_MINUTES = { grocery: 52, medicine: 37, restaurant: 35, laundry: 1440, electronics: 180 };
const RIDERS = [
  { id: 'R1', name: 'Rahim Hossain', phone: '01712345678', avatar: '👨‍🦱' },
  { id: 'R2', name: 'Karim Uddin',   phone: '01823456789', avatar: '👨'   },
];
const ORDER_STATUSES = ['placed', 'assigned', 'processing', 'on_the_way', 'delivered'];

export const placeOrder = async (orderData) => {
  await delay(800);
  const { items, customer, paymentMethod, subtotal, deliveryFee, total, riderTip, discount, couponDiscount, couponCode } = orderData;
  if (!items || !items.length) throw new Error('Cart empty');

  const dominantCategory = getDominantCategory(items);
  const orderId = generateOrderId();
  const rider = RIDERS[Math.floor(Math.random() * RIDERS.length)];
  const estimatedMinutes = DELIVERY_MINUTES[dominantCategory] || 45;

  const order = {
    id: orderId, items, customer,
    paymentMethod: paymentMethod || 'cash',
    subtotal: subtotal || 0, deliveryFee: deliveryFee || 0, riderTip: riderTip || 0,
    discount: discount || 0, couponDiscount: couponDiscount || 0, couponCode: couponCode || null, total: total || 0,
    status: 'placed',
    estimatedDelivery: DELIVERY_TIMES[dominantCategory] || '45–60 minutes',
    estimatedMinutes, dominantCategory, rider,
    placedAt: new Date().toISOString(),
  };

  orders.push(order);
  return { success: true, message: 'Order placed successfully!', order };
};

export const getOrderById = async (id) => {
  await delay();
  const order = orders.find(o => o.id === id);
  if (!order) throw new Error('Order not found');
  return { success: true, order };
};

export const getOrders = async () => {
  await delay();
  return { success: true, count: orders.length, orders };
};

export const updateOrderStatus = async (id, status) => {
  await delay();
  const order = orders.find(o => o.id === id);
  if (!order) throw new Error('Order not found');

  if (status && ORDER_STATUSES.includes(status)) {
    order.status = status;
  } else {
    const cur = ORDER_STATUSES.indexOf(order.status);
    if (cur < ORDER_STATUSES.length - 1) order.status = ORDER_STATUSES[cur + 1];
  }
  return { success: true, order };
};


// --- ADMIN: PENDING STORES --- //

let mockPendingStores = [
  {
    id: 'r_fresh_bake', category: 'grocery', name: 'Fresh Bake', tagline: 'Artisan bread & daily pastries', emoji: '🥐', rating: 0, reviewCount: 0, deliveryTime: '30–45 min', deliveryFee: 40, minOrder: 100, promoted: false, isFeatured: false, tags: ['Bakery', 'Breakfast', 'Desserts'], bgColor: '#FFFBEB', accentColor: '#D97706', coverGradient: 'linear-gradient(135deg, #78350F 0%, #D97706 60%, #FCD34D 100%)', logoColor: '#D97706', menuSections: ['Breads', 'Pastries', 'Cakes'], applicantName: 'Fahim Rahman'
  },
  {
    id: 'r_health_plus', category: 'medicine', name: 'Health Plus', tagline: 'Quick vitamins and OTC medicines', emoji: '💊', rating: 0, reviewCount: 0, deliveryTime: '20–30 min', deliveryFee: 30, minOrder: 50, promoted: false, isFeatured: false, tags: ['Vitamins', 'OTC'], bgColor: '#EFF6FF', accentColor: '#2563EB', coverGradient: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 60%, #93C5FD 100%)', logoColor: '#2563EB', menuSections: ['Vitamins', 'First Aid'], applicantName: 'Dr. Sarah'
  }
];

export const getPendingStores = async () => {
  await delay();
  return { success: true, pendingStores: mockPendingStores };
};

export const approvePendingStore = async (id) => {
  await delay(500);
  const storeIndex = mockPendingStores.findIndex(s => s.id === id);
  if (storeIndex === -1) throw new Error('Pending store not found');
  
  const storeToApprove = mockPendingStores[storeIndex];
  mockPendingStores.splice(storeIndex, 1);
  delete storeToApprove.applicantName;
  restaurants.push(storeToApprove);
  
  return { success: true, message: 'Store approved', restaurant: storeToApprove };
};
