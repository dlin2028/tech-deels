<script lang="ts">
	import type { ActionData } from './$types';
	export let form: ActionData;
</script>

<svelte:head>
	<title>Register - TechDeels</title>
</svelte:head>

<div class="min-h-[80vh] flex items-center justify-center px-4">
	<div class="w-full max-w-md">
		<div class="card p-8">
			<div class="text-center mb-6">
				<div class="inline-flex bg-brand-500 text-white font-bold text-2xl px-4 py-2 rounded-lg mb-2">TD</div>
				<h1 class="text-2xl font-bold text-gray-900">Create account</h1>
				<p class="text-gray-500 text-sm mt-1">Join the TechDeels community</p>
			</div>

			{#if form?.message}
				<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">
					{form.message}
				</div>
			{/if}

			<form method="POST" class="space-y-4">
				<div>
					<label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
					<input
						type="text"
						id="username"
						name="username"
						class="input"
						placeholder="dealshunter"
						minlength="3"
						maxlength="20"
						pattern="[a-zA-Z0-9_]+"
						required
					/>
					<p class="text-xs text-gray-400 mt-1">3-20 characters, letters, numbers, underscores only</p>
				</div>

				<div>
					<label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						class="input"
						placeholder="you@example.com"
						required
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						class="input"
						placeholder="••••••••"
						minlength="8"
						required
					/>
					<p class="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
				</div>

				<button type="submit" class="btn-primary w-full py-2.5">Create Account</button>
			</form>

			<p class="text-center text-sm text-gray-500 mt-4">
				Already have an account? <a href="/login" class="text-brand-600 font-medium hover:underline">Sign in</a>
			</p>
		</div>
	</div>
</div>
