export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'SecureBank';

export const ROUTES = {
  HOME: '/',
  SIGN_IN: '/login',
  SIGN_UP: '/signup',
  DASHBOARD: '/dashboard',
  TRANSFER: '/transfer',
  TRANSACTIONS: '/transactions',
};

export const TRANSACTION_TYPES = {
  CREDIT: 'CREDIT',
  DEBIT: 'DEBIT',
};