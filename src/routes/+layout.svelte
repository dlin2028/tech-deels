<script lang="ts">
import '../app.css';
import type { LayoutData } from './$types';

export let data: LayoutData;
</script>

<div class="min-h-screen bg-gray-100">
<nav class="bg-orange-600 text-white shadow-md">
<div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
<a href="/" class="text-xl font-bold tracking-tight">⚡ TechDeels</a>
<div class="flex items-center gap-4">
<a href="/" class="hover:text-orange-200 text-sm">Deals</a>
<a href="/deals/new" class="hover:text-orange-200 text-sm">Post Deal</a>
{#if data.user}
{#if data.user.isAdmin}
<a href="/admin" class="text-sm bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded font-medium">Admin</a>
{/if}
<a href="/users/{data.user.username}" class="text-sm hover:text-orange-200 flex items-center gap-1.5">
<span class="text-orange-200">👤</span>
{data.user.username}
<span class="bg-orange-700 text-orange-100 text-xs px-1.5 py-0.5 rounded" title="Reputation">{data.user.reputation}</span>
</a>
<form method="POST" action="/logout">
<button type="submit" class="text-sm hover:text-orange-200">Logout</button>
</form>
{:else}
<a href="/login" class="text-sm hover:text-orange-200">Login</a>
<a href="/register" class="bg-white text-orange-600 px-3 py-1 rounded text-sm font-semibold hover:bg-orange-100">
Register
</a>
{/if}
</div>
</div>
</nav>
<main class="max-w-6xl mx-auto px-4 py-6">
<slot />
</main>
</div>
