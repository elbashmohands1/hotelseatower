'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { format, subDays } from 'date-fns';

Chart.register(...registerables);

interface RevenueData {
  createdAt: Date;
  _sum: {
    totalAmount: number;
  };
}

interface RevenueChartProps {
  data: RevenueData[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Process data for the last 30 days
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), i);
      return format(date, 'yyyy-MM-dd');
    }).reverse();

    const revenueByDate = data.reduce((acc, item) => {
      const date = format(new Date(item.createdAt), 'yyyy-MM-dd');
      acc[date] = item._sum.totalAmount || 0;
      return acc;
    }, {} as Record<string, number>);

    const chartData = last30Days.map(date => ({
      date,
      revenue: revenueByDate[date] || 0,
    }));

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartData.map(d => format(new Date(d.date), 'MMM dd')),
        datasets: [
          {
            label: 'Daily Revenue',
            data: chartData.map(d => d.revenue),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Revenue (Last 30 Days)',
            font: {
              size: 16,
              weight: 'bold',
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: value => `$${value}`,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <canvas ref={chartRef} />
    </div>
  );
} 