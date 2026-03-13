export function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function hotScore(score: number, createdAt: Date): number {
  const ageHours = (new Date().getTime() - createdAt.getTime()) / 3600000;
  return score / Math.pow(ageHours + 2, 1.5);
}

export function rewriteAffiliateUrl(url: string, affiliateTag: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("amazon.")) {
      parsed.searchParams.set("tag", affiliateTag);
      return parsed.toString();
    }
  } catch {
    // invalid URL
  }
  return url;
}

export function formatPrice(price: string | number | null): string {
  if (price === null || price === undefined || price === "") return "Free";
  return `$${Number(price).toFixed(2)}`;
}

export function formatDiscount(
  price: string | number | null,
  originalPrice: string | number | null
): string | null {
  if (!price || !originalPrice) return null;
  const p = Number(price);
  const op = Number(originalPrice);
  if (op <= p) return null;
  const pct = Math.round(((op - p) / op) * 100);
  return `${pct}% off`;
}
