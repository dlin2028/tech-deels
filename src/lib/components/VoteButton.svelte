<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	export let dealId: string;
	export let score: number;
	export let userVote: number | null = null;
	export let disabled = false;

	let loading = false;

	async function vote(value: number) {
		if (disabled || loading) return;
		loading = true;
		try {
			const res = await fetch(`/deals/${dealId}/vote`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ value })
			});
			if (res.ok) {
				const data = await res.json();
				score = data.score;
				userVote = data.userVote;
				await invalidateAll();
			}
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex flex-col items-center gap-1">
	<button
		on:click={() => vote(1)}
		disabled={disabled || loading}
		class="p-1.5 rounded transition-colors {userVote === 1
			? 'text-brand-500 bg-brand-50'
			: 'text-gray-400 hover:text-brand-500 hover:bg-brand-50'}"
		title={disabled ? 'Login to vote' : 'Upvote'}
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
		</svg>
	</button>

	<span class="text-xl font-bold {score >= 0 ? 'text-brand-500' : 'text-red-500'}">{score}</span>

	<button
		on:click={() => vote(-1)}
		disabled={disabled || loading}
		class="p-1.5 rounded transition-colors {userVote === -1
			? 'text-red-500 bg-red-50'
			: 'text-gray-400 hover:text-red-500 hover:bg-red-50'}"
		title={disabled ? 'Login to vote' : 'Downvote'}
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>
</div>
