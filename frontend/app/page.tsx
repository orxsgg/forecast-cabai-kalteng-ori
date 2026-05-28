'use client'

import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'

import {
  Download,
  Zap
} from 'lucide-react'

import { ThemeSwitcher }
from '@/components/theme-switcher'

import { PremiumChart }
from '@/components/premium-chart'

export default function Dashboard() {

  // ============================================
  // API URL
  // ============================================

  const API_URL =
    "https://forecast-cabai-kalteng-ori-production.up.railway.app"

  // ============================================
  // STATE
  // ============================================

  const [days, setDays] =
    useState(7)

  const [isLoading, setIsLoading] =
    useState(false)

  const [showForecast, setShowForecast] =
    useState(false)

  const [dashboardData, setDashboardData] =
    useState<any>(null)

  const [historicalData, setHistoricalData] =
    useState<any[]>([])

  const [forecastData, setForecastData] =
    useState<any[]>([])

  const [error, setError] =
    useState('')

  // ============================================
  // FETCH DASHBOARD DATA
  // ============================================

  useEffect(() => {

    const fetchDashboard =
      async () => {

        try {

          setError('')

          const response =
            await fetch(
              `${API_URL}/dashboard-data`
            )

          if (!response.ok) {

            throw new Error(
              'Gagal mengambil data dashboard'
            )

          }

          const data =
            await response.json()

          setDashboardData(data)

          // ==========================
          // FORMAT HISTORICAL
          // ==========================

          const formattedHistorical =
            data.grafik_historis.map(
              (item: any) => ({

                date:
                  item.tanggal,

                historical:
                  item.harga,

              })
            )

          setHistoricalData(
            formattedHistorical
          )

        } catch (err) {

          console.error(err)

          setError(
            'Backend FastAPI tidak dapat diakses'
          )

        }

      }

    fetchDashboard()

  }, [])

  // ============================================
  // HANDLE FORECAST
  // ============================================

  const handleForecast =
    async () => {

      try {

        setIsLoading(true)

        setError('')

        const response =
          await fetch(
            `${API_URL}/predict`,
            {

              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json'
              },

              body: JSON.stringify({

                hari_prediksi:
                  days

              })

            }
          )

        if (!response.ok) {

          throw new Error(
            'Forecast gagal'
          )

        }

        const data =
          await response.json()

        // ==================================
        // AMBIL TITIK TERAKHIR HISTORIS
        // ==================================

        const lastHistorical =
          historicalData[
            historicalData.length - 1
          ]

        // ==================================
        // FORMAT FORECAST
        // ==================================

        const formattedForecast = [

          // titik sambungan
          {
            date:
              lastHistorical?.date,

            forecast:
              lastHistorical?.historical,
          },

          // hasil prediksi
          ...data.forecast.map(
            (item: any) => ({

              date:
                item.tanggal,

              forecast:
                item.prediksi_harga,

              harga:
                item.prediksi_harga,

              type:
                'Prediksi'

            })
          )

        ]

        setForecastData(
          formattedForecast
        )

        setShowForecast(true)

      } catch (err) {

        console.error(err)

        setError(
          'Forecast gagal dilakukan'
        )

      } finally {

        setIsLoading(false)

      }

    }

  // ============================================
  // DOWNLOAD CSV
  // ============================================

  const handleDownloadCSV =
    () => {

      const csv =
        'Tanggal,Harga\n' +

        forecastData
          .filter(
            (item) => item.harga
          )
          .map(
            (item) =>
              `${item.date},${item.harga}`
          )
          .join('\n')

      const blob =
        new Blob(
          [csv],
          {
            type: 'text/csv'
          }
        )

      const url =
        window.URL.createObjectURL(blob)

      const a =
        document.createElement('a')

      a.href = url

      a.download =
        'forecast_cabai.csv'

      document.body.appendChild(a)

      a.click()

      window.URL.revokeObjectURL(url)

      document.body.removeChild(a)
    }

  return (

    <main className="min-h-screen bg-white dark:bg-background">

      {/* HEADER */}

      <header className="border-b bg-white dark:bg-black/40">

        <div className="mx-auto max-w-7xl px-4 py-8">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <span className="text-4xl">
                🌶️
              </span>

              <div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">

                  Forecasting Harga Cabai Rawit

                </h1>

                <p className="text-sm text-gray-600 dark:text-gray-400">

                  Kalimantan Tengah Menggunakan LSTM

                </p>

              </div>

            </div>

            <ThemeSwitcher />

          </div>

        </div>

      </header>

      {/* MAIN */}

      <div className="mx-auto max-w-7xl px-4 py-8">

        {/* ERROR */}

        {error && (

          <div className="mb-6 rounded-lg border border-red-500 bg-red-50 p-4 text-red-700">

            {error}

          </div>

        )}

        {/* METRICS */}

        <div className="grid gap-4 md:grid-cols-3 mb-8">

          <Card className="p-6">

            <p className="text-sm text-gray-500">
              Jumlah Data
            </p>

            <p className="mt-2 text-3xl font-bold">

              {dashboardData?.jumlah_data ?? '-'}

            </p>

          </Card>

          <Card className="p-6">

            <p className="text-sm text-gray-500">
              Harga Maksimum
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-600">

              Rp {
                dashboardData?.harga_maksimum
                ?.toLocaleString('id-ID')
              }

            </p>

          </Card>

          <Card className="p-6">

            <p className="text-sm text-gray-500">
              Harga Minimum
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">

              Rp {
                dashboardData?.harga_minimum
                ?.toLocaleString('id-ID')
              }

            </p>

          </Card>

        </div>

        {/* CONTENT */}

        <div className="grid gap-8 lg:grid-cols-3">

          {/* LEFT */}

          <div className="lg:col-span-2 space-y-8">

            {/* HISTORICAL CHART */}

            <PremiumChart
              data={historicalData}
              title="📈 Grafik Harga Historis"
              height={450}
            />

            {/* EVALUASI */}

            <Card className="p-6">

              <h2 className="text-lg font-semibold mb-4">

                📉 Evaluasi Model

              </h2>

              <div className="grid gap-4 sm:grid-cols-3">

                <div className="rounded-lg border p-4">

                  <p className="text-sm text-gray-500">
                    MAE
                  </p>

                  <p className="text-2xl font-bold">

                    {dashboardData?.mae}

                  </p>

                </div>

                <div className="rounded-lg border p-4">

                  <p className="text-sm text-gray-500">
                    RMSE
                  </p>

                  <p className="text-2xl font-bold">

                    {dashboardData?.rmse}

                  </p>

                </div>

                <div className="rounded-lg border p-4">

                  <p className="text-sm text-gray-500">
                    MAPE
                  </p>

                  <p className="text-2xl font-bold">

                    {dashboardData?.mape}%

                  </p>

                </div>

              </div>

            </Card>

            {/* FORECAST */}

            {showForecast && (

              <div className="space-y-6">

                {/* PREDIKSI BESOK */}

                <Card className="p-6 border border-emerald-500">

                  <h2 className="text-lg font-semibold mb-4">

                    🎯 Prediksi Harga Besok

                  </h2>

                  <p className="text-sm text-gray-500">

                    Estimasi Harga

                  </p>

                  <p className="mt-2 text-4xl font-bold text-emerald-600">

                    Rp {
                      forecastData[1]?.harga
                      ?.toLocaleString('id-ID')
                    }

                  </p>

                </Card>

                {/* FORECAST CHART */}

                <PremiumChart
                  data={[
                    ...historicalData,
                    ...forecastData
                  ]}
                  title="📊 Grafik Forecast"
                  showForecast={true}
                  height={450}
                />

                {/* TABLE */}

                <Card className="p-6">

                  <h2 className="text-lg font-semibold mb-4">

                    📋 Tabel Forecast

                  </h2>

                  <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                      <thead>

                        <tr className="border-b">

                          <th className="px-4 py-3 text-left">
                            Tanggal
                          </th>

                          <th className="px-4 py-3 text-left">
                            Harga
                          </th>

                          <th className="px-4 py-3 text-left">
                            Status
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {forecastData
                          .filter(
                            (item) => item.harga
                          )
                          .map(
                            (item, idx) => (

                              <tr
                                key={idx}
                                className="border-b"
                              >

                                <td className="px-4 py-3">

                                  {item.date}

                                </td>

                                <td className="px-4 py-3 font-semibold text-emerald-600">

                                  Rp {
                                    item.harga
                                    .toLocaleString('id-ID')
                                  }

                                </td>

                                <td className="px-4 py-3">

                                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">

                                    {item.type}

                                  </span>

                                </td>

                              </tr>

                            )
                          )}

                      </tbody>

                    </table>

                  </div>

                  <Button
                    onClick={
                      handleDownloadCSV
                    }
                    className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white"
                  >

                    <Download className="mr-2 h-4 w-4" />

                    Download CSV

                  </Button>

                </Card>

              </div>

            )}

          </div>

          {/* RIGHT */}

          <div>

            <Card className="p-6 sticky top-8">

              <h2 className="text-lg font-semibold mb-6">

                🚀 Jalankan Forecast

              </h2>

              <div className="space-y-6">

                <div>

                  <label className="block text-sm mb-3">

                    Jumlah Hari Prediksi

                  </label>

                  <div className="flex items-center gap-4">

                    <Slider
                      value={[days]}
                      onValueChange={
                        (value) =>
                          setDays(value[0])
                      }
                      min={1}
                      max={30}
                      step={1}
                      className="flex-1"
                    />

                    <span className="font-bold text-red-600">

                      {days}

                    </span>

                  </div>

                </div>

                <Button
                  onClick={handleForecast}
                  disabled={isLoading}
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white"
                >

                  {isLoading ? (

                    <>
                      ⏳ Sedang forecasting...
                    </>

                  ) : (

                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      Jalankan Forecast
                    </>

                  )}

                </Button>

                {showForecast && (

                  <div className="rounded-lg border border-emerald-500 bg-emerald-50 p-4">

                    <p className="text-sm text-emerald-700">

                      ✓ Forecast berhasil dilakukan

                    </p>

                  </div>

                )}

              </div>

            </Card>

          </div>

        </div>

      </div>

      {/* FOOTER */}

      <footer className="mt-16 border-t bg-gray-100 dark:bg-black/40">

        <div className="mx-auto max-w-7xl px-4 py-8 text-center">

          <p className="text-sm text-gray-600 dark:text-gray-400">

            Forecasting Harga Cabai Rawit Menggunakan Deep Learning LSTM

          </p>

        </div>

      </footer>

    </main>
  )
}