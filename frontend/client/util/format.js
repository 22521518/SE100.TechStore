
export const formattedPrice = (price=0) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(price)
}

export const formattedDate = (dateString, daysToAdd = 0) => {
  if (!dateString) return '';
  const date = new Date(dateString);

  // Add days if needed
  date.setDate(date.getDate() + daysToAdd);

  // Get day, month, and year
  const day = String(date.getDate()).padStart(2, '0'); // Ensures two digits
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = date.getFullYear();

  // Return formatted date as "dd-mm-yyyy"
  return `${day}-${month}-${year}`;
};