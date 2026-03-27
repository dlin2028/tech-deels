export function hotScore(score: number, createdAt: Date): number {
	const ageInHours = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
	return score / Math.pow(ageInHours + 2, 1.5);
}

export function formatTimeAgo(date: Date): string {
	const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
	if (seconds < 60) return `${seconds}s ago`;
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	if (days < 30) return `${days}d ago`;
	const months = Math.floor(days / 30);
	if (months < 12) return `${months}mo ago`;
	return `${Math.floor(months / 12)}y ago`;
}

export function formatPrice(price: number | null): string {
	if (price === null || price === undefined) return '';
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	}).format(price);
}

export function formatDiscount(price: number | null, originalPrice: number | null): string {
	if (!price || !originalPrice || originalPrice <= price) return '';
	const pct = Math.round(((originalPrice - price) / originalPrice) * 100);
	return `-${pct}%`;
}

export function rewriteAffiliateUrl(url: string): string {
	try {
		const parsed = new URL(url);
		if (parsed.hostname.includes('amazon.com')) {
			parsed.searchParams.set('tag', 'techdeels-20');
			return parsed.toString();
		}
		// For other stores, use a redirect tracker pattern
		return `/redirect?url=${encodeURIComponent(url)}`;
	} catch {
		return url;
	}
}

export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function generateId(): string {
	return crypto.randomUUID().replace(/-/g, '');
}

export function truncate(text: string, length: number): string {
	if (text.length <= length) return text;
	return text.slice(0, length) + '...';
}
