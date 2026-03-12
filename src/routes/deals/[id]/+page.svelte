<script lang="ts">
import { enhance } from '$app/forms';
import type { PageData, ActionData } from './$types';

export let data: PageData;
export let form: ActionData;

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

interface CommentRow {
id: number;
content: string;
score: number;
createdAt: Date | string;
authorId: string;
parentId: number | null;
dealId: number;
authorUsername: string | null;
}

interface CommentTree extends CommentRow {
replies: CommentTree[];
}

function buildCommentTree(rows: CommentRow[]): CommentTree[] {
const map = new Map<number, CommentTree>();
const roots: CommentTree[] = [];
rows.forEach((c) => map.set(c.id, { ...c, replies: [] }));
rows.forEach((c) => {
const node = map.get(c.id)!;
if (c.parentId !== null && map.has(c.parentId)) {
map.get(c.parentId)!.replies.push(node);
} else {
roots.push(node);
}
});
return roots;
}

const STATUS_LABELS: Record<string, string> = {
active: '✅ Active',
expired: '⏰ Expired',
out_of_stock: '❌ Out of Stock',
price_changed: '📈 Price Changed'
};

const STATUS_COLORS: Record<string, string> = {
active: 'bg-green-100 text-green-700',
expired: 'bg-gray-100 text-gray-600',
out_of_stock: 'bg-red-100 text-red-700',
price_changed: 'bg-yellow-100 text-yellow-700'
};

$: commentTree = buildCommentTree(data.comments);
let replyingTo: number | null = null;
let showFlagForm = false;
let showStatusForm = false;

$: isOwnerOrAdmin = data.user && (data.deal.postedBy === data.user.id || data.user.isAdmin);
</script>

<svelte:head>
<title>{data.deal.title} – TechDeels</title>
<meta property="og:title" content={data.deal.title} />
<meta property="og:description" content={`${data.deal.store} – $${(data.deal.price / 100).toFixed(2)}`} />
{#if data.deal.imageUrl}
<meta property="og:image" content={data.deal.imageUrl} />
{/if}
</svelte:head>

<div class="max-w-3xl mx-auto space-y-6">
<!-- Deal Card -->
<div class="bg-white rounded-lg border border-gray-200 p-6">
<!-- Status banner for non-active deals -->
{#if data.deal.status !== 'active'}
<div class="mb-4 px-3 py-2 rounded text-sm font-medium {STATUS_COLORS[data.deal.status] ?? 'bg-gray-100 text-gray-600'}">
{STATUS_LABELS[data.deal.status] ?? data.deal.status} — This deal may no longer be available
</div>
{/if}

<div class="flex gap-4">
<!-- Vote column -->
<div class="flex flex-col items-center gap-1 min-w-[56px] text-center">
<form method="POST" action="vote?/upvote" use:enhance>
<button type="submit"
class="text-2xl leading-none transition-colors {data.myVote === 1 ? 'text-orange-600' : 'text-gray-400 hover:text-orange-600'}"
aria-label="upvote">▲</button>
</form>
<span class="text-lg font-bold text-gray-700">{data.deal.score}</span>
<form method="POST" action="vote?/downvote" use:enhance>
<button type="submit"
class="text-2xl leading-none transition-colors {data.myVote === -1 ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'}"
aria-label="downvote">▼</button>
</form>
</div>

<!-- Deal info -->
<div class="flex-1 min-w-0">
<h1 class="text-xl font-bold text-gray-900 mb-3">{data.deal.title}</h1>
<div class="flex flex-wrap items-center gap-2 mb-3">
<span class="text-2xl font-bold text-green-600">{formatPrice(data.deal.price)}</span>
{#if data.deal.originalPrice && data.deal.originalPrice > data.deal.price}
<span class="text-base text-gray-400 line-through">{formatPrice(data.deal.originalPrice)}</span>
<span class="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
{Math.round((1 - data.deal.price / data.deal.originalPrice) * 100)}% OFF
</span>
{/if}
<span class="bg-orange-100 text-orange-700 px-2 py-1 rounded text-sm font-medium">{data.deal.store}</span>
{#if data.deal.category}
<a href="/?category={data.deal.category.slug}" class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm hover:bg-gray-200">
{data.deal.category.name}
</a>
{/if}
{#if data.deal.condition !== 'new'}
<span class="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm">
{{'refurbished':'🔄 Refurb','open_box':'📦 Open Box','used':'🔧 Used'}[data.deal.condition] ?? data.deal.condition}
</span>
{/if}
</div>

{#if data.deal.shippingCost === 0}
<p class="text-sm text-green-600 mb-3">🚚 Free shipping</p>
{:else}
<p class="text-sm text-gray-500 mb-3">+ {formatPrice(data.deal.shippingCost)} shipping</p>
{/if}

{#if data.deal.description}
<p class="text-gray-700 text-sm mb-4 whitespace-pre-wrap">{data.deal.description}</p>
{/if}

<div class="flex items-center gap-3 flex-wrap">
<a href={data.deal.outboundUrl} target="_blank" rel="noopener noreferrer"
class="bg-orange-600 text-white px-6 py-2 rounded font-semibold hover:bg-orange-700 text-sm">
Get This Deal →
</a>

{#if data.user}
<form method="POST" action="?/saveToggle" use:enhance>
<button type="submit" class="text-sm text-gray-500 hover:text-orange-600 border border-gray-200 px-3 py-2 rounded hover:border-orange-300">
{data.isSaved ? '🔖 Saved' : '☆ Save'}
</button>
</form>
{/if}

<span class="text-xs text-gray-400">
Posted by <a href="/users/{data.deal.poster?.username}" class="hover:text-orange-600 underline">{data.deal.poster?.username ?? 'unknown'}</a>
· {timeAgo(data.deal.createdAt)}
{#if data.deal.affiliateUrl}
<span class="ml-1 text-gray-300" title="Affiliate link" aria-label="Affiliate link">🔗</span>
{/if}
</span>
</div>

<!-- Owner/Admin controls -->
{#if isOwnerOrAdmin}
<div class="mt-3 pt-3 border-t border-gray-100">
{#if !showStatusForm}
<button class="text-xs text-gray-500 hover:text-gray-700" on:click={() => showStatusForm = true}>
✏️ Update status
</button>
{:else}
<form method="POST" action="?/updateStatus" use:enhance class="flex items-center gap-2">
<select name="status" class="border border-gray-300 rounded text-xs px-2 py-1">
<option value="active">Active</option>
<option value="expired">Expired</option>
<option value="out_of_stock">Out of Stock</option>
<option value="price_changed">Price Changed</option>
</select>
<button type="submit" class="text-xs bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-800">Update</button>
<button type="button" class="text-xs text-gray-500" on:click={() => showStatusForm = false}>Cancel</button>
</form>
{/if}
</div>
{/if}

<!-- Flag deal -->
{#if data.user}
<div class="mt-2">
{#if !showFlagForm}
<button class="text-xs text-gray-400 hover:text-red-500" on:click={() => showFlagForm = true}>
⚑ Report deal
</button>
{:else}
{#if form?.flagged}
<p class="text-xs text-green-600">✅ Report submitted. Thanks!</p>
{:else}
<form method="POST" action="?/flag" use:enhance class="space-y-2 mt-2 p-3 bg-gray-50 rounded border border-gray-200">
<p class="text-xs font-medium text-gray-700">Report this deal</p>
<select name="reason" class="border border-gray-300 rounded text-xs px-2 py-1 w-full">
<option value="spam">Spam</option>
<option value="expired">Deal is expired</option>
<option value="duplicate">Duplicate</option>
<option value="abusive">Abusive content</option>
<option value="affiliate_link">Unapproved affiliate link</option>
</select>
<textarea name="details" rows="2" placeholder="Additional details..." class="w-full border border-gray-300 rounded text-xs px-2 py-1"></textarea>
<div class="flex gap-2">
<button type="submit" class="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Submit</button>
<button type="button" class="text-xs text-gray-500" on:click={() => showFlagForm = false}>Cancel</button>
</div>
</form>
{/if}
{/if}
</div>
{/if}
</div>

<!-- Thumbnail -->
{#if data.deal.imageUrl}
<img src={data.deal.imageUrl} alt={data.deal.title} class="w-32 h-32 object-cover rounded flex-shrink-0 hidden sm:block" />
{/if}
</div>
</div>

<!-- Comments Section -->
<div class="bg-white rounded-lg border border-gray-200 p-6">
<h2 class="text-lg font-bold text-gray-900 mb-4">
💬 Discussion ({data.comments.length} comments)
</h2>

{#if data.user}
{#if form?.error}
<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">{form.error}</div>
{/if}
<form method="POST" action="?/comment" use:enhance class="mb-6">
<textarea name="content" rows="3"
placeholder="Share your thoughts, ask questions, or add deal details..."
class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 mb-2"
></textarea>
<input type="hidden" name="parentId" value="" />
<button type="submit" class="bg-orange-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-orange-700">
Post Comment
</button>
</form>
{:else}
<p class="text-sm text-gray-500 mb-6">
<a href="/login" class="text-orange-600 hover:underline">Sign in</a> to join the discussion.
</p>
{/if}

{#if commentTree.length === 0}
<p class="text-gray-500 text-sm">No comments yet. Be the first!</p>
{:else}
<div class="space-y-4">
{#each commentTree as comment (comment.id)}
<div class="border-l-2 border-gray-100 pl-4">
<div class="flex items-center gap-2 mb-1">
<a href="/users/{comment.authorUsername}" class="text-xs font-semibold text-gray-700 hover:text-orange-600">
{comment.authorUsername ?? 'unknown'}
</a>
<span class="text-xs text-gray-400">· {timeAgo(comment.createdAt)}</span>
<span class="text-xs text-gray-400">· {comment.score} pts</span>
</div>
<p class="text-sm text-gray-800 whitespace-pre-wrap">{comment.content}</p>

<!-- Comment vote + reply -->
{#if data.user}
<div class="flex items-center gap-3 mt-1">
<form method="POST" action="?/voteComment" use:enhance>
<input type="hidden" name="commentId" value={comment.id} />
<input type="hidden" name="value" value="1" />
<button type="submit" class="text-xs {data.commentVoteMap[comment.id] === 1 ? 'text-orange-600' : 'text-gray-400 hover:text-orange-600'}">▲</button>
</form>
<form method="POST" action="?/voteComment" use:enhance>
<input type="hidden" name="commentId" value={comment.id} />
<input type="hidden" name="value" value="-1" />
<button type="submit" class="text-xs {data.commentVoteMap[comment.id] === -1 ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'}">▼</button>
</form>
{#if replyingTo !== comment.id}
<button class="text-xs text-gray-400 hover:text-orange-600" on:click={() => (replyingTo = comment.id)}>reply</button>
{/if}
</div>
{/if}

{#if replyingTo === comment.id}
<form method="POST" action="?/comment" use:enhance class="mt-2">
<textarea name="content" rows="2" placeholder="Write a reply..."
class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 mb-2"
></textarea>
<input type="hidden" name="parentId" value={comment.id} />
<div class="flex gap-2">
<button type="submit" class="bg-orange-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-orange-700">Reply</button>
<button type="button" class="text-xs text-gray-500 hover:text-gray-700" on:click={() => (replyingTo = null)}>Cancel</button>
</div>
</form>
{/if}

{#if comment.replies.length > 0}
<div class="mt-3 space-y-3">
{#each comment.replies as reply (reply.id)}
<div class="border-l-2 border-gray-100 pl-4">
<div class="flex items-center gap-2 mb-1">
<a href="/users/{reply.authorUsername}" class="text-xs font-semibold text-gray-700 hover:text-orange-600">
{reply.authorUsername ?? 'unknown'}
</a>
<span class="text-xs text-gray-400">· {timeAgo(reply.createdAt)}</span>
<span class="text-xs text-gray-400">· {reply.score} pts</span>
</div>
<p class="text-sm text-gray-800 whitespace-pre-wrap">{reply.content}</p>
{#if data.user}
<div class="flex items-center gap-3 mt-1">
<form method="POST" action="?/voteComment" use:enhance>
<input type="hidden" name="commentId" value={reply.id} />
<input type="hidden" name="value" value="1" />
<button type="submit" class="text-xs {data.commentVoteMap[reply.id] === 1 ? 'text-orange-600' : 'text-gray-400 hover:text-orange-600'}">▲</button>
</form>
<form method="POST" action="?/voteComment" use:enhance>
<input type="hidden" name="commentId" value={reply.id} />
<input type="hidden" name="value" value="-1" />
<button type="submit" class="text-xs {data.commentVoteMap[reply.id] === -1 ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'}">▼</button>
</form>
</div>
{/if}
</div>
{/each}
</div>
{/if}
</div>
{/each}
</div>
{/if}
</div>
</div>
