export class GenericRequestError extends Error {
	constructor(
		readonly endpoint: string,
		readonly status: number = 0,
		override readonly message: string = "Unknown error",
	) {
		super(`API error on ${endpoint}, HTTP status - ${status}: ${message}`)
	}
}