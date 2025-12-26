/**
 * Fetch utilities with timeout protection and error handling
 */

export class FetchTimeoutError extends Error {
  constructor(message: string = 'Request timed out') {
    super(message)
    this.name = 'FetchTimeoutError'
  }
}

export class FetchJsonError extends Error {
  public response: Response

  constructor(message: string, response: Response) {
    super(message)
    this.name = 'FetchJsonError'
    this.response = response
  }
}

/**
 * Default timeout duration in milliseconds (30 seconds)
 */
export const DEFAULT_TIMEOUT = 30000

/**
 * Wraps a fetch request with a timeout
 * @param url - The URL to fetch
 * @param options - Fetch options including timeout
 * @returns Promise resolving to the Response
 * @throws FetchTimeoutError if the request times out
 */
export async function fetchWithTimeout(
  url: string | URL,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT, signal, ...fetchOptions } = options

  // Create an AbortController for timeout
  const controller = new AbortController()

  // If an external signal is provided, listen to it
  if (signal) {
    signal.addEventListener('abort', () => controller.abort())
  }

  // Set up the timeout
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })
    return response
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      // Check if it was our timeout or an external abort
      if (signal?.aborted) {
        throw error // Re-throw external aborts
      }
      throw new FetchTimeoutError(`Request to ${url} timed out after ${timeout}ms`)
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Safely parses JSON from a response, with validation
 * @param response - The Response object to parse
 * @returns Promise resolving to the parsed JSON
 * @throws FetchJsonError if the response is not valid JSON
 */
export async function safeJsonParse<T = unknown>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type')

  // Check if response is JSON
  if (!contentType || !contentType.includes('application/json')) {
    throw new FetchJsonError(
      `Expected JSON response but got ${contentType || 'no content-type'}`,
      response
    )
  }

  const text = await response.text()

  if (!text || text.trim() === '') {
    throw new FetchJsonError('Empty response body', response)
  }

  try {
    return JSON.parse(text) as T
  } catch {
    throw new FetchJsonError(
      `Invalid JSON response: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`,
      response
    )
  }
}

/**
 * Combines fetchWithTimeout and safeJsonParse for convenience
 * @param url - The URL to fetch
 * @param options - Fetch options including timeout
 * @returns Promise resolving to the parsed JSON response
 */
export async function fetchJson<T = unknown>(
  url: string | URL,
  options: RequestInit & { timeout?: number } = {}
): Promise<{ data: T; response: Response }> {
  const response = await fetchWithTimeout(url, options)
  const data = await safeJsonParse<T>(response)
  return { data, response }
}

/**
 * Creates a fetch function with a pre-configured timeout
 * @param defaultTimeout - Default timeout in milliseconds
 * @returns A fetch function with the configured timeout
 */
export function createTimeoutFetch(defaultTimeout: number) {
  return (url: string | URL, options: RequestInit & { timeout?: number } = {}) =>
    fetchWithTimeout(url, { timeout: defaultTimeout, ...options })
}
