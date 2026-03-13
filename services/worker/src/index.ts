/**
 * Background worker service.
 * Responsibilities:
 *  - Recompute hot scores for active deals periodically
 *  - Mark expired deals as 'expired'
 *  - Send notification emails (future)
 *  - Clean up stale sessions (future)
 */

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
// NOTE: Using relative import until workspace packages are installed via `bun install`.
// After installation, prefer: import * as schema from '@tech-deels/db';
import * as schema from '../../packages/db/src/schema';
import { eq, lt, and, sql } from 'drizzle-orm';

const connectionString =
  process.env.DATABASE_URL || 'postgresql://techdeels:techdeels@localhost:5432/techdeels';
const queryClient = postgres(connectionString);
const db = drizzle(queryClient, { schema });

function calculateHotScore(upvotes: number, downvotes: number, createdAt: Date): number {
  const ageInHours = (Date.now() - createdAt.getTime()) / 3_600_000;
  const score = upvotes - downvotes;
  return score / Math.pow(ageInHours + 2, 1.8);
}

async function updateHotScores() {
  console.log('[worker] Updating hot scores...');
  const activeDeals = await db
    .select({
      id: schema.deals.id,
      upvotes: schema.deals.upvotes,
      downvotes: schema.deals.downvotes,
      createdAt: schema.deals.createdAt,
    })
    .from(schema.deals)
    .where(eq(schema.deals.status, 'active'));

  for (const deal of activeDeals) {
    const hotScore = calculateHotScore(deal.upvotes, deal.downvotes, deal.createdAt);
    const score = deal.upvotes - deal.downvotes;
    await db
      .update(schema.deals)
      .set({ hotScore, score })
      .where(eq(schema.deals.id, deal.id));
  }

  console.log(`[worker] Updated hot scores for ${activeDeals.length} deals.`);
}

async function expireDeals() {
  console.log('[worker] Checking for expired deals...');
  const now = new Date();
  const result = await db
    .update(schema.deals)
    .set({ status: 'expired' })
    .where(
      and(
        eq(schema.deals.status, 'active'),
        lt(schema.deals.expiresAt, now)
      )
    )
    .returning({ id: schema.deals.id });
  console.log(`[worker] Expired ${result.length} deals.`);
}

async function runWorkerCycle() {
  try {
    await updateHotScores();
    await expireDeals();
  } catch (err) {
    console.error('[worker] Error in worker cycle:', err);
  }
}

const INTERVAL_MS = 5 * 60 * 1000; // every 5 minutes

console.log('[worker] Starting background worker...');
await runWorkerCycle();
setInterval(runWorkerCycle, INTERVAL_MS);
console.log(`[worker] Running every ${INTERVAL_MS / 1000}s. Press Ctrl+C to stop.`);
