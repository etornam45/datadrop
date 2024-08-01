# Cerebrum
Cerebrum is a robust document understanding model designed to extract, interpret, and analyze data from documents, and export the results in XLS and JSON formats.

## Table of Contents
- [Overview]
   The Challenge
   Features
   Links
- [Process]
    Dataset
    Deployment
    Technologies Used
    Data Preprocessing
    Model Finetuning 
    Deployment
    - Starting the frontend
    Future Development
- [Resources]
- [Author]

## Overview
### The Challenge
The primary challenge addressed by Cerebrum is the efficient extraction and interpretation of data from various document formats. This model aims to streamline data extraction processes, reducing manual effort and improving accuracy.

### Features

Data Extraction: Extracts structured data from unstructured documents.
Data Interpretation: Analyzes and understands the context of the extracted data.
Data Analysis: Provides insights and summaries based on the extracted data.
Export Capabilities: Exports results in XLS and JSON formats for easy integration with other tools.
Scalability: Handles large volumes of documents efficiently.

## Process

### Dataset
Alpaca dataset publicly available on huggingface
    [Alpaca dataset](https://huggingface.co/datasets/tatsu-lab/alpaca)
The dataset helps finetune the nlp model to follow instructions  
   
### Data Preprocessing
- OCR Processing: Convert scanned images to text using Optical Character Recognition (OCR).
- Text Cleaning: Remove noise and irrelevant information from the text.

### Model Finetuning 
We fintuned Llama3.1 8B on the alpaca dataset and quantized it into gguf fromat

[FINETUNED MODEL](https://huggingface.co/etornam/flash)


### Deployment
> NOTE: This code cannot be executed without the appropriate environment variables
> We might provide a docker image to help test the code 

```bash
DATABASE_URL="file:./db/dev.db" please do not change this variable 
GOOGLE_API_KEY="a google api key"

LLAMA_CLOUD_API_KEY="Llama cloud"
PINECONE_API_KEY="pinconedb"
ENCRYPTION_KEY="an encryption key"
```

cd into the node_server folder and run 
```bash
$ npm run decrypt
$ npm install

$ npx prisma db push

$ npm run dev or build

// if you build then run

$ npm run start
```

The above instruction will help run the backend server

### Starting the frontend 
cd into the client folder
```bash
$ npm install
$ npm run dev or build

// if you build then run

$ npm run preview
```

### Technologies Used
- Programming Languages: Python, JavaScript
- Frameworks: Express, Svelte, etc
- Tools: Docker, SQLite, Pinecone

## Future Development
- Enhanced Data Interpretation: Improve the model's ability to understand complex document structures.
- Additional Export Formats: Support more export formats (e.g., CSV, XML).
- User Interface: improve on user-interface for  physicaally challenged users.
- Integration with Other Systems: Enable seamless integration with enterprise systems.

## Authors
- Benjamin Etornam - Github profile [https://github.com/etornam45] 
- Bright Alour - Github profile [https://github.com/coralearl] 
- Dotse Kenneth - Github profile [https://github.com/Kennethdotse] 
