/**
 * Takes the output from the prompt(as md) and processes it into a JSON object removing the ```json``` code block
 * @param output {string}
 * @returns {Object} JSON object
 * @example
 * ```json
 * {
 *    "key": "value"
 * }
 * ```
 * returns {
 *   "key": "value"
 * }
 */

export default function ProcessOutput(output: string): Object {
    const match = RegExp(/```json([\s\S]*)```/).exec(output);
    const text = match ? match[1] : '';
    return JSON.parse(text.trim());
}