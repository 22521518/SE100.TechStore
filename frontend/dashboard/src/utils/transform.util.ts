export function transformVNMoney(value: number) {
  return new Intl.NumberFormat('vn-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
}

export function transformDateWithMonthText(date: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  return new Date(date).toLocaleDateString('en-US', options);
}

export function transformDate(
  date: string,
  includeTime: boolean = false
): string {
  const parsedDate = new Date(date);

  const day = String(parsedDate.getUTCDate()).padStart(2, '0');
  const month = String(parsedDate.getUTCMonth() + 1).padStart(2, '0');
  const year = parsedDate.getUTCFullYear();

  let formattedDate = `${month}-${day}-${year}`;

  if (includeTime) {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
    const timeString = parsedDate.toLocaleTimeString('en-US', options);
    formattedDate += `, ${timeString}`;
  }

  return formattedDate;
}
