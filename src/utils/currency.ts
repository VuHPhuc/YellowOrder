export const formatPrice = (usdValue: number): string => {
  const vndValue = Math.round(usdValue * 25000);
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(vndValue);
};
