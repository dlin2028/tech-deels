<script lang="ts">
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
  <title>Login - TechDeels</title>
</svelte:head>

<div class="max-w-md mx-auto mt-8">
  <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
    <h1 class="text-2xl font-bold mb-6">Welcome back</h1>

    {#if form?.message}
      <div
        class="mb-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm"
      >
        {form.message}
      </div>
    {/if}

    <form method="post" class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium mb-1.5">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={form?.email ?? ''}
          required
          autocomplete="email"
          class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
          placeholder="you@example.com"
        />
        {#if form?.errors?.email}
          <p class="mt-1 text-xs text-red-600 dark:text-red-400">{form.errors.email[0]}</p>
        {/if}
      </div>

      <div>
        <label for="password" class="block text-sm font-medium mb-1.5">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          autocomplete="current-password"
          class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
          placeholder="••••••••"
        />
        {#if form?.errors?.password}
          <p class="mt-1 text-xs text-red-600 dark:text-red-400">{form.errors.password[0]}</p>
        {/if}
      </div>

      <button
        type="submit"
        class="w-full py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
      >
        Log in
      </button>
    </form>

    <p class="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
      Don't have an account?
      <a href="/signup" class="text-orange-500 hover:text-orange-600 font-medium">Sign up</a>
    </p>
  </div>
</div>
