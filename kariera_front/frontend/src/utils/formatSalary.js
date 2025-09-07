// src/utils/formatSalary.js
export const formatSalary = (salaryData) => {
  // Handle null, undefined, or invalid data
  if (!salaryData) return "$0";

  // If it's already a number, format normally
  if (typeof salaryData === "number") {
    if (salaryData >= 1000000) return `$${(salaryData / 1000000).toFixed(1)}M`;
    if (salaryData >= 1000) return `$${(salaryData / 1000).toFixed(0)}k`;
    return `$${Math.round(salaryData)}`;
  }

  // If it's an object with min, max, currency properties
  if (typeof salaryData === "object" && salaryData.min !== undefined) {
    const amount = salaryData.max
      ? (salaryData.min + salaryData.max) / 2
      : salaryData.min;
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}k`;
    return `$${Math.round(amount)}`;
  }

  // If it's a string, try to parse it
  if (typeof salaryData === "string") {
    const parsed = parseFloat(salaryData);
    if (!isNaN(parsed)) {
      return formatSalary(parsed);
    }
  }

  // Default fallback
  return "$0";
};
