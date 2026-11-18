/** Fetch JSON from our own API, throwing the server's error message on failure. */
export async function api<T>(url: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const { json, ...rest } = init ?? {}
  const res = await fetch(url, {
    ...rest,
    ...(json !== undefined && {
      body: JSON.stringify(json),
      headers: { 'Content-Type': 'application/json' },
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error ?? 'Something went wrong.')
  return data as T
}
