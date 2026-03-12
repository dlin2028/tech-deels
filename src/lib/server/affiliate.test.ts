import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { rewriteToAffiliate, getOutboundUrl } from './affiliate';

describe('rewriteToAffiliate', () => {
	beforeEach(() => {
		process.env.AMAZON_AFFILIATE_TAG = 'teststore-20';
		process.env.NEWEGG_AFFILIATE_ID = 'testid';
	});
	afterEach(() => {
		delete process.env.AMAZON_AFFILIATE_TAG;
		delete process.env.NEWEGG_AFFILIATE_ID;
		delete process.env.SKIMLINKS_ID;
	});

	test('appends Amazon affiliate tag', () => {
		const result = rewriteToAffiliate('https://www.amazon.com/dp/B08N5WRWNW');
		expect(result).toContain('tag=teststore-20');
	});

	test('works for amazon subdomains', () => {
		const result = rewriteToAffiliate('https://smile.amazon.com/dp/B08N5WRWNW');
		expect(result).toContain('tag=teststore-20');
	});

	test('works for international Amazon domains (amazon.co.uk)', () => {
		const result = rewriteToAffiliate('https://www.amazon.co.uk/dp/B08N5WRWNW');
		expect(result).toContain('tag=teststore-20');
	});

	test('works for amazon.de', () => {
		const result = rewriteToAffiliate('https://www.amazon.de/dp/B08N5WRWNW');
		expect(result).toContain('tag=teststore-20');
	});

	test('appends Newegg affiliate id', () => {
		const result = rewriteToAffiliate('https://www.newegg.com/p/N82E16814932235');
		expect(result).toContain('aid=testid');
	});

	test('returns null for unrecognised URL without skimlinks', () => {
		const result = rewriteToAffiliate('https://www.bestbuy.com/site/product');
		expect(result).toBeNull();
	});

	test('uses skimlinks fallback if configured', () => {
		process.env.SKIMLINKS_ID = 'skim123';
		const result = rewriteToAffiliate('https://www.bestbuy.com/site/product');
		expect(result).toContain('skimresources.com');
		expect(result).toContain('skim123');
	});

	test('returns null for invalid URL', () => {
		expect(rewriteToAffiliate('not-a-url')).toBeNull();
	});
});

describe('getOutboundUrl', () => {
	test('prefers stored affiliateUrl', () => {
		const result = getOutboundUrl('https://amazon.com/dp/x', 'https://stored-affiliate.com');
		expect(result).toBe('https://stored-affiliate.com');
	});

	test('falls back to raw url when no affiliate applies', () => {
		delete process.env.AMAZON_AFFILIATE_TAG;
		delete process.env.SKIMLINKS_ID;
		const raw = 'https://www.bestbuy.com/site/product';
		expect(getOutboundUrl(raw, null)).toBe(raw);
	});
});
