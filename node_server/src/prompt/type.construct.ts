export function convertJsonToTypeOf(json: Record<string, any>): Record<string, string> {
    const result: Record<string, string> = {};

    for (const [key, value] of Object.entries(json)) {
        result[key] = getDetailedType(value);
    }

    return result;
}

function getDetailedType(value: any): string {
    if (Array.isArray(value)) {
        if (value.length === 0) return "any[]";
        const elementType = getDetailedType(value[0]);
        return `${elementType}[]`;
    } else if (typeof value === "object" && value !== null) {
        const nestedTypes = convertJsonToTypeOf(value);
        return `{ ${Object.entries(nestedTypes)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ")} }`;
    } else {
        return typeof value;
    }
}