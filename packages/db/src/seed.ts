import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { hash } from '@node-rs/argon2';
import * as schema from './schema.js';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set.');
  process.exit(1);
}

const client = postgres(DATABASE_URL);
const db = drizzle(client, { schema });

async function seed() {
  console.log('🌱 Seeding database...');

  // Categories
  console.log('  Creating categories...');
  const categoryData = [
    { name: 'Laptops', slug: 'laptops', description: 'Laptop deals and portable computers' },
    { name: 'CPUs', slug: 'cpus', description: 'Processors and CPU deals' },
    { name: 'GPUs', slug: 'gpus', description: 'Graphics cards and GPU deals' },
    { name: 'Monitors', slug: 'monitors', description: 'Monitor and display deals' },
    { name: 'Storage', slug: 'storage', description: 'SSDs, HDDs, and storage deals' },
  ];

  await db.insert(schema.categories).values(categoryData).onConflictDoNothing();
  const categories = await db.select().from(schema.categories);

  // Merchants
  console.log('  Creating merchants...');
  const merchantData = [
    { name: 'Amazon', slug: 'amazon', domain: 'amazon.com', trustScore: 4.5 },
    { name: 'Newegg', slug: 'newegg', domain: 'newegg.com', trustScore: 4.2 },
    { name: 'Best Buy', slug: 'bestbuy', domain: 'bestbuy.com', trustScore: 4.3 },
  ];

  await db.insert(schema.merchants).values(merchantData).onConflictDoNothing();
  const merchants = await db.select().from(schema.merchants);

  // Admin user
  console.log('  Creating admin user...');
  const adminPasswordHash = await hash('admin123', {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const adminId = 'admin_seed_user_001';
  await db
    .insert(schema.users)
    .values({
      id: adminId,
      username: 'admin',
      email: 'admin@techdeels.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
      reputation: 1000,
    })
    .onConflictDoNothing();

  // Regular user for deals
  const userId = 'regular_seed_user_01';
  await db
    .insert(schema.users)
    .values({
      id: userId,
      username: 'techfan',
      email: 'techfan@example.com',
      passwordHash: await hash('password123', {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      }),
      role: 'user',
      reputation: 150,
    })
    .onConflictDoNothing();

  const laptopCat = categories.find((c) => c.slug === 'laptops');
  const cpuCat = categories.find((c) => c.slug === 'cpus');
  const gpuCat = categories.find((c) => c.slug === 'gpus');
  const monitorCat = categories.find((c) => c.slug === 'monitors');
  const storageCat = categories.find((c) => c.slug === 'storage');

  const amazon = merchants.find((m) => m.slug === 'amazon');
  const newegg = merchants.find((m) => m.slug === 'newegg');
  const bestbuy = merchants.find((m) => m.slug === 'bestbuy');

  // Sample deals
  console.log('  Creating sample deals...');
  const dealsData = [
    {
      title: 'ASUS ROG Zephyrus G14 14" Gaming Laptop - AMD Ryzen 9, RTX 4060, 16GB RAM, 512GB SSD',
      url: 'https://www.amazon.com/dp/example1',
      price: 949.99,
      originalPrice: 1299.99,
      shippingCost: 0,
      categoryId: laptopCat?.id,
      merchantId: amazon?.id,
      userId: adminId,
      description: 'Excellent gaming laptop with the latest AMD CPU and Nvidia GPU combo at a great price.',
      hotScore: 95.5,
    },
    {
      title: 'AMD Ryzen 9 7950X Desktop Processor - 16 Cores, 32 Threads, 4.5GHz',
      url: 'https://www.newegg.com/p/example2',
      price: 549.99,
      originalPrice: 699.99,
      shippingCost: 0,
      categoryId: cpuCat?.id,
      merchantId: newegg?.id,
      userId: adminId,
      description: 'Top-of-the-line AMD processor for workstation builds. Incredible multi-threaded performance.',
      hotScore: 88.2,
    },
    {
      title: 'NVIDIA GeForce RTX 4070 Super 12GB GDDR6X Graphics Card',
      url: 'https://www.bestbuy.com/p/example3',
      price: 549.00,
      originalPrice: 599.99,
      shippingCost: 0,
      categoryId: gpuCat?.id,
      merchantId: bestbuy?.id,
      userId: userId,
      description: 'Great mid-range GPU with excellent 1440p performance. Ray tracing capable.',
      hotScore: 76.8,
    },
    {
      title: 'LG 27GP850-B 27" 1440p 165Hz IPS Gaming Monitor with G-Sync',
      url: 'https://www.amazon.com/dp/example4',
      price: 249.99,
      originalPrice: 349.99,
      shippingCost: 0,
      categoryId: monitorCat?.id,
      merchantId: amazon?.id,
      userId: userId,
      description: 'Incredible IPS panel with fast response time. Perfect for competitive gaming.',
      hotScore: 71.3,
    },
    {
      title: 'Samsung 990 Pro 2TB NVMe M.2 SSD - PCIe 4.0',
      url: 'https://www.newegg.com/p/example5',
      price: 109.99,
      originalPrice: 179.99,
      shippingCost: 0,
      categoryId: storageCat?.id,
      merchantId: newegg?.id,
      userId: adminId,
      description: 'Blazing fast NVMe SSD. Great for OS drive or game storage.',
      hotScore: 65.1,
    },
    {
      title: 'Lenovo ThinkPad E14 Gen 5 - Intel Core i7-13700H, 16GB, 512GB SSD',
      url: 'https://www.amazon.com/dp/example6',
      price: 699.00,
      originalPrice: 999.00,
      shippingCost: 0,
      categoryId: laptopCat?.id,
      merchantId: amazon?.id,
      userId: userId,
      description: 'Business laptop with excellent keyboard and build quality. Great for work.',
      hotScore: 58.9,
    },
    {
      title: 'Intel Core i5-13600K Desktop Processor - 14 Cores, 24 Threads',
      url: 'https://www.bestbuy.com/p/example7',
      price: 219.99,
      originalPrice: 319.99,
      shippingCost: 0,
      categoryId: cpuCat?.id,
      merchantId: bestbuy?.id,
      userId: adminId,
      description: 'Best value Intel CPU for gaming. Great single-core performance.',
      hotScore: 52.4,
    },
    {
      title: 'AMD Radeon RX 7600 XT 16GB GDDR6 Graphics Card',
      url: 'https://www.newegg.com/p/example8',
      price: 299.99,
      originalPrice: 329.99,
      shippingCost: 0,
      categoryId: gpuCat?.id,
      merchantId: newegg?.id,
      userId: userId,
      description: 'AMD mid-range GPU with plenty of VRAM for the price. Good 1080p performer.',
      hotScore: 44.7,
    },
    {
      title: 'ASUS ProArt 32" 4K OLED Monitor PA32DC - 120Hz, DisplayHDR True Black 400',
      url: 'https://www.amazon.com/dp/example9',
      price: 899.99,
      originalPrice: 1199.99,
      shippingCost: 0,
      categoryId: monitorCat?.id,
      merchantId: amazon?.id,
      userId: adminId,
      description: 'Professional OLED monitor with stunning color accuracy. Perfect for content creators.',
      hotScore: 38.2,
    },
    {
      title: 'WD Blue SN580 1TB NVMe M.2 SSD - PCIe 4.0 x4',
      url: 'https://www.bestbuy.com/p/example10',
      price: 59.99,
      originalPrice: 89.99,
      shippingCost: 0,
      categoryId: storageCat?.id,
      merchantId: bestbuy?.id,
      userId: userId,
      description: 'Budget-friendly NVMe SSD with great everyday performance. Good value pick.',
      hotScore: 31.5,
    },
  ];

  for (const deal of dealsData) {
    if (deal.categoryId && deal.merchantId) {
      await db.insert(schema.deals).values(deal as typeof schema.deals.$inferInsert).onConflictDoNothing();
    }
  }

  console.log('✅ Seeding complete!');
  console.log('');
  console.log('Admin credentials: admin@techdeels.com / admin123');

  await client.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
