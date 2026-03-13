<script lang="ts">
	import type { User } from 'lucia';

	export let user: User | null = null;
</script>

<nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16">
			<div class="flex items-center gap-6">
				<a href="/" class="flex items-center gap-2">
					<div class="bg-brand-500 text-white font-bold text-xl px-3 py-1 rounded-md">TD</div>
					<span class="font-bold text-xl text-gray-900 hidden sm:block">TechDeels</span>
				</a>
				<div class="hidden md:flex items-center gap-1">
					<a href="/" class="btn-ghost text-sm px-3 py-2 rounded-md hover:bg-gray-100">Hot Deals</a>
					<a href="/?sort=new" class="btn-ghost text-sm px-3 py-2 rounded-md hover:bg-gray-100">New</a>
					<a href="/search" class="btn-ghost text-sm px-3 py-2 rounded-md hover:bg-gray-100">Search</a>
				</div>
			</div>

			<div class="flex items-center gap-3">
				{#if user}
					<a href="/deals/new" class="btn-primary text-sm hidden sm:inline-flex">
						+ Submit Deal
					</a>
					<div class="flex items-center gap-2">
						<a href="/profile/{user.username}" class="flex items-center gap-2 hover:opacity-80">
							{#if user.avatarUrl}
								<img src={user.avatarUrl} alt={user.username} class="w-8 h-8 rounded-full" />
							{:else}
								<div class="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center text-sm font-bold">
									{user.username[0].toUpperCase()}
								</div>
							{/if}
							<span class="text-sm font-medium hidden sm:block">{user.username}</span>
						</a>
						{#if user.role === 'admin' || user.role === 'moderator'}
							<a href="/admin" class="text-xs text-brand-600 font-medium bg-brand-50 px-2 py-1 rounded">Admin</a>
						{/if}
					</div>
					<form method="POST" action="/logout">
						<button type="submit" class="btn-ghost text-sm px-3 py-2 rounded-md text-gray-600">Logout</button>
					</form>
				{:else}
					<a href="/login" class="btn-ghost text-sm">Login</a>
					<a href="/register" class="btn-primary text-sm">Sign Up</a>
				{/if}
			</div>
		</div>
	</div>
</nav>
