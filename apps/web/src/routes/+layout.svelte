<script lang="ts">
  import "../app.css";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;

  $: user = data.user;
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Navigation -->
  <header class="bg-slate-900 shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center gap-8">
          <a href="/" class="flex items-center gap-2 text-white font-bold text-xl hover:text-amber-400 transition-colors">
            <span class="text-amber-400">⚡</span>
            TechDeels
          </a>
          <nav class="hidden md:flex items-center gap-6">
            <a href="/" class="text-slate-300 hover:text-white transition-colors text-sm font-medium">Home</a>
            <a href="/?tab=hot" class="text-slate-300 hover:text-white transition-colors text-sm font-medium">Hot Deals</a>
            <a href="/?tab=new" class="text-slate-300 hover:text-white transition-colors text-sm font-medium">New</a>
            {#if user}
              <a href="/deals/new" class="text-slate-300 hover:text-amber-400 transition-colors text-sm font-medium">
                + Submit Deal
              </a>
            {/if}
          </nav>
        </div>

        <!-- Search -->
        <form action="/search" method="GET" class="hidden md:flex flex-1 max-w-md mx-8">
          <div class="relative w-full">
            <input
              type="search"
              name="q"
              placeholder="Search deals..."
              class="w-full bg-slate-800 text-white placeholder-slate-400 rounded-lg px-4 py-2 pr-10 text-sm border border-slate-700 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
            <button type="submit" class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>

        <!-- Auth -->
        <div class="flex items-center gap-3">
          {#if user}
            <a href="/profile/{user.username}" class="text-slate-300 hover:text-white text-sm font-medium flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-xs">
                {user.username[0].toUpperCase()}
              </div>
              <span class="hidden md:block">{user.username}</span>
            </a>
            {#if user.role === "admin"}
              <a href="/admin" class="text-xs bg-red-600 text-white px-2 py-1 rounded font-medium hover:bg-red-700">
                Admin
              </a>
            {/if}
            <form action="/logout" method="POST">
              <button type="submit" class="text-slate-400 hover:text-white text-sm transition-colors">
                Logout
              </button>
            </form>
          {:else}
            <a href="/login" class="text-slate-300 hover:text-white text-sm font-medium transition-colors">
              Login
            </a>
            <a href="/register" class="bg-amber-500 hover:bg-amber-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Register
            </a>
          {/if}
        </div>
      </div>
    </div>
  </header>

  <!-- Mobile Search -->
  <div class="md:hidden bg-slate-800 px-4 py-2">
    <form action="/search" method="GET">
      <input
        type="search"
        name="q"
        placeholder="Search deals..."
        class="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-2 text-sm border border-slate-600 focus:outline-none focus:border-amber-400"
      />
    </form>
  </div>

  <!-- Main Content -->
  <main>
    <slot />
  </main>

  <!-- Footer -->
  <footer class="bg-slate-900 text-slate-400 mt-16 py-8">
    <div class="max-w-7xl mx-auto px-4 text-center text-sm">
      <p>© {new Date().getFullYear()} TechDeels — The best tech hardware deals, curated by the community.</p>
      <p class="mt-1 text-xs text-slate-500">Some links may be affiliate links. We may earn a commission.</p>
    </div>
  </footer>
</div>
