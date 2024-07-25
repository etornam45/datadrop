<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import Plus from '$lib/components/icons/plus.svelte';
	import Rule from './Rule.svelte';
	import { createRule } from '$lib/api';
	import { jsonStructure } from '$lib/store';
	import { generateJSON } from '$lib/utils';

	let ruleName = '';

	async function saveRule() {
		await createRule(ruleName, JSON.stringify(generateJSON($jsonStructure)));
	}
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<button class="text-white p-0 rounded-[6px]">
			<Plus width="1.5rem" height="1.5rem" />
		</button>
	</Dialog.Trigger>
	<Dialog.Content class="shadow-none bg-[#D9D9D9] h-max">
		<Dialog.Header>
			<Dialog.Title>Create a new rules</Dialog.Title>
			<Dialog.Description class="text-slate-600">
				Rules define the structure for extracting data from documents
			</Dialog.Description>
		</Dialog.Header>
		<div class="h-max">
			<input
				bind:value={ruleName}
				type="text"
				placeholder="Rule Name"
				class="w-full p-3 my-3 bg-[#F9F5F5] rounded-[8px]"
			/>
			<Rule />
			<button on:click={saveRule}  class="w-full p-3 bg-[#6B4A38] text-white rounded-[8px] mt-3">Save</button>
		</div>
	</Dialog.Content>
</Dialog.Root>
