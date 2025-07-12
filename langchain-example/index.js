import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    model: "gpt-4.1-nano",
    verbose: false
});

//simple example
//const response = await model.invoke("Hello");
//console.log(response.content);
//console.log(response);

//prompt template example
import { ChatPromptTemplate } from "@langchain/core/prompts";

const chatPrompt = ChatPromptTemplate.fromMessages([
  ["system", "Você é um comediante que conta piadas para crianças."],
  ["user", "Conte uma piada sobre {topic}"],
]);

const chain = chatPrompt.pipe(model);
const response = await chain.stream({
    topic: "galinha"
})

for await (const chunk of response) { console.log(chunk.content); }
