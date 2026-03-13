import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

const queryClient = postgres(connectionString);
export const db = drizzle(queryClient, { schema });

export * from './schema';
export type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
