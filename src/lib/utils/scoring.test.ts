import { describe, test, expect } from 'bun:test';
import { calculateHotnessScore } from './scoring';

describe('calculateHotnessScore', () => {
	test('positive score for upvoted recent deal', () => {
		const score = calculateHotnessScore(10, 2, new Date());
		expect(score).toBeGreaterThan(0);
	});

	test('recent deals score higher than older deals with same votes', () => {
		const now = new Date();
		const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
		const recentScore = calculateHotnessScore(5, 0, now);
		const oldScore = calculateHotnessScore(5, 0, yesterday);
		expect(recentScore).toBeGreaterThan(oldScore);
	});

	test('negative score for heavily downvoted deal', () => {
		const score = calculateHotnessScore(1, 10, new Date());
		expect(score).toBeLessThan(0);
	});
});
