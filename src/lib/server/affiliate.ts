/**
 * Affiliate link rewriting middleware.
 * Converts outbound deal URLs to affiliate-tracked links.
 *
 * Currently supports:
 *  - Amazon Associates (tag parameter)
 *  - Newegg affiliate
 *  - Generic Skimlinks fallback
 *
 * Set the following env vars to enable rewriting:
 *  AMAZON_AFFILIATE_TAG=yourstore-20
 *  NEWEGG_AFFILIATE_ID=your_id
 *  SKIMLINKS_ID=your_id  (used as fallback for unrecognised stores)
 */

interface AffiliateConfig {
	amazonTag?: string;
	neweggId?: string;
	skimlinksId?: string;
}

function getConfig(): AffiliateConfig {
	return {
		amazonTag: process.env.AMAZON_AFFILIATE_TAG,
		neweggId: process.env.NEWEGG_AFFILIATE_ID,
		skimlinksId: process.env.SKIMLINKS_ID
	};
}

/**
 * Rewrite a deal URL to an affiliate URL if a matching affiliate program is configured.
 * Returns `null` if no rewrite applies (original URL should be used).
 */
export function rewriteToAffiliate(rawUrl: string): string | null {
	const config = getConfig();

	let url: URL;
	try {
		url = new URL(rawUrl);
	} catch {
		return null;
	}

	const host = url.hostname.replace(/^www\./, '');

	// Amazon (supports international domains: .com, .co.uk, .de, .ca, .co.jp, .fr, etc.)
	if (config.amazonTag && (host === 'amazon.com' || /^(smile\.)?amazon\.[a-z.]+$/.test(host))) {
		url.searchParams.set('tag', config.amazonTag);
		// Strip other tracking params that might conflict
		url.searchParams.delete('ref');
		return url.toString();
	}

	// Newegg
	if (config.neweggId && host === 'newegg.com') {
		url.searchParams.set('aid', config.neweggId);
		return url.toString();
	}

	// Skimlinks fallback (just prepend their redirect URL)
	if (config.skimlinksId) {
		return `https://go.skimresources.com/?id=${encodeURIComponent(config.skimlinksId)}&url=${encodeURIComponent(rawUrl)}`;
	}

	return null;
}

/**
 * Returns the best outbound URL for a deal: the stored affiliateUrl if present,
 * otherwise rewrite on-the-fly, otherwise the raw URL.
 */
export function getOutboundUrl(rawUrl: string, affiliateUrl: string | null): string {
	if (affiliateUrl) return affiliateUrl;
	return rewriteToAffiliate(rawUrl) ?? rawUrl;
}
