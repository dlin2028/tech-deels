<script lang="ts">
	import { formatTimeAgo, formatPrice } from '$lib/utils';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.profileUser.username} - TechDeels</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8 sm:px-6">
	<!-- Profile header -->
	<div class="card p-6 mb-6">
		<div class="flex items-start gap-4">
			{#if data.profileUser.avatarUrl}
				<img src={data.profileUser.avatarUrl} alt={data.profileUser.username} class="w-20 h-20 rounded-full" />
			{:else}
				<div class="w-20 h-20 rounded-full bg-brand-500 text-white flex items-center justify-center text-3xl font-bold">
					{data.profileUser.username[0].toUpperCase()}
				</div>
			{/if}
			<div>
				<div class="flex items-center gap-3">
					<h1 class="text-2xl font-bold text-gray-900">{data.profileUser.username}</h1>
					{#if data.profileUser.role !== 'user'}
						<span class="badge bg-brand-100 text-brand-700 capitalize">{data.profileUser.role}</span>
					{/if}
				</div>
				{#if data.profileUser.bio}
					<p class="text-gray-600 mt-1">{data.profileUser.bio}</p>
				{/if}
				<div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
					<span>🏆 <strong class="text-gray-900">{data.profileUser.reputation}</strong> reputation</span>
					<span>📅 Joined {formatTimeAgo(new Date(data.profileUser.createdAt))}</span>
					<span>📦 <strong class="text-gray-900">{data.deals.length}</strong> deals</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Deals list -->
	<h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Deals</h2>
	{#if data.deals.length === 0}
		<div class="card p-8 text-center text-gray-500">No deals submitted yet.</div>
	{:else}
		<div class="space-y-3">
			{#each data.deals as deal}
				<div class="card p-4 flex items-center gap-4">
					<div class="text-center min-w-[40px]">
						<div class="text-lg font-bold {deal.score >= 0 ? 'text-brand-500' : 'text-gray-400'}">{deal.score}</div>
						<div class="text-xs text-gray-400">pts</div>
					</div>
					<div class="flex-1 min-w-0">
						<a href="/deals/{deal.id}" class="font-medium text-gray-900 hover:text-brand-600 line-clamp-1">
							{deal.title}
						</a>
						<div class="flex items-center gap-2 mt-1 text-xs text-gray-500">
							{#if deal.price !== null}
								<span class="text-brand-600 font-medium">{formatPrice(deal.price)}</span>
							{/if}
							{#if deal.store}
								<span>• {deal.store}</span>
							{/if}
							{#if deal.category}
								<span>• {deal.category.name}</span>
							{/if}
							<span>• {formatTimeAgo(new Date(deal.createdAt))}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
