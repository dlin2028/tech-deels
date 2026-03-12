/**
 * Calculate the hotness score for a deal.
 * Uses a Reddit-like algorithm: score / (age_hours + 2)^gravity
 */
export function calculateHotnessScore(
	upvotes: number,
	downvotes: number,
	createdAt: Date
): number {
	const score = upvotes - downvotes;
	const ageHours = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
	const gravity = 1.8;
	return score / Math.pow(ageHours + 2, gravity);
}
