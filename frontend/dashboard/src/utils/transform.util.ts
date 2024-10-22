export function transformVNMoney(value: number) {
  return new Intl.NumberFormat('vn-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
}
