import axios from 'axios';
import type { GetProject, Project } from './types';
import { projectListing, Rules } from './store';

const api = axios.create({
	baseURL: 'http://localhost:3000',
	withCredentials: true
});

export const createProject = async (project: Project, userId: string) => {
	return api
		.post('/project/create', { ...project, userId })
		.then((res) => res.data)
		.catch((err) => {
			throw new Error(err.response.data.message);
		});
};

export const getProjects = async (): Promise<GetProject[]> => {
	return api.get('/project').then((res) => {
		projectListing.set(res.data.reverse());
		return res.data;
	});
};

export const deleteProject = async (id: string) => {
	return api.delete(`/project/delete/${id}`).then((res) => res.data);
};

// RULES

export const getRules = async () => {
	return api.get('/rule').then((res) => {
		Rules.set(res.data);
		return res.data;
	});
};

export const createRule = async (name: string, value: any) => {
	return api.post('/rule/create', {name, value}).then((res) => res.data);
};
