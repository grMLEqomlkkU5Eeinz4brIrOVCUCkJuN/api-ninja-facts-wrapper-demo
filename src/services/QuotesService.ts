import type { ApiRequestFunction } from "../client.js";
import type { QuoteResponse } from "../types/Quotes.js";

export type QuotesService = {
	getQuotes: (category?: string) => Promise<QuoteResponse>;
};

export const createQuotesService = (request: ApiRequestFunction): QuotesService => ({
	getQuotes: async (category?: string): Promise<QuoteResponse> => {
		return await request<QuoteResponse>("/quotes", category === undefined ? {} : { params: { category } });
	}
});
