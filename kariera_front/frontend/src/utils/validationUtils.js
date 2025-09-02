// src/utils/validationUtils.js
export const validationUtils = {
  // Phone number validation and formatting
  phone: {
    validate: (phone) => {
      if (!phone) return { isValid: true, message: "" };

      // Remove all non-digits
      const digitsOnly = phone.replace(/\D/g, "");

      // Check various international formats
      const patterns = [
        /^\+?1?[2-9]\d{9}$/, // US/Canada: +1234567890 or 1234567890
        /^\+?44[1-9]\d{8,9}$/, // UK: +441234567890
        /^\+?33[1-9]\d{8}$/, // France: +33123456789
        /^\+?49[1-9]\d{7,11}$/, // Germany: +4912345678
        /^\+?216[2-9]\d{7}$/, // Tunisia: +21612345678
        /^\+?\d{7,15}$/, // General international format
      ];

      const isValid = patterns.some((pattern) => pattern.test(phone));

      return {
        isValid,
        message: isValid
          ? ""
          : "Please enter a valid phone number (7-15 digits with optional country code)",
      };
    },

    format: (phone) => {
      if (!phone) return "";

      // Remove all non-digits except +
      let cleaned = phone.replace(/[^\d+]/g, "");

      // If it starts with country code, keep the +
      if (cleaned.startsWith("+")) {
        return cleaned;
      }

      // Auto-format based on length and patterns
      const digits = cleaned.replace(/\D/g, "");

      if (digits.length === 10) {
        // US format: (123) 456-7890
        return digits.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
      } else if (digits.length === 11 && digits.startsWith("1")) {
        // US with country code: +1 (234) 567-8900
        return (
          "+1 (" +
          digits.slice(1, 4) +
          ") " +
          digits.slice(4, 7) +
          "-" +
          digits.slice(7)
        );
      } else if (digits.length >= 7) {
        // International format with spaces every 3 digits
        return (
          "+" + digits.replace(/(\d{1,3})(\d{1,3})?(\d+)?/, "$1 $2 $3").trim()
        );
      }

      return cleaned;
    },
  },

  // Email validation
  email: {
    validate: (email) => {
      if (!email) return { isValid: false, message: "Email is required" };

      // Comprehensive email regex
      const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

      const isValid = emailRegex.test(email);

      // Additional checks
      if (isValid) {
        const parts = email.split("@");
        if (parts[0].length > 64 || parts[1].length > 253) {
          return { isValid: false, message: "Email address is too long" };
        }

        if (
          email.includes("..") ||
          email.startsWith(".") ||
          email.endsWith(".")
        ) {
          return { isValid: false, message: "Email address format is invalid" };
        }
      }

      return {
        isValid,
        message: isValid ? "" : "Please enter a valid email address",
      };
    },

    format: (email) => {
      return email ? email.toLowerCase().trim() : "";
    },
  },

  // Postal code validation (supports multiple countries)
  postalCode: {
    validate: (postalCode, countryCode = "US") => {
      if (!postalCode) return { isValid: true, message: "" };

      const patterns = {
        US: /^\d{5}(-\d{4})?$/, // 12345 or 12345-6789
        CA: /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/, // K1A 0A6 or K1A0A6
        UK: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, // SW1A 1AA
        FR: /^\d{5}$/, // 75001
        DE: /^\d{5}$/, // 10115
        TN: /^\d{4}$/, // 1000 (Tunisia)
        AU: /^\d{4}$/, // 2000
        JP: /^\d{3}-?\d{4}$/, // 123-4567
        IN: /^\d{6}$/, // 110001
        BR: /^\d{5}-?\d{3}$/, // 01234-567
      };

      const pattern = patterns[countryCode] || patterns.US;
      const isValid = pattern.test(postalCode.trim());

      const formatExamples = {
        US: "12345 or 12345-6789",
        CA: "K1A 0A6",
        UK: "SW1A 1AA",
        FR: "75001",
        DE: "10115",
        TN: "1000",
        AU: "2000",
        JP: "123-4567",
        IN: "110001",
        BR: "01234-567",
      };

      return {
        isValid,
        message: isValid
          ? ""
          : `Please enter a valid postal code (format: ${
              formatExamples[countryCode] || formatExamples.US
            })`,
      };
    },

    format: (postalCode, countryCode = "US") => {
      if (!postalCode) return "";

      const cleaned = postalCode.toUpperCase().trim();

      // Format based on country
      switch (countryCode) {
        case "CA":
          // Canadian postal codes: A1A 1A1
          return cleaned.replace(/^([A-Z]\d[A-Z])(\d[A-Z]\d)$/, "$1 $2");
        case "UK":
          // UK postal codes: SW1A 1AA
          return cleaned.replace(
            /^([A-Z]{1,2}\d[A-Z\d]?)(\d[A-Z]{2})$/,
            "$1 $2"
          );
        case "US":
          // US ZIP codes: 12345-6789
          const digits = cleaned.replace(/\D/g, "");
          if (digits.length === 9) {
            return digits.replace(/(\d{5})(\d{4})/, "$1-$2");
          }
          return digits;
        default:
          return cleaned;
      }
    },
  },

  // General field validation
  required: (value, fieldName) => {
    const isValid = value && value.toString().trim().length > 0;
    return {
      isValid,
      message: isValid ? "" : `${fieldName} is required`,
    };
  },

  // Length validation
  length: (value, min = 0, max = Infinity, fieldName = "Field") => {
    if (!value)
      return {
        isValid: min === 0,
        message: min > 0 ? `${fieldName} is required` : "",
      };

    const length = value.toString().length;
    const isValid = length >= min && length <= max;

    let message = "";
    if (!isValid) {
      if (length < min) {
        message = `${fieldName} must be at least ${min} characters long`;
      } else {
        message = `${fieldName} must be no more than ${max} characters long`;
      }
    }

    return { isValid, message };
  },
};

// Real-time input formatters
export const inputFormatters = {
  phone: (value) => validationUtils.phone.format(value),
  email: (value) => validationUtils.email.format(value),
  postalCode: (value, countryCode) =>
    validationUtils.postalCode.format(value, countryCode),

  // Capitalize words (for names, cities)
  titleCase: (value) => {
    return value
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  },

  // Remove special characters (for names)
  alphaOnly: (value) => {
    return value.replace(/[^a-zA-Z\s-']/g, "");
  },
};
