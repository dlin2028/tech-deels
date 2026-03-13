<script lang="ts">
  import '../app.css';
  import type { LayoutData } from './$types';

  let { data, children }: { data: LayoutData; children: any } = $props();

  const categories = [
    { name: 'Components', slug: 'components' },
    { name: 'Laptops', slug: 'laptops' },
    { name: 'Systems', slug: 'systems' },
    { name: 'Peripherals', slug: 'peripherals' },
    { name: 'Networking', slug: 'networking' },
    { name: 'Home Entertainment', slug: 'home-entertainment' },
    { name: 'Monitors', slug: 'monitors' },
    { name: 'Storage', slug: 'storage' },
  ];

  let mobileMenuOpen = $state(false);
  let searchQuery = $state('');

  function handleSearch(e: Event) {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  }
</script>

<div class="min-h-screen bg-gray-950 text-gray-100">
  <!-- Header -->
  <header class="sticky top-0 z-50 bg-gray-900 border-b border-gray-800 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <a href="/" class="flex items-center gap-2 shrink-0">
          <span class="text-2xl">🔥</span>
          <span class="text-xl font-bold text-orange-400">Tech<span class="text-white">Deels</span></span>
        </a>

        <!-- Search Bar (desktop) -->
        <form onsubmit={handleSearch} class="hidden md:flex flex-1 max-w-xl mx-6">
          <div class="relative w-full">
            <input
              type="text"
              bind:value={searchQuery}
              placeholder="Search deals..."
              class="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              🔍
            </span>
          </div>
        </form>

        <!-- Right nav (desktop) -->
        <div class="hidden md:flex items-center gap-2">
          <a href="/?sort=hot" class="btn-ghost text-sm">🔥 Hot</a>
          <a href="/?sort=new" class="btn-ghost text-sm">✨ New</a>
          {#if data.user}
            <a href="/deals/new" class="btn-primary text-sm">+ Submit Deal</a>
            <div class="flex items-center gap-2 ml-2">
              <a href="/profile" class="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
                <div class="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs">
                  {data.user.username[0].toUpperCase()}
                </div>
                <span class="hidden lg:inline">{data.user.username}</span>
              </a>
              <form method="POST" action="/auth/logout">
                <button type="submit" class="btn-ghost text-sm text-gray-400">Sign out</button>
              </form>
            </div>
          {:else}
            <a href="/auth/login" class="btn-ghost text-sm">Sign in</a>
            <a href="/auth/register" class="btn-primary text-sm">Join</a>
          {/if}
        </div>

        <!-- Mobile menu toggle -->
        <button
          class="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800"
          onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {#if mobileMenuOpen}✕{:else}☰{/if}
        </button>
      </div>

      <!-- Category nav -->
      <nav class="hidden md:flex items-center gap-1 pb-2 overflow-x-auto scrollbar-hide">
        <a href="/" class="px-3 py-1 text-xs font-medium text-gray-400 hover:text-orange-400 hover:bg-gray-800 rounded-full transition-colors whitespace-nowrap">
          All Deals
        </a>
        {#each categories as cat}
          <a
            href="/category/{cat.slug}"
            class="px-3 py-1 text-xs font-medium text-gray-400 hover:text-orange-400 hover:bg-gray-800 rounded-full transition-colors whitespace-nowrap"
          >
            {cat.name}
          </a>
        {/each}
      </nav>
    </div>

    <!-- Mobile menu -->
    {#if mobileMenuOpen}
      <div class="md:hidden border-t border-gray-800 bg-gray-900 px-4 py-3 space-y-2">
        <form onsubmit={handleSearch} class="flex">
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Search deals..."
            class="input-field text-sm flex-1"
          />
        </form>
        <div class="flex flex-col gap-1 pt-1">
          <a href="/?sort=hot" class="btn-ghost text-sm justify-start">🔥 Hot Deals</a>
          <a href="/?sort=new" class="btn-ghost text-sm justify-start">✨ New Deals</a>
          {#if data.user}
            <a href="/deals/new" class="btn-primary text-sm">+ Submit Deal</a>
            <a href="/profile" class="btn-ghost text-sm justify-start">👤 {data.user.username}</a>
            <form method="POST" action="/auth/logout">
              <button type="submit" class="btn-ghost text-sm w-full justify-start text-gray-400">Sign out</button>
            </form>
          {:else}
            <a href="/auth/login" class="btn-ghost text-sm justify-start">Sign in</a>
            <a href="/auth/register" class="btn-primary text-sm text-center">Join TechDeels</a>
          {/if}
        </div>
        <div class="border-t border-gray-800 pt-2 flex flex-wrap gap-1">
          {#each categories as cat}
            <a href="/category/{cat.slug}" class="px-2 py-1 text-xs text-gray-400 hover:text-orange-400 bg-gray-800 rounded-full">
              {cat.name}
            </a>
          {/each}
        </div>
      </div>
    {/if}
  </header>

  <!-- Main content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    {@render children()}
  </main>

  <!-- Footer -->
  <footer class="mt-12 border-t border-gray-800 bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <span class="text-xl">🔥</span>
          <span class="font-bold text-orange-400">Tech<span class="text-white">Deels</span></span>
          <span class="text-gray-500 text-sm">— Community-powered tech deals</span>
        </div>
        <div class="flex items-center gap-4 text-sm text-gray-500">
          <a href="/about" class="hover:text-gray-300 transition-colors">About</a>
          <a href="/rules" class="hover:text-gray-300 transition-colors">Rules</a>
          <a href="/contact" class="hover:text-gray-300 transition-colors">Contact</a>
        </div>
        <p class="text-gray-600 text-xs">© {new Date().getFullYear()} TechDeels. All rights reserved.</p>
      </div>
    </div>
  </footer>
</div>
