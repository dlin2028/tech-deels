<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
</script>

<svelte:head>
	<title>Post a Deal – TechDeels</title>
</svelte:head>

<div class="max-w-2xl mx-auto">
	<div class="bg-white rounded-lg border border-gray-200 p-8">
		<h1 class="text-2xl font-bold text-gray-900 mb-6">Post a Deal</h1>

		{#if form?.error}
			<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
				{form.error}
			</div>
		{/if}

		<form method="POST" use:enhance class="space-y-4">
			<div>
				<label for="title" class="block text-sm font-medium text-gray-700 mb-1"
					>Deal Title <span class="text-red-500">*</span></label
				>
				<input
					id="title"
					name="title"
					type="text"
					required
					maxlength="200"
					value={form?.title ?? ''}
					placeholder='e.g. ASUS ROG 27" 4K 165Hz Monitor – $499 (reg $699)'
					class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
				/>
			</div>

			<div>
				<label for="url" class="block text-sm font-medium text-gray-700 mb-1"
					>Deal URL <span class="text-red-500">*</span></label
				>
				<input
					id="url"
					name="url"
					type="url"
					required
					value={form?.url ?? ''}
					placeholder="https://www.amazon.com/..."
					class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
				/>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="price" class="block text-sm font-medium text-gray-700 mb-1"
						>Deal Price <span class="text-red-500">*</span></label
					>
					<div class="relative">
						<span class="absolute left-3 top-2 text-gray-400 text-sm">$</span>
						<input
							id="price"
							name="price"
							type="number"
							required
							min="0"
							step="0.01"
							value={form?.price ?? ''}
							placeholder="0.00"
							class="w-full border border-gray-300 rounded pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
						/>
					</div>
				</div>
				<div>
					<label for="originalPrice" class="block text-sm font-medium text-gray-700 mb-1"
						>Original Price</label
					>
					<div class="relative">
						<span class="absolute left-3 top-2 text-gray-400 text-sm">$</span>
						<input
							id="originalPrice"
							name="originalPrice"
							type="number"
							min="0"
							step="0.01"
							value={form?.originalPrice ?? ''}
							placeholder="0.00"
							class="w-full border border-gray-300 rounded pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
						/>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="store" class="block text-sm font-medium text-gray-700 mb-1"
						>Store / Merchant <span class="text-red-500">*</span></label
					>
					<input
						id="store"
						name="store"
						type="text"
						required
						value={form?.store ?? ''}
						placeholder="Amazon, Newegg, Microcenter..."
						class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
					/>
				</div>
				<div>
					<label for="shippingCost" class="block text-sm font-medium text-gray-700 mb-1"
						>Shipping Cost</label
					>
					<div class="relative">
						<span class="absolute left-3 top-2 text-gray-400 text-sm">$</span>
						<input
							id="shippingCost"
							name="shippingCost"
							type="number"
							min="0"
							step="0.01"
							value={form?.shippingCost ?? '0'}
							placeholder="0.00 (free)"
							class="w-full border border-gray-300 rounded pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
						/>
					</div>
				</div>
			</div>

			<div>
				<label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
				<select
					id="category"
					name="category"
					class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
				>
					<option value="">Select a category...</option>
					{#each data.categories as category (category.id)}
						<option value={category.id}>{category.name}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="description" class="block text-sm font-medium text-gray-700 mb-1"
					>Description</label
				>
				<textarea
					id="description"
					name="description"
					rows="5"
					placeholder="Describe the deal, coupon codes, price match instructions, specs..."
					class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
				>{form?.description ?? ''}</textarea>
			</div>

			<div>
				<label for="imageUrl" class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
				<input
					id="imageUrl"
					name="imageUrl"
					type="url"
					value={form?.imageUrl ?? ''}
					placeholder="https://example.com/product.jpg"
					class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
				/>
			</div>

			<button
				type="submit"
				class="w-full bg-orange-600 text-white py-2 rounded font-semibold hover:bg-orange-700 text-sm"
			>
				Submit Deal
			</button>
		</form>
	</div>
</div>
