import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import { generateId } from 'lucia';

const connectionString = process.env.DATABASE_URL || 'postgresql://techdeels:techdeels@localhost:5432/techdeels';
const queryClient = postgres(connectionString);
const db = drizzle(queryClient, { schema });

async function seed() {
  console.log('🌱 Seeding database...');

  // Seed categories
  const categoryData = [
    { name: 'Components', slug: 'components', description: 'CPUs, GPUs, RAM, Motherboards', iconName: 'cpu', sortOrder: 1 },
    { name: 'Laptops', slug: 'laptops', description: 'Laptops and Ultrabooks', iconName: 'laptop', sortOrder: 2 },
    { name: 'Systems', slug: 'systems', description: 'Pre-built desktops and workstations', iconName: 'desktop', sortOrder: 3 },
    { name: 'Peripherals', slug: 'peripherals', description: 'Keyboards, mice, headsets', iconName: 'mouse', sortOrder: 4 },
    { name: 'Networking', slug: 'networking', description: 'Routers, switches, access points', iconName: 'wifi', sortOrder: 5 },
    { name: 'Home Entertainment', slug: 'home-entertainment', description: 'TVs, soundbars, streaming devices', iconName: 'tv', sortOrder: 6 },
    { name: 'Monitors', slug: 'monitors', description: 'Gaming and productivity monitors', iconName: 'monitor', sortOrder: 7 },
    { name: 'Storage', slug: 'storage', description: 'SSDs, HDDs, NAS devices', iconName: 'hdd', sortOrder: 8 },
  ];

  const insertedCategories = await db
    .insert(schema.categories)
    .values(categoryData)
    .onConflictDoNothing()
    .returning();

  console.log(`✅ Inserted ${insertedCategories.length} categories`);

  // Seed tags
  const tagData = [
    { name: 'Lightning Deal', slug: 'lightning-deal' },
    { name: 'Free Shipping', slug: 'free-shipping' },
    { name: 'Price Drop', slug: 'price-drop' },
    { name: 'Limited Time', slug: 'limited-time' },
    { name: 'Coupon', slug: 'coupon' },
    { name: 'Clearance', slug: 'clearance' },
    { name: 'Bundle Deal', slug: 'bundle-deal' },
    { name: 'Refurbished', slug: 'refurbished' },
  ];

  const insertedTags = await db
    .insert(schema.tags)
    .values(tagData)
    .onConflictDoNothing()
    .returning();

  console.log(`✅ Inserted ${insertedTags.length} tags`);

  // Seed a demo user
  // NOTE: This is a development-only demo password. Never use hardcoded passwords in production.
  const { Argon2id } = await import('oslo/password');
  const hasher = new Argon2id();
  const hashedPassword = await hasher.hash('password123');
  const userId = generateId(15);

  const insertedUsers = await db
    .insert(schema.users)
    .values([
      {
        id: userId,
        username: 'demouser',
        email: 'demo@techdeels.com',
        hashedPassword,
        role: 'user',
        reputation: 42,
        bio: "I find the best tech deals so you don't have to.",
      },
    ])
    .onConflictDoNothing()
    .returning();

  if (insertedUsers.length === 0) {
    console.log('⚠️  Demo user already exists, skipping deals seed');
    await queryClient.end();
    return;
  }

  console.log(`✅ Inserted ${insertedUsers.length} users`);

  // Get category IDs for reference
  const allCategories = await db.select().from(schema.categories);
  const catMap = Object.fromEntries(allCategories.map((c) => [c.slug, c.id]));

  // Seed sample deals
  const now = new Date();
  const dealsData = [
    {
      title: 'Samsung 990 Pro 2TB NVMe SSD - PCIe 4.0',
      description: 'Blazing fast PCIe 4.0 NVMe SSD with sequential read speeds up to 7,450 MB/s. Perfect for gaming and content creation.',
      url: 'https://example.com/samsung-990-pro',
      price: 119.99,
      originalPrice: 179.99,
      shippingCost: 0,
      store: 'Amazon',
      brand: 'Samsung',
      categoryId: catMap['storage'],
      userId,
      status: 'active' as const,
      condition: 'new' as const,
      upvotes: 234,
      downvotes: 12,
      commentCount: 45,
      viewCount: 1820,
      isFeatured: true,
      hotScore: 8.4,
      score: 222,
      createdAt: new Date(now.getTime() - 2 * 3600 * 1000),
      updatedAt: new Date(now.getTime() - 2 * 3600 * 1000),
    },
    {
      title: 'LG 27" 4K IPS Monitor 144Hz HDR600 - 27GP950-B',
      description: 'Stunning 4K UHD gaming monitor with Nano IPS panel, 144Hz refresh rate, HDMI 2.1, and DisplayPort 1.4.',
      url: 'https://example.com/lg-27gp950',
      price: 449.99,
      originalPrice: 699.99,
      shippingCost: 0,
      store: 'Best Buy',
      brand: 'LG',
      categoryId: catMap['monitors'],
      userId,
      status: 'active' as const,
      condition: 'new' as const,
      upvotes: 187,
      downvotes: 8,
      commentCount: 32,
      viewCount: 2100,
      isFeatured: true,
      hotScore: 7.9,
      score: 179,
      createdAt: new Date(now.getTime() - 5 * 3600 * 1000),
      updatedAt: new Date(now.getTime() - 5 * 3600 * 1000),
    },
    {
      title: 'Logitech G Pro X Superlight 2 Wireless Mouse',
      description: 'Ultra-lightweight gaming mouse at just 60g. HERO 2 sensor, 32000 DPI, 95-hour battery life.',
      url: 'https://example.com/g-pro-x-superlight-2',
      price: 89.99,
      originalPrice: 159.99,
      shippingCost: 0,
      store: 'Newegg',
      brand: 'Logitech',
      categoryId: catMap['peripherals'],
      userId,
      status: 'active' as const,
      condition: 'new' as const,
      upvotes: 142,
      downvotes: 5,
      commentCount: 28,
      viewCount: 1560,
      isFeatured: false,
      hotScore: 6.8,
      score: 137,
      createdAt: new Date(now.getTime() - 8 * 3600 * 1000),
      updatedAt: new Date(now.getTime() - 8 * 3600 * 1000),
    },
    {
      title: 'ASUS ROG Strix B650E-F Gaming WiFi Motherboard',
      description: 'AMD B650E chipset, PCIe 5.0 x16, DDR5, 2.5G LAN + WiFi 6E. Outstanding VRM for AM5 platform.',
      url: 'https://example.com/rog-b650e-f',
      price: 249.99,
      originalPrice: 319.99,
      shippingCost: 0,
      store: 'B&H Photo',
      brand: 'ASUS',
      categoryId: catMap['components'],
      userId,
      status: 'active' as const,
      condition: 'new' as const,
      upvotes: 98,
      downvotes: 3,
      commentCount: 19,
      viewCount: 980,
      isFeatured: false,
      hotScore: 5.2,
      score: 95,
      createdAt: new Date(now.getTime() - 14 * 3600 * 1000),
      updatedAt: new Date(now.getTime() - 14 * 3600 * 1000),
    },
    {
      title: 'Lenovo IdeaPad 5 Laptop - Ryzen 7 5700U, 16GB RAM, 512GB SSD',
      description: '15.6" FHD IPS display, AMD Ryzen 7 5700U, 16GB DDR4, 512GB NVMe SSD. Great everyday laptop deal.',
      url: 'https://example.com/lenovo-ideapad-5',
      price: 499.99,
      originalPrice: 749.99,
      shippingCost: 0,
      store: 'Walmart',
      brand: 'Lenovo',
      categoryId: catMap['laptops'],
      userId,
      status: 'active' as const,
      condition: 'new' as const,
      upvotes: 76,
      downvotes: 9,
      commentCount: 14,
      viewCount: 1340,
      isFeatured: false,
      hotScore: 4.1,
      score: 67,
      createdAt: new Date(now.getTime() - 20 * 3600 * 1000),
      updatedAt: new Date(now.getTime() - 20 * 3600 * 1000),
    },
    {
      title: 'TP-Link Archer AXE75 WiFi 6E Router - Tri-Band',
      description: 'WiFi 6E tri-band router with 6 GHz band support. 4804 Mbps + 1201 Mbps + 574 Mbps. OneMesh compatible.',
      url: 'https://example.com/archer-axe75',
      price: 119.99,
      originalPrice: 169.99,
      shippingCost: 0,
      store: 'Amazon',
      brand: 'TP-Link',
      categoryId: catMap['networking'],
      userId,
      status: 'active' as const,
      condition: 'new' as const,
      upvotes: 63,
      downvotes: 4,
      commentCount: 11,
      viewCount: 870,
      isFeatured: false,
      hotScore: 3.7,
      score: 59,
      createdAt: new Date(now.getTime() - 28 * 3600 * 1000),
      updatedAt: new Date(now.getTime() - 28 * 3600 * 1000),
    },
  ];

  const insertedDeals = await db.insert(schema.deals).values(dealsData).returning();
  console.log(`✅ Inserted ${insertedDeals.length} deals`);

  // Add some sample comments
  if (insertedDeals.length > 0) {
    const commentsData = [
      {
        content: 'Just ordered this! Best price I\'ve seen in months.',
        userId,
        dealId: insertedDeals[0].id,
      },
      {
        content: 'Does it come with a heatsink?',
        userId,
        dealId: insertedDeals[0].id,
      },
      {
        content: 'I picked this up last week, highly recommend. Super fast boot times.',
        userId,
        dealId: insertedDeals[0].id,
      },
      {
        content: 'The colors are incredible on this monitor. HDR really shines.',
        userId,
        dealId: insertedDeals[1].id,
      },
      {
        content: 'Any input lag concerns at 4K 144Hz?',
        userId,
        dealId: insertedDeals[1].id,
      },
    ];

    await db.insert(schema.comments).values(commentsData);
    console.log(`✅ Inserted ${commentsData.length} sample comments`);
  }

  console.log('🎉 Seeding complete!');
  await queryClient.end();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
