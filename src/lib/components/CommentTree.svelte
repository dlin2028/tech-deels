<script lang="ts">
	import { formatTimeAgo } from '$lib/utils';
	import type { Comment, User } from '$lib/server/db/schema';

	type CommentWithUser = Comment & { user: User; replies?: CommentWithUser[] };

	export let comments: CommentWithUser[];
	export let dealId: string;
	export let currentUser: import('lucia').User | null = null;
	export let depth = 0;

	let replyingTo: string | null = null;
	let replyContent: Record<string, string> = {};
	let submitting = false;

	async function submitReply(parentId: string) {
		if (!replyContent[parentId]?.trim() || submitting) return;
		submitting = true;
		try {
			const res = await fetch(`/deals/${dealId}/comment`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content: replyContent[parentId], parentId })
			});
			if (res.ok) {
				replyContent[parentId] = '';
				replyingTo = null;
				window.location.reload();
			}
		} finally {
			submitting = false;
		}
	}
</script>

<div class="{depth > 0 ? 'ml-6 border-l-2 border-gray-100 pl-4' : ''}">
	{#each comments as comment (comment.id)}
		<div class="py-3">
			<div class="flex items-start gap-3">
				<div class="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0">
					{comment.user.username[0].toUpperCase()}
				</div>
				<div class="flex-1 min-w-0">
					<div class="flex items-center gap-2 text-xs text-gray-500">
						<a href="/profile/{comment.user.username}" class="font-medium text-gray-900 hover:text-brand-600">
							{comment.user.username}
						</a>
						<span>{formatTimeAgo(new Date(comment.createdAt))}</span>
						<span class="text-brand-500 font-medium">▲ {comment.score}</span>
					</div>
					<p class="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{comment.content}</p>
					{#if currentUser}
						<button
							class="text-xs text-gray-500 hover:text-brand-600 mt-1"
							on:click={() => replyingTo = replyingTo === comment.id ? null : comment.id}
						>
							Reply
						</button>
					{/if}

					{#if replyingTo === comment.id}
						<div class="mt-2">
							<textarea
								bind:value={replyContent[comment.id]}
								rows="2"
								placeholder="Write a reply..."
								class="input text-sm"
							></textarea>
							<div class="flex gap-2 mt-1">
								<button
									on:click={() => submitReply(comment.id)}
									disabled={submitting}
									class="btn-primary py-1 px-3 text-xs"
								>Submit</button>
								<button
									on:click={() => replyingTo = null}
									class="btn-secondary py-1 px-3 text-xs"
								>Cancel</button>
							</div>
						</div>
					{/if}
				</div>
			</div>

			{#if comment.replies && comment.replies.length > 0}
				<svelte:self
					comments={comment.replies}
					{dealId}
					{currentUser}
					depth={depth + 1}
				/>
			{/if}
		</div>
	{/each}
</div>
