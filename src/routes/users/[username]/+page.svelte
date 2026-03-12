<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

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

	function joinedDate(d: Date | string): string {
		return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
	}

	const STATUS_COLORS: Record<string, string> = {
		active: 'bg-green-100 text-green-700',
		expired: 'bg-gray-100 text-gray-500',
		out_of_stock: 'bg-red-100 text-red-600',
		price_changed: 'bg-yellow-100 text-yellow-700'
	};

	let activeTab: 'deals' | 'comments' = 'deals';
</script>

<svelte:head>
	<title>@{data.profile.username} – TechDeels</title>
</svelte:head>

<div class="max-w-3xl mx-auto space-y-6">
	<!-- Profile Header -->
	<div class="bg-white rounded-lg border border-gray-200 p-6">
		<div class="flex items-start gap-5">
			{#if data.profile.avatarUrl}
				<img src={data.profile.avatarUrl} alt={data.profile.username} class="w-20 h-20 rounded-full object-cover flex-shrink-0" />
			{:else}
				<div class="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
					<span class="text-3xl font-bold text-orange-600">{data.profile.username[0].toUpperCase()}</span>
				</div>
			{/if}

			<div class="flex-1">
				<div class="flex items-center gap-3 flex-wrap">
					<h1 class="text-2xl font-bold text-gray-900">@{data.profile.username}</h1>
					{#if data.profile.isAdmin}
						<span class="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded">MOD</span>
					{/if}
				</div>
				{#if data.profile.bio}
					<p class="text-gray-600 text-sm mt-1">{data.profile.bio}</p>
				{/if}
				<p class="text-xs text-gray-400 mt-2">Joined {joinedDate(data.profile.createdAt)}</p>
			</div>

			<!-- Reputation -->
			<div class="text-center flex-shrink-0">
				<div class="text-3xl font-bold text-orange-600">{data.profile.reputation.toLocaleString()}</div>
				<div class="text-xs text-gray-500 mt-1">reputation</div>
			</div>
		</div>

		<!-- Stats row -->
		<div class="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-gray-100">
			<div class="text-center">
				<div class="text-xl font-bold text-gray-900">{data.stats.dealCount}</div>
				<div class="text-xs text-gray-500">Deals posted</div>
			</div>
			<div class="text-center">
				<div class="text-xl font-bold text-gray-900">{data.stats.commentCount}</div>
				<div class="text-xs text-gray-500">Comments</div>
			</div>
		</div>
	</div>

	<!-- Activity tabs -->
	<div class="bg-white rounded-lg border border-gray-200">
		<div class="flex border-b border-gray-200">
			<button
				class="px-6 py-3 text-sm font-semibold border-b-2 transition-colors {activeTab === 'deals' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-600 hover:text-gray-900'}"
				on:click={() => (activeTab = 'deals')}
			>
				Deals ({data.recentDeals.length})
			</button>
			<button
				class="px-6 py-3 text-sm font-semibold border-b-2 transition-colors {activeTab === 'comments' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-600 hover:text-gray-900'}"
				on:click={() => (activeTab = 'comments')}
			>
				Comments ({data.recentComments.length})
			</button>
		</div>

		<div class="p-4">
			{#if activeTab === 'deals'}
				{#if data.recentDeals.length === 0}
					<p class="text-gray-500 text-sm text-center py-4">No deals posted yet.</p>
				{:else}
					<div class="space-y-3">
						{#each data.recentDeals as deal (deal.id)}
							<div class="flex items-start justify-between gap-3 py-2 border-b border-gray-50 last:border-0">
								<div class="flex-1 min-w-0">
									<a href="/deals/{deal.id}" class="font-medium text-gray-900 hover:text-orange-600 text-sm leading-snug">
										{deal.title}
									</a>
									<div class="flex items-center gap-2 mt-1 text-xs text-gray-500">
										<span class="font-semibold text-green-600">{formatPrice(deal.price)}</span>
										<span>@ {deal.store}</span>
										<span class="px-1.5 py-0.5 rounded text-xs {STATUS_COLORS[deal.status] ?? 'bg-gray-100 text-gray-500'}">{deal.status}</span>
										<span>· {timeAgo(deal.createdAt)}</span>
										<span>💬 {deal.commentCount}</span>
									</div>
								</div>
								<div class="text-right flex-shrink-0">
									<span class="text-sm font-bold {deal.score >= 0 ? 'text-orange-600' : 'text-red-500'}">
										{deal.score > 0 ? '+' : ''}{deal.score}
									</span>
									<div class="text-xs text-gray-400">score</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			{:else}
				{#if data.recentComments.length === 0}
					<p class="text-gray-500 text-sm text-center py-4">No comments yet.</p>
				{:else}
					<div class="space-y-3">
						{#each data.recentComments as comment (comment.id)}
							<div class="py-2 border-b border-gray-50 last:border-0">
								<a href="/deals/{comment.dealId}" class="text-xs text-orange-600 hover:underline mb-1 block">
									→ Deal #{comment.dealId}
								</a>
								<p class="text-sm text-gray-800 line-clamp-2">{comment.content}</p>
								<div class="flex items-center gap-2 mt-1 text-xs text-gray-400">
									<span>{timeAgo(comment.createdAt)}</span>
									<span>· {comment.score} pts</span>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>
