'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'

type Coin = {
  id: string
  name: string
  symbol: string
  image: string
  current_price: number
}

export default function TradePage() {
  const { coinId } = useParams()
  const router = useRouter()

  const [coin, setCoin] = useState<Coin | null>(null)
  const [amount, setAmount] = useState(0)

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const res = await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets`,
          {
            params: {
              vs_currency: 'usd',
              ids: coinId,
            },
          }
        )
        setCoin(res.data[0])
      } catch (err) {
        console.error(err)
      }
    }

    if (coinId) fetchCoin()
  }, [coinId])

  const handleBuy = () => {
    if (!coin || amount <= 0) return

    const existing = JSON.parse(localStorage.getItem('portfolio') || '[]')
    const updated = [
      ...existing,
      {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        amount,
        priceBought: coin.current_price,
      },
    ]

    localStorage.setItem('portfolio', JSON.stringify(updated))
    router.push('/portfolio')
  }

  if (!coin) return <p className="p-6">Loading...</p>

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Buy {coin.name}</h1>

      <div className="bg-white shadow rounded p-4 max-w-md">
        <div className="mb-2">
          <img src={coin.image} alt={coin.name} className="w-10 h-10 inline-block mr-2" />
          <span className="text-xl font-bold">{coin.name} ({coin.symbol.toUpperCase()})</span>
        </div>
        <p className="mb-4 text-gray-600">
          Current Price: <strong>${coin.current_price.toLocaleString()}</strong>
        </p>

        <input
          type="number"
          min="0"
          placeholder="Enter amount to buy"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded mb-4"
        />

        <button
          onClick={handleBuy}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Buy
        </button>
      </div>
    </main>
  )
}
