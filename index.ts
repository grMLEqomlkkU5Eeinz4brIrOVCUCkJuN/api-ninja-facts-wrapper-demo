// The `.js` extension is required: under `nodenext` resolution the specifier
// must match the emitted file, not the `.ts` source.

export { createApiNinjas } from "./src/index.js";
export { createApiClient, BASE_API_URL } from "./src/client.js";
export { createFactsService } from "./src/services/FactsService.js";
export { createQuotesService } from "./src/services/QuotesService.js";
export { GenericRequestError } from "./src/types/GenericRequestError.js";

export type { ApiNinjas } from "./src/index.js";
export type {
	ApiRequestFunction,
	RequestMethod,
	RequestOptions,
	RequestParams
} from "./src/client.js";
export type { FactsService } from "./src/services/FactsService.js";
export type { QuotesService } from "./src/services/QuotesService.js";
export type { Fact, FactResponse } from "./src/types/Facts.js";
export type { Quote, QuoteResponse } from "./src/types/Quotes.js";
