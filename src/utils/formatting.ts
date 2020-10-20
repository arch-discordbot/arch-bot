import { format } from 'date-fns';

export const formatDate = (date: Date) => format(date, 'MM-dd-yyyy HH:mm:ss O');

export const formatNumber = (
  number: number,
  options: Intl.NumberFormatOptions = {
    minimumFractionDigits: number % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  },
  locale?: string | string[]
) => number.toLocaleString(locale, options);
