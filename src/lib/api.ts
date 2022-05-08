interface Send<TData> {
  path: string
  method: string
  data?: TData
  options?: Record<string, string>
}

export async function send<TData>({
  path,
  method,
  data,
  options,
}: Send<TData>): Promise<Response> {
  const response = await fetch(path, {
    method: method,
    body: data && JSON.stringify(data),
    ...options,
  })
  return response
}
