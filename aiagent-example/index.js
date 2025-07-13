import "dotenv/config";

import axios from "axios";
import { Agent, tool, run } from '@openai/agents';
import { z } from 'zod';

const API_URL = `http://localhost:${process.env.PORT}`;

const getCustomersTool = tool({
    name: 'get_customers',
    description: 'Obtém a lista de clientes do sistema CRM',
    parameters: {
        type: "object",
        properties: {},
        additionalProperties: false,
    },
    async execute({ }) {
        const response = await axios.get(`${API_URL}/customers`)
        return response.data;
    },
});

const getCustomerTool = tool({
    name: 'get_customer',
    description: 'Obtém os detalhes de um cliente por id no banco de dados do sistema CRM',
    parameters: z.object({ id: z.number() }),
    async execute({ id }) {
        const response = await axios.get(`${API_URL}/customers/${id}`)
        return response.data;
    },
});

const addCustomerTool = tool({
    name: 'add_customer',
    description: 'Adiciona um novo cliente no sistema CRM',
    parameters: z.object({ name: z.string(), age: z.number(), uf: z.string() }),
    async execute(customer) {
        const response = await axios.post(`${API_URL}/customers`, customer)
        return response.data;
    },
});

const crmAssistant = new Agent({
    name: 'CRM Assistant',
    model: "gpt-4.1-nano",
    instructions: 'Você é um assistente de sistema CRM, ajudando o usuário a lidar com a gestão dos clientes.',
    tools: [getCustomersTool, addCustomerTool, getCustomerTool]
});

const result = await run(
    crmAssistant,
    'Me informe qual é a capital da UF do cliente mais velho da base',
);
console.log(result.finalOutput);