import type { ApiRequestFunction } from "../client.js";
import type { FactResponse } from "../types/Facts.js";

export type FactsService = {
	getFacts: (limit?: number) => Promise<FactResponse>;
	getFactOfTheDay: () => Promise<FactResponse>; // yes it returns 1 fact but it is still in an array
};

export const createFactsService = (request: ApiRequestFunction): FactsService => ({
	getFacts: async (limit?: number): Promise<FactResponse> => {
		return await request<FactResponse>("/facts", limit === undefined ? {} : { params: { limit } });
	},
	getFactOfTheDay: async (): Promise<FactResponse> => {
		return await request<FactResponse>("/factoftheday");
	}
});
