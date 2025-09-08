// src/utils/salaryUtils.js - Centralized salary formatting utilities

/**
 * Formats salary data into a human-readable string
 * Handles all possible salary data structures safely
 * @param {*} salaryData - The salary data to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted salary string
 */
export const formatSalary = (salaryData, options = {}) => {
  const {
    defaultCurrency = "$",
    showCurrency = true,
    abbreviated = true,
    fallbackText = "Competitive salary",
  } = options;

  // Handle null/undefined
  if (!salaryData) {
    return fallbackText;
  }

  // Handle if salary is already a string (fallback)
  if (typeof salaryData === "string") {
    return salaryData;
  }

  // Handle if salary is a number (direct amount)
  if (typeof salaryData === "number") {
    return formatAmount(salaryData, {
      defaultCurrency,
      showCurrency,
      abbreviated,
    });
  }

  // Handle object with different structures
  if (typeof salaryData === "object") {
    const currency = getCurrency(
      salaryData.currency,
      defaultCurrency,
      showCurrency
    );

    // Range: min and max
    if (salaryData.min && salaryData.max) {
      const minFormatted = formatAmount(salaryData.min, {
        currency,
        showCurrency,
        abbreviated,
      });
      const maxFormatted = formatAmount(salaryData.max, {
        currency,
        showCurrency,
        abbreviated,
      });
      return `${minFormatted} - ${maxFormatted}`;
    }

    // Single amount
    if (salaryData.amount) {
      return formatAmount(salaryData.amount, {
        currency,
        showCurrency,
        abbreviated,
      });
    }

    // Minimum only
    if (salaryData.min && !salaryData.max) {
      const minFormatted = formatAmount(salaryData.min, {
        currency,
        showCurrency,
        abbreviated,
      });
      return `${minFormatted}+`;
    }

    // Maximum only
    if (salaryData.max && !salaryData.min) {
      const maxFormatted = formatAmount(salaryData.max, {
        currency,
        showCurrency,
        abbreviated,
      });
      return `Up to ${maxFormatted}`;
    }

    // Hourly rate
    if (salaryData.hourly) {
      const hourlyFormatted = formatAmount(salaryData.hourly, {
        currency,
        showCurrency,
        abbreviated: false,
      });
      return `${hourlyFormatted}/hour`;
    }
  }

  return fallbackText;
};

/**
 * Helper function to format individual amounts
 */
const formatAmount = (
  amount,
  { currency = "$", showCurrency = true, abbreviated = true }
) => {
  if (!amount || amount <= 0) return "0";

  const currencySymbol = showCurrency ? currency : "";

  if (abbreviated && amount >= 1000) {
    if (amount >= 1000000) {
      return `${currencySymbol}${(amount / 1000000).toFixed(1)}M`;
    }
    return `${currencySymbol}${(amount / 1000).toFixed(0)}k`;
  }

  return `${currencySymbol}${amount.toLocaleString()}`;
};

/**
 * Helper function to get currency symbol
 */
const getCurrency = (currencyCode, defaultCurrency, showCurrency) => {
  if (!showCurrency) return "";

  const currencyMap = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CAD: "C$",
    AUD: "A$",
  };

  return currencyMap[currencyCode] || defaultCurrency;
};

/**
 * Validates salary data structure
 * @param {*} salaryData
 * @returns {boolean}
 */
export const isValidSalaryData = (salaryData) => {
  if (!salaryData) return false;

  if (typeof salaryData === "string" || typeof salaryData === "number") {
    return true;
  }

  if (typeof salaryData === "object") {
    return !!(
      salaryData.min ||
      salaryData.max ||
      salaryData.amount ||
      salaryData.hourly
    );
  }

  return false;
};

/**
 * Converts salary range to average for calculations
 * @param {*} salaryData
 * @returns {number}
 */
export const getSalaryAverage = (salaryData) => {
  if (!salaryData) return 0;

  if (typeof salaryData === "number") {
    return salaryData;
  }

  if (typeof salaryData === "object") {
    if (salaryData.min && salaryData.max) {
      return (salaryData.min + salaryData.max) / 2;
    }

    if (salaryData.amount) {
      return salaryData.amount;
    }

    if (salaryData.min) {
      return salaryData.min;
    }

    if (salaryData.max) {
      return salaryData.max;
    }
  }

  return 0;
};

/**
 * Formats salary for comparison purposes (always returns a number)
 * @param {*} salaryData
 * @returns {number}
 */
export const getSalaryForComparison = (salaryData) => {
  if (!salaryData) return 0;

  if (typeof salaryData === "number") {
    return salaryData;
  }

  if (typeof salaryData === "object") {
    // Use max for comparison to get the highest potential
    if (salaryData.max) {
      return salaryData.max;
    }

    if (salaryData.amount) {
      return salaryData.amount;
    }

    if (salaryData.min) {
      return salaryData.min;
    }
  }

  return 0;
};

/**
 * Example usage in components:
 *
 * import { formatSalary } from '@/utils/salaryUtils';
 *
 * // Basic usage
 * const salaryString = formatSalary(job.salary);
 *
 * // With options
 * const salaryString = formatSalary(job.salary, {
 *   defaultCurrency: "€",
 *   abbreviated: false,
 *   fallbackText: "Salary negotiable"
 * });
 *
 * // In JSX (ALWAYS SAFE)
 * <span>{formatSalary(job.salary)}</span>
 */
