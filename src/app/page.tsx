'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'

type Coin = {
  id: string
  name: string
  symbol: string
  image: string
  current_price: number
  market_cap: number
  price_change_percentage_24h: number
}

export default function Home() {
  const [prices, setPrices] = useState<Coin[]>([])

  useEffect(() => {
    const fetchPrices = async () => {
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
        setPrices(res.data)
      } catch (err) {
        console.error('Error fetching crypto prices:', err)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🚀 My Crypto Exchange</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b border-gray-700">
            <th className="p-2">#</th>
            <th className="p-2">Coin</th>
            <th className="p-2">Price</th>
            <th className="p-2">24h Change</th>
            <th className="p-2">Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((coin, index) => (
            <tr key={coin.id} className="border-b border-gray-800 hover:bg-gray-900">
              <td className="p-2">{index + 1}</td>
              <td className="p-2 flex items-center gap-2">
                <Image
                  src={coin.image}
                  alt={coin.name}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                {coin.name} ({coin.symbol.toUpperCase()})
              </td>
              <td className="p-2">${coin.current_price.toLocaleString()}</td>
              <td
                className={`p-2 ${
                  coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
              </td>
              <td className="p-2">${coin.market_cap.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
