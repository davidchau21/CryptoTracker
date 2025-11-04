
import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChartData, TimeRange } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface PriceChartProps {
  data: ChartData[];
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  isLoading: boolean;
}

const timeRangeOptions: { value: TimeRange; label: string }[] = [
  { value: '1d', label: '1D' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '1M' },
  { value: '90d', label: '3M' },
  { value: '1y', label: '1Y' },
  { value: 'max', label: 'Max' },
];

const PriceChart = ({ data, timeRange, onTimeRangeChange, isLoading }: PriceChartProps) => {
  const isMobile = useIsMobile();
  
  const formattedData = useMemo(() => {
    return data.map(({ timestamp, price }) => ({
      timestamp,
      price,
      date: new Date(timestamp).toLocaleDateString()
    }));
  }, [data]);

  // Calculate if the overall trend is positive
  const isPriceUp = useMemo(() => {
    if (formattedData.length < 2) return true;
    const firstPrice = formattedData[0].price;
    const lastPrice = formattedData[formattedData.length - 1].price;
    return lastPrice >= firstPrice;
  }, [formattedData]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card px-4 py-2 border border-border shadow-md rounded-md">
          <p className="text-sm text-muted-foreground">
            {new Date(payload[0].payload.timestamp).toLocaleString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <p className="text-lg font-semibold">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      <div className="flex flex-wrap justify-end gap-2">
        {timeRangeOptions.map(option => (
          <Button
            key={option.value}
            variant={timeRange === option.value ? "default" : "outline"}
            size="sm"
            className="px-3 py-1 h-8"
            onClick={() => onTimeRangeChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      
      <div className="w-full h-[400px]">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-pulse-opacity bg-secondary/50 w-full h-full rounded-md"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formattedData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop 
                    offset="5%" 
                    stopColor={isPriceUp ? "rgb(16, 185, 129)" : "rgb(239, 68, 68)"} 
                    stopOpacity={0.3} 
                  />
                  <stop 
                    offset="95%" 
                    stopColor={isPriceUp ? "rgb(16, 185, 129)" : "rgb(239, 68, 68)"} 
                    stopOpacity={0} 
                  />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="rgba(255, 255, 255, 0.1)" 
              />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(timestamp) => {
                  const date = new Date(timestamp);
                  const format = isMobile 
                    ? { month: 'short', day: 'numeric' } 
                    : { month: 'short', day: 'numeric' };
                  return date.toLocaleDateString(undefined, format as Intl.DateTimeFormatOptions);
                }}
                tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                tickLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                minTickGap={20}
              />
              <YAxis 
                orientation="right"
                domain={['auto', 'auto']} 
                tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
                tickFormatter={(value) => formatCurrency(value, true)}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                tickLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                width={80}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: 'rgba(255, 255, 255, 0.2)' }} 
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke={isPriceUp ? "rgb(16, 185, 129)" : "rgb(239, 68, 68)"} 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrice)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default PriceChart;
