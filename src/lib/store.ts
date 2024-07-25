import { writable } from 'svelte/store';
import type { GetProject, JSONArray, JSONField, JSONValue, Rule } from './types';

export const jsonStructure = writable<JSONField[]>([]);
export const user = writable<{
	name: string;
	email: string;
	id: string;
} | null>(null);

export const extractedData = writable<JSONArray | Record<string, JSONValue> | null>(null);

export const dataProcessing = writable<'compressing' | 'exracting' | null>(null);

export const selectedrule = writable<string>('');


// PROJECT
export const projectListing = writable<GetProject[]>();

export const activeProject = writable<GetProject>();

export function setActiveProject(project: GetProject) {
	activeProject.set(project);
}

// RULE
export const Rules = writable<Rule[]>();
export const activeRule = writable<Rule>();