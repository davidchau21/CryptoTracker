
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number, compact = false): string {
  if (num === null || num === undefined || isNaN(num)) {
    return 'N/A';
  }

  if (compact) {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 2
    }).format(num);
  }

  // For very small numbers, show more decimals
  if (num < 0.01 && num > 0) {
    return num.toFixed(6);
  }

  // For regular numbers
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
}

export function formatCurrency(num: number, compact = false): string {
  if (num === null || num === undefined || isNaN(num)) {
    return 'N/A';
  }

  return `$${formatNumber(num, compact)}`;
}

export function formatPercentage(num: number): string {
  if (num === null || num === undefined || isNaN(num)) {
    return 'N/A';
  }

  return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

export function calculateTimeframe(range: string): number | string {
  switch (range) {
    case '1d':
      return 1;
    case '7d':
      return 7;
    case '30d':
      return 30;
    case '90d':
      return 90;
    case '1y':
      return 365;
    case 'max':
      return 'max';
    default:
      return 7;
  }
}

export function transformMarketChartData(data: [number, number][]): { timestamp: number; price: number }[] {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map(([timestamp, price]) => ({
    timestamp,
    price
  }));
}
