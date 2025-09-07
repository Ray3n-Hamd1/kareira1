// Fix for "Objects are not valid as a React child" error
// The issue is rendering objects directly in JSX instead of formatting them

// ❌ WRONG - This causes the error:
// <span>{job.salary}</span>  // This renders {min: 100000, max: 150000, currency: "USD"}

// ✅ CORRECT - Format the object first:
// <span>{formatSalary(job.salary)}</span>

// Universal salary formatter function
export const formatSalary = (salary) => {
  // Handle null/undefined salary
  if (!salary) {
    return "Salary not specified";
  }

  // Handle salary object with min/max
  if (salary.min && salary.max) {
    const currency = salary.currency || "USD";
    const symbol =
      currency === "USD" ? "$" : currency === "EUR" ? "€" : currency;

    if (salary.min === salary.max) {
      return `${symbol}${(salary.min / 1000).toFixed(0)}k`;
    }
    return `${symbol}${(salary.min / 1000).toFixed(0)}k - ${symbol}${(
      salary.max / 1000
    ).toFixed(0)}k`;
  }

  // Handle single amount
  if (salary.amount) {
    const currency = salary.currency || "USD";
    const symbol =
      currency === "USD" ? "$" : currency === "EUR" ? "€" : currency;
    return `${symbol}${(salary.amount / 1000).toFixed(0)}k`;
  }

  // Handle string salaries
  if (typeof salary === "string") {
    return salary;
  }

  // Handle number salaries
  if (typeof salary === "number") {
    return `$${(salary / 1000).toFixed(0)}k`;
  }

  return "Competitive salary";
};

// Fix for EnhancedBulkActionBar.js - Update the problematic line
// Find this line in your code and replace it:
const BulkActionBarFix = ({ selectionStats }) => {
  const formatSalary = (amount) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}k`;
    return `$${amount}`;
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-xs text-gray-400">
        {selectionStats.companies} compan
        {selectionStats.companies !== 1 ? "ies" : "y"} • Avg.{" "}
        {/* ❌ WRONG: {selectionStats.avgSalary} */}
        {/* ✅ CORRECT: */}
        {typeof selectionStats.avgSalary === "object"
          ? formatSalary(
              (selectionStats.avgSalary.min + selectionStats.avgSalary.max) / 2
            )
          : formatSalary(selectionStats.avgSalary)}
      </span>
    </div>
  );
};

// Quick fix component that safely renders any value
export const SafeRender = ({ value, fallback = "N/A" }) => {
  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value === "object") {
    // Don't render objects directly - convert to string or use specific formatter
    if (value.min && value.max) {
      return formatSalary(value);
    }
    return JSON.stringify(value); // Last resort
  }

  return value;
};

// Usage example:
// Instead of: <span>{job.salary}</span>
// Use: <SafeRender value={job.salary} />
// Or better: <span>{formatSalary(job.salary)}</span>

// Common places where this error occurs:
// 1. {job.salary} - should be {formatSalary(job.salary)}
// 2. {filters.salaryRange} - should be {formatSalaryRange(filters.salaryRange)}
// 3. {selectionStats.avgSalary} - should be {formatSalary(selectionStats.avgSalary)}
// 4. {priceObject} - should be {formatPrice(priceObject)}

// To find all instances in your code, search for patterns like:
// - {.*\.salary}
// - {.*\.price}
// - {.*Range}
// And make sure they're properly formatted before rendering
