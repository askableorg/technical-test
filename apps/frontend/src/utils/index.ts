const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return String(error);
};

const formatPrice = (value: number | string, currency = 'AUD', locale = 'en-au') => {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(Number(value));
};

export { getErrorMessage, formatPrice };
