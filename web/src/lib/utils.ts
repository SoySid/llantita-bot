import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return '$0';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTimeAgo(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return 'recientemente';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'hace unos segundos';
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  return `hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
}

export function parseTalles(tallesStr: string | null | undefined): string[] {
  if (!tallesStr) return [];
  return tallesStr
    .split(',')
    .map((t) => {
      const trimmed = t.trim();
      const matchTalle = trimmed.match(/talle[:\s]+([0-9]+(?:\.[0-9]+)?)/i);
      if (matchTalle) return matchTalle[1];

      const matchUk = trimmed.match(/^([0-9]+(?:\.[0-9]+)?)\s*\(/);
      if (matchUk) return matchUk[1];

      const match = trimmed.match(/\b\d+(\.\d+)?\b/);
      return match ? match[0] : trimmed;
    })
    .filter((v, idx, arr) => Boolean(v) && arr.indexOf(v) === idx)
    .sort((a, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    })
    .slice(0, 10);
}
