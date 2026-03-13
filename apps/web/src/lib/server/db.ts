import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

const connectionString =
  process.env.DATABASE_URL || 'postgresql://techdeels:techdeels@localhost:5432/techdeels';

const queryClient = postgres(connectionString);
export const db = drizzle(queryClient, { schema });

export * from './schema';
