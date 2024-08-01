<script lang="ts">
	import LeftSideBar from '../../components/LeftSideBar.svelte';
	import { api } from '$lib';
	import { onMount } from 'svelte';
	import JsonVisualizer from '../../components/JSONVisualizer.svelte';
	import SJSONView from '../../components/SJSONView.svelte';
	import { activeProject, dataProcessing, extractedData, user } from '$lib/store';
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
			<div class="p-1 px-2 rounded-[8px] bg-[#ddf9f1]">
				{#if $activeProject}
					<h1 class="text-base font-semibold">{$activeProject.name}</h1>
				{:else if $dataProcessing === 'exracting'}
					<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24"
						><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"
							><path
								stroke-dasharray="2 4"
								stroke-dashoffset="6"
								d="M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3"
								><animate
									attributeName="stroke-dashoffset"
									dur="0.6s"
									repeatCount="indefinite"
									values="6;0"
								/></path
							><path
								stroke-dasharray="30"
								stroke-dashoffset="30"
								d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21"
								><animate
									fill="freeze"
									attributeName="stroke-dashoffset"
									begin="0.1s"
									dur="0.3s"
									values="30;0"
								/></path
							><path stroke-dasharray="10" stroke-dashoffset="10" d="M12 16v-7.5"
								><animate
									fill="freeze"
									attributeName="stroke-dashoffset"
									begin="0.5s"
									dur="0.2s"
									values="10;0"
								/></path
							><path stroke-dasharray="6" stroke-dashoffset="6" d="M12 8.5l3.5 3.5M12 8.5l-3.5 3.5"
								><animate
									fill="freeze"
									attributeName="stroke-dashoffset"
									begin="0.7s"
									dur="0.2s"
									values="6;0"
								/></path
							></g
						></svg
					>
				{:else}
					<h1 class="text-base font-semibold">No file uploaded</h1>
				{/if}
			</div>

			<div class="p-1 px-2 rounded-[8px] bg-[#ddf9f1]">
				<h1 class="text-base font-semibold">
					<ExtractButton />
				</h1>
			</div>
		</div>
		<div class="p-4 bg-[#ddf9f1] rounded-[8px] h-[calc(100%)] overflow-scroll">
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

		<!-- <div class="h-[300px] bg-[#ddf9f1] rounded-[8px]"></div> -->
	</div>
</main>
