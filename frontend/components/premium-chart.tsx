'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

// ============================================
// INTERFACE
// ============================================

interface ChartData {
  date: string
  historical?: number
  forecast?: number
}

interface PremiumChartProps {
  data: ChartData[]
  title: string
  showForecast?: boolean
  height?: number
}

// ============================================
// COMPONENT
// ============================================

export function PremiumChart({
  data,
  title,
  showForecast = false,
  height = 450
}: PremiumChartProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // ============================================
  // MOUNT
  // ============================================

  useEffect(() => {
    setMounted(true)
  }, [])

  // ============================================
  // PREVENT HYDRATION ERROR
  // ============================================

  if (!mounted) {
    return (
      <div
        style={{
          borderRadius: '20px',
          height: `${height}px`,
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
        }}
      />
    )
  }

  // ============================================
  // THEME
  // ============================================

  const isDark = theme === 'dark'

  // ============================================
  // COLORS
  // ============================================

  const colors = {
    light: {
      background: '#FFFFFF',
      gridStroke: '#E5E7EB',
      axisText: '#4B5563',
      textLabel: '#1F2937',
      tooltip: '#FFFFFF',
      tooltipBorder: '#E5E7EB',
      tooltipText: '#1F2937',
      historicalLine: '#2F43F1',
      forecastLine: '#EF4444',
    },
    dark: {
      background: '#0F172A',
      gridStroke: '#1E293B',
      axisText: '#94A3B8',
      textLabel: '#E5E7EB',
      tooltip: '#1E293B',
      tooltipBorder: '#334155',
      tooltipText: '#F3F4F6',
      historicalLine: '#818CF8',
      forecastLine: '#FCA5A5',
    },
  }

  const currentColors = isDark ? colors.dark : colors.light

  // ============================================
  // FORMAT Y AXIS
  // ============================================

  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(0)}M`
    }
    if (value >= 1000) {
      return `Rp ${(value / 1000).toFixed(0)}k`
    }
    return `Rp ${value}`
  }

  // ============================================
  // FORMAT X AXIS
  // ============================================

  const formatXAxis = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', {
      month: 'short',
      year: 'numeric'
    })
  }

  // ============================================
  // TOOLTIP
  // ============================================

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload.find((p: any) => p.value !== undefined)

      if (!item) {
        return null
      }

      const data = item.payload
      const date = new Date(data.date)

      const formattedDate = date.toLocaleDateString('id-ID', {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      return (
        <div
          style={{
            backgroundColor: currentColors.tooltip,
            border: `1px solid ${currentColors.tooltipBorder}`,
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: isDark
              ? '0 20px 25px rgba(0,0,0,0.5)'
              : '0 10px 15px rgba(0,0,0,0.1)',
            color: currentColors.tooltipText,
          }}
        >
          <p
            style={{
              margin: '0 0 4px 0',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            {formattedDate}
          </p>
          <p
            style={{
              margin: '0',
              fontSize: '16px',
              fontWeight: '700',
              color:
                item.dataKey === 'forecast'
                  ? currentColors.forecastLine
                  : currentColors.historicalLine,
            }}
          >
            Rp {Number(item.value).toLocaleString('id-ID')}
          </p>
        </div>
      )
    }

    return null
  }

  // ============================================
  // RETURN
  // ============================================

  return (
    <div
      style={{
        borderRadius: '24px',
        border: `1px solid ${currentColors.gridStroke}`,
        background: currentColors.background,
        padding: '24px 28px',
        boxShadow: isDark
          ? '0 20px 25px -5px rgba(0,0,0,0.3)'
          : '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      {/* TITLE */}
      <h3
        style={{
          fontSize: '20px',
          fontWeight: '700',
          color: currentColors.textLabel,
          marginBottom: '20px',
          marginTop: '0',
        }}
      >
        {title}
      </h3>

      {/* CHART */}
      <ResponsiveContainer width="100%" height={height - 70}>
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 50,
            left: 10,
            // Margin bawah ditambah lagi sedikit untuk menampung jarak yang baru
            bottom: showForecast ? 70 : 50, 
          }}
        >
          {/* GRID */}
          <CartesianGrid
            strokeDasharray="4 4"
            stroke={currentColors.gridStroke}
            horizontal={true}
            vertical={false}
            opacity={0.5}
          />

          {/* X AXIS */}
          <XAxis
            dataKey="date"
            tick={{
              fill: currentColors.axisText,
              fontSize: 11,
              fontWeight: 500,
            }}
            tickFormatter={formatXAxis}
            stroke={currentColors.gridStroke}
            minTickGap={30} 
            tickMargin={10}
            label={{
              value: 'Tanggal',
              position: 'bottom',
              offset: 10, // Dikembalikan ke 10 agar ada jarak dengan angka bulan
              style: {
                fill: currentColors.textLabel,
                fontSize: 15,
                fontWeight: 600,
                textAnchor: 'middle', 
              }
            }}
          />

          {/* Y AXIS */}
          <YAxis
            tick={{
              fill: currentColors.axisText,
              fontSize: 12,
              fontWeight: 500,
            }}
            tickFormatter={formatYAxis}
            stroke={currentColors.gridStroke}
            width={90}
            label={{
              value: 'Harga (Rupiah)',
              angle: -90,
              position: 'insideLeft',
              offset: 10,
              style: {
                fill: currentColors.textLabel,
                fontSize: 15,
                fontWeight: 600,
                textAnchor: 'middle', 
              }
            }}
          />

          {/* TOOLTIP */}
          <Tooltip content={<CustomTooltip />} />

          {/* LEGEND */}
          {showForecast && (
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="plainline"
              iconSize={30}
              wrapperStyle={{
                paddingTop: '25px', // Jarak antara "Tanggal" dan Legend dilebarkan lagi
                display: 'flex',
                justifyContent: 'center', 
                alignItems: 'center',
                width: '100%',
              }}
              formatter={(value) => (
                <span
                  style={{
                    color: currentColors.textLabel,
                    fontSize: '15px',
                    fontWeight: 600,
                    marginLeft: '8px',
                    marginRight: '20px',
                  }}
                >
                  {value}
                </span>
              )}
            />
          )}

          {/* HISTORICAL LINE */}
          <Line
            type="monotone"
            dataKey="historical"
            stroke={currentColors.historicalLine}
            strokeWidth={3.5}
            dot={false}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
            animationDuration={800}
            name="Harga Historis"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* FORECAST LINE */}
          {showForecast && (
            <Line
              type="monotone"
              dataKey="forecast"
              stroke={currentColors.forecastLine}
              strokeWidth={3.5}
              strokeDasharray="10 6"
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
              animationDuration={800}
              name="Prediksi"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}