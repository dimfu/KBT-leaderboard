type ProcessCallback<T, U> = (url: string, json: T) => U

export default async function fetchAll<T, U>(urls: string[], callback: ProcessCallback<T, U>): Promise<U[]> {
  const promises = urls.map((url) => fetch(url).then(async (res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch ${url}`)
      }
      return res.json().then((data) => callback(url, data as T))
    })
    .catch((err) => {
      console.error(`Error fetching ${url}:`, err);
      throw new Error(err as string)
    })
  )

  try {
    const data = await Promise.all(promises) as U[]
    return data
  } catch (err) {
    throw new Error(err as string)
  }
}