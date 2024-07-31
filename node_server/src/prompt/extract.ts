import { model } from "../utils/genAI";

export async function extractDataFromDocument(
  document: string,
  ouput: string | Object | null = null,
): Promise<string> {
  console.log("Extracting data from document...");
  console.log("Output type: ", ouput);

  const prompt = `
        ${ouput == null
      ? "Analyze the following document and extract key information in JSON format."
      : `
        Analyze the following document and extract key information in JSON format. Do not change the keys names or form  extract only what you are asked to.
        and null values should be assigned to keys that are not found in the document.
        `
    }
        You are a data extraction model. You are to get important information from any document given to you.

        and format the document into a JSON of type ${ouput == null
      ? `{
            "key": "value"
            }`
      : `
            ${ouput}
            `
    }
        ensure correct types are used for the values.

        Document:
        ${document}

        Output the extracted data in valid JSON format.
    `;
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.log("Error extracting data from document: ", error);
    return "";
  }
}