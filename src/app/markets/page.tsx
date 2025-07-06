'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

type Coin = {
  id: string
  name: string
  symbol: string
  image: string
  current_price: number
  price_change_percentage_24h: number
}

export default function MarketsPage() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets',
          {
            params: {
              vs_currency: 'usd',
              order: 'market_cap_desc',
              per_page: 10,
              page: 1,
              sparkline: false,
            },
          }
        )
        setCoins(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCoins()
  }, [])

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Crypto Market Overview</h1>

      {loading ? (
        <p>Loading coins...</p>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Coin</th>
              <th className="p-3">Price</th>
              <th className="p-3">Change (24h)</th>
              <th className="p-3">Trade</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <tr key={coin.id} className="border-t hover:bg-gray-50">
                <td className="p-3 flex items-center gap-2">
                  <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">{coin.name}</div>
                    <div className="text-sm text-gray-500 uppercase">{coin.symbol}</div>
                  </div>
                </td>
                <td className="p-3">${coin.current_price.toLocaleString()}</td>
                <td
                  className={`p-3 ${
                    coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td className="p-3">
                  <Link href={`/trade/${coin.id}`}>
                    <button className="text-blue-600 underline">Trade</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
