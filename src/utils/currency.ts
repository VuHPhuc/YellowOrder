export const formatPrice = (vndValue: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(Math.round(vndValue));
};

export const convertJpyToVnd = (jpyValue: number): number => {
  return Math.round(jpyValue * 160);
};

export const convertVndToJpy = (vndValue: number): number => {
  return Math.round(vndValue / 160);
};

export const formatWithDots = (val: string): string => {
  const clean = val.replace(/\D/g, '');
  if (!clean) return '';
  return parseInt(clean, 10).toLocaleString('vi-VN');
};
