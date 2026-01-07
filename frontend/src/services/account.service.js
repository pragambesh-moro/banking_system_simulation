import api from './api';

/**
 * Get account details by ID
 */
export const getAccount = async (accountId) => {
  const response = await api.get(`/api/v1/accounts/${accountId}`);
  return response.data;
};

/**
 * Get account by account number
 */
export const getAccountByNumber = async (accountNumber) => {
  const response = await api.get(`/api/v1/accounts/by-number/${accountNumber}`);
  return response.data;
};

/**
 * Get transaction history for an account
 */
export const getTransactionHistory = async (accountId, limit = 10, offset = 0) => {
  const response = await api.get(`/api/v1/accounts/${accountId}/history`, {
    params: { limit, offset }
  });
  return response.data;
};

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (accountId, days = 30) => {
  const response = await api.get(`/api/v1/accounts/${accountId}/stats`, {
    params: { days }
  });
  return response.data;
};

/**
 * Make a deposit
 */
export const deposit = async (accountId, amount, description = '') => {
  const response = await api.post('/api/v1/transactions/deposit', {
    account_id: accountId,
    amount: parseFloat(amount),
    description
  });
  return response.data;
};

/**
 * Make a withdrawal
 */
export const withdraw = async (accountId, amount, description = '') => {
  const response = await api.post('/api/v1/transactions/withdraw', {
    account_id: accountId,
    amount: parseFloat(amount),
    description
  });
  return response.data;
};

/**
 * Make a transfer by account number
 */
export const transferByAccountNumber = async (fromAccountId, toAccountNumber, amount, description = '') => {
  const response = await api.post('/api/v1/transactions/transfer-by-account', {
    from_account_id: fromAccountId,
    to_account_number: toAccountNumber,
    amount: parseFloat(amount),
    description
  });
  return response.data;
};

/**
 * Make a transfer (legacy - by account ID)
 */
export const transfer = async (fromAccountId, toAccountId, amount, description = '') => {
  const response = await api.post('/api/v1/transactions/transfer', {
    from_account_id: fromAccountId,
    to_account_id: toAccountId,
    amount: parseFloat(amount),
    description
  });
  return response.data;
};

/**
 * Create a new account
 */
export const createAccount = async (userId, initialBalance = 0) => {
  const response = await api.post('/api/v1/accounts', {
    user_id: userId,
    initial_balance: parseFloat(initialBalance)
  });
  return response.data;
};
