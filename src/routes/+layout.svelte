<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<Navbar user={data.user} />

<main class="min-h-screen">
	<slot />
</main>

<footer class="bg-white border-t border-gray-200 mt-8">
	<div class="max-w-7xl mx-auto px-4 py-6 text-sm text-gray-500 text-center">
		© 2024 TechDeels — Find the best tech deals
	</div>
</footer>
