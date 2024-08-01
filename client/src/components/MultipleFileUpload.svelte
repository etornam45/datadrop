<script lang="ts">
	import { onMount } from 'svelte';
	import { api } from '$lib';
	import { compressFile, generateJSON } from '$lib/utils';
	import axios from 'axios';
	import { activeProject , activeRule, dataProcessing, extractedData, jsonStructure, selectedrule } from '$lib/store';
	import Button from '$lib/components/ui/button/button.svelte';
	let dragActive = false;
	let files: File[] | null = null;

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

	async function uploadFiles(url: string, files: File[]): Promise<void> {

		if (!activeProject) {
			displayMessage('No project selected', true);
			dataProcessing.set(null);
			return;
		}

		if (!activeRule) {
			displayMessage('No rule selected', true);
			dataProcessing.set(null);
			return;
		}

		try {
			const formData = new FormData();
			dataProcessing.set('compressing');
			await Promise.all(
				files.map(async (file) => {
					const compressedBlob = await compressFile(file);
					formData.append('files', compressedBlob, file.name);
				})
			);
			dataProcessing.set('exracting');
			const response = await axios.post(url, formData, {
				withCredentials: true,
				headers: {
					'Content-Type': 'multipart/form-data',
					userId: user.id,
					projectId: $activeProject.id,
					rule: $activeRule.value
				}
			});

			console.log($selectedrule ? $selectedrule : JSON.stringify(generateJSON($jsonStructure)));
			extractedData.set(response.data);
			displayMessage(response.data);
		} catch (error) {
			console.log('Error:', error);
			displayMessage(`Upload failed: ${error}`, true);
		}
		dataProcessing.set(null);
	}

	function displayMessage(msg: string, error = false): void {
		// message = msg;
		// isError = error;
	}

	function handleUpload(e: Event): void {
		e.preventDefault();
		console.log("Multiple files uploading....");
		dataProcessing.set('exracting');
		if (files) {
			uploadFiles('http://localhost:3000/upload_files', files);
		}
	}

	function handleDragOver(e: DragEvent): void {
		e.preventDefault();
		dragActive = true;
	}

	function handleDrop(e: DragEvent): void {
		e.preventDefault();
		dragActive = false;
		files = Array.from(e.dataTransfer?.files || []);
	}

	function handleDragLeave(e: DragEvent): void {
		e.preventDefault();
		dragActive = false;
	}

	function handleFile(e: Event): void {
		const target = e.target as HTMLInputElement;
		if (target instanceof HTMLInputElement) {
			files = Array.from(target.files || []);
		}
	}
</script>

<form
	id="multiple-file-upload"
	on:submit={handleUpload}
	on:dragover={handleDragOver}
	on:drop={handleDrop}
	on:dragleave={handleDragLeave}
>
	<input hidden id="multiple-file" type="file" multiple on:change={handleFile} />

	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<label
		for="multiple-file"
		class="drag-area"
		class:active={dragActive}
		on:dragover={handleDragOver}
		on:dragleave={handleDragLeave}
		on:drop={handleDrop}
	>
		{#if dragActive}
			<p>Drop files here</p>
		{:else if files && files.length > 0}
			{#each files.slice(0, 2) as file}
				<p>{file.name}</p>
			{/each}
		{:else}
			<p>Drag and drop files here or click to select</p>
		{/if}
	</label>

	<Button
		class="bg-[#6ad0ae] text-white p-2 w-full mt-4 hover:bg-[#6ad0ae]/30 hover:text-white"
		disabled={!files ||
			files.length === 0 ||
			$dataProcessing == 'compressing' ||
			$dataProcessing == 'exracting'}
		type="submit"
		>Upload
		{#if files && files?.length >= 0}
			{#if $dataProcessing == 'compressing'}
				Compressing...
			{:else if $dataProcessing == 'exracting'}
				Extracting...
			{:else}
				Files
			{/if}
		{:else}
			Files
		{/if}
	</Button>
</form>

<style>
	.drag-area {
		display: flex;
		border: 2px dashed #6ad0b0;
		padding: 20px;
		text-align: center;
		transition: background-color 0.3s;
		height: 130px;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
	}
	.drag-area.active {
		background-color: #f0f0f0;
	}
</style>
