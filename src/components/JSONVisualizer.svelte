<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Table from '$lib/components/ui/table/index.js';
	import SjsonView from './SJSONView.svelte';

	type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

	export let data: JSONValue;

	function isObject(item: unknown): item is Record<string, unknown> {
		return item !== null && typeof item === 'object' && !Array.isArray(item);
	}

	function isArrayOfObjects(arr: unknown): arr is Record<string, unknown>[] {
		return Array.isArray(arr) && arr.length > 0 && isObject(arr[0]);
	}

	let drawerOpen: number | null = null;
	let dropdownopen = false;
	function handleDrawer(index: number) {
		if (!dropdownopen) {
			drawerOpen = index;
		} else {
			drawerOpen = null;
		}
	}
</script>

<div class="json-visualizer">
	{#if Array.isArray(data)}
		{#if isArrayOfObjects(data)}
			<Table.Root class="bg-white rounded">
				<Table.Header>
					<Table.Row>
						{#each Object.keys(data[0]) as key}
							<Table.Head>{key}</Table.Head>
							{/each}
							<Table.Head>More</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data as item, index}
						<Sheet.Root open={drawerOpen == index} onOutsideClick={() => (drawerOpen = null)}>
							<Sheet.Trigger asChild>
								<Table.Row class="hover:bg-blue-200" >
									{#each Object.values(item) as value}
										<Table.Cell class="p-2">
											{#if isObject(value) || Array.isArray(value)}
												<DropdownMenu.Root onOutsideClick={() => (dropdownopen = false)}>
													<DropdownMenu.Trigger on:click={() => (dropdownopen = !dropdownopen)}>
														<Button variant="outline">Open</Button>
													</DropdownMenu.Trigger>
													<DropdownMenu.Content class="w-max">
														<DropdownMenu.Label>Dropdown</DropdownMenu.Label>
														<DropdownMenu.Separator />
														<svelte:self data={value} />
													</DropdownMenu.Content>
												</DropdownMenu.Root>
											{:else}
												{value}
											{/if}
										</Table.Cell>
									{/each}
									<Table.Cell>
										<Button class='p-2' variant="ghost" on:click={() => handleDrawer(index)}>
											Details
										</Button>
									</Table.Cell>
								</Table.Row>
							</Sheet.Trigger>
							<Sheet.Content side="right" class="!min-w-[600px] overflow-y-scroll overflow-x-hidden">
								<SjsonView data={item} />
							</Sheet.Content>
						</Sheet.Root>
					{/each}
				</Table.Body>
			</Table.Root>
		{:else}
			<ul>
				{#each data as item}
					<li>
						{#if isObject(item) || Array.isArray(item)}
							<svelte:self data={item} />
						{:else}
							{item}
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	{:else if isObject(data)}
		<table>
			<tbody>
				{#each Object.entries(data) as [key, value]}
					<tr>
						<th>{key}</th>
						<td>
							{#if isObject(value) || Array.isArray(value)}
								<DropdownMenu.Root>
									<DropdownMenu.Trigger asChild let:builder>
										<Button variant="outline" builders={[builder]}>Open</Button>
									</DropdownMenu.Trigger>
									<DropdownMenu.Content class="w-56">
										<DropdownMenu.Label>Dropdown</DropdownMenu.Label>
										<DropdownMenu.Separator />
										<svelte:self data={value} />
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							{:else}
								{value}
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		{data}
	{/if}
</div>

<style>
	.json-visualizer {
		font-family: Arial, sans-serif;
		margin-bottom: 1em;
	}
	table {
		border-collapse: collapse;
		width: 100%;
	}
	th,
	td {
		border: 1px solid #ddd;
		padding: 8px;
		text-align: left;
	}
	th {
		background-color: #f2f2f2;
	}
	ul {
		list-style-type: none;
		padding-left: 20px;
	}
</style>
