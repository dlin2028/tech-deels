import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

function createDb() {
	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) {
		throw new Error('DATABASE_URL is not set');
	}
	const client = postgres(connectionString);
	return drizzle(client, { schema });
}

let _db: ReturnType<typeof createDb> | null = null;

// Lazy proxy: defers connection until first DB call (avoids build-time errors)
export const db = new Proxy({} as ReturnType<typeof createDb>, {
	get(_target, prop) {
		if (!_db) {
			_db = createDb();
		}
		return Reflect.get(_db, prop);
	}
});
