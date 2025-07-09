require("dotenv").config();

const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function start() {
    const model = "gpt-4.1-nano";
    const message1 = "Me escreva uma função que ordene um array recebido usando quicksort";
    console.log(message1);
    const response1 = await client.responses.create({
        model,
        instructions: "Você é um assistente de código, especializado em JavaScript",
        input: message1,
    });

    console.log(response1.output_text);

    const message2 = "Converta exatamente este código que me passou para TypeScript";
    console.log(message2);
    const response2 = await client.responses.create({
        model,
        previous_response_id: response1.id,
        input: message2,
    });
    console.log(response2.output_text);
}

start();

