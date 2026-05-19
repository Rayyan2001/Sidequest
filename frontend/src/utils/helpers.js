// src/utils/helpers.js

/**
 * Format pence amount as GBP string
 * e.g. 1250 → "£12.50"
 */
export const formatCurrency = (pence) => {
  const pounds = (pence / 100).toFixed(2);
  return `£${pounds}`;
};

/**
 * Format a balance for display (strips trailing zeros)
 * e.g. 1250 → "£12.50"  200 → "£2.00"
 */
export const formatBalance = (pence) => {
  return formatCurrency(pence);
};

/**
 * Truncate text to maxLength with ellipsis
 */
export const truncate = (str, maxLength = 40) => {
  if (!str) return '';
  return str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str;
};

/**
 * Capitalize the first letter of a string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Replace template tokens in a string
 * e.g. interpolate("Step {current} of {total}", { current: 2, total: 3 })
 *   → "Step 2 of 3"
 */
export const interpolate = (template, values = {}) => {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    values[key] !== undefined ? String(values[key]) : `{${key}}`
  );
};

/**
 * Format a number with commas
 * e.g. 1250 → "1,250"
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Group an array of objects by a key
 */
export const groupBy = (arr, key) => {
  return arr.reduce((acc, item) => {
    const group = item[key];
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
};

/**
 * Safely parse JSON — returns null on failure
 */
export const safeParseJSON = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

/**
 * Clamp a number between min and max
 */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Check if a string is a valid email
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Check if a password meets minimum requirements
 */
export const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= 8;
};

/**
 * Generate a simple unique ID
 */
export const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
};

/**
 * Format credit label
 * e.g. 125 → "125 Green Credits"
 */
export const formatCredits = (credits) => {
  return `${formatNumber(credits)} Green Credits`;
};
