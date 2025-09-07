// src/utils/salaryUtils.js
export const salaryUtils = {
  /**
   * Format a single salary amount
   * @param {number} amount - The salary amount in dollars
   * @param {Object} options - Formatting options
   * @returns {string} Formatted salary string
   */
  formatAmount: (amount, options = {}) => {
    const {
      currency = "$",
      showCents = false,
      compactFormat = true,
      locale = "en-US",
    } = options;

    if (!amount || isNaN(amount) || amount <= 0) {
      return "Not specified";
    }

    // Use compact format by default (e.g., $120k instead of $120,000)
    if (compactFormat) {
      if (amount >= 1000000) {
        return `${currency}${(amount / 1000000).toFixed(1)}M`;
      }
      if (amount >= 1000) {
        return `${currency}${Math.round(amount / 1000)}k`;
      }
      return `${currency}${Math.round(amount)}`;
    }

    // Full format with proper locale formatting
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency === "$" ? "USD" : "USD",
      minimumFractionDigits: showCents ? 2 : 0,
      maximumFractionDigits: showCents ? 2 : 0,
    });

    return formatter.format(amount);
  },

  /**
   * Format a salary range (min and max)
   * @param {Object} salary - Salary object with min/max or amount
   * @param {Object} options - Formatting options
   * @returns {string} Formatted salary range string
   */
  formatRange: (salary, options = {}) => {
    const {
      showRange = true,
      separator = " - ",
      fallbackText = "Competitive salary",
    } = options;

    if (!salary) {
      return fallbackText;
    }

    // Handle single amount
    if (salary.amount && !salary.min && !salary.max) {
      return salaryUtils.formatAmount(salary.amount, options);
    }

    // Handle salary range
    if (salary.min && salary.max && showRange) {
      const minFormatted = salaryUtils.formatAmount(salary.min, options);
      const maxFormatted = salaryUtils.formatAmount(salary.max, options);
      return `${minFormatted}${separator}${maxFormatted}`;
    }

    // Handle single values from range
    if (salary.max) {
      return `Up to ${salaryUtils.formatAmount(salary.max, options)}`;
    }

    if (salary.min) {
      return `From ${salaryUtils.formatAmount(salary.min, options)}`;
    }

    return fallbackText;
  },

  /**
   * Calculate and format average salary
   * @param {Array} salaries - Array of salary objects
   * @param {Object} options - Formatting options
   * @returns {string} Formatted average salary
   */
  formatAverage: (salaries, options = {}) => {
    if (!salaries || salaries.length === 0) {
      return "N/A";
    }

    const total = salaries.reduce((sum, salary) => {
      if (!salary) return sum;

      // Calculate average from range
      if (salary.min && salary.max) {
        return sum + (salary.min + salary.max) / 2;
      }

      // Use single amount
      if (salary.amount) {
        return sum + salary.amount;
      }

      // Use max if only max is available
      if (salary.max) {
        return sum + salary.max;
      }

      // Use min if only min is available
      if (salary.min) {
        return sum + salary.min;
      }

      return sum;
    }, 0);

    const average = total / salaries.length;
    return salaryUtils.formatAmount(average, options);
  },

  /**
   * Format salary for filter displays (always show full numbers)
   * @param {number} amount - The salary amount
   * @param {Object} options - Formatting options
   * @returns {string} Formatted salary for filters
   */
  formatForFilter: (amount, options = {}) => {
    const { currency = "$", locale = "en-US" } = options;

    if (!amount || isNaN(amount) || amount <= 0) {
      return "No minimum";
    }

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  },

  /**
   * Parse salary string back to number (useful for form inputs)
   * @param {string} salaryString - Formatted salary string
   * @returns {number|null} Parsed amount or null if invalid
   */
  parseAmount: (salaryString) => {
    if (!salaryString || typeof salaryString !== "string") {
      return null;
    }

    // Remove currency symbols and whitespace
    const cleaned = salaryString.replace(/[$,\s]/g, "");

    // Handle k/K suffix (thousands)
    if (cleaned.toLowerCase().includes("k")) {
      const num = parseFloat(cleaned.replace(/k/i, ""));
      return isNaN(num) ? null : num * 1000;
    }

    // Handle m/M suffix (millions)
    if (cleaned.toLowerCase().includes("m")) {
      const num = parseFloat(cleaned.replace(/m/i, ""));
      return isNaN(num) ? null : num * 1000000;
    }

    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  },

  /**
   * Validate salary data
   * @param {Object} salary - Salary object to validate
   * @returns {Object} Validation result with isValid and errors
   */
  validate: (salary) => {
    const errors = [];

    if (!salary) {
      return { isValid: false, errors: ["Salary data is required"] };
    }

    // Check for valid salary structure
    const hasAmount = salary.amount && salary.amount > 0;
    const hasRange =
      salary.min && salary.max && salary.min > 0 && salary.max > 0;

    if (!hasAmount && !hasRange) {
      errors.push("Salary must have either an amount or a valid min/max range");
    }

    // Validate range logic
    if (hasRange && salary.min >= salary.max) {
      errors.push("Minimum salary must be less than maximum salary");
    }

    // Check for reasonable salary values
    if (salary.amount && (salary.amount < 1000 || salary.amount > 10000000)) {
      errors.push(
        "Salary amount seems unrealistic (should be between $1,000 and $10,000,000)"
      );
    }

    if (salary.min && (salary.min < 1000 || salary.min > 10000000)) {
      errors.push(
        "Minimum salary seems unrealistic (should be between $1,000 and $10,000,000)"
      );
    }

    if (salary.max && (salary.max < 1000 || salary.max > 10000000)) {
      errors.push(
        "Maximum salary seems unrealistic (should be between $1,000 and $10,000,000)"
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

// Export individual functions for convenience
export const {
  formatAmount,
  formatRange,
  formatAverage,
  formatForFilter,
  parseAmount,
  validate: validateSalary,
} = salaryUtils;

// Export default
export default salaryUtils;
