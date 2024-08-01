<script lang="ts">
	import type { JSONField } from '$lib/types';
	import { CircleX } from 'lucide-svelte';
    import { Plus } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	export let field: JSONField;
	export let isArrayItem = false;

	const dispatch = createEventDispatcher();

	function updateField(updates: Partial<JSONField>) {
		dispatch('updateField', updates);
	}

	function removeField() {
		dispatch('removeField');
	}

	function addSubField() {
		dispatch('addField');
	}

	$: isComplex = field.type === 'object' || field.type === 'array';
</script>

<div class="field" style:margin-left={isArrayItem ? '1rem' : '0'}>
	<button
		type="button"
		on:click={removeField}
	>
		<CircleX size="1rem" color="red" />
	</button>
	{#if !isArrayItem}
		<input
			class="border p-2"
			bind:value={field.key}
			placeholder="Key"
			on:input={() => updateField({ key: field.key })}
		/>
	{/if}
	<select bind:value={field.type} on:change={() => updateField({ type: field.type })}>
		<option value="string">String</option>
		<option value="number">Number</option>
		<option value="boolean">Boolean</option>
		<option value="null">Null</option>
		<option value="object">Object</option>
		<option value="array">Array</option>
	</select>
	{#if field.type === 'string' || field.type === 'number' || field.type === 'boolean' || field.type === 'null'}
		<input
			hidden
			type="text"
			value={field.type}
			on:load={() => updateField({ value: field.type })}
			on:input={() => updateField({ value: field.type })}
		/>
	{:else if isComplex}
		<button type="button" on:click={addSubField}><Plus /></button>
	{/if}
</div>
{#if isComplex && field.children}
	<div class="nested border-l" >
		{#each field.children as childField (childField.id)}
			<svelte:self
				field={childField}
				isArrayItem={false}
				on:updateField={({ detail }) =>
					dispatch('updateField', {
						children: field.children?.map((f) => (f.id === childField.id ? { ...f, ...detail } : f))
					})}
				on:removeField={() =>
					dispatch('updateField', {
						children: field.children?.filter((f) => f.id !== childField.id)
					})}
				on:addField={() =>
					dispatch('updateField', {
						children: [
							...(field.children || []),
							{ id: Math.random().toString(36).substr(2, 9), key: '', type: 'string', value: '' }
						]
					})}
			/>
		{/each}
	</div>
{/if}

<style>
	.field {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		margin-bottom: 0.5rem;
	}
	.nested {
		margin-left: 2rem;
	}
	input,
	select {
		padding: 0.25rem;
	}
	button {
		padding: 0.25rem 0.5rem;
	}
</style>
