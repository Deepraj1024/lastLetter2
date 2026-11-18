export const getInvestmentLabel = (type: string): string => {
  if (type === 'daily_saving') {
    return 'Daily';
  }
  if (type === 'instant_saving') {
    return 'Instant';
  }
  return type;
};

export const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleString('en-IN', {
    day: '2-digit',
    hour: '2-digit',
    hour12: true,
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  });
