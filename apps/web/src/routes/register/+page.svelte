<script lang="ts">
  import type { ActionData } from "./$types";

  export let form: ActionData;
</script>

<svelte:head>
  <title>Register — TechDeels</title>
</svelte:head>

<div class="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
  <div class="w-full max-w-md">
    <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Create your account</h1>
        <p class="text-gray-500 mt-1 text-sm">Join TechDeels and start sharing great deals</p>
      </div>

      <form method="POST" class="space-y-5">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={form?.username ?? ""}
            autocomplete="username"
            class="w-full rounded-lg border {form?.errors?.username ? 'border-red-400 bg-red-50' : 'border-gray-300'} px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
            placeholder="cooluser123"
          />
          {#if form?.errors?.username}
            <p class="text-red-500 text-xs mt-1">{form.errors.username}</p>
          {/if}
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form?.email ?? ""}
            autocomplete="email"
            class="w-full rounded-lg border {form?.errors?.email ? 'border-red-400 bg-red-50' : 'border-gray-300'} px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
            placeholder="you@example.com"
          />
          {#if form?.errors?.email}
            <p class="text-red-500 text-xs mt-1">{form.errors.email}</p>
          {/if}
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            autocomplete="new-password"
            class="w-full rounded-lg border {form?.errors?.password ? 'border-red-400 bg-red-50' : 'border-gray-300'} px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
            placeholder="At least 8 characters"
          />
          {#if form?.errors?.password}
            <p class="text-red-500 text-xs mt-1">{form.errors.password}</p>
          {/if}
        </div>

        <button
          type="submit"
          class="w-full bg-amber-500 hover:bg-amber-400 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm"
        >
          Create Account
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 mt-6">
        Already have an account?
        <a href="/login" class="text-amber-600 hover:text-amber-700 font-medium">Sign in</a>
      </p>
    </div>
  </div>
</div>
