<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<svelte:head>
	<title>Create Account – TechDeels</title>
</svelte:head>

<div class="max-w-md mx-auto">
	<div class="bg-white rounded-lg border border-gray-200 p-8">
		<h1 class="text-2xl font-bold text-gray-900 mb-6">Create Account</h1>

		{#if form?.error}
			<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
				{form.error}
			</div>
		{/if}

		<form method="POST" use:enhance>
			<div class="mb-4">
				<label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
				<input
					id="username"
					name="username"
					type="text"
					required
					minlength="3"
					maxlength="20"
					value={form?.username ?? ''}
					placeholder="3–20 characters, letters/numbers/underscore"
					class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
				/>
			</div>
			<div class="mb-4">
				<label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					value={form?.email ?? ''}
					class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
				/>
			</div>
			<div class="mb-6">
				<label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					minlength="8"
					class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
				/>
				<p class="text-xs text-gray-400 mt-1">At least 8 characters</p>
			</div>
			<button
				type="submit"
				class="w-full bg-orange-600 text-white py-2 rounded font-semibold hover:bg-orange-700 text-sm"
			>
				Create Account
			</button>
		</form>

		<p class="text-center text-sm text-gray-500 mt-4">
			Already have an account?
			<a href="/login" class="text-orange-600 hover:underline">Sign in</a>
		</p>
	</div>
</div>
