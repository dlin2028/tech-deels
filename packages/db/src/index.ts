import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required but not set.');
}

const queryClient = postgres(connectionString);
export const db = drizzle(queryClient, { schema });

export * from './schema';
export type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
