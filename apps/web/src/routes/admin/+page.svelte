<script lang="ts">
  import type { ActionData, PageData } from "./$types";
  import { enhance } from "$app/forms";
  import { timeAgo } from "$lib/utils";

  export let data: PageData;
</script>

<svelte:head>
  <title>Admin Dashboard — TechDeels</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

  <!-- Stats Overview -->
  <div class="grid grid-cols-3 gap-6 mb-8">
    <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div class="text-3xl font-bold text-gray-900">{data.stats.dealCount}</div>
      <div class="text-sm text-gray-500 mt-1">Total Deals</div>
    </div>
    <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div class="text-3xl font-bold text-gray-900">{data.stats.userCount}</div>
      <div class="text-sm text-gray-500 mt-1">Total Users</div>
    </div>
    <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div class="text-3xl font-bold text-red-600">{data.stats.flagCount}</div>
      <div class="text-sm text-gray-500 mt-1">Pending Flags</div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    <!-- Flagged Content -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div class="p-5 border-b border-gray-100">
        <h2 class="font-bold text-gray-900">Pending Flags</h2>
      </div>
      <div class="divide-y divide-gray-100">
        {#if data.flags.length === 0}
          <p class="p-5 text-sm text-gray-500">No pending flags.</p>
        {:else}
          {#each data.flags as flag}
            <div class="p-4 flex items-start justify-between gap-3">
              <div class="flex-1">
                <p class="text-sm text-gray-700">{flag.reason}</p>
                <p class="text-xs text-gray-400 mt-0.5">
                  by {flag.reporter ?? 'unknown'} ·
                  {#if flag.deal_id}<a href="/deals/{flag.deal_id}" class="text-amber-600 hover:underline">Deal #{flag.deal_id}</a>{/if}
                  {#if flag.created_at}· {timeAgo(new Date(flag.created_at))}{/if}
                </p>
              </div>
              <form method="POST" action="?/resolveFlag" use:enhance>
                <input type="hidden" name="flagId" value={flag.id} />
                <button type="submit" class="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-lg transition-colors">
                  Resolve
                </button>
              </form>
            </div>
          {/each}
        {/if}
      </div>
    </div>

    <!-- Add Category -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div class="p-5 border-b border-gray-100">
        <h2 class="font-bold text-gray-900">Categories</h2>
      </div>
      <div class="p-5">
        <form method="POST" action="?/addCategory" use:enhance class="mb-4 flex gap-2">
          <input
            type="text"
            name="name"
            placeholder="New category name"
            class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button type="submit" class="bg-amber-500 hover:bg-amber-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            Add
          </button>
        </form>
        <ul class="space-y-1">
          {#each data.categories as cat}
            <li class="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-50">
              <span class="text-sm font-medium text-gray-700">{cat.name}</span>
              <span class="text-xs text-gray-400">/{cat.slug}</span>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>

  <!-- Users Table -->
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
    <div class="p-5 border-b border-gray-100">
      <h2 class="font-bold text-gray-900">Users</h2>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="text-left px-4 py-3 font-medium text-gray-600">Username</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">Email</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">Role</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">Reputation</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">Joined</th>
            <th class="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          {#each data.users as user}
            <tr class="hover:bg-gray-50">
              <td class="px-4 py-3">
                <a href="/profile/{user.username}" class="font-medium text-gray-900 hover:text-amber-600">{user.username}</a>
              </td>
              <td class="px-4 py-3 text-gray-500">{user.email}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-0.5 rounded-full text-xs font-medium {user.role === 'admin' ? 'bg-red-100 text-red-700' : user.role === 'banned' ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-700'}">
                  {user.role ?? 'user'}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-600">{user.reputation ?? 0}</td>
              <td class="px-4 py-3 text-gray-500 text-xs">{user.created_at ? timeAgo(new Date(user.created_at)) : ''}</td>
              <td class="px-4 py-3">
                {#if user.role !== 'admin'}
                  {#if user.role === 'banned'}
                    <form method="POST" action="?/unbanUser" use:enhance class="inline">
                      <input type="hidden" name="userId" value={user.id} />
                      <button type="submit" class="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded transition-colors">
                        Unban
                      </button>
                    </form>
                  {:else}
                    <form method="POST" action="?/banUser" use:enhance class="inline">
                      <input type="hidden" name="userId" value={user.id} />
                      <button type="submit" class="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded transition-colors">
                        Ban
                      </button>
                    </form>
                  {/if}
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
