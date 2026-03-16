<script lang="ts">
  import '../app.css';

  let { data, children } = $props();

  let darkMode = $state(false);

  function initTheme() {
    if (typeof localStorage !== 'undefined') {
      darkMode = localStorage.getItem('theme') === 'dark';
      if (darkMode) {
        document.documentElement.classList.add('dark');
      }
    }
  }

  function toggleDark() {
    darkMode = !darkMode;
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
</script>

<svelte:head>
  <title>TechDeels - Hardware Deals Forum</title>
  <script>
    // Prevent flash of wrong theme
    (function () {
      const theme = localStorage.getItem('theme');
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    })();
  </script>
</svelte:head>

<svelte:window on:load={initTheme} />

<div class="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
  <header
    class="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-6">
          <a href="/" class="text-xl font-bold text-orange-500">🔥 TechDeels</a>
          <nav class="hidden md:flex items-center gap-4 text-sm">
            <a href="/" class="hover:text-orange-500 transition-colors">Hot</a>
            <a href="/?sort=new" class="hover:text-orange-500 transition-colors">New</a>
            <a href="/deals/new" class="hover:text-orange-500 transition-colors">Submit Deal</a>
          </nav>
        </div>
        <div class="flex items-center gap-3">
          <button
            onclick={toggleDark}
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {#if darkMode}☀️{:else}🌙{/if}
          </button>
          {#if data.user}
            <a
              href="/notifications"
              class="text-sm hover:text-orange-500 transition-colors"
              aria-label="Notifications"
            >
              🔔
            </a>
            <a
              href="/u/{data.user.username}"
              class="text-sm font-medium hover:text-orange-500 transition-colors"
            >
              {data.user.username}
            </a>
            <form action="/logout" method="post">
              <button
                type="submit"
                class="text-sm px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </form>
          {:else}
            <a href="/login" class="text-sm px-3 py-1.5 hover:text-orange-500 transition-colors"
              >Login</a
            >
            <a
              href="/signup"
              class="text-sm px-4 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Sign Up
            </a>
          {/if}
        </div>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    {@render children()}
  </main>

  <footer class="mt-16 border-t border-gray-200 dark:border-gray-800 py-8">
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400"
    >
      <div class="flex justify-center gap-6 mb-4">
        <a href="/guidelines" class="hover:text-orange-500 transition-colors">Guidelines</a>
        <a href="/privacy" class="hover:text-orange-500 transition-colors">Privacy</a>
        <a href="/terms" class="hover:text-orange-500 transition-colors">Terms</a>
        <a href="/affiliate-disclosure" class="hover:text-orange-500 transition-colors"
          >Affiliate Disclosure</a
        >
      </div>
      <p>© {new Date().getFullYear()} TechDeels. All rights reserved.</p>
    </div>
  </footer>
</div>
