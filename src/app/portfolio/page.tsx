'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type Holding = {
  id: string
  name: string
  symbol: string
  amount: number
  priceBought: number
}

type PriceMap = {
  [id: string]: number
}

type ChartDataPoint = {
  date: string
  value: number
}

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [prices, setPrices] = useState<PriceMap>({})
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])

  // Load portfolio from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('portfolio')
    if (stored) {
      setHoldings(JSON.parse(stored))
    }
  }, [])

  // Fetch current prices every minute
  useEffect(() => {
    if (holdings.length === 0) {
      setLoading(false)
      return
    }

    const fetchPrices = async () => {
      try {
        const ids = holdings.map((h) => h.id).join(',')
        const res = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price`,
          {
            params: {
              ids,
              vs_currencies: 'usd',
            },
          }
        )
        const priceMap: PriceMap = {}
        for (const id in res.data) {
          priceMap[id] = res.data[id].usd
        }
        setPrices(priceMap)
        setLoading(false)

        // Update chart data with current total value
        const totalValue = holdings.reduce((sum, h) => {
          const price = priceMap[h.id] ?? h.priceBought
          return sum + h.amount * price
        }, 0)
        setChartData((prev) => {
          const today = new Date().toLocaleDateString()
          // Append or replace today's value
          if (prev.length && prev[prev.length - 1].date === today) {
            return [...prev.slice(0, -1), { date: today, value: totalValue }]
          } else {
            return [...prev, { date: today, value: totalValue }]
          }
        })
      } catch (error) {
        console.error(error)
        setLoading(false)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 60000)
    return () => clearInterval(interval)
  }, [holdings])

  const removeHolding = (id: string) => {
    const updated = holdings.filter((h) => h.id !== id)
    setHoldings(updated)
    localStorage.setItem('portfolio', JSON.stringify(updated))
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">My Crypto Portfolio</h1>

      {holdings.length === 0 ? (
        <p className="text-gray-600 text-lg">No holdings yet.</p>
      ) : loading ? (
        <p>Loading prices and chart...</p>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Portfolio Value Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </section>

          <section>
            <table className="min-w-full border border-gray-300 rounded shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border-b">Coin</th>
                  <th className="p-3 border-b">Symbol</th>
                  <th className="p-3 border-b">Amount</th>
                  <th className="p-3 border-b">Buy Price</th>
                  <th className="p-3 border-b">Current Price</th>
                  <th className="p-3 border-b">Value</th>
                  <th className="p-3 border-b">P/L</th>
                  <th className="p-3 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => {
                  const currentPrice = prices[h.id] ?? h.priceBought
                  const value = h.amount * currentPrice
                  const cost = h.amount * h.priceBought
                  const profitLoss = value - cost
                  const profitLossPercent = (profitLoss / cost) * 100
                  return (
                    <tr key={h.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{h.name}</td>
                      <td className="p-3 uppercase">{h.symbol}</td>
                      <td className="p-3">{h.amount}</td>
                      <td className="p-3">${h.priceBought.toFixed(2)}</td>
                      <td className="p-3">${currentPrice.toFixed(2)}</td>
                      <td className="p-3">${value.toFixed(2)}</td>
                      <td
                        className={`p-3 ${
                          profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {profitLoss.toFixed(2)} ({profitLossPercent.toFixed(2)}%)
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => removeHolding(h.id)}
                          className="text-red-600 underline hover:text-red-800"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>
        </>
      )}
    </main>
  )
}
