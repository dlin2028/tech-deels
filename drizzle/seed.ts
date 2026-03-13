import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../src/lib/server/db/schema';
import { generateId } from '../src/lib/utils';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/techdeels';

async function seed() {
	const client = postgres(DATABASE_URL);
	const db = drizzle(client, { schema });

	console.log('🌱 Seeding database...');

	// Categories
	const categories = [
		{ id: generateId(), name: 'Laptops & Computers', slug: 'laptops', description: 'Laptops, desktops, and computer components' },
		{ id: generateId(), name: 'Smartphones', slug: 'smartphones', description: 'Phones and accessories' },
		{ id: generateId(), name: 'TVs & Displays', slug: 'tvs', description: 'Televisions and monitors' },
		{ id: generateId(), name: 'Gaming', slug: 'gaming', description: 'Consoles, games, and accessories' },
		{ id: generateId(), name: 'Audio', slug: 'audio', description: 'Headphones, speakers, earbuds' },
		{ id: generateId(), name: 'Smart Home', slug: 'smart-home', description: 'Smart home devices and automation' },
		{ id: generateId(), name: 'Software', slug: 'software', description: 'Apps, subscriptions, and licenses' },
		{ id: generateId(), name: 'Networking', slug: 'networking', description: 'Routers, switches, and networking gear' },
	];

	await db.insert(schema.category).values(categories).onConflictDoNothing();
	console.log('✅ Categories seeded');

	// Admin user
	const passwordHash = await Bun.password.hash('admin123');
	const adminId = generateId();
	await db.insert(schema.user).values({
		id: adminId,
		username: 'admin',
		email: 'admin@techdeels.com',
		passwordHash,
		role: 'admin',
		reputation: 1000
	}).onConflictDoNothing();
	console.log('✅ Admin user seeded (email: admin@techdeels.com, password: admin123)');

	// Demo user
	const demoHash = await Bun.password.hash('demo1234');
	const demoId = generateId();
	await db.insert(schema.user).values({
		id: demoId,
		username: 'dealshunter',
		email: 'demo@techdeels.com',
		passwordHash: demoHash,
		role: 'user',
		reputation: 250
	}).onConflictDoNothing();

	// Sample deals
	const deals = [
		{
			id: generateId(),
			title: 'Apple MacBook Air M2 - $200 off at Amazon',
			description: 'Great deal on the MacBook Air M2! The base model with 8GB RAM and 256GB SSD is now $200 off the regular price. Perfect for students and professionals alike.',
			url: 'https://amazon.com/dp/example',
			price: 899,
			originalPrice: 1099,
			store: 'Amazon',
			status: 'active' as const,
			score: 42,
			userId: demoId,
			categoryId: categories[0].id
		},
		{
			id: generateId(),
			title: 'Sony WH-1000XM5 Headphones - Lowest Price Ever',
			description: 'The best noise-canceling headphones are at their lowest price ever. 30-hour battery, multipoint connection, and crystal-clear call quality.',
			url: 'https://bestbuy.com/example',
			price: 279,
			originalPrice: 399,
			store: 'Best Buy',
			status: 'active' as const,
			score: 35,
			userId: adminId,
			categoryId: categories[4].id
		},
		{
			id: generateId(),
			title: "Samsung 65\" QLED 4K TV - $400 off",
			description: "Incredible deal on Samsung's QLED line. Quantum HDR, 120Hz refresh rate. Perfect for gaming and movies.",
			url: 'https://samsung.com/example',
			price: 799,
			originalPrice: 1199,
			store: 'Samsung',
			status: 'active' as const,
			score: 28,
			userId: demoId,
			categoryId: categories[2].id
		}
	];

	for (const d of deals) {
		await db.insert(schema.deal).values({ ...d, affiliateUrl: d.url, imageUrl: null }).onConflictDoNothing();
	}
	console.log('✅ Sample deals seeded');

	await client.end();
	console.log('🎉 Seeding complete!');
}

seed().catch(console.error);
