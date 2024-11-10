// Helper function to generate a random voucher code (e.g., 6 characters alphanumeric)
function generateVoucherCode(length = 6)  {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let voucherCode = "";
  for (let i = 0; i < length; i++) {
    voucherCode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return voucherCode;
}


// Main function to generate a voucher
function generateVoucher() {
  // Generate random values for voucher properties
  const voucherName = `Voucher ${Math.floor(Math.random() * 1000)}`;
  const description = `${Math.floor(
    Math.random() * 100
  )}% off`;
  const discountAmount = Math.floor(Math.random() * 50) + 5; // Discount between 5 and 50
  const isActive = Math.random() > 0.5; // Randomly activate or deactivate the voucher
  
  // Generate valid_from (between now and 6 months ago)
  const now = new Date();
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(now.getMonth() - 6); // Set 6 months ago
  
  const validFrom = generateRandomDateInRange(sixMonthsAgo, now);

  // Generate valid_to (between 1 day and 1 month after valid_from)
  const validFromDate = new Date(validFrom);
  const oneDayLater = new Date(validFromDate);
  oneDayLater.setDate(validFromDate.getDate() + 1); // 1 day after valid_from
  
  const oneMonthLater = new Date(validFromDate);
  oneMonthLater.setMonth(validFromDate.getMonth() + 1); // 1 month after valid_from

  const validTo = generateRandomDateInRange(oneDayLater, oneMonthLater);

  const voucherCode = generateVoucherCode();

  return {
    voucher_name: voucherName,
    description: description,
    discount_amount: discountAmount,
    valid_from: validFrom,
    valid_to: validTo,
    is_active: isActive,
    voucher_code: voucherCode,
  };
}

function generateRandomDateInRange(start , end) {
    const startTimestamp = start.getTime();
    const endTimestamp = end.getTime();
    const randomTimestamp = Math.floor(Math.random() * (endTimestamp - startTimestamp)) + startTimestamp;
    return new Date(randomTimestamp).toISOString();
  }

export const generateDummyVouchersData = (num = 1) => {
    const vouchers_list = []

    for(let i = 0 ;i<num;i++) {
        vouchers_list.push(generateVoucher())
    }
    return vouchers_list
};

