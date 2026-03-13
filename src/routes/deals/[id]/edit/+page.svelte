<script lang="ts">
	import type { ActionData, PageData } from './$types';
	export let data: PageData;
	export let form: ActionData;
</script>

<svelte:head>
	<title>Edit Deal - TechDeels</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-8">
	<h1 class="text-2xl font-bold text-gray-900 mb-6">Edit Deal</h1>

	{#if form?.message}
		<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">
			{form.message}
		</div>
	{/if}

	<div class="card p-6">
		<form method="POST" class="space-y-5">
			<div>
				<label for="title" class="block text-sm font-medium text-gray-700 mb-1">Deal Title *</label>
				<input type="text" id="title" name="title" class="input" value={data.deal.title} required maxlength="200" />
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="price" class="block text-sm font-medium text-gray-700 mb-1">Sale Price ($)</label>
					<input type="number" id="price" name="price" class="input" value={data.deal.price ?? ''} min="0" step="0.01" />
				</div>
				<div>
					<label for="originalPrice" class="block text-sm font-medium text-gray-700 mb-1">Original Price ($)</label>
					<input type="number" id="originalPrice" name="originalPrice" class="input" value={data.deal.originalPrice ?? ''} min="0" step="0.01" />
				</div>
			</div>

			<div>
				<label for="url" class="block text-sm font-medium text-gray-700 mb-1">Deal URL *</label>
				<input type="url" id="url" name="url" class="input" value={data.deal.url} required />
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="store" class="block text-sm font-medium text-gray-700 mb-1">Store</label>
					<input type="text" id="store" name="store" class="input" value={data.deal.store ?? ''} maxlength="100" />
				</div>
				<div>
					<label for="categoryId" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
					<select id="categoryId" name="categoryId" class="input">
						<option value="">Select category...</option>
						{#each data.categories as cat}
							<option value={cat.id} selected={cat.id === data.deal.categoryId}>{cat.name}</option>
						{/each}
					</select>
				</div>
			</div>

			<div>
				<label for="imageUrl" class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
				<input type="url" id="imageUrl" name="imageUrl" class="input" value={data.deal.imageUrl ?? ''} />
			</div>

			<div>
				<label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description *</label>
				<textarea id="description" name="description" class="input" rows="4" required maxlength="2000">{data.deal.description}</textarea>
			</div>

			<div class="flex gap-3">
				<button type="submit" class="btn-primary flex-1 py-2.5">Save Changes</button>
				<a href="/deals/{data.deal.id}" class="btn-secondary px-6 py-2.5">Cancel</a>
			</div>
		</form>
	</div>
</div>
