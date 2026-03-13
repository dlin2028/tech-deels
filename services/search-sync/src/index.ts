/**
 * Search sync service.
 * Syncs deal data to a full-text search index (e.g., Meilisearch, Typesense, or pg_trgm).
 *
 * Currently a stub that demonstrates the sync pattern.
 * In production, connect to your search engine of choice and keep it in sync.
 */

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
// NOTE: Using relative import until workspace packages are installed via `bun install`.
// After installation, prefer: import * as schema from '@tech-deels/db';
import * as schema from '../../../packages/db/src/schema';
import { eq } from 'drizzle-orm';

const connectionString =
  process.env.DATABASE_URL || 'postgresql://techdeels:techdeels@localhost:5432/techdeels';
const queryClient = postgres(connectionString);
const db = drizzle(queryClient, { schema });

interface SearchDocument {
  id: number;
  title: string;
  description: string | null;
  store: string;
  brand: string | null;
  price: number;
  categoryName: string | null;
  upvotes: number;
  hotScore: number;
  createdAt: Date;
}

async function buildSearchIndex(): Promise<SearchDocument[]> {
  const deals = await db
    .select({
      id: schema.deals.id,
      title: schema.deals.title,
      description: schema.deals.description,
      store: schema.deals.store,
      brand: schema.deals.brand,
      price: schema.deals.price,
      hotScore: schema.deals.hotScore,
      upvotes: schema.deals.upvotes,
      createdAt: schema.deals.createdAt,
      categoryName: schema.categories.name,
    })
    .from(schema.deals)
    .leftJoin(schema.categories, eq(schema.deals.categoryId, schema.categories.id))
    .where(eq(schema.deals.status, 'active'));

  return deals.map((d) => ({
    id: d.id,
    title: d.title,
    description: d.description,
    store: d.store,
    brand: d.brand,
    price: d.price,
    categoryName: d.categoryName,
    upvotes: d.upvotes,
    hotScore: d.hotScore,
    createdAt: d.createdAt,
  }));
}

async function syncToSearchEngine(docs: SearchDocument[]) {
  // TODO: Replace with actual search engine client
  // Example for Meilisearch:
  //   const client = new MeiliSearch({ host: process.env.MEILI_HOST!, apiKey: process.env.MEILI_KEY! });
  //   const index = client.index('deals');
  //   await index.addDocuments(docs);

  console.log(`[search-sync] Would sync ${docs.length} documents to search index.`);
  console.log(`[search-sync] Sample:`, docs[0] ?? 'none');
}

async function runSync() {
  try {
    console.log('[search-sync] Building search index...');
    const docs = await buildSearchIndex();
    await syncToSearchEngine(docs);
    console.log('[search-sync] Sync complete.');
  } catch (err) {
    console.error('[search-sync] Sync failed:', err);
  }
}

const INTERVAL_MS = 10 * 60 * 1000; // every 10 minutes

console.log('[search-sync] Starting search sync service...');
await runSync();
setInterval(runSync, INTERVAL_MS);
console.log(`[search-sync] Running every ${INTERVAL_MS / 1000}s. Press Ctrl+C to stop.`);
