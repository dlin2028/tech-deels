<script lang="ts">
import { goto } from '$app/navigation';
import type { PageData } from './$types';

export let data: PageData;

let activeTab: 'hot' | 'new' = 'hot';
let searchQuery = data.filters.q;

const CONDITIONS = [
{ value: '', label: 'All' },
{ value: 'new', label: '🆕 New' },
{ value: 'refurbished', label: '🔄 Refurbished' },
{ value: 'open_box', label: '📦 Open Box' },
{ value: 'used', label: '🔧 Used' }
];

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

function conditionBadge(condition: string) {
const map: Record<string, string> = {
new: '🆕 New',
refurbished: '🔄 Refurb',
open_box: '📦 Open Box',
used: '🔧 Used'
};
return map[condition] ?? condition;
}

function discountPct(price: number, originalPrice: number | null): number | null {
if (!originalPrice || originalPrice <= price) return null;
return Math.round((1 - price / originalPrice) * 100);
}

function buildUrl(params: Record<string, string>) {
const u = new URL(window.location.href);
for (const [k, v] of Object.entries(params)) {
if (v) u.searchParams.set(k, v);
else u.searchParams.delete(k);
}
return u.pathname + u.search;
}

function filterBy(key: string, value: string) {
goto(buildUrl({ [key]: value, q: data.filters.q }));
}

function search(e: Event) {
e.preventDefault();
goto(buildUrl({ q: searchQuery }));
}

$: activeDeals = activeTab === 'hot' ? data.hotDeals : data.newDeals;
$: hasFilters = !!(data.filters.q || data.filters.categorySlug || data.filters.tagSlug || data.filters.condition);
</script>

<svelte:head>
<title>{data.filters.q ? `"${data.filters.q}" – ` : ''}TechDeels – Best Tech Hardware Deals</title>
</svelte:head>

<div class="flex gap-6">
<!-- Feed -->
<div class="flex-1 min-w-0">
<!-- Search bar -->
<form on:submit={search} class="mb-4">
<div class="flex gap-2">
<input
type="search"
bind:value={searchQuery}
placeholder="Search deals, stores, specs..."
class="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
/>
<button type="submit" class="bg-orange-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-orange-700">
Search
</button>
</div>
</form>

<!-- Condition filter pills -->
<div class="flex gap-2 flex-wrap mb-3">
{#each CONDITIONS as cond}
<button
class="px-3 py-1 rounded-full text-xs font-medium border transition-colors {data.filters.condition === cond.value
? 'bg-orange-600 text-white border-orange-600'
: 'bg-white text-gray-600 border-gray-200 hover:border-orange-400'}"
on:click={() => filterBy('condition', cond.value)}
>
{cond.label}
</button>
{/each}
</div>

<!-- Active filter display -->
{#if hasFilters}
<div class="flex gap-2 items-center flex-wrap mb-3 text-sm text-gray-600">
<span>Filtering by:</span>
{#if data.filters.q}
<span class="bg-orange-100 text-orange-700 px-2 py-0.5 rounded flex items-center gap-1">
🔍 "{data.filters.q}"
<a href={buildUrl({ q: '' })} class="text-orange-400 hover:text-orange-600 ml-1">×</a>
</span>
{/if}
{#if data.filters.categorySlug}
<span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded flex items-center gap-1">
📦 {data.filters.categorySlug}
<a href={buildUrl({ category: '' })} class="text-blue-400 hover:text-blue-600 ml-1">×</a>
</span>
{/if}
{#if data.filters.tagSlug}
<span class="bg-green-100 text-green-700 px-2 py-0.5 rounded flex items-center gap-1">
🏷 {data.filters.tagSlug}
<a href={buildUrl({ tag: '' })} class="text-green-400 hover:text-green-600 ml-1">×</a>
</span>
{/if}
<a href="/" class="text-gray-400 hover:text-gray-600 text-xs ml-2">Clear all</a>
</div>
{/if}

<!-- Hot/New tabs -->
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
<p class="text-lg font-semibold mb-2">{hasFilters ? 'No deals match your filters.' : 'No deals yet!'}</p>
{#if hasFilters}
<a href="/" class="text-orange-600 hover:underline text-sm">Clear filters</a>
{:else}
<p class="mb-4">Be the first to post a tech deal.</p>
<a href="/deals/new" class="bg-orange-600 text-white px-6 py-2 rounded font-semibold hover:bg-orange-700 inline-block">
Post a Deal
</a>
{/if}
</div>
{:else}
<div class="space-y-3">
{#each activeDeals as deal (deal.id)}
{@const discount = discountPct(deal.price, deal.originalPrice)}
<div class="bg-white rounded-lg border border-gray-200 p-4 flex gap-4 hover:border-orange-300 transition-colors">
<!-- Vote column -->
<div class="flex flex-col items-center gap-1 min-w-[40px] text-center">
<a href="/deals/{deal.id}" class="text-gray-400 hover:text-orange-600 text-xl leading-none" aria-label="view deal">▲</a>
<span class="text-sm font-bold text-gray-700">{deal.score}</span>
<a href="/deals/{deal.id}" class="text-gray-400 hover:text-blue-600 text-xl leading-none" aria-label="view deal">▼</a>
</div>

<!-- Thumbnail -->
{#if deal.imageUrl}
<img src={deal.imageUrl} alt={deal.title} class="w-20 h-20 object-cover rounded flex-shrink-0" />
{/if}

<!-- Content -->
<div class="flex-1 min-w-0">
<div class="flex items-start justify-between gap-2">
<a href="/deals/{deal.id}" class="font-semibold text-gray-900 hover:text-orange-600 leading-snug">
{deal.title}
</a>
<div class="text-right flex-shrink-0">
<span class="text-lg font-bold text-green-600">{formatPrice(deal.price)}</span>
{#if deal.originalPrice && deal.originalPrice > deal.price}
<p class="text-xs text-gray-400 line-through">{formatPrice(deal.originalPrice)}</p>
{/if}
{#if discount}
<span class="bg-red-100 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded">{discount}% OFF</span>
{/if}
</div>
</div>
<div class="flex items-center flex-wrap gap-2 mt-2 text-xs text-gray-500">
<span class="bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-medium">{deal.store}</span>
{#if deal.category}
<a href="/?category={deal.category.slug}" class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded hover:bg-gray-200">
{deal.category.name}
</a>
{/if}
{#if deal.condition !== 'new'}
<span class="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">{conditionBadge(deal.condition)}</span>
{/if}
<span>
{deal.shippingCost === 0 ? '🚚 Free shipping' : `+ ${formatPrice(deal.shippingCost)} shipping`}
</span>
<span>· by <a href="/users/{deal.posterUsername}" class="hover:text-orange-600">{deal.posterUsername ?? 'unknown'}</a></span>
<span>· {timeAgo(deal.createdAt)}</span>
<a href="/deals/{deal.id}" class="hover:text-orange-600">💬 {deal.commentCount} comments</a>
</div>
</div>
</div>
{/each}
</div>
{/if}
</div>

<!-- Sidebar -->
<aside class="w-64 flex-shrink-0 hidden lg:block space-y-4">
<div class="bg-white rounded-lg border border-gray-200 p-4">
<h3 class="font-bold text-gray-900 mb-3">📦 Categories</h3>
<ul class="space-y-1">
<li>
<a href="/" class="text-sm block py-0.5 {!data.filters.categorySlug ? 'text-orange-600 font-semibold' : 'text-gray-600 hover:text-orange-600'}">
All Categories
</a>
</li>
{#each data.categories as category (category.id)}
<li>
<a
href="/?category={category.slug}"
class="text-sm block py-0.5 {data.filters.categorySlug === category.slug ? 'text-orange-600 font-semibold' : 'text-gray-600 hover:text-orange-600'}"
>
{category.name}
</a>
</li>
{/each}
</ul>
</div>

{#if data.tags.length > 0}
<div class="bg-white rounded-lg border border-gray-200 p-4">
<h3 class="font-bold text-gray-900 mb-3">🏷 Popular Tags</h3>
<div class="flex flex-wrap gap-1">
{#each data.tags.slice(0, 20) as tag (tag.id)}
<a
href="/?tag={tag.slug}"
class="text-xs px-2 py-1 rounded-full border {data.filters.tagSlug === tag.slug ? 'bg-orange-600 text-white border-orange-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-orange-400'}"
>
{tag.name}
</a>
{/each}
</div>
</div>
{/if}

<div class="bg-orange-50 rounded-lg p-4 border border-orange-200">
<p class="font-semibold text-gray-900 mb-1 text-sm">Share a Deal!</p>
<p class="text-xs text-gray-500 mb-3">Found a great hardware deal? Share it with the community.</p>
<a href="/deals/new" class="block text-center bg-orange-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-orange-700">
Submit Deal
</a>
</div>
</aside>
</div>
