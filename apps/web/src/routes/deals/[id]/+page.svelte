<script lang="ts">
  import type { ActionData, PageData } from "./$types";
  import { formatPrice, formatDiscount, timeAgo, rewriteAffiliateUrl } from "$lib/utils";
  import { enhance } from "$app/forms";

  export let data: PageData;
  export let form: ActionData;

  $: deal = data.deal;
  $: comments = data.comments;
  $: userVote = data.userVote;

  let currentScore = deal.score ?? 0;
  let currentUserVote = userVote;
  let replyTo: number | null = null;

  async function vote(value: number) {
    const res = await fetch(`/deals/${deal.id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    if (res.ok) {
      const data = await res.json();
      currentScore = data.score;
      currentUserVote = data.userVote;
    }
  }

  $: affiliateUrl = rewriteAffiliateUrl(deal.url, data.affiliateTag);
  $: discount = formatDiscount(deal.price, deal.original_price);
</script>

<svelte:head>
  <title>{deal.title} — TechDeels</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  <!-- Deal Card -->
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
    <div class="flex gap-6">
      <!-- Vote Column -->
      <div class="flex flex-col items-center gap-2 flex-shrink-0">
        <button
          on:click={() => vote(1)}
          class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors {currentUserVote === 1 ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-amber-100 hover:text-amber-600'}"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clip-rule="evenodd"/>
          </svg>
        </button>
        <span class="font-bold text-2xl {currentScore > 0 ? 'text-amber-600' : currentScore < 0 ? 'text-red-500' : 'text-gray-600'}">
          {currentScore}
        </span>
        <button
          on:click={() => vote(-1)}
          class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors {currentUserVote === -1 ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600'}"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>

      <!-- Deal Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start gap-3 mb-3">
          {#if deal.image_url}
            <img src={deal.image_url} alt={deal.title} class="w-24 h-24 rounded-xl object-cover flex-shrink-0 border border-gray-100" />
          {/if}
          <div>
            <h1 class="text-xl font-bold text-gray-900 leading-tight">{deal.title}</h1>
            <div class="flex flex-wrap items-center gap-3 mt-2">
              {#if deal.price !== null}
                <span class="text-green-600 font-bold text-2xl">{formatPrice(deal.price)}</span>
              {/if}
              {#if discount}
                <span class="text-gray-400 line-through">{formatPrice(deal.original_price)}</span>
                <span class="bg-green-100 text-green-700 text-sm font-bold px-2 py-0.5 rounded-full">{discount}</span>
              {/if}
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3 mb-4">
          {#if deal.store}
            <span class="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">{deal.store}</span>
          {/if}
          {#if deal.category_name}
            <span class="text-sm bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-medium">{deal.category_name}</span>
          {/if}
          <span class="text-sm text-gray-500">
            by <a href="/profile/{deal.username}" class="text-amber-600 hover:text-amber-700">{deal.username ?? 'unknown'}</a>
            {#if deal.created_at}· {timeAgo(new Date(deal.created_at))}{/if}
          </span>
        </div>

        {#if deal.description}
          <p class="text-gray-600 text-sm leading-relaxed mb-4">{deal.description}</p>
        {/if}

        <div class="flex items-center gap-3">
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="bg-amber-500 hover:bg-amber-400 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-sm flex items-center gap-2"
          >
            Get This Deal
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <!-- Flag form -->
          <details class="relative">
            <summary class="cursor-pointer text-sm text-gray-400 hover:text-gray-600 list-none flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              Flag
            </summary>
            <div class="absolute left-0 top-8 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-10 w-64">
              <form method="POST" action="?/flag" use:enhance>
                <label for="flag-reason" class="block text-sm font-medium text-gray-700 mb-2">Reason for flagging</label>
                <textarea id="flag-reason" name="reason" rows="2" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" placeholder="Expired deal, spam, etc."></textarea>
                <button type="submit" class="mt-2 w-full bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium py-2 rounded-lg transition-colors">
                  Submit Flag
                </button>
              </form>
            </div>
          </details>
        </div>
      </div>
    </div>
  </div>

  <!-- Comments Section -->
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
    <h2 class="font-bold text-lg text-gray-900 mb-6">Comments ({comments.length})</h2>

    <!-- Add Comment Form -->
    {#if data.deal}
      <form method="POST" action="?/addComment" use:enhance class="mb-8">
        <input type="hidden" name="parent_id" value="" />
        <textarea
          name="content"
          rows="3"
          class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
          placeholder="Share your thoughts on this deal..."
        ></textarea>
        {#if form?.commentError}
          <p class="text-red-500 text-xs mt-1">{form.commentError}</p>
        {/if}
        <button type="submit" class="mt-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          Post Comment
        </button>
      </form>
    {/if}

    <!-- Comment Tree -->
    {#if comments.length === 0}
      <p class="text-gray-500 text-sm text-center py-8">No comments yet. Be the first!</p>
    {:else}
      <div class="space-y-4">
        {#each comments as comment (comment.id)}
          <div class="border-l-2 border-gray-100 pl-4">
            <div class="flex items-start gap-3">
              <div class="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                {(comment.username ?? 'U')[0].toUpperCase()}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <a href="/profile/{comment.username}" class="text-sm font-semibold text-gray-900 hover:text-amber-600">{comment.username ?? 'Unknown'}</a>
                  <span class="text-xs text-gray-400">{comment.created_at ? timeAgo(new Date(comment.created_at)) : ''}</span>
                  <span class="text-xs text-gray-400">· {comment.score} pts</span>
                </div>
                <p class="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                <button
                  on:click={() => replyTo = replyTo === comment.id ? null : comment.id}
                  class="text-xs text-gray-400 hover:text-amber-600 mt-1 transition-colors"
                >
                  Reply
                </button>

                {#if replyTo === comment.id}
                  <form method="POST" action="?/addComment" use:enhance class="mt-3">
                    <input type="hidden" name="parent_id" value={comment.id} />
                    <textarea
                      name="content"
                      rows="2"
                      class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                      placeholder="Write a reply..."
                    ></textarea>
                    <div class="flex gap-2 mt-1">
                      <button type="submit" class="text-xs bg-amber-500 hover:bg-amber-400 text-white px-3 py-1 rounded-lg transition-colors">Reply</button>
                      <button type="button" on:click={() => replyTo = null} class="text-xs text-gray-500 hover:text-gray-700 px-3 py-1">Cancel</button>
                    </div>
                  </form>
                {/if}

                <!-- Nested Children -->
                {#if comment.children && comment.children.length > 0}
                  <div class="mt-3 space-y-3 border-l-2 border-gray-100 pl-4">
                    {#each comment.children as child (child.id)}
                      <div class="flex items-start gap-3">
                        <div class="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                          {(child.username ?? 'U')[0].toUpperCase()}
                        </div>
                        <div class="flex-1">
                          <div class="flex items-center gap-2 mb-1">
                            <a href="/profile/{child.username}" class="text-sm font-semibold text-gray-900 hover:text-amber-600">{child.username ?? 'Unknown'}</a>
                            <span class="text-xs text-gray-400">{child.created_at ? timeAgo(new Date(child.created_at)) : ''}</span>
                          </div>
                          <p class="text-sm text-gray-700">{child.content}</p>
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
