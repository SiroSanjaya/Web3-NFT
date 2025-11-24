import { NextResponse } from 'next/server'

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3/simple/price'

function symbolToId(symbol: string): string {
  const sym = symbol.trim().toLowerCase()
  if (sym === 'eth' || sym === 'ethereum') return 'ethereum'
  if (sym === 'matic' || sym === 'polygon') return 'matic-network'
  if (sym === 'usdt' || sym === 'tether') return 'tether'
  return sym
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbolsParam = searchParams.get('symbols') || 'eth,matic'
    const symbols = symbolsParam.split(',').map((s) => s.trim()).filter(Boolean)
    const ids = symbols.map(symbolToId)

    const url = `${COINGECKO_BASE}?ids=${encodeURIComponent(ids.join(','))}&vs_currencies=usd`
    const headers: Record<string, string> = {}
    if (process.env.COINGECKO_API_KEY) headers['x-cg-pro-api-key'] = process.env.COINGECKO_API_KEY

    const res = await fetch(url, { headers, cache: 'no-store' })
    if (!res.ok) {
      const txt = await res.text()
      return NextResponse.json({ error: 'Failed to fetch prices', details: txt }, { status: 502 })
    }
    const data = await res.json()

    const result: Record<string, number> = {}
    symbols.forEach((sym, idx) => {
      const id = ids[idx]
      const key = `${sym.toLowerCase()}Usd`
      result[key] = data?.[id]?.usd ?? 0
    })

    // Back-compat keys for eth/matic
    if (result['ethUsd'] == null && data['ethereum']) result['ethUsd'] = data['ethereum'].usd
    if (result['maticUsd'] == null && data['matic-network']) result['maticUsd'] = data['matic-network'].usd

    return NextResponse.json({ ...result, timestamp: Date.now() })
  } catch (err: any) {
    return NextResponse.json({ error: 'Unexpected error', details: err?.message }, { status: 500 })
  }
}


