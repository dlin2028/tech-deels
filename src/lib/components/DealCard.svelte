<script lang="ts">
	import { formatPrice, formatDiscount, formatTimeAgo } from '$lib/utils';
	import type { Deal, User, Category } from '$lib/server/db/schema';

	export let deal: Deal & { user: User; category: Category | null; userVote?: number | null };
	export let currentUser: import('lucia').User | null = null;

	$: discount = formatDiscount(deal.price, deal.originalPrice);
	$: hotDeal = deal.score >= 10;
</script>

<article class="card hover:shadow-md transition-shadow">
	<div class="flex gap-4 p-4">
		<!-- Vote column -->
		<div class="flex flex-col items-center gap-1 min-w-[48px]">
			<a
				href="/deals/{deal.id}"
				class="flex flex-col items-center gap-1 group"
				data-sveltekit-preload-data="false"
			>
				<div class="text-2xl font-bold {deal.score >= 0 ? 'text-brand-500' : 'text-gray-400'}">
					{deal.score}
				</div>
				<div class="text-xs text-gray-500">votes</div>
			</a>
		</div>

		<!-- Deal image -->
		{#if deal.imageUrl}
			<a href="/deals/{deal.id}" class="shrink-0">
				<img
					src={deal.imageUrl}
					alt={deal.title}
					class="w-20 h-20 object-contain rounded border border-gray-100 bg-white"
				/>
			</a>
		{/if}

		<!-- Deal content -->
		<div class="flex-1 min-w-0">
			<div class="flex items-start justify-between gap-2 flex-wrap">
				<a href="/deals/{deal.id}" class="hover:text-brand-600">
					<h2 class="font-semibold text-gray-900 text-base leading-snug line-clamp-2">
						{#if hotDeal}
							<span class="badge bg-brand-500 text-white mr-1">🔥 Hot</span>
						{/if}
						{deal.title}
					</h2>
				</a>
			</div>

			<!-- Price info -->
			<div class="flex items-center gap-2 mt-1 flex-wrap">
				{#if deal.price !== null}
					<span class="text-2xl font-bold text-brand-600">{formatPrice(deal.price)}</span>
				{/if}
				{#if deal.originalPrice && deal.originalPrice > (deal.price ?? 0)}
					<span class="text-sm text-gray-400 line-through">{formatPrice(deal.originalPrice)}</span>
				{/if}
				{#if discount}
					<span class="badge bg-green-100 text-green-800">{discount}</span>
				{/if}
				{#if deal.store}
					<span class="badge bg-gray-100 text-gray-700">{deal.store}</span>
				{/if}
				{#if deal.category}
					<a href="/?category={deal.category.slug}" class="badge bg-brand-50 text-brand-700 hover:bg-brand-100">
						{deal.category.name}
					</a>
				{/if}
			</div>

			<p class="text-sm text-gray-600 mt-1 line-clamp-2">{deal.description}</p>

			<!-- Footer -->
			<div class="flex items-center gap-3 mt-2 text-xs text-gray-500 flex-wrap">
				<span>by <a href="/profile/{deal.user.username}" class="text-brand-600 hover:underline">{deal.user.username}</a></span>
				<span>{formatTimeAgo(new Date(deal.createdAt))}</span>
				<a href="/deals/{deal.id}#comments" class="hover:text-brand-600">💬 Comments</a>
				<a href={deal.affiliateUrl || deal.url} target="_blank" rel="noopener noreferrer" class="ml-auto btn-primary py-1.5 px-3 text-xs">
					Get Deal →
				</a>
			</div>
		</div>
	</div>
</article>
