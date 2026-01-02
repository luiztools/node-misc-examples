import { z } from "zod";
import { fetch24hTicker } from "./BinanceService.js";

const SymbolSchema = z.object({
    symbol: z.string().describe("Par de negociação (ex: BTCUSDT)")
});

export async function getCurrentPrice(args: any) {
    const { symbol } = SymbolSchema.parse(args);
    const data = await fetch24hTicker(symbol.toUpperCase());

    return {
        content: [
            {
                type: "text",
                text: `O preço atual do par ${data.symbol} é ${data.lastPrice}`
            }
        ]
    };
}

export async function get24hPriceChangePercent(args: any) {
    const { symbol } = SymbolSchema.parse(args);
    const data = await fetch24hTicker(symbol.toUpperCase());

    return {
        content: [
            {
                type: "text",
                text: `A variação percentual nas últimas 24h para ${data.symbol} é ${data.priceChangePercent}%`
            }
        ]
    };
}

export function getTools() {
    return [
        {
            name: "getCurrentPrice",
            description: "Retorna o preço atual de um par de moedas na Binance",
            inputSchema: SymbolSchema
        },
        {
            name: "get24hPriceChangePercent",
            description: "Retorna a variação percentual nas últimas 24h",
            inputSchema: SymbolSchema
        }
    ]
}