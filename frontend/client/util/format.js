
export const formattedPrice = (price=0) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(price)
}

export const formattedDate = (dateString, daysToAdd = 0) => {
  if(!dateString) return ''
  const date = new Date(dateString);

  // Add days if needed
  date.setDate(date.getDate() + daysToAdd);

  // Options to format the date as "Mon Day, Year" (e.g., "Jan 19, 2024")
  const options = { year: 'numeric', month: 'short', day: 'numeric' };

  return date.toLocaleDateString(undefined, options);
}