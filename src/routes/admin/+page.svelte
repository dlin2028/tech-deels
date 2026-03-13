<script lang="ts">
	import { formatTimeAgo } from '$lib/utils';
	import type { PageData } from './$types';

	export let data: PageData;

	let activeTab = 'deals';
</script>

<svelte:head>
	<title>Admin - TechDeels</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-6 sm:px-6">
	<div class="flex items-center justify-between mb-6">
		<h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
		<span class="badge bg-brand-100 text-brand-700">
			{data.user?.role}
		</span>
	</div>

	<!-- Stats -->
	<div class="grid grid-cols-3 gap-4 mb-6">
		<div class="card p-4 text-center">
			<div class="text-3xl font-bold text-brand-600">{data.stats.deals}</div>
			<div class="text-sm text-gray-500 mt-1">Total Deals</div>
		</div>
		<div class="card p-4 text-center">
			<div class="text-3xl font-bold text-brand-600">{data.stats.users}</div>
			<div class="text-sm text-gray-500 mt-1">Total Users</div>
		</div>
		<div class="card p-4 text-center">
			<div class="text-3xl font-bold {data.stats.flags > 0 ? 'text-red-500' : 'text-brand-600'}">{data.stats.flags}</div>
			<div class="text-sm text-gray-500 mt-1">Flagged Deals</div>
		</div>
	</div>

	<!-- Tabs -->
	<div class="border-b border-gray-200 mb-4">
		<div class="flex gap-4">
			{#each ['deals', 'users', 'flags'] as tab}
				<button
					on:click={() => activeTab = tab}
					class="pb-2 px-1 text-sm font-medium border-b-2 transition-colors capitalize {activeTab === tab ? 'border-brand-500 text-brand-600' : 'border-transparent text-gray-500 hover:text-gray-700'}"
				>{tab}</button>
			{/each}
		</div>
	</div>

	{#if activeTab === 'deals'}
		<div class="card overflow-hidden">
			<table class="w-full text-sm">
				<thead class="bg-gray-50 border-b">
					<tr>
						<th class="text-left p-3 font-medium text-gray-600">Deal</th>
						<th class="text-left p-3 font-medium text-gray-600">Author</th>
						<th class="text-left p-3 font-medium text-gray-600">Score</th>
						<th class="text-left p-3 font-medium text-gray-600">Status</th>
						<th class="text-left p-3 font-medium text-gray-600">Date</th>
						<th class="p-3"></th>
					</tr>
				</thead>
				<tbody class="divide-y">
					{#each data.recentDeals as d}
						<tr class="hover:bg-gray-50">
							<td class="p-3">
								<a href="/deals/{d.id}" class="text-brand-600 hover:underline font-medium line-clamp-1">{d.title}</a>
							</td>
							<td class="p-3">
								<a href="/profile/{d.user?.username}" class="text-gray-600 hover:text-brand-600">{d.user?.username}</a>
							</td>
							<td class="p-3 font-medium {d.score >= 0 ? 'text-brand-600' : 'text-red-500'}">{d.score}</td>
							<td class="p-3">
								<span class="badge {
									d.status === 'active' ? 'bg-green-100 text-green-700' :
									d.status === 'expired' ? 'bg-gray-100 text-gray-600' :
									d.status === 'rejected' ? 'bg-red-100 text-red-700' :
									'bg-yellow-100 text-yellow-700'
								} capitalize">{d.status}</span>
							</td>
							<td class="p-3 text-gray-500">{formatTimeAgo(new Date(d.createdAt))}</td>
							<td class="p-3">
								<form method="POST" action="?/updateDealStatus" class="flex gap-1">
									<input type="hidden" name="dealId" value={d.id} />
									<select name="status" class="text-xs border rounded px-1 py-0.5">
										<option value="active" selected={d.status === 'active'}>active</option>
										<option value="expired" selected={d.status === 'expired'}>expired</option>
										<option value="pending" selected={d.status === 'pending'}>pending</option>
										<option value="rejected" selected={d.status === 'rejected'}>rejected</option>
									</select>
									<button type="submit" class="btn-primary py-0.5 px-2 text-xs">Save</button>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else if activeTab === 'users'}
		<div class="card overflow-hidden">
			<table class="w-full text-sm">
				<thead class="bg-gray-50 border-b">
					<tr>
						<th class="text-left p-3 font-medium text-gray-600">User</th>
						<th class="text-left p-3 font-medium text-gray-600">Email</th>
						<th class="text-left p-3 font-medium text-gray-600">Role</th>
						<th class="text-left p-3 font-medium text-gray-600">Reputation</th>
						<th class="text-left p-3 font-medium text-gray-600">Joined</th>
						<th class="p-3"></th>
					</tr>
				</thead>
				<tbody class="divide-y">
					{#each data.users as u}
						<tr class="hover:bg-gray-50">
							<td class="p-3">
								<a href="/profile/{u.username}" class="text-brand-600 hover:underline font-medium">{u.username}</a>
							</td>
							<td class="p-3 text-gray-600">{u.email}</td>
							<td class="p-3">
								<span class="badge capitalize {
									u.role === 'admin' ? 'bg-brand-100 text-brand-700' :
									u.role === 'moderator' ? 'bg-purple-100 text-purple-700' :
									'bg-gray-100 text-gray-600'
								}">{u.role}</span>
							</td>
							<td class="p-3 font-medium">{u.reputation}</td>
							<td class="p-3 text-gray-500">{formatTimeAgo(new Date(u.createdAt))}</td>
							{#if data.user?.role === 'admin'}
								<td class="p-3">
									<form method="POST" action="?/updateUserRole" class="flex gap-1">
										<input type="hidden" name="userId" value={u.id} />
										<select name="role" class="text-xs border rounded px-1 py-0.5">
											<option value="user" selected={u.role === 'user'}>user</option>
											<option value="moderator" selected={u.role === 'moderator'}>moderator</option>
											<option value="admin" selected={u.role === 'admin'}>admin</option>
										</select>
										<button type="submit" class="btn-primary py-0.5 px-2 text-xs">Save</button>
									</form>
								</td>
							{:else}
								<td></td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else if activeTab === 'flags'}
		{#if data.flags.length === 0}
			<div class="card p-8 text-center text-gray-500">No flagged deals 🎉</div>
		{:else}
			<div class="space-y-3">
				{#each data.flags as flag}
					<div class="card p-4">
						<div class="flex items-start justify-between gap-4">
							<div>
								<a href="/deals/{flag.deal?.id}" class="font-medium text-brand-600 hover:underline">{flag.deal?.title}</a>
								<p class="text-sm text-gray-600 mt-1">Reason: {flag.reason}</p>
								<p class="text-xs text-gray-400 mt-1">
									Reported by <a href="/profile/{flag.reporter?.username}" class="text-brand-600">{flag.reporter?.username}</a>
									· {formatTimeAgo(new Date(flag.createdAt))}
								</p>
							</div>
							<form method="POST" action="?/updateDealStatus" class="flex gap-2">
								<input type="hidden" name="dealId" value={flag.deal?.id} />
								<input type="hidden" name="status" value="rejected" />
								<button type="submit" class="btn-secondary text-xs py-1 px-3 text-red-600">Reject Deal</button>
							</form>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>
