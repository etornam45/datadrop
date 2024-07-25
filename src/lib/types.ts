export type JSONPrimitive = string | number | boolean | null;
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type JSONObject = { [key: string]: JSONValue };
export type JSONArray = JSONValue[];

export interface JSONField {
	id: string;
	key: string;
	type: 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array';
	value: JSONValue;
	children?: JSONField[];
}

export interface Rule {
	id: string;
	name: string;
	userId: string;
	value: string;
}

export interface Project {
	name: string;
	description: string;
}

export interface GetProject {
	id: string;
	name: string;
	description: string | null;
	ownerId: string;
	tables: string | null;
}
