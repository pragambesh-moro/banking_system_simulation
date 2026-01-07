/**
 * Format a number as currency (USD)
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a date string to a readable format
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  const options = {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

/**
 * Format account number with prefix
 */
export const formatAccountNumber = (accountId) => {
  return `ACC-${String(accountId).padStart(6, '0')}`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format transaction amount with sign
 */
export const formatTransactionAmount = (amount, type) => {
  const formattedAmount = formatCurrency(Math.abs(amount));
  
  if (type === 'CREDIT' || type === 'credit' || amount > 0) {
    return `+${formattedAmount}`;
  } else if (type === 'DEBIT' || type === 'debit' || amount < 0) {
    return `-${formattedAmount}`;
  }
  
  return formattedAmount;
};
