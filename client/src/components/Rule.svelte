<script lang="ts">
	import FieldComponent from './FieldComponent.svelte';
	import type { JSONField, JSONValue } from '$lib/types';
	import { jsonStructure } from '$lib/store';
	import Button from '$lib/components/ui/button/button.svelte';

	function generateId() {
		return Math.random().toString(36).substr(2, 9);
	}

	function addField(parentField?: JSONField) {
		const newField: JSONField = { id: generateId(), key: '', type: 'string', value: '' };
		if (parentField) {
			parentField.children = parentField.children || [];
			parentField.children.push(newField);
		} else {
			jsonStructure.update((structure) => [...structure, newField]);
		}
		jsonStructure.update((s) => s);
	}

	function removeField(fieldId: string, parentField?: JSONField) {
		if (parentField) {
			parentField.children = parentField.children?.filter((f) => f.id !== fieldId);
		} else {
			jsonStructure.update((structure) => structure.filter((f) => f.id !== fieldId));
		}
		jsonStructure.update((s) => s);
	}

	function updateField(fieldId: string, updates: Partial<JSONField>, parentField?: JSONField) {
		const updateFieldRecursive = (fields: JSONField[]): JSONField[] => {
			return fields.map((field) => {
				if (field.id === fieldId) {
					const updatedField = { ...field, ...updates };
					if (updates.type) {
						updatedField.value = getDefaultValueForType(updates.type);
						if (updates.type === 'object' || updates.type === 'array') {
							updatedField.children = updatedField.children || [];
						} else {
							updatedField.children = undefined;
						}
					}
					return updatedField;
				}
				if (field.children) {
					return { ...field, children: updateFieldRecursive(field.children) };
				}
				return field;
			});
		};

		if (parentField) {
			parentField.children = updateFieldRecursive(parentField.children || []);
		} else {
			jsonStructure.update((structure) => updateFieldRecursive(structure));
		}
	}

	function getDefaultValueForType(type: JSONField['type']): JSONValue {
		switch (type) {
			case 'string':
				return 'sting';
			case 'number':
				return 'number';
			case 'boolean':
				return false;
			case 'null':
				return null;
			case 'object':
				return {};
			case 'array':
				return [];
		}
	}
</script>

<div class="h-full flex-1 flex-col justify-between items-center">
	<form
		class="w-full max-h-[530px] overflow-y-scroll overflow-x-hidden p-2 border h-full rounded-lg"
	>
		{#each $jsonStructure as field (field.id)}
			<FieldComponent
				{field}
				on:updateField={({ detail }) => updateField(field.id, detail)}
				on:removeField={() => removeField(field.id)}
				on:addField={() => addField(field)}
			/>
		{/each}
		<Button type="button" class="bg-[#6B4A38] text-white p-2" on:click={() => addField()}
			>Add Field</Button
		>
	</form>
</div>

<style>
	form {
		display: flex;
		flex-direction: column;
		/* gap: 1rem; */
	}
</style>
