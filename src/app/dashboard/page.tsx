'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

type Coin = {
  id: string
  name: string
  symbol: string
  image: string
  current_price: number
  price_change_percentage_24h: number
}

export default function DashboardPage() {
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
              per_page: 3,
              page: 1,
              sparkline: false,
            },
          }
        );
        setCoins(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCoins();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard Overview</h1>

      {loading ? (
        <p>Loading top coins...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {coins.map((coin) => (
            <div key={coin.id} className="bg-white shadow-md p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                <div>
                  <h2 className="text-lg font-bold">{coin.name}</h2>
                  <p className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</p>
                </div>
              </div>
              <p className="text-gray-800">
                💲 <strong>${coin.current_price.toLocaleString()}</strong>
              </p>
              <p
                className={`mt-1 ${
                  coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {coin.price_change_percentage_24h.toFixed(2)}% (24h)
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
