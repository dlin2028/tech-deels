<script lang="ts">
	import VoteButton from '$lib/components/VoteButton.svelte';
	import CommentTree from '$lib/components/CommentTree.svelte';
	import { formatPrice, formatDiscount, formatTimeAgo } from '$lib/utils';
	import type { PageData } from './$types';

	export let data: PageData;

	let commentContent = '';
	let submitting = false;

	async function submitComment() {
		if (!commentContent.trim() || submitting) return;
		submitting = true;
		try {
			const res = await fetch(`/deals/${data.deal.id}/comment`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content: commentContent, parentId: null })
			});
			if (res.ok) {
				commentContent = '';
				window.location.reload();
			}
		} finally {
			submitting = false;
		}
	}

	$: discount = formatDiscount(data.deal.price, data.deal.originalPrice);
</script>

<svelte:head>
	<title>{data.deal.title} - TechDeels</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-6 sm:px-6">
	<div class="card overflow-hidden mb-6">
		<!-- Deal header -->
		<div class="p-6">
			<div class="flex gap-6">
				<!-- Vote -->
				<div class="shrink-0">
					<VoteButton
						dealId={data.deal.id}
						score={data.deal.score}
						userVote={data.deal.userVote}
						disabled={!data.user}
					/>
				</div>

				<!-- Content -->
				<div class="flex-1 min-w-0">
					<div class="flex items-start gap-3">
						{#if data.deal.imageUrl}
							<img src={data.deal.imageUrl} alt={data.deal.title} class="w-32 h-32 object-contain rounded border bg-white shrink-0" />
						{/if}
						<div>
							<h1 class="text-2xl font-bold text-gray-900 mb-2">{data.deal.title}</h1>

							<div class="flex items-center gap-3 flex-wrap mb-3">
								{#if data.deal.price !== null}
									<span class="text-3xl font-bold text-brand-600">{formatPrice(data.deal.price)}</span>
								{/if}
								{#if data.deal.originalPrice && data.deal.originalPrice > (data.deal.price ?? 0)}
									<span class="text-xl text-gray-400 line-through">{formatPrice(data.deal.originalPrice)}</span>
								{/if}
								{#if discount}
									<span class="badge bg-green-100 text-green-800 text-sm">{discount} OFF</span>
								{/if}
							</div>

							<div class="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
								{#if data.deal.store}
									<span class="badge bg-gray-100 text-gray-700">{data.deal.store}</span>
								{/if}
								{#if data.deal.category}
									<a href="/?category={data.deal.category.slug}" class="badge bg-brand-50 text-brand-700 hover:bg-brand-100">
										{data.deal.category.name}
									</a>
								{/if}
								<span>Posted by <a href="/profile/{data.deal.user.username}" class="text-brand-600 hover:underline">{data.deal.user.username}</a></span>
								<span>{formatTimeAgo(new Date(data.deal.createdAt))}</span>
							</div>
						</div>
					</div>

					<div class="mt-4 prose prose-sm max-w-none">
						<p class="text-gray-700 whitespace-pre-wrap">{data.deal.description}</p>
					</div>

					<div class="flex gap-3 mt-4 flex-wrap">
						<a
							href={data.deal.affiliateUrl || data.deal.url}
							target="_blank"
							rel="noopener noreferrer"
							class="btn-primary"
						>
							Get This Deal →
						</a>
						{#if data.user && data.user.id === data.deal.userId}
							<a href="/deals/{data.deal.id}/edit" class="btn-secondary">Edit Deal</a>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Comments section -->
	<div class="card p-6" id="comments">
		<h2 class="text-lg font-semibold text-gray-900 mb-4">
			💬 Comments ({data.comments.length})
		</h2>

		{#if data.user}
			<div class="mb-6">
				<textarea
					bind:value={commentContent}
					rows="3"
					placeholder="Share your thoughts on this deal..."
					class="input"
				></textarea>
				<div class="flex justify-end mt-2">
					<button
						on:click={submitComment}
						disabled={submitting || !commentContent.trim()}
						class="btn-primary"
					>
						{submitting ? 'Posting...' : 'Post Comment'}
					</button>
				</div>
			</div>
		{:else}
			<div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-sm text-gray-600 text-center">
				<a href="/login" class="text-brand-600 font-medium">Login</a> to join the conversation
			</div>
		{/if}

		{#if data.comments.length === 0}
			<p class="text-gray-500 text-sm text-center py-8">No comments yet. Be the first!</p>
		{:else}
			<CommentTree comments={data.comments} dealId={data.deal.id} currentUser={data.user} />
		{/if}
	</div>
</div>
