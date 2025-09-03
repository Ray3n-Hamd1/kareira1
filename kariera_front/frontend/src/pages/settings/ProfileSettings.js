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
        error ? "border-red-500" : "border-gray-700"
      } ${className}`}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
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

export default function ProfileSettings() {
  const { user, updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingUserData, setFetchingUserData] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [validationErrors, setValidationErrors] = useState({});
  const [initialFormData, setInitialFormData] = useState(null);

  // Initialize form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
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
    const newFormData = {
      firstName,
      lastName,
      email: userData.email || "",
      phone: userData.phone || userData.phoneNumber || userData.mobile || "",
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

  // Validate individual field
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
        if (value) {
          validation = validationUtils.phone.validate(value);
        }
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

    // Clear messages when user starts typing
    if (message.text) {
      setMessage({ type: "", text: "" });
    }

    // Handle country change - reset city and postalCode
    if (id === "country") {
      setFormData((prev) => ({ ...prev, city: "", postalCode: "" }));
      setValidationErrors((prev) => ({ ...prev, city: "", postalCode: "" }));
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
        }
      }
    });
    setValidationErrors(errors);
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
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone || null,
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
        />

        {/* Phone Number */}
        <ValidatedInput
          id="phone"
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={(e) => handleKeyDown(e, "phone")}
          placeholder="Enter phone number with country code"
          error={validationErrors.phone}
        />

        {/* Profession */}
        <ValidatedInput
          id="profession"
          label="Profession"
          value={formData.profession}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your profession or job title"
          error={validationErrors.profession}
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
          />
          <ValidatedInput
            id="postalCode"
            label="Postal Code"
            value={formData.postalCode}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => handleKeyDown(e, "postalCode")}
            placeholder="Enter postal code"
            errorIrrelevant={validationErrors.postalCode}
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
