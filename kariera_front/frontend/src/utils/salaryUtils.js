// src/utils/salaryUtils.js
export const formatSalary = (salary) => {
  if (!salary) return "Competitive";

  if (typeof salary === "number") {
    return `$${salary.toLocaleString()}`;
  }

  if (typeof salary === "object") {
    if (salary.min && salary.max) {
      return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;
    }
    if (salary.amount) {
      return `$${salary.amount.toLocaleString()}`;
    }
  }

  if (typeof salary === "string") {
    return salary;
  }

  return "Competitive";
};

export const getSalaryAverage = (salary) => {
  if (!salary) return 0;

  if (typeof salary === "number") {
    return salary;
  }

  if (typeof salary === "object" && salary.min && salary.max) {
    return (salary.min + salary.max) / 2;
  }

  if (typeof salary === "object" && salary.amount) {
    return salary.amount;
  }

  return 0;
};

export const getSalaryForComparison = (salary) => {
  if (!salary) return 0;

  // Convert any salary format to a comparable number
  if (typeof salary === "number") {
    return salary;
  }

  if (typeof salary === "object") {
    if (salary.max) return salary.max; // Use max for comparison
    if (salary.amount) return salary.amount;
    if (salary.min) return salary.min;
  }

  if (typeof salary === "string") {
    // Try to extract number from string
    const match = salary.match(/[\d,]+/);
    if (match) {
      return parseInt(match[0].replace(/,/g, ""), 10);
    }
  }

  return 0;
};

export const isValidSalaryData = (salary) => {
  if (!salary) return false;

  if (typeof salary === "number" && salary > 0) {
    return true;
  }

  if (typeof salary === "object") {
    if (salary.min && salary.max && salary.min > 0 && salary.max > 0) {
      return true;
    }
    if (salary.amount && salary.amount > 0) {
      return true;
    }
  }

  if (typeof salary === "string" && salary.trim() !== "") {
    return true;
  }

  return false;
};

// Helper function to format salary ranges
export const formatSalaryRange = (min, max) => {
  if (!min || !max) return "Competitive";
  return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
};

// Helper function to convert salary to annual if needed
export const convertToAnnual = (amount, period = "annual") => {
  if (!amount || typeof amount !== "number") return 0;

  switch (period.toLowerCase()) {
    case "hourly":
      return amount * 40 * 52; // 40 hours/week, 52 weeks/year
    case "monthly":
      return amount * 12;
    case "weekly":
      return amount * 52;
    case "annual":
    case "yearly":
    default:
      return amount;
  }
};

// Default export for backward compatibility (though we should use named exports)
const salaryUtils = {
  formatSalary,
  getSalaryAverage,
  getSalaryForComparison,
  isValidSalaryData,
  formatSalaryRange,
  convertToAnnual,
};

export default salaryUtils;
