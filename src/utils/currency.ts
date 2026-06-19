export const formatPrice = (vndValue: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(Math.round(vndValue));
};

export const convertJpyToVnd = (jpyValue: number): number => {
  return Math.round(jpyValue * 160);
};
