import { createApiClient } from "./client.js";
import { createFactsService } from "./services/FactsService.js";
import { createQuotesService } from "./services/QuotesService.js";
import type { FactsService } from "./services/FactsService.js";
import type { QuotesService } from "./services/QuotesService.js";

export type ApiNinjas = {
	facts: FactsService;
	quotes: QuotesService;
};

export const createApiNinjas = (apiKey: string): ApiNinjas => {
	const request = createApiClient(apiKey);

	return {
		facts: createFactsService(request),
		quotes: createQuotesService(request)
	};
};
