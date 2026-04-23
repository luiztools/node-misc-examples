import "dotenv/config";
import fs from "fs";
import readline from "node:readline/promises";
import pdf from "pdf-parse";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

const PDF_PATH = "file.pdf";

//tamanho do bloco de informação em caracteres, para entender contexto. Chunk grande = menor coerência, chunk pequeno = mais coerente, mas mais lento. O ideal é testar entre 500 e 1500 caracteres. O modelo gpt-4-mini tem limite de 8192 tokens, então 1200 caracteres é um bom ponto de partida para garantir que o contexto caiba na resposta.
const CHUNK_SIZE = 1200;

//número de caracteres que podem ser repetidos entre os chunks, para evitar que informações importantes sejam cortadas. O ideal é testar entre 100 e 300 caracteres. Com 200 caracteres de overlap, garantimos que o modelo tenha acesso a informações cruciais que possam estar no limite entre dois chunks.
const CHUNK_OVERLAP = 200;

//quantidade de chunks mais relevantes a serem usados como contexto para a resposta. O ideal é testar entre 3 e 5 chunks. Com TOP_K = 4, conseguimos um bom equilíbrio entre fornecer contexto suficiente e evitar sobrecarregar o modelo com informações irrelevantes.
const TOP_K = 4;

async function loadPdfText(pdfPath) {
  const pdfBuffer = fs.readFileSync(pdfPath);
  const parsed = await pdf(pdfBuffer);
  return parsed.text || "";
}

async function buildContext(question, retriever) {
  const docs = await retriever.invoke(question);

  return docs
    .map((doc, i) => `[Trecho ${i + 1}]\n${doc.pageContent}`)
    .join("\n\n");
}

async function answerQuestion(question, retriever, model) {
  const context = await buildContext(question, retriever);

  const response = await model.invoke([
    {
      role: "system",
      content:
        "Voce eh um assistente de RAG. Responda apenas com base no contexto recuperado. Se nao houver informacao suficiente, diga claramente que nao encontrou no PDF."
    },
    {
      role: "user",
      content: `Pergunta: ${question}\n\nContexto recuperado do PDF:\n${context}`
    }
  ]);

  console.log("Pergunta:", question);
  console.log("\nResposta:\n", response.content);
}

const pdfText = await loadPdfText(PDF_PATH);
const splitter = new RecursiveCharacterTextSplitter({ chunkSize: CHUNK_SIZE, chunkOverlap: CHUNK_OVERLAP });
const chunks = await splitter.splitText(pdfText);

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",//modelo para gerar os embeddings dos chunks e da pergunta
  openAIApiKey: process.env.OPENAI_API_KEY
});

const vectorStore = await MemoryVectorStore.fromTexts(chunks, chunks.map(() => ({})), embeddings);
const retriever = vectorStore.asRetriever(TOP_K);

const model = new ChatOpenAI({
  model: "gpt-4.1-mini",//modelo para a resposta final
  temperature: 0,//temperatura 0 para respostas mais objetivas e baseadas no contexto, sem criatividade adicional
  openAIApiKey: process.env.OPENAI_API_KEY
});

console.log("PDF carregado e indexado. Digite sua pergunta (ou 'sair' para encerrar).\n");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

try {
  while (true) {
    const question = (await rl.question("Pergunta> ")).trim();

    if (!question) {
      continue;
    }

    const normalized = question.toLowerCase();
    if (normalized === "sair" || normalized === "exit" || normalized === "quit") {
      break;
    }

    await answerQuestion(question, retriever, model);
    console.log("\n---\n");
  }
} finally {
  rl.close();
}
