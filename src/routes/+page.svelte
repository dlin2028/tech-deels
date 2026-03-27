<script lang="ts">
	import DealCard from '$lib/components/DealCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>TechDeels - Best Tech Deals</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
	<div class="flex flex-col lg:flex-row gap-6">
		<!-- Main feed -->
		<div class="flex-1 min-w-0">
			<!-- Sort tabs -->
			<div class="flex items-center gap-2 mb-4 border-b border-gray-200">
				<a
					href="/?sort=hot{data.categorySlug ? `&category=${data.categorySlug}` : ''}"
					class="pb-2 px-3 text-sm font-medium border-b-2 transition-colors {data.sort === 'hot' || !data.sort
						? 'border-brand-500 text-brand-600'
						: 'border-transparent text-gray-500 hover:text-gray-700'}"
				>🔥 Hot</a>
				<a
					href="/?sort=new{data.categorySlug ? `&category=${data.categorySlug}` : ''}"
					class="pb-2 px-3 text-sm font-medium border-b-2 transition-colors {data.sort === 'new'
						? 'border-brand-500 text-brand-600'
						: 'border-transparent text-gray-500 hover:text-gray-700'}"
				>✨ New</a>
			</div>

			{#if data.deals.length === 0}
				<div class="card p-12 text-center">
					<div class="text-5xl mb-4">🛍️</div>
					<h2 class="text-xl font-semibold text-gray-900 mb-2">No deals yet</h2>
					<p class="text-gray-500 mb-4">Be the first to submit a deal!</p>
					<a href="/deals/new" class="btn-primary">Submit a Deal</a>
				</div>
			{:else}
				<div class="space-y-3">
					{#each data.deals as deal (deal.id)}
						<DealCard {deal} currentUser={data.user} />
					{/each}
				</div>

				<!-- Pagination -->
				<div class="flex justify-center gap-2 mt-6">
					{#if data.page > 1}
						<a href="?sort={data.sort}&page={data.page - 1}{data.categorySlug ? `&category=${data.categorySlug}` : ''}" class="btn-secondary">← Previous</a>
					{/if}
					{#if data.deals.length === 20}
						<a href="?sort={data.sort}&page={data.page + 1}{data.categorySlug ? `&category=${data.categorySlug}` : ''}" class="btn-primary">Next →</a>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Sidebar -->
		<aside class="lg:w-64 shrink-0">
			<div class="card p-4 mb-4">
				<h3 class="font-semibold text-gray-900 mb-3">📂 Categories</h3>
				<div class="space-y-1">
					<a
						href="/"
						class="block px-2 py-1 rounded text-sm {!data.categorySlug ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}"
					>All Deals</a>
					{#each data.categories as cat}
						<a
							href="/?category={cat.slug}"
							class="block px-2 py-1 rounded text-sm {data.categorySlug === cat.slug ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}"
						>{cat.name}</a>
					{/each}
				</div>
			</div>

			<div class="card p-4">
				<h3 class="font-semibold text-gray-900 mb-2">💡 About TechDeels</h3>
				<p class="text-sm text-gray-600">Community-driven tech deals. Find the best prices on gadgets, software, and more.</p>
				<a href="/deals/new" class="btn-primary w-full mt-3 text-sm">Submit a Deal</a>
			</div>
		</aside>
	</div>
</div>
