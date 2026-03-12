import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { categories } from '../src/lib/server/db/schema.js';

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
	{
		name: 'Home Entertainment',
		slug: 'home-entertainment',
		description: 'TVs, streaming devices, and displays'
	},
	{ name: 'Storage', slug: 'storage', description: 'SSDs, HDDs, and NAS devices' },
	{
		name: 'Cooling',
		slug: 'cooling',
		description: 'CPU coolers, case fans, and thermal paste'
	}
];

await db.insert(categories).values(defaultCategories).onConflictDoNothing();
console.log('✅ Seeded default categories');
await client.end();
