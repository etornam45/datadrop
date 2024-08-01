<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import SingleFileUpload from './SingleFileUpload.svelte';
	import MultipleFileUpload from './MultipleFileUpload.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { activeRule, extractedData, projectListing, Rules, setActiveProject, user } from '$lib/store';

	import Clip from '$lib/components/icons/clip.svelte';
	import Logo from './Logo.svelte';
	import Menu from '$lib/components/icons/menu.svelte';

	import NewProject from './NewProject.svelte';
	import { onMount } from 'svelte';
	import { deleteProject, getProjects, getRules } from '$lib/api';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import NewRule from './NewRule.svelte';

	onMount(async () => {
		await getProjects();
		await getRules();
	});

	function handleRuleSelected(event: any) {
		// activeRule.set(event.target.value);
	}
</script>

<aside class="min-w-[350px] p-2 flex flex-col items-center justify-between gap-4 bg-[#b3d7af]">
	<div class="w-full">
		<div class="w-full flex justify-between items-center">
			<Logo />

			<div class="clipper bg-[#386b55] p-[3px] aspect-square rounded-[6px]">
				<Clip width="1.2rem" height="1.2rem" class="text-white fill-white" />
			</div>
		</div>
		<Separator class="my-3" />

		<div class="w-full flex items-center gap-3 rounded-full bg-[#ecfff7] p-2">
			<img
				src={'https://api.dicebear.com/9.x/adventurer/svg?seed=' + $user?.name.split(' ')[0]}
				alt="user"
				class="w-12 aspect-square rounded-full bg-[#386b55]/40"
			/>
			<div>
				<p class="text-[#386b59] font-semibold text-lg">{$user?.name}</p>
				<p class="text-[#386b59] text-sm">{$user?.email}</p>
			</div>
		</div>

		<Separator class="my-3" />

		<div class="w-full">
			<div class="w-full flex justify-between items-center">
				<p class="font-semibold">Files</p>
				<NewProject />
			</div>

			<div class="w-full flex flex-col gap-2 mt-4 p-3 bg-[#62c08ea5] rounded-[8px]">
				{#if $projectListing}
					{#each $projectListing.slice(0, 5) as item}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div on:click={() => {
							setActiveProject(item)
							if (item.tables !== null) {
							  extractedData.set(JSON.parse(item.tables))
							} else {
							  extractedData.set(null)
							}
						}} class="w-full p-2 bg-white rounded-[6px] flex items-center justify-between hover:bg-slate-200 cursor-pointer">
							<div>
								<p class="text-[#5c5c5c]">{item.name}</p>
								<p class="text-[#386b59] text-sm italic">
									<span class="text-[#386b59]">{item.description}</span>
								</p>
							</div>

							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<Menu width="1.5rem" height="1.5rem" />
								</DropdownMenu.Trigger>
								<DropdownMenu.Content>
									<DropdownMenu.Group>
										<DropdownMenu.Label>Actions</DropdownMenu.Label>
										<DropdownMenu.Separator />
										<DropdownMenu.Item disabled>Edit (coming soon)</DropdownMenu.Item>
										<DropdownMenu.Item
											on:click={async () => {
												await deleteProject(item.id);
												await getProjects();
											}}
											class="text-red-500 hover:text-red-300">Delete</DropdownMenu.Item
										>
									</DropdownMenu.Group>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</div>
					{/each}
				{/if}
				<button class="w-full p-2 bg-[#43825b] text-[#ffffff] rounded-[6px]">View All</button>
			</div>
		</div>

		<Separator class="my-3" />

		<div class="w-full">
			<div class="w-full flex justify-between items-center">
				<p class="font-semibold">RULES</p>
				<NewRule />
			</div>

			<!-- Selector -->

			{#if $Rules}
			<select bind:value={$activeRule} class="w-full p-3 my-3 bg-[#43825b] rounded-[8px]">
				{#each $Rules as rule}
					<option value={rule}>{rule.name}</option>
				{/each}
			</select>
			{/if}
		</div>

		<Separator class="my-3" />
		<div class="w-full">
			<Tabs.Root value="account" class="w-full">
				<Tabs.List class="w-full">
					<Tabs.Trigger class="w-full" value="account">Single File</Tabs.Trigger>
					<Tabs.Trigger class="w-full" value="password">Multiple Files</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="account" class="">
					<SingleFileUpload />
				</Tabs.Content>
				<Tabs.Content value="password" class="">
					<MultipleFileUpload />
				</Tabs.Content>
			</Tabs.Root>
		</div>
	</div>
</aside>
