import axios from "axios";

interface Binance24hTicker {
    symbol: string;
    lastPrice: string;
    priceChangePercent: string;
}

export async function fetch24hTicker(symbol: string): Promise<Binance24hTicker> {
    const response = await axios.get<Binance24hTicker>(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
    return response.data;
}