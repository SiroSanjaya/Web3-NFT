export type Prices = {
  ethUsd: number
  maticUsd: number
  timestamp: number
}

let cache: Prices | null = null
let cacheTime = 0
const TTL_MS = 60_000 // 1 minute

export async function fetchPrices(symbols: string[] = ['eth', 'matic']): Promise<Prices> {
  const now = Date.now()
  if (cache && now - cacheTime < TTL_MS) return cache

  const params = new URLSearchParams({ symbols: symbols.join(',') })
  const res = await fetch(`/api/prices?${params.toString()}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch prices')
  const data = await res.json()
  cache = data
  cacheTime = now
  return data
}

export async function toUsd(amountEthOrMatic: number, symbol: 'eth' | 'matic', prices?: Prices): Promise<number> {
  const p = prices || (await fetchPrices([symbol]))
  const rate = symbol === 'eth' ? p.ethUsd : p.maticUsd
  return amountEthOrMatic * (rate || 0)
}






