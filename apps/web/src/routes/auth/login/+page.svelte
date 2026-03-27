<script lang="ts">
  import type { ActionData } from './$types';
  import { enhance } from '$app/forms';

  let { form }: { form: ActionData } = $props();
  let loading = $state(false);
</script>

<svelte:head>
  <title>Sign In — TechDeels</title>
</svelte:head>

<div class="min-h-[70vh] flex items-center justify-center py-12 px-4">
  <div class="w-full max-w-md">
    <!-- Logo -->
    <div class="text-center mb-8">
      <a href="/" class="inline-flex items-center gap-2">
        <span class="text-3xl">🔥</span>
        <span class="text-2xl font-bold text-orange-400">Tech<span class="text-white">Deels</span></span>
      </a>
      <h1 class="mt-4 text-2xl font-bold text-gray-100">Welcome back</h1>
      <p class="mt-1 text-gray-500 text-sm">Sign in to your account to continue</p>
    </div>

    <div class="card p-8">
      {#if form?.error}
        <div class="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {form.error}
        </div>
      {/if}

      <form
        method="POST"
        use:enhance={() => {
          loading = true;
          return async ({ update }) => {
            loading = false;
            await update();
          };
        }}
        class="space-y-4"
      >
        <div>
          <label for="email" class="block text-sm font-medium text-gray-300 mb-1">Email address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form?.email ?? ''}
            required
            autocomplete="email"
            class="input-field"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-300 mb-1">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            autocomplete="current-password"
            class="input-field"
            placeholder="••••••••"
          />
        </div>

        <button type="submit" disabled={loading} class="btn-primary w-full py-2.5">
          {#if loading}
            <span class="animate-pulse">Signing in…</span>
          {:else}
            Sign in
          {/if}
        </button>
      </form>
    </div>

    <p class="mt-4 text-center text-sm text-gray-500">
      Don't have an account?
      <a href="/auth/register" class="text-orange-400 hover:text-orange-300 font-medium">Create one</a>
    </p>
  </div>
</div>
