import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { validationUtils, inputFormatters } from "../../utils/validationUtils";
import { countries } from "../../data/countries";
import CityDropdown from "../../components/CityDropdown";
import axios from "axios";

// Hoisted ValidatedInput component to prevent re-definition on re-renders
const ValidatedInput = ({
  id,
  label,
  type = "text",
  required = false,
  placeholder,
  value,
  onChange,
  onBlur,
  onKeyDown,
  error = "",
  success = "",
  className = "",
  ...props
}) => (
  <div className="mb-6">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-300 mb-2"
    >
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
        error
          ? "border-red-500"
          : success
          ? "border-green-500"
          : "border-gray-700"
      } ${className}`}
      aria-invalid={!!error}
      aria-describedby={
        error ? `${id}-error` : success ? `${id}-success` : undefined
      }
      autoComplete="off"
      {...props}
    />
    {error && (
      <p
        id={`${id}-error`}
        className="mt-1 text-sm text-red-400 flex items-center"
      >
        <svg
          className="w-4 h-4 mr-1 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        {error}
      </p>
    )}
    {success && !error && (
      <p
        id={`${id}-success`}
        className="mt-1 text-sm text-green-400 flex items-center"
      >
        <svg
          className="w-4 h-4 mr-1 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        {success}
      </p>
    )}
  </div>
);

// Hoisted CountryDropdown component
const CountryDropdown = ({
  value,
  onChange,
  onBlur,
  error = "",
  countries,
}) => (
  <div className="mb-6">
    <label
      htmlFor="country"
      className="block text-sm font-medium text-gray-300 mb-2"
    >
      Country <span className="text-red-400 ml-1">*</span>
    </label>
    <select
      id="country"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
        error ? "border-red-500" : "border-gray-700"
      }`}
      aria-invalid={!!error}
      aria-describedby={error ? "country-error" : undefined}
    >
      <option value="">Select a country</option>
      {countries.map((country) => (
        <option key={country.code} value={country.code}>
          {country.flag} {country.name}
        </option>
      ))}
    </select>
    {error && (
      <p id="country-error" className="mt-1 text-sm text-red-400">
        {error}
      </p>
    )}
  </div>
);

// Fixed CountryCodeSelect component - shows country code instead of name
const CountryCodeSelect = ({ value, onChange, error = "", countries }) => {
  // Helper to get possible dial code property
  const getDial = (c) =>
    c.dial_code || c.dialCode || c.callingCode || c.phone || "";

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Country code
      </label>
      <select
        id="phoneCountryCode"
        value={value || ""}
        onChange={onChange}
        className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent border-gray-700`}
      >
        <option value="">Select code</option>
        {countries.map((country) => {
          const dial = getDial(country);
          return (
            <option key={country.code} value={dial}>
              {country.flag ? `${country.flag} ` : ""}
              {country.code} {dial ? `${dial}` : ""}
            </option>
          );
        })}
      </select>
      {/* Don't show error under country code field */}
    </div>
  );
};

export default function ProfileSettings() {
  const { user, updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingUserData, setFetchingUserData] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [validationErrors, setValidationErrors] = useState({});
  const [validationSuccess, setValidationSuccess] = useState({});
  const [initialFormData, setInitialFormData] = useState(null);

  // Consolidated form data (added phoneCountryCode & phoneLocal)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    phoneCountryCode: "",
    phoneLocal: "",
    profession: "",
    country: "",
    city: "",
    district: "",
    postalCode: "",
  });

  // Load user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      setFetchingUserData(true);
      try {
        if (user) {
          updateFormWithUserData(user, "auth context");
        }
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const API_URL =
              process.env.REACT_APP_API_URL || "http://localhost:5000/api";
            const response = await axios.get(`${API_URL}/auth/me`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            let apiUserData = response.data?.user || response.data;
            if (apiUserData) {
              updateFormWithUserData(apiUserData, "API");
            }
          } catch (error) {
            console.error(
              "[ProfileSettings] Error fetching user data from API:",
              error
            );
          }
        }
      } catch (error) {
        console.error("[ProfileSettings] Unexpected error:", error);
      } finally {
        setFetchingUserData(false);
      }
    };
    fetchUserData();
  }, [user]);

  // Update form data and save initial data for reset
  const updateFormWithUserData = (userData, source = "unknown") => {
    if (!userData) return;
    let firstName = userData.firstName || userData.first_name || "";
    let lastName = userData.lastName || userData.last_name || "";
    if (!firstName && !lastName && userData.name) {
      const nameParts = userData.name.split(" ");
      firstName = nameParts[0] || "";
      lastName = nameParts.slice(1).join(" ") || "";
    }
    const rawPhone =
      userData.phone || userData.phoneNumber || userData.mobile || "";
    // Try to parse a leading international code like "+234 ..." or "+1-..."
    let phoneCountryCode = "";
    let phoneLocal = rawPhone || "";
    if (rawPhone) {
      const match = rawPhone.match(/^(\+\d{1,4})\s*(.*)$/);
      if (match) {
        phoneCountryCode = match[1];
        phoneLocal = match[2] || "";
      } else {
        // fallback: if user has country, try to derive dial code from countries list
        const found = countries.find(
          (c) =>
            c.code &&
            (c.code.toUpperCase() === (userData.country || "").toUpperCase() ||
              c.name?.toLowerCase() === (userData.country || "").toLowerCase())
        );
        phoneCountryCode = found ? found.dial_code || found.dialCode || "" : "";
      }
    }

    const newFormData = {
      firstName,
      lastName,
      email: userData.email || "",
      phone: rawPhone || "",
      phoneCountryCode: phoneCountryCode || "",
      phoneLocal: phoneLocal || "",
      profession:
        userData.profession || userData.occupation || userData.jobTitle || "",
      country: userData.country || userData.countryCode || "",
      city: userData.city || userData.cityCountry || userData.location || "",
      district: userData.district || userData.area || userData.region || "",
      postalCode: userData.postalCode || userData.zipCode || userData.zip || "",
    };
    setFormData(newFormData);
    if (!initialFormData) {
      setInitialFormData(newFormData);
    }
  };

  // Get success message for valid fields
  const getSuccessMessage = (fieldName, value) => {
    switch (fieldName) {
      case "phone":
        return "✓ Phone number format is valid";
      case "email":
        return "✓ Email format is valid";
      case "postalCode":
        return "✓ Postal code format is valid";
      default:
        return "";
    }
  };

  // Validate individual field (phone combines parts)
  const validateField = (name, value) => {
    let validation = { isValid: true, message: "" };
    switch (name) {
      case "firstName":
      case "lastName":
        validation = validationUtils.required(
          value,
          name === "firstName" ? "First name" : "Last name"
        );
        if (validation.isValid) {
          validation = validationUtils.length(
            value,
            2,
            50,
            name === "firstName" ? "First name" : "Last name"
          );
        }
        break;
      case "email":
        validation = validationUtils.email.validate(value);
        break;
      case "phone":
        // Only validate the combined phone when we have both parts
        const countryCode = formData.phoneCountryCode || "";
        const localNumber = formData.phoneLocal || value || "";

        // If neither field has a value, it's valid (optional field)
        if (!countryCode && !localNumber) {
          validation = { isValid: true, message: "" };
          break;
        }

        // If we have a country code but no local number, show error
        if (countryCode && !localNumber) {
          validation = {
            isValid: false,
            message: "Please enter a phone number",
          };
          break;
        }

        // If we have a local number but no country code, show error
        if (!countryCode && localNumber) {
          validation = {
            isValid: false,
            message: "Please select a country code",
          };
          break;
        }

        // Validate the complete phone number - be more lenient
        const fullPhone = `${countryCode} ${localNumber}`.trim();
        if (fullPhone) {
          // Simple validation - just check if we have digits
          const digitsOnly = fullPhone.replace(/\D/g, "");
          if (digitsOnly.length >= 7 && digitsOnly.length <= 15) {
            validation = { isValid: true, message: "" };
          } else {
            validation = {
              isValid: false,
              message: "Phone number should be 7-15 digits",
            };
          }
        }
        break;
      case "phoneCountryCode":
        // Don't validate country code by itself - only when combined with local number
        validation = { isValid: true, message: "" };
        break;
      case "phoneLocal":
        // Don't validate local number by itself - only when combined with country code
        validation = { isValid: true, message: "" };
        break;
      case "postalCode":
        if (value) {
          validation = validationUtils.postalCode.validate(
            value,
            formData.country
          );
        }
        break;
      case "profession":
        validation = validationUtils.length(value, 0, 100, "Profession");
        break;
      case "district":
        validation = validationUtils.length(value, 0, 100, "District");
        break;
      case "city":
        validation = validationUtils.required(value, "City");
        break;
      case "country":
        validation = validationUtils.required(value, "Country");
        break;
      default:
        break;
    }
    return validation;
  };

  // Handle key down for phone and postalCode to restrict invalid characters
  const handleKeyDown = (e, field) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
    ];
    if (allowedKeys.includes(e.key)) return;

    if (field === "phone") {
      // Allow digits, +, -, and space
      if (!/[0-9+\-\s]/.test(e.key)) {
        e.preventDefault();
      }
    } else if (field === "postalCode") {
      // Restrict based on country-specific patterns
      const country = formData.country;
      const postalCodePatterns = {
        US: /^[0-9]$/, // Only digits for US
        CA: /^[A-Za-z0-9]$/, // Alphanumeric for CA
        GB: /^[A-Za-z0-9]$/, // Alphanumeric for GB
        // Add more country-specific patterns as needed
      };
      const pattern = postalCodePatterns[country] || /^[A-Za-z0-9\s\-]$/;
      if (!pattern.test(e.key)) {
        e.preventDefault();
      }
    }
  };

  // Handle input change without formatting
  const handleChange = (e) => {
    const { id, value } = e.target;

    // For phone fields, handle them with special care
    if (id === "phoneLocal" || id === "phoneCountryCode") {
      // Don't use this handler for phone fields - they have their own handlers
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Validate field in real-time with raw value
    const validation = validateField(id, value);
    setValidationErrors((prev) => ({
      ...prev,
      [id]: validation.isValid ? "" : validation.message,
    }));

    // Set success message for valid fields
    setValidationSuccess((prev) => ({
      ...prev,
      [id]: validation.isValid && value ? getSuccessMessage(id, value) : "",
    }));

    // Clear messages when user starts typing
    if (message.text) {
      setMessage({ type: "", text: "" });
    }

    // Handle country change - reset city and postalCode
    if (id === "country") {
      setFormData((prev) => ({ ...prev, city: "", postalCode: "" }));
      setValidationErrors((prev) => ({ ...prev, city: "", postalCode: "" }));
      setValidationSuccess((prev) => ({ ...prev, city: "", postalCode: "" }));
    }
  };

  // Handle phone country code change
  const handlePhoneCountryChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      phoneCountryCode: value,
    }));

    // Validate the combined phone number
    const combinedPhone = value + " " + (formData.phoneLocal || "");
    const validation = validateField("phone", combinedPhone.trim());
    setValidationErrors((prev) => ({
      ...prev,
      phone: validation.isValid ? "" : validation.message,
      phoneCountryCode: "", // Clear any previous error on country code field
    }));

    // Set success message for valid phone
    setValidationSuccess((prev) => ({
      ...prev,
      phone:
        validation.isValid && combinedPhone.trim()
          ? getSuccessMessage("phone", combinedPhone.trim())
          : "",
    }));

    // Clear messages when user starts typing
    if (message.text) {
      setMessage({ type: "", text: "" });
    }
  };

  // Handle phone local number change
  const handlePhoneLocalChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      phoneLocal: value,
    }));

    // Validate the combined phone number
    const combinedPhone = (formData.phoneCountryCode || "") + " " + value;
    const validation = validateField("phone", combinedPhone.trim());
    setValidationErrors((prev) => ({
      ...prev,
      phone: validation.isValid ? "" : validation.message,
      phoneLocal: "", // Clear any previous error on local number field
    }));

    // Set success message for valid phone
    setValidationSuccess((prev) => ({
      ...prev,
      phone:
        validation.isValid && combinedPhone.trim()
          ? getSuccessMessage("phone", combinedPhone.trim())
          : "",
    }));

    // Clear messages when user starts typing
    if (message.text) {
      setMessage({ type: "", text: "" });
    }
  };

  // Handle blur for formatting and final validation
  const handleBlur = (e) => {
    const { id } = e.target;
    let formattedValue = formData[id];

    switch (id) {
      case "phone":
        formattedValue = inputFormatters.phone(formattedValue);
        break;
      case "email":
        formattedValue = inputFormatters.email(formattedValue);
        break;
      case "postalCode":
        formattedValue = inputFormatters.postalCode(
          formattedValue,
          formData.country
        );
        break;
      case "firstName":
      case "lastName":
        formattedValue = inputFormatters.alphaOnly(formattedValue);
        formattedValue = inputFormatters.titleCase(formattedValue);
        break;
      case "city":
        formattedValue = inputFormatters.titleCase(formattedValue);
        break;
      case "district":
        formattedValue = inputFormatters.titleCase(formattedValue);
        break;
      case "phoneLocal":
      case "phoneCountryCode":
        // attempt to format & update combined phone
        const combined =
          (formData.phoneCountryCode ? formData.phoneCountryCode + " " : "") +
          (formData.phoneLocal || "");
        const formatted = inputFormatters.phone
          ? inputFormatters.phone(combined)
          : combined;
        // try to split back into country + local
        const match = formatted
          ? formatted.match(/^(\+\d{1,4})\s*(.*)$/)
          : null;
        if (match) {
          setFormData((prev) => ({
            ...prev,
            phoneCountryCode: match[1],
            phoneLocal: match[2] || "",
            phone: formatted,
          }));
        } else {
          setFormData((prev) => ({ ...prev, phone: formatted || combined }));
        }
        return;
      default:
        break;
    }

    if (formattedValue !== formData[id]) {
      setFormData((prev) => ({
        ...prev,
        [id]: formattedValue,
      }));
    }

    // Validate on blur with formatted value
    const validation = validateField(id, formattedValue);
    setValidationErrors((prev) => ({
      ...prev,
      [id]: validation.isValid ? "" : validation.message,
    }));

    // Set success message for valid fields
    setValidationSuccess((prev) => ({
      ...prev,
      [id]:
        validation.isValid && formattedValue
          ? getSuccessMessage(id, formattedValue)
          : "",
    }));
  };

  // Handle city change from dropdown
  const handleCityChange = (cityName) => {
    setFormData((prev) => ({
      ...prev,
      city: cityName,
    }));

    const validation = validateField("city", cityName);
    setValidationErrors((prev) => ({
      ...prev,
      city: validation.isValid ? "" : validation.message,
    }));

    // Set success message for valid city
    setValidationSuccess((prev) => ({
      ...prev,
      city: validation.isValid && cityName ? "✓ City selected" : "",
    }));

    if (message.text) {
      setMessage({ type: "", text: "" });
    }
  };

  // Handle photo change with upload
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setMessage({ type: "error", text: "Please select a valid image file" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "Image size must be less than 5MB" });
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const API_URL =
          process.env.REACT_APP_API_URL || "http://localhost:5000/api";
        const formData = new FormData();
        formData.append("photo", file);
        const response = await axios.post(
          `${API_URL}/auth/upload-photo`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setMessage({ type: "success", text: "Photo uploaded successfully" });
      } catch (error) {
        setMessage({
          type: "error",
          text: error.response?.data?.message || "Failed to upload photo",
        });
      }
    }
  };

  // Validate all fields
  const validateAllFields = () => {
    const errors = {};
    const success = {};
    let isValid = true;
    Object.keys(formData).forEach((key) => {
      if (
        key !== "district" &&
        key !== "postalCode" &&
        key !== "phone" &&
        key !== "profession"
      ) {
        const validation = validateField(key, formData[key]);
        if (!validation.isValid) {
          errors[key] = validation.message;
          isValid = false;
        } else if (formData[key]) {
          success[key] = getSuccessMessage(key, formData[key]);
        }
      }
    });
    setValidationErrors(errors);
    setValidationSuccess(success);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    if (!validateAllFields()) {
      setIsLoading(false);
      setMessage({
        type: "error",
        text: "Please fix the errors before submitting",
      });
      return;
    }

    try {
      const fullPhone =
        (formData.phoneCountryCode ? formData.phoneCountryCode + " " : "") +
        (formData.phoneLocal || formData.phone || "");
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: fullPhone ? fullPhone.trim() : null,
        profession: formData.profession || null,
        country: formData.country,
        city: formData.city,
        district: formData.district || null,
        postalCode: formData.postalCode || null,
      };
      if (updateUserProfile) {
        const result = await updateUserProfile(profileData);
        if (result && result.success) {
          setMessage({
            type: "success",
            text: result.message || "Profile updated successfully!",
          });
          if (result.user) {
            updateFormWithUserData(result.user, "update response");
          } else {
            updateFormWithUserData({ ...profileData }, "submitted data");
          }
        } else {
          throw new Error(result?.error || "Failed to update profile");
        }
      } else {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      let errorMessage = "Failed to update profile. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
    if (initialFormData) {
      setFormData(initialFormData);
    }
    setValidationErrors({});
    setValidationSuccess({});
    setMessage({ type: "", text: "" });
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (formData.firstName && formData.lastName) {
      return `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase();
    }
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.name) {
      const names = user.name.split(" ");
      return names.length > 1
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : names[0][0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  if (fetchingUserData) {
    return (
      <div
        className="bg-gray-900 rounded-lg p-8 flex items-center justify-center"
        style={{ minHeight: "300px" }}
      >
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-8">
      <h2 className="text-2xl font-semibold text-white mb-8">
        Profile Information
      </h2>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-900 border border-green-700 text-green-300"
              : "bg-red-900 border border-red-700 text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Profile Photo */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-semibold text-white">
                {getUserInitials()}
              </span>
            </div>
            <div>
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <label
                htmlFor="photo"
                className="inline-flex items-center px-4 py-2 bg-transparent border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 cursor-pointer transition-colors"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    document.getElementById("photo").click();
                  }
                }}
              >
                Change Photo
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Max size: 5MB. Formats: JPG, PNG, GIF
              </p>
            </div>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-6">
          <ValidatedInput
            id="firstName"
            label="First Name"
            required
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter first name"
            error={validationErrors.firstName}
            success={validationSuccess.firstName}
          />
          <ValidatedInput
            id="lastName"
            label="Last Name"
            required
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter last name"
            error={validationErrors.lastName}
            success={validationSuccess.lastName}
          />
        </div>

        {/* Email */}
        <ValidatedInput
          id="email"
          label="Email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your email address"
          error={validationErrors.email}
          success={validationSuccess.email}
        />

        {/* Phone Number split: country code + local number */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <CountryCodeSelect
              value={formData.phoneCountryCode}
              onChange={handlePhoneCountryChange}
              error="" // Don't pass phone error to country code field
              countries={countries}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              id="phoneLocal"
              type="tel"
              value={formData.phoneLocal}
              onChange={handlePhoneLocalChange}
              onBlur={handleBlur}
              onKeyDown={(e) => handleKeyDown(e, "phone")}
              placeholder="Enter phone number without country code"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {/* Show the phone validation error only once, under the local number field */}
            {validationErrors.phone && (
              <p className="mt-1 text-sm text-red-400 flex items-center">
                <svg
                  className="w-4 h-4 mr-1 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {validationErrors.phone}
              </p>
            )}
            {/* Show success message when phone is valid */}
            {validationSuccess.phone && !validationErrors.phone && (
              <p className="mt-1 text-sm text-green-400 flex items-center">
                <svg
                  className="w-4 h-4 mr-1 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {validationSuccess.phone}
              </p>
            )}
          </div>
        </div>

        {/* Profession */}
        <ValidatedInput
          id="profession"
          label="Profession"
          value={formData.profession}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your profession or job title"
          error={validationErrors.profession}
          success={validationSuccess.profession}
        />

        {/* Location Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CountryDropdown
            value={formData.country}
            onChange={handleChange}
            onBlur={handleBlur}
            error={validationErrors.country}
            countries={countries}
          />
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              City <span className="text-red-400 ml-1">*</span>
            </label>
            <CityDropdown
              countryCode={formData.country}
              value={formData.city}
              onChange={handleCityChange}
              required
              error={validationErrors.city}
              disabled={!formData.country}
            />
            {/* Show success message for city */}
            {validationSuccess.city && !validationErrors.city && (
              <p className="mt-1 text-sm text-green-400 flex items-center">
                <svg
                  className="w-4 h-4 mr-1 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {validationSuccess.city}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ValidatedInput
            id="district"
            label="District/State/Province"
            value={formData.district}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter district or state"
            error={validationErrors.district}
            success={validationSuccess.district}
          />
          <ValidatedInput
            id="postalCode"
            label="Postal Code"
            value={formData.postalCode}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => handleKeyDown(e, "postalCode")}
            placeholder="Enter postal code"
            error={validationErrors.postalCode}
            success={validationSuccess.postalCode}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center mt-8 space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
                <span>Saving...</span>
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-8 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
