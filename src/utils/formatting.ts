import { format } from 'date-fns';

export const formatDate = (date: Date) => format(date, 'MM-dd-yyyy HH:mm:ss O');

export const formatNumber = (
  number: number,
  locale?: string | string[],
  options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }
) => number.toLocaleString(locale, options);
