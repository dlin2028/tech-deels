import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { categories, tags } from '../src/lib/server/db/schema.js';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

const client = postgres(url);
const db = drizzle(client);

const defaultCategories = [
{ name: 'Components', slug: 'components', description: 'CPUs, GPUs, RAM, Motherboards, etc.' },
{ name: 'Systems', slug: 'systems', description: 'Pre-built desktops and workstations' },
{ name: 'Laptops', slug: 'laptops', description: 'Laptops and ultrabooks' },
{ name: 'Peripherals', slug: 'peripherals', description: 'Keyboards, mice, headsets, and more' },
{ name: 'Networking', slug: 'networking', description: 'Routers, switches, and networking gear' },
{ name: 'Home Entertainment', slug: 'home-entertainment', description: 'TVs, streaming devices, and displays' },
{ name: 'Storage', slug: 'storage', description: 'SSDs, HDDs, and NAS devices' },
{ name: 'Cooling', slug: 'cooling', description: 'CPU coolers, case fans, and thermal paste' }
];

const defaultTags = [
{ name: 'GPU', slug: 'gpu' },
{ name: 'CPU', slug: 'cpu' },
{ name: 'SSD', slug: 'ssd' },
{ name: 'RAM', slug: 'ram' },
{ name: 'Monitor', slug: 'monitor' },
{ name: 'Keyboard', slug: 'keyboard' },
{ name: 'Mouse', slug: 'mouse' },
{ name: 'Headset', slug: 'headset' },
{ name: 'Webcam', slug: 'webcam' },
{ name: 'Router', slug: 'router' },
{ name: 'NAS', slug: 'nas' },
{ name: '4K', slug: '4k' },
{ name: 'Gaming', slug: 'gaming' },
{ name: 'RTX', slug: 'rtx' },
{ name: 'Mini PC', slug: 'mini-pc' },
];

await db.insert(categories).values(defaultCategories).onConflictDoNothing();
console.log('✅ Seeded default categories');

await db.insert(tags).values(defaultTags).onConflictDoNothing();
console.log('✅ Seeded default tags');

await client.end();
