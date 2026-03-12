<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	let activeTab: 'hot' | 'new' = 'hot';

	function formatPrice(cents: number): string {
		return `$${(cents / 100).toFixed(2)}`;
	}

	function timeAgo(date: Date | string): string {
		const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
		if (seconds < 60) return `${seconds}s ago`;
		const minutes = Math.floor(seconds / 60);
		if (minutes < 60) return `${minutes}m ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(hours / 24);
		return `${days}d ago`;
	}

	$: activeDeals = activeTab === 'hot' ? data.hotDeals : data.newDeals;
</script>

<svelte:head>
	<title>TechDeels – Best Tech Hardware Deals</title>
</svelte:head>

<div class="flex gap-6">
	<!-- Feed -->
	<div class="flex-1 min-w-0">
		<div class="flex gap-2 mb-4">
			<button
				class="px-4 py-2 rounded font-semibold text-sm transition-colors {activeTab === 'hot'
					? 'bg-orange-600 text-white'
					: 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}"
				on:click={() => (activeTab = 'hot')}
			>
				🔥 Hot
			</button>
			<button
				class="px-4 py-2 rounded font-semibold text-sm transition-colors {activeTab === 'new'
					? 'bg-orange-600 text-white'
					: 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}"
				on:click={() => (activeTab = 'new')}
			>
				🆕 New
			</button>
		</div>

		{#if activeDeals.length === 0}
			<div class="bg-white rounded-lg p-8 text-center text-gray-500 border border-gray-200">
				<p class="text-lg font-semibold mb-2">No deals yet!</p>
				<p class="mb-4">Be the first to post a tech deal.</p>
				<a
					href="/deals/new"
					class="bg-orange-600 text-white px-6 py-2 rounded font-semibold hover:bg-orange-700 inline-block"
				>
					Post a Deal
				</a>
			</div>
		{:else}
			<div class="space-y-3">
				{#each activeDeals as deal (deal.id)}
					<div
						class="bg-white rounded-lg border border-gray-200 p-4 flex gap-4 hover:border-orange-300 transition-colors"
					>
						<!-- Vote column -->
						<div class="flex flex-col items-center gap-1 min-w-[40px] text-center">
							<a
								href="/deals/{deal.id}"
								class="text-gray-400 hover:text-orange-600 text-xl leading-none"
								aria-label="view deal">▲</a
							>
							<span class="text-sm font-bold text-gray-700">{deal.score}</span>
							<a
								href="/deals/{deal.id}"
								class="text-gray-400 hover:text-blue-600 text-xl leading-none"
								aria-label="view deal">▼</a
							>
						</div>

						<!-- Thumbnail -->
						{#if deal.imageUrl}
							<img
								src={deal.imageUrl}
								alt={deal.title}
								class="w-20 h-20 object-cover rounded flex-shrink-0"
							/>
						{/if}

						<!-- Content -->
						<div class="flex-1 min-w-0">
							<div class="flex items-start justify-between gap-2">
								<a
									href="/deals/{deal.id}"
									class="font-semibold text-gray-900 hover:text-orange-600 leading-snug"
								>
									{deal.title}
								</a>
								<div class="text-right flex-shrink-0">
									<span class="text-lg font-bold text-green-600">{formatPrice(deal.price)}</span>
									{#if deal.originalPrice && deal.originalPrice > deal.price}
										<p class="text-xs text-gray-400 line-through">{formatPrice(deal.originalPrice)}</p>
									{/if}
								</div>
							</div>
							<div class="flex items-center flex-wrap gap-2 mt-2 text-xs text-gray-500">
								<span class="bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-medium">
									{deal.store}
								</span>
								{#if deal.category}
									<span class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
										{deal.category.name}
									</span>
								{/if}
								<span>
									{deal.shippingCost === 0
										? '🚚 Free shipping'
										: `+ ${formatPrice(deal.shippingCost)} shipping`}
								</span>
								<span>· {timeAgo(deal.createdAt)}</span>
								<a href="/deals/{deal.id}" class="hover:text-orange-600">
									💬 {deal.commentCount} comments
								</a>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Sidebar -->
	<aside class="w-64 flex-shrink-0 hidden lg:block">
		<div class="bg-white rounded-lg border border-gray-200 p-4 mb-4">
			<h3 class="font-bold text-gray-900 mb-3">📦 Categories</h3>
			<ul class="space-y-1">
				{#each data.categories as category (category.id)}
					<li>
						<a
							href="/?category={category.slug}"
							class="text-sm text-gray-600 hover:text-orange-600 block py-0.5"
						>
							{category.name}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<div class="bg-orange-50 rounded-lg p-4 border border-orange-200">
			<p class="font-semibold text-gray-900 mb-1 text-sm">Share a Deal!</p>
			<p class="text-xs text-gray-500 mb-3">
				Found a great hardware deal? Share it with the community.
			</p>
			<a
				href="/deals/new"
				class="block text-center bg-orange-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-orange-700"
			>
				Submit Deal
			</a>
		</div>
	</aside>
</div>
