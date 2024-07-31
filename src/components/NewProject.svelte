<script lang="ts">
	import { createProject, getProjects } from '$lib/api';
	import Plus from '$lib/components/icons/plus.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { user } from '$lib/store';
	import type { Project } from '$lib/types';

	const project: Project = {
		name: '',
		description: ''
	};

	let loading = false;
	let open = false;

	$: console.log(open);

	const handleCreate = async () => {
		loading = true;
		await createProject(project, $user!.id!);
		loading = false;
		open = false;
		await getProjects();
	};
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<button class="text-white p-0 rounded-[6px]">
			<Plus width="1.5rem" height="1.5rem" />
		</button>
	</Dialog.Trigger>
	<Dialog.Content class="shadow-none bg-[#D9D9D9]">
		<Dialog.Header>
			<Dialog.Title>Create a new project</Dialog.Title>
			<Dialog.Description class="text-slate-600">
				Projects are used to organize your work. You can create multiple projects
			</Dialog.Description>
		</Dialog.Header>
		<div>
			<input
				bind:value={project.name}
				type="text"
				placeholder="Project Name"
				class="w-full p-3 my-3 bg-[#F9F5F5] rounded-[8px]"
			/>
			<input
				bind:value={project.description}
				type="text"
				placeholder="Description"
				class="w-full p-3 bg-[#F9F5F5] rounded-[8px]"
			/>
			<button
				disabled={loading}
				on:click={handleCreate}
				class="w-full p-3 bg-[#6B4A38] text-white rounded-[8px] mt-3">Create</button
			>
		</div>
	</Dialog.Content>
</Dialog.Root>
