<script lang="ts">
	import { onMount } from 'svelte';
	import axios from 'axios';
	import { compressFile, generateJSON } from '$lib/utils';
	import { api } from '$lib';
	import { jsonStructure, extractedData, dataProcessing, selectedrule, activeProject, activeRule } from '$lib/store';
	import { Button } from '$lib/components/ui/button';

	let dragActive = false;
	let file: File | null = null;

	let user: {
		id: string;
		name: string;
		email: string;
		password: string;
	};

	onMount(() => {
		api.get('/user/profile', { withCredentials: true }).then((response) => {
			user = response.data;
		});
	});

	async function uploadFile(url: string, file: File): Promise<void> {

		if (!$activeProject) {
			alert('Please select a project');
			dataProcessing.set(null);
			return;
		}

		if (!$activeRule) {
			alert('Please select a rule');
			dataProcessing.set(null);
			return;
		}

		if (!$activeProject && !$activeRule) {
			alert('Please select a project and a rule');
			return;
		}

		try {
			const formData = new FormData();
			dataProcessing.set('compressing');
			const compressedBlob = await compressFile(file);
			dataProcessing.set('exracting');
			formData.append('file', compressedBlob, file.name);

			const response = await axios.post(url, formData, {
				withCredentials: true,
				headers: {
					'Content-Type': 'multipart/form-data',
					userId: user.id,
					projectId: $activeProject.id,
					rule: $activeRule.value,
				}
			});

			extractedData.set(response.data);
		} catch (error) {
			console.error('Error:', error);
		}
		dataProcessing.set(null);
	}

	function handleUpload(e: Event): void {
		dataProcessing.set('exracting');
		e.preventDefault();
		if (file) {
			uploadFile('http://localhost:3000/upload_file', file);
		}
	}

	function handleDragOver(e: DragEvent): void {
		e.preventDefault();
		dragActive = true;
	}

	function handleDragLeave(e: DragEvent): void {
		e.preventDefault();
		dragActive = false;
	}

	function handleDrop(e: DragEvent): void {
		e.preventDefault();
		dragActive = false;
		if (e.dataTransfer && e.dataTransfer.files.length > 0) {
			file = e.dataTransfer.files[0];
		}
	}

	function handleFile(e: Event): void {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			file = target.files[0];
		}
	}
</script>

<form id="singleUploadForm" on:submit={handleUpload} class="">
	<input class="hidden" hidden type="file" id="singleFile" on:change={handleFile} />
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label
		for="singleFile"
		class="drag-area"
		class:active={dragActive}
		on:dragover={handleDragOver}
		on:dragleave={handleDragLeave}
		on:drop={handleDrop}
	>
		{#if file}
			<p>{file.name}</p>
		{:else}
			<p>Drag and drop a file here or click to select</p>
		{/if}
	</label>
	<Button
		class="bg-[#6ad0ae] text-white p-2 w-full mt-4 hover:bg-[#6ad0ae]/30 hover:text-white"
		disabled={!file || !$dataProcessing == null}
		type="submit"
	>
		{#if $dataProcessing == 'compressing'}
			Compressing...
		{:else if $dataProcessing == 'exracting'}
			Extracting...
		{:else}
			Upload Single File
		{/if}
	</Button>
</form>

<style>
	.drag-area {
		display: flex;
		border: 2px dashed #6ad0b7;
		padding: 20px;
		text-align: center;
		transition: background-color 0.3s;
		height: 130px;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
	}
	.drag-area.active {
		background-color: #6ad0ac;
	}
</style>
