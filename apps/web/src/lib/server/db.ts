import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "@tech-deels/db";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client, { schema });
export type DB = typeof db;
