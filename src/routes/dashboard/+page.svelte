<script lang="ts">
	import LeftSideBar from '../../components/LeftSideBar.svelte';
	import { api } from '$lib';
	import { onMount } from 'svelte';
	import JsonVisualizer from '../../components/JSONVisualizer.svelte';
	import SJSONView from '../../components/SJSONView.svelte';
	import { activeProject, extractedData, user } from '$lib/store';
	import ExtractButton from '../../components/ExtractButton.svelte';

	onMount(async () => {
		const response = await api.get('/user/profile', { withCredentials: true });
		user.set({ ...response.data });
	});

	function isObject(value: any) {
		return value && typeof value === 'object' && value.constructor === Object;
	}

	function isArray(value: any) {
		return value && typeof value === 'object' && value.constructor === Array;
	}
</script>

<!-- <NavBar user={$user} /> -->

<main class="flex h-[calc(100vh)]">
	<LeftSideBar />
	<div class="p-4 w-full max-h-screen flex flex-col gap-3 max-w-[1200px] mx-auto">
		<div class="flex justify-between items-center">
			<div class="p-1 px-2 rounded-[8px] bg-[#F2F2F2]">
				{#if $activeProject}
					<h1 class="text-base font-semibold">{$activeProject.name}</h1>
				{:else}
					<h1 class="text-base font-semibold">No Project Selected</h1>
				{/if}
			</div>

			<div class="p-1 px-2 rounded-[8px] bg-[#F2F2F2]">
				<h1 class="text-base font-semibold">Export Data</h1>
			</div>
		</div>
		<div class="p-4 bg-[#F2F2F2] rounded-[8px] h-[calc(100%-300px)] overflow-scroll">
			<!-- <ExtractButton /> -->
			{#if $extractedData}
				{#if isObject($extractedData)}
					<SJSONView data={$extractedData} />
				{:else if isArray($extractedData)}
					<JsonVisualizer data={$extractedData} />
				{/if}
			{:else}
				<div class="flex items-center justify-center">
					<p class="text-lg mt-16">No data to display</p>
				</div>
			{/if}
		</div>

		<div class="h-[300px] bg-[#F2F2F2] rounded-[8px]"></div>
	</div>
</main>
