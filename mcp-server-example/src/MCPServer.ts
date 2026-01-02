import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { getCurrentPrice, get24hPriceChangePercent, getTools } from "./BinanceTools.js";

const server = new Server({
    name: "binance-mcp-server",
    version: "1.0.0"
}, {
    capabilities: {
        tools: {}
    }
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: getTools() };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
        case "getCurrentPrice": return getCurrentPrice(args);
        case "get24hPriceChangePercent": return get24hPriceChangePercent(args);
        default: throw new Error(`Tool desconhecida: ${name}`);
    }
});

export default server;