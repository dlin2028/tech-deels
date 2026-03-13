<script lang="ts">
  import type { PageData } from './$types';
  import { formatPrice, calculateDiscount, timeAgo, formatCount } from '$lib/utils';
  import { enhance } from '$app/forms';

  let { data }: { data: PageData } = $props();

  const { deal, comments, userVote, isSaved } = $derived(data);
  const discount = $derived(calculateDiscount(deal.price, deal.originalPrice));

  const conditionLabels: Record<string, string> = {
    new: 'New',
    open_box: 'Open Box',
    refurbished: 'Refurbished',
    used: 'Used',
  };
</script>

<svelte:head>
  <title>{deal.title} — TechDeels</title>
  <meta name="description" content="{deal.title} at {formatPrice(deal.price)} from {deal.store}" />
</svelte:head>

<div class="flex flex-col lg:flex-row gap-6">
  <!-- Main content -->
  <div class="flex-1 min-w-0">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-500 mb-4">
      <a href="/" class="hover:text-gray-300 transition-colors">Deals</a>
      {#if deal.categoryName}
        <span>›</span>
        <a href="/category/{deal.categorySlug}" class="hover:text-gray-300 transition-colors">{deal.categoryName}</a>
      {/if}
      <span>›</span>
      <span class="text-gray-400 truncate">{deal.title}</span>
    </nav>

    <!-- Deal card -->
    <div class="card p-6 mb-6">
      <div class="flex gap-4">
        <!-- Vote column -->
        <div class="flex flex-col items-center gap-1 shrink-0 w-14">
          <form method="POST" action="?/upvote" use:enhance>
            <button
              type="submit"
              class="flex flex-col items-center p-2 rounded-lg transition-colors {userVote === 'up' ? 'text-orange-400 bg-orange-500/10' : 'text-gray-500 hover:text-orange-400 hover:bg-gray-800'}"
              title="Upvote"
            >
              <span class="text-2xl leading-none">▲</span>
            </button>
          </form>
          <span class="text-lg font-bold {deal.upvotes - deal.downvotes >= 50 ? 'text-orange-400' : deal.upvotes - deal.downvotes >= 10 ? 'text-yellow-400' : 'text-gray-300'}">
            {formatCount(deal.upvotes - deal.downvotes)}
          </span>
          <form method="POST" action="?/downvote" use:enhance>
            <button
              type="submit"
              class="p-2 rounded-lg transition-colors {userVote === 'down' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-600 hover:text-gray-400 hover:bg-gray-800'}"
              title="Downvote"
            >
              <span class="text-2xl leading-none">▼</span>
            </button>
          </form>
        </div>

        <!-- Deal info -->
        <div class="flex-1 min-w-0">
          <div class="flex flex-wrap gap-2 mb-2">
            {#if deal.isFeatured}
              <span class="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs font-bold rounded uppercase tracking-wide">Featured</span>
            {/if}
            {#if discount >= 10}
              <span class="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded">-{discount}% OFF</span>
            {/if}
            <span class="px-2 py-0.5 bg-gray-700 text-gray-400 text-xs rounded">{conditionLabels[deal.condition] ?? deal.condition}</span>
            {#if deal.status !== 'active'}
              <span class="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded uppercase">{deal.status.replace('_', ' ')}</span>
            {/if}
          </div>

          <h1 class="text-xl sm:text-2xl font-bold text-gray-100 leading-snug mb-3">{deal.title}</h1>

          {#if deal.imageUrl}
            <img
              src={deal.imageUrl}
              alt={deal.title}
              class="w-full max-h-72 object-contain rounded-lg bg-gray-800 mb-4"
              loading="lazy"
            />
          {/if}

          <!-- Price block -->
          <div class="flex flex-wrap items-end gap-3 mb-4">
            <span class="text-3xl font-bold text-green-400">{formatPrice(deal.price)}</span>
            {#if deal.originalPrice && deal.originalPrice > deal.price}
              <span class="text-lg text-gray-500 line-through">{formatPrice(deal.originalPrice)}</span>
              <span class="text-base text-green-500 font-semibold">Save {formatPrice(deal.originalPrice - deal.price)}</span>
            {/if}
          </div>

          <div class="flex flex-wrap items-center gap-3 text-sm mb-4">
            <span class="font-semibold text-gray-300">{deal.store}</span>
            {#if deal.brand}
              <span class="text-gray-500">· Brand: <span class="text-gray-300">{deal.brand}</span></span>
            {/if}
            {#if deal.shippingCost === 0}
              <span class="text-blue-400 font-medium">✓ Free Shipping</span>
            {:else if deal.shippingCost}
              <span class="text-gray-500">+ {formatPrice(deal.shippingCost)} shipping</span>
            {/if}
          </div>

          <!-- Action buttons -->
          <div class="flex flex-wrap gap-3 mb-4">
            <a
              href={deal.affiliateUrl || deal.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              class="btn-primary px-6 py-2.5 text-base"
            >
              🛒 Get This Deal
            </a>
            <form method="POST" action="?/save" use:enhance>
              <button
                type="submit"
                class="btn-secondary px-4 py-2.5 {isSaved ? 'text-yellow-400' : ''}"
                title={isSaved ? 'Remove from saved' : 'Save deal'}
              >
                {isSaved ? '★ Saved' : '☆ Save'}
              </button>
            </form>
          </div>

          {#if deal.description}
            <div class="border-t border-gray-800 pt-4">
              <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Description</h2>
              <p class="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{deal.description}</p>
            </div>
          {/if}
        </div>
      </div>

      <!-- Meta footer -->
      <div class="border-t border-gray-800 mt-4 pt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
        <span>Posted {timeAgo(deal.createdAt)}</span>
        {#if deal.username}
          <span>· by <a href="/user/{deal.username}" class="hover:text-gray-300 transition-colors">{deal.username}</a></span>
        {/if}
        <span>· 👁 {formatCount(deal.viewCount)} views</span>
        <span>· 💬 {deal.commentCount} comments</span>
        {#if deal.expiresAt}
          <span class="text-yellow-500">· Expires {timeAgo(deal.expiresAt)}</span>
        {/if}
      </div>
    </div>

    <!-- Comments section -->
    <div id="comments">
      <h2 class="text-lg font-semibold text-gray-200 mb-4">
        Comments <span class="text-gray-500 font-normal text-base">({comments.length})</span>
      </h2>

      <!-- Add comment form -->
      <div class="card p-4 mb-4">
        <form method="POST" action="?/comment" use:enhance class="space-y-3">
          <textarea
            name="content"
            rows="3"
            class="input-field resize-y"
            placeholder="Share your thoughts, experience, or tips about this deal…"
          ></textarea>
          <div class="flex justify-end">
            <button type="submit" class="btn-primary text-sm px-4 py-2">Post Comment</button>
          </div>
        </form>
      </div>

      <!-- Comment list -->
      {#if comments.length === 0}
        <div class="card p-8 text-center">
          <div class="text-3xl mb-2">💬</div>
          <p class="text-gray-500 text-sm">No comments yet. Be the first!</p>
        </div>
      {:else}
        <div class="space-y-3">
          {#each comments as comment}
            <div class="card p-4">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-sm shrink-0">
                  {(comment.username ?? '?')[0].toUpperCase()}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-sm font-medium text-gray-300">{comment.username ?? 'Deleted User'}</span>
                    <span class="text-xs text-gray-600">{timeAgo(comment.createdAt)}</span>
                  </div>
                  <p class="text-sm text-gray-300 leading-relaxed">{comment.content}</p>

                  <!-- Replies -->
                  {#if comment.replies && comment.replies.length > 0}
                    <div class="mt-3 pl-4 border-l-2 border-gray-800 space-y-3">
                      {#each comment.replies as reply}
                        <div class="flex items-start gap-2">
                          <div class="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs shrink-0">
                            {(reply.username ?? '?')[0].toUpperCase()}
                          </div>
                          <div>
                            <div class="flex items-center gap-2 mb-0.5">
                              <span class="text-xs font-medium text-gray-300">{reply.username ?? 'Deleted User'}</span>
                              <span class="text-xs text-gray-600">{timeAgo(reply.createdAt)}</span>
                            </div>
                            <p class="text-sm text-gray-400">{reply.content}</p>
                          </div>
                        </div>
                      {/each}
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <!-- Sidebar -->
  <aside class="w-full lg:w-64 shrink-0 space-y-4">
    <!-- Quick stats -->
    <div class="card p-4">
      <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Deal Stats</h3>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-500">Score</span>
          <span class="font-semibold text-gray-200">{formatCount(deal.upvotes - deal.downvotes)}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Views</span>
          <span class="font-semibold text-gray-200">{formatCount(deal.viewCount)}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-500">Comments</span>
          <span class="font-semibold text-gray-200">{deal.commentCount}</span>
        </div>
        {#if deal.expiresAt}
          <div class="flex justify-between">
            <span class="text-gray-500">Expires</span>
            <span class="font-semibold text-yellow-500">{timeAgo(deal.expiresAt)}</span>
          </div>
        {/if}
      </div>
    </div>

    <!-- Get deal CTA -->
    <div class="card p-4 text-center">
      <p class="text-sm text-gray-400 mb-3">
        <span class="text-2xl font-bold text-green-400 block mb-1">{formatPrice(deal.price)}</span>
        {#if discount > 0}
          <span class="text-green-500">{discount}% off retail</span>
        {/if}
      </p>
      <a
        href={deal.affiliateUrl || deal.url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        class="btn-primary w-full text-sm py-2.5"
      >
        Get This Deal →
      </a>
    </div>
  </aside>
</div>
