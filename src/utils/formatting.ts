export const formatDate = (date: Date, locale?: string | string[]) =>
  date.toLocaleString(locale, {
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });

export const formatNumber = (
  number: number,
  locale?: string | string[],
  options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }
) => number.toLocaleString(locale, options);
