<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let activeTab: 'flags' | 'deals' | 'users' = 'flags';

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

	const REASON_LABELS: Record<string, string> = {
		spam: '🚫 Spam',
		expired: '⏰ Expired',
		duplicate: '🔁 Duplicate',
		abusive: '⚠️ Abusive',
		affiliate_link: '🔗 Affiliate'
	};
</script>

<svelte:head>
	<title>Admin Dashboard – TechDeels</title>
</svelte:head>

<div class="max-w-5xl mx-auto">
	<div class="flex items-center justify-between mb-6">
		<h1 class="text-2xl font-bold text-gray-900">🛡 Admin Dashboard</h1>
		<span class="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded">
			{data.openFlags.length} pending flags
		</span>
	</div>

	{#if form?.success || form?.deleted || form?.updated}
		<div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 text-sm">
			✅ Action completed successfully.
		</div>
	{/if}

	<!-- Tabs -->
	<div class="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
		{#each [['flags', '⚑ Flags'], ['deals', '📋 Deals'], ['users', '👥 Users']] as [tab, label]}
			<button
				class="px-4 py-2 rounded text-sm font-medium transition-colors {activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}"
				on:click={() => (activeTab = tab)}
			>
				{label}
				{#if tab === 'flags' && data.openFlags.length > 0}
					<span class="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5">{data.openFlags.length}</span>
				{/if}
			</button>
		{/each}
	</div>

	<!-- Flags Tab -->
	{#if activeTab === 'flags'}
		{#if data.openFlags.length === 0}
			<div class="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
				<p>No pending flags. 🎉</p>
			</div>
		{:else}
			<div class="space-y-3">
				{#each data.openFlags as flag (flag.id)}
					<div class="bg-white rounded-lg border border-gray-200 p-4">
						<div class="flex items-start justify-between gap-4">
							<div class="flex-1">
								<div class="flex items-center gap-2 flex-wrap mb-1">
									<span class="text-sm font-semibold">{REASON_LABELS[flag.reason] ?? flag.reason}</span>
									{#if flag.dealId}
										<a href="/deals/{flag.dealId}" class="text-xs text-orange-600 hover:underline">Deal #{flag.dealId}</a>
									{/if}
									{#if flag.commentId}
										<span class="text-xs text-gray-500">Comment #{flag.commentId}</span>
									{/if}
									<span class="text-xs text-gray-400">· by {flag.reporterUsername ?? 'unknown'} · {timeAgo(flag.createdAt)}</span>
								</div>
								{#if flag.details}
									<p class="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">{flag.details}</p>
								{/if}
							</div>
							<div class="flex gap-2 flex-shrink-0">
								<form method="POST" action="?/resolveFlag" use:enhance>
									<input type="hidden" name="flagId" value={flag.id} />
									<input type="hidden" name="action" value="resolve" />
									<button type="submit" class="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700">
										Resolve
									</button>
								</form>
								<form method="POST" action="?/resolveFlag" use:enhance>
									<input type="hidden" name="flagId" value={flag.id} />
									<input type="hidden" name="action" value="dismiss" />
									<button type="submit" class="text-xs bg-gray-200 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-300">
										Dismiss
									</button>
								</form>
								{#if flag.dealId}
									<form method="POST" action="?/deleteDeal" use:enhance>
										<input type="hidden" name="dealId" value={flag.dealId} />
										<button type="submit" class="text-xs bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700">
											Expire Deal
										</button>
									</form>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{/if}

	<!-- Deals Tab -->
	{#if activeTab === 'deals'}
		<div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
			<table class="w-full text-sm">
				<thead class="bg-gray-50 border-b border-gray-200">
					<tr>
						<th class="text-left px-4 py-3 font-semibold text-gray-700">Deal</th>
						<th class="text-left px-4 py-3 font-semibold text-gray-700">Store</th>
						<th class="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
						<th class="text-left px-4 py-3 font-semibold text-gray-700">Score</th>
						<th class="text-left px-4 py-3 font-semibold text-gray-700">Posted</th>
						<th class="px-4 py-3"></th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					{#each data.recentDeals as deal (deal.id)}
						<tr class="hover:bg-gray-50">
							<td class="px-4 py-3">
								<a href="/deals/{deal.id}" class="text-orange-600 hover:underline font-medium">
									{deal.title.length > 50 ? deal.title.slice(0, 50) + '…' : deal.title}
								</a>
								<div class="text-xs text-gray-400">by {deal.posterUsername ?? 'unknown'}</div>
							</td>
							<td class="px-4 py-3 text-gray-600">{deal.store}</td>
							<td class="px-4 py-3">
								<span class="text-xs px-2 py-1 rounded {deal.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">{deal.status}</span>
							</td>
							<td class="px-4 py-3 font-bold {deal.score >= 0 ? 'text-orange-600' : 'text-red-500'}">{deal.score}</td>
							<td class="px-4 py-3 text-gray-400 text-xs">{timeAgo(deal.createdAt)}</td>
							<td class="px-4 py-3">
								{#if deal.status === 'active'}
									<form method="POST" action="?/deleteDeal" use:enhance>
										<input type="hidden" name="dealId" value={deal.id} />
										<button type="submit" class="text-xs text-red-600 hover:text-red-800">Expire</button>
									</form>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	<!-- Users Tab -->
	{#if activeTab === 'users'}
		<div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
			<table class="w-full text-sm">
				<thead class="bg-gray-50 border-b border-gray-200">
					<tr>
						<th class="text-left px-4 py-3 font-semibold text-gray-700">User</th>
						<th class="text-left px-4 py-3 font-semibold text-gray-700">Email</th>
						<th class="text-left px-4 py-3 font-semibold text-gray-700">Reputation</th>
						<th class="text-left px-4 py-3 font-semibold text-gray-700">Joined</th>
						<th class="px-4 py-3"></th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					{#each data.users as user (user.id)}
						<tr class="hover:bg-gray-50">
							<td class="px-4 py-3">
								<a href="/users/{user.username}" class="text-orange-600 hover:underline font-medium">@{user.username}</a>
								{#if user.isAdmin}
									<span class="ml-1 bg-purple-100 text-purple-700 text-xs px-1.5 py-0.5 rounded">admin</span>
								{/if}
							</td>
							<td class="px-4 py-3 text-gray-500">{user.email}</td>
							<td class="px-4 py-3 font-bold text-orange-600">{user.reputation}</td>
							<td class="px-4 py-3 text-gray-400 text-xs">{timeAgo(user.createdAt)}</td>
							<td class="px-4 py-3">
								<form method="POST" action="?/toggleAdmin" use:enhance>
									<input type="hidden" name="userId" value={user.id} />
									<input type="hidden" name="makeAdmin" value={user.isAdmin ? 'false' : 'true'} />
									<button type="submit" class="text-xs {user.isAdmin ? 'text-red-600 hover:text-red-800' : 'text-purple-600 hover:text-purple-800'}">
										{user.isAdmin ? 'Remove Admin' : 'Make Admin'}
									</button>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
