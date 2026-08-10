import { GenericRequestError } from "./types/GenericRequestError.js";

export const BASE_API_URL = "https://api.api-ninjas.com/v1";

export type RequestMethod = "GET" | "POST";

export type RequestParams = Record<string, string | number | boolean>;

export type RequestOptions = {
	path?: string;
	params?: RequestParams;
	method?: RequestMethod;
};

export type ApiRequestFunction = <T>(endpoint: string, options?: RequestOptions) => Promise<T>;

type ApiErrorBody = {
	error: string;
};

const isApiErrorBody = (data: unknown): data is ApiErrorBody =>
	typeof data === "object"
	&& data !== null
	&& "error" in data
	&& typeof (data as { error: unknown }).error === "string";

/**
 * Joins path segments onto the base URL. Splitting on "/" first means callers
 * can pass "/facts", "facts", or "a/b" interchangeably, and each segment gets
 * encoded so a value like "foo bar" can't corrupt the path.
 */
const buildUrl = (base: string, ...segments: (string | undefined)[]): URL => {
	const encoded = segments
		.filter((segment): segment is string => segment !== undefined)
		.flatMap((segment) => segment.split("/"))
		.filter((segment) => segment.length > 0)
		.map(encodeURIComponent);

	return new URL([base.replace(/\/+$/, ""), ...encoded].join("/"));
};

const toSearchParams = (params: RequestParams): URLSearchParams =>
	new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)]));

const parseJson = async <T>(endpoint: string, response: Response): Promise<T> => {
	try {
		return await response.json() as T;
	} catch {
		throw new GenericRequestError(endpoint, response.status, "Response body was not valid JSON");
	}
};

export const createApiClient = (apiKey: string): ApiRequestFunction => {
	return async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
		const { path, params, method = "GET" } = options;

		const url = buildUrl(BASE_API_URL, endpoint, path);
		const search = params ? toSearchParams(params) : undefined;
		const isPost = method === "POST";

		if (search && !isPost) url.search = search.toString();

		let response: Response;

		// Only the fetch itself is guarded here: wrapping the checks below in the
		// same try would swallow their errors and discard the HTTP status.
		try {
			response = await fetch(url, {
				method,
				headers: {
					"Accept": "application/json",
					"X-Api-Key": apiKey
				},
				body: isPost ? search : undefined
			});
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Network request failed";
			throw new GenericRequestError(endpoint, 0, message);
		}

		const data = await parseJson<T>(endpoint, response);

		if (isApiErrorBody(data)) {
			throw new GenericRequestError(endpoint, response.status, data.error);
		}

		if (!response.ok) {
			throw new GenericRequestError(endpoint, response.status, response.statusText);
		}

		return data;
	};
};
