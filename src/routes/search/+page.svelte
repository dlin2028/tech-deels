<script lang="ts">
	import DealCard from '$lib/components/DealCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let query = data.query;
</script>

<svelte:head>
	<title>{data.query ? `Search: ${data.query}` : 'Search'} - TechDeels</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8 sm:px-6">
	<h1 class="text-2xl font-bold text-gray-900 mb-6">Search Deals</h1>

	<form method="GET" class="flex gap-2 mb-6">
		<input
			type="text"
			name="q"
			bind:value={query}
			class="input flex-1"
			placeholder="Search for deals, products..."
			autofocus
		/>
		{#if data.categorySlug}
			<input type="hidden" name="category" value={data.categorySlug} />
		{/if}
		<button type="submit" class="btn-primary px-6">Search</button>
	</form>

	<!-- Category filter -->
	<div class="flex gap-2 mb-6 flex-wrap">
		<a
			href="/search{query ? `?q=${encodeURIComponent(query)}` : ''}"
			class="badge py-1 px-3 {!data.categorySlug ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
		>All</a>
		{#each data.categories as cat}
			<a
				href="/search?{query ? `q=${encodeURIComponent(query)}&` : ''}category={cat.slug}"
				class="badge py-1 px-3 {data.categorySlug === cat.slug ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
			>{cat.name}</a>
		{/each}
	</div>

	{#if data.query || data.categorySlug}
		{#if data.deals.length === 0}
			<div class="card p-12 text-center">
				<div class="text-4xl mb-3">🔍</div>
				<h2 class="text-lg font-semibold text-gray-900">No deals found</h2>
				<p class="text-gray-500 mt-1">Try different keywords or browse all deals</p>
				<a href="/" class="btn-primary mt-4">Browse All Deals</a>
			</div>
		{:else}
			<p class="text-sm text-gray-500 mb-4">{data.deals.length} deal{data.deals.length !== 1 ? 's' : ''} found</p>
			<div class="space-y-3">
				{#each data.deals as deal (deal.id)}
					<DealCard {deal} currentUser={data.user} />
				{/each}
			</div>
		{/if}
	{/if}
</div>
