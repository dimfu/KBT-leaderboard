type ProcessCallback = (url: string, json: any[]) => any

export default async function fetchAll(urls: string[], callback: ProcessCallback) {
  const promises = urls.map((url) => fetch(url).then(async (res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch ${url}`)
      }
      return res.json().then((data) => callback(url, data as unknown as string[]))
    })
    .catch((err) => {
      console.error(`Error fetching ${url}:`, err);
      throw new Error(err as string)
    })
  )

  try {
    const data = await Promise.all(promises)
    return data
  } catch (err) {
    throw new Error(err as string)
  }
}