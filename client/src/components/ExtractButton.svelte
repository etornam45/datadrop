<script lang="ts">
	import { onMount } from 'svelte';
	import * as XLSX from 'xlsx';
	import { saveAs } from 'file-saver';
	import { extractedData } from '$lib/store';

	let jsonData: string = ''; // Initialize with your sample data
	let selectedFormat: 'xlsx' | 'csv' | 'json' = 'xlsx';

	function handleConvert() {
		try {
			const data = $extractedData!;

			switch (selectedFormat) {
				case 'xlsx':
					convertToExcel(data);
					break;
				case 'csv':
					convertToCSV(data);
					break;
				case 'json':
					convertToJSON(data);
					break;
			}
		} catch (error) {
			console.error('Error converting data:', error);
			alert('Error converting data. Please check your JSON input and console for details.');
		}
	}

	function convertToExcel(data: any[]) {
		const workbook = XLSX.utils.book_new();

		// Process main data
		const mainSheet = XLSX.utils.json_to_sheet(
			data.map((item) => {
				const flatItem = { ...item };
				for (const key in flatItem) {
					if (typeof flatItem[key] === 'object') {
						flatItem[key] = JSON.stringify(flatItem[key]);
					}
				}
				return flatItem;
			})
		);
		XLSX.utils.book_append_sheet(workbook, mainSheet, 'Main Data');

		// Process nested arrays and objects
		data.forEach((item, index) => {
			for (const key in item) {
				if (Array.isArray(item[key])) {
					const sheetName = `${key}_${index + 1}`;
					const sheet = XLSX.utils.json_to_sheet(item[key]);
					XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
				} else if (typeof item[key] === 'object' && item[key] !== null) {
					const sheetName = `${key}_${index + 1}`;
					const sheet = XLSX.utils.json_to_sheet([item[key]]);
					XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
				}
			}
		});

		// Generate Excel file
		const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
		const blob = new Blob([excelBuffer], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		});
		saveAs(blob, 'output.xlsx');
	}

	function convertToCSV(data: any[]) {
		const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(data));
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		saveAs(blob, 'output.csv');
	}

	function convertToJSON(data: any[]) {
		const jsonString = JSON.stringify(data, null, 2);
		const blob = new Blob([jsonString], { type: 'application/json' });
		saveAs(blob, 'output.json');
	}

	onMount(() => {
		// Any initialization code can go here
	});
</script>

<div class="p-4 flex items-center gap-4">
	<div class="">
		<label class="mr-2">Select output format:</label>
		<select bind:value={selectedFormat} class="p-2 border rounded">
			<option value="xlsx">Excel (.xlsx)</option>
			<option value="csv">CSV</option>
			<option value="json">JSON</option>
		</select>
	</div>
	<button
		class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
		on:click={handleConvert}
	>
		Convert
	</button>
</div>
