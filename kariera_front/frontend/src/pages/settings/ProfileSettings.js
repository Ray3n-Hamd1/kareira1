// src/pages/settings/ProfileSettings.js - ENHANCED VERSION
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { validationUtils, inputFormatters } from "../../utils/validationUtils";
import { countries } from "../../data/countries";
import { cityService } from "../../services/cityService";
import axios from "axios";

export default function ProfileSettings() {
  const { user, updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingUserData, setFetchingUserData] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [validationErrors, setValidationErrors] = useState({});

  // City search state
  const [cities, setCities] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [citySearching, setCitySearching] = useState(false);
  const cityInputRef = useRef(null);

  // Initialize form data with empty values
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
              headers: {
                "x-auth-token": token,
                Authorization: `Bearer ${token}`,
              },
            });

            let apiUserData = null;
            if (response.data?.user) {
              apiUserData = response.data.user;
            } else if (response.data) {
              apiUserData = response.data;
            }

            if (apiUserData) {
              updateFormWithUserData(apiUserData, "API");
            }
          } catch (error) {
            console.error("Error fetching user data from API:", error);
          }
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setFetchingUserData(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Update form data helper
  const updateFormWithUserData = (userData, source = "unknown") => {
    if (!userData) return;

    let firstName = userData.firstName || userData.first_name || "";
    let lastName = userData.lastName || userData.last_name || "";

    if (!firstName && !lastName && userData.name) {
      const nameParts = userData.name.split(" ");
      firstName = nameParts[0] || "";
      lastName = nameParts.slice(1).join(" ") || "";
    }

    const phone =
      userData.phone || userData.phoneNumber || userData.mobile || "";
    const profession =
      userData.profession || userData.occupation || userData.jobTitle || "";
    const city =
      userData.city || userData.cityCountry || userData.location || "";
    const district =
      userData.district || userData.area || userData.region || "";
    const postalCode =
      userData.postalCode || userData.zipCode || userData.zip || "";
    const country = userData.country || userData.countryCode || "";

    const newFormData = {
      firstName,
      lastName,
      email: userData.email || "",
      phone,
      profession,
      country,
      city,
      district,
      postalCode,
    };

    setFormData(newFormData);
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
        validation = validationUtils.phone.validate(value);
        break;

      case "postalCode":
        validation = validationUtils.postalCode.validate(
          value,
          formData.country
        );
        break;

      case "profession":
        validation = validationUtils.length(value, 0, 100, "Profession");
        break;

      case "district":
        validation = validationUtils.length(value, 0, 100, "District");
        break;

      default:
        break;
    }

    return validation;
  };

  // Handle input change with validation and formatting
  const handleChange = (e) => {
    const { id, value } = e.target;
    let formattedValue = value;

    // Apply formatting based on field type
    switch (id) {
      case "phone":
        formattedValue = inputFormatters.phone(value);
        break;
      case "email":
        formattedValue = inputFormatters.email(value);
        break;
      case "postalCode":
        formattedValue = inputFormatters.postalCode(value, formData.country);
        break;
      case "firstName":
      case "lastName":
        formattedValue = inputFormatters.alphaOnly(value);
        formattedValue = inputFormatters.titleCase(formattedValue);
        break;
      case "city":
        formattedValue = inputFormatters.titleCase(value);
        break;
      case "district":
        formattedValue = inputFormatters.titleCase(value);
        break;
      default:
        break;
    }

    setFormData((prev) => ({
      ...prev,
      [id]: formattedValue,
    }));

    // Validate field in real-time
    const validation = validateField(id, formattedValue);
    setValidationErrors((prev) => ({
      ...prev,
      [id]: validation.isValid ? "" : validation.message,
    }));

    // Clear messages when user starts typing
    if (message.text) {
      setMessage({ type: "", text: "" });
    }

    // Handle country change - reset city when country changes
    if (id === "country") {
      setFormData((prev) => ({ ...prev, city: "" }));
      setCities([]);
      setShowCityDropdown(false);
    }
  };

  // City search functionality
  const handleCitySearch = async (searchQuery) => {
    if (!formData.country) {
      setMessage({ type: "error", text: "Please select a country first" });
      return;
    }

    if (searchQuery.length < 2) {
      setCities([]);
      setShowCityDropdown(false);
      return;
    }

    setCitySearching(true);
    try {
      const results = await cityService.getCities(
        formData.country,
        searchQuery,
        10
      );
      setCities(results);
      setShowCityDropdown(true);
    } catch (error) {
      console.error("Error searching cities:", error);
      setMessage({
        type: "error",
        text: "Failed to search cities. Please try again.",
      });
    } finally {
      setCitySearching(false);
    }
  };

  // Handle city selection
  const handleCitySelect = (city) => {
    setFormData((prev) => ({
      ...prev,
      city: city.name,
    }));
    setShowCityDropdown(false);
    setCities([]);
  };

  // Handle photo change
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        setMessage({ type: "error", text: "Please select a valid image file" });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setMessage({ type: "error", text: "Image size must be less than 5MB" });
        return;
      }

      // TODO: Handle photo upload logic here
      setMessage({
        type: "success",
        text: "Photo upload functionality will be implemented soon",
      });
    }
  };

  // Validate all fields
  const validateAllFields = () => {
    const errors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (key !== "district" && key !== "postalCode") {
        // These are optional
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

    // Validate all fields
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
        name: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        profession: formData.profession,
        country: formData.country,
        city: formData.city,
        district: formData.district,
        postalCode: formData.postalCode,
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
          setMessage({
            type: "error",
            text:
              result?.error || "Failed to update profile. Please try again.",
          });
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

  // Input component with validation
  const ValidatedInput = ({
    id,
    label,
    type = "text",
    required = false,
    placeholder,
    value,
    onChange,
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
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
          validationErrors[id] ? "border-red-500" : "border-gray-700"
        } ${className}`}
        {...props}
      />
      {validationErrors[id] && (
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
          {validationErrors[id]}
        </p>
      )}
    </div>
  );

  // Country Dropdown Component
  const CountryDropdown = () => (
    <div className="mb-6">
      <label
        htmlFor="country"
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        Country <span className="text-red-400 ml-1">*</span>
      </label>
      <select
        id="country"
        value={formData.country}
        onChange={handleChange}
        className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
          validationErrors.country ? "border-red-500" : "border-gray-700"
        }`}
      >
        <option value="">Select a country</option>
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.flag} {country.name}
          </option>
        ))}
      </select>
      {validationErrors.country && (
        <p className="mt-1 text-sm text-red-400">{validationErrors.country}</p>
      )}
    </div>
  );

  // City Typeahead Component
  const CityTypeahead = () => (
    <div className="mb-6 relative">
      <label
        htmlFor="city"
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        City <span className="text-red-400 ml-1">*</span>
      </label>
      <div className="relative">
        <input
          ref={cityInputRef}
          id="city"
          type="text"
          value={formData.city}
          onChange={(e) => {
            handleChange(e);
            handleCitySearch(e.target.value);
          }}
          onFocus={() => {
            if (formData.city && cities.length > 0) {
              setShowCityDropdown(true);
            }
          }}
          onBlur={() => {
            // Delay hiding to allow click on dropdown items
            setTimeout(() => setShowCityDropdown(false), 200);
          }}
          placeholder={
            formData.country
              ? "Start typing city name..."
              : "Select country first"
          }
          disabled={!formData.country}
          className={`w-full px-4 py-3 pr-10 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            validationErrors.city ? "border-red-500" : "border-gray-700"
          } ${!formData.country ? "opacity-50 cursor-not-allowed" : ""}`}
        />

        {citySearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {showCityDropdown && cities.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {cities.map((city, index) => (
              <div
                key={index}
                onClick={() => handleCitySelect(city)}
                className="px-4 py-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
              >
                <div className="text-white">{city.name}</div>
                {city.adminName && (
                  <div className="text-sm text-gray-400">{city.adminName}</div>
                )}
                {city.population && (
                  <div className="text-xs text-gray-500">
                    Population: {city.population.toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {validationErrors.city && (
        <p className="mt-1 text-sm text-red-400">{validationErrors.city}</p>
      )}

      {!formData.country && (
        <p className="mt-1 text-sm text-gray-500">
          Please select a country first to search for cities
        </p>
      )}
    </div>
  );

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
            placeholder="Enter first name"
          />
          <ValidatedInput
            id="lastName"
            label="Last Name"
            required
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
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
          placeholder="Enter your email address"
        />

        {/* Phone Number */}
        <ValidatedInput
          id="phone"
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter phone number with country code"
        />

        {/* Profession */}
        <ValidatedInput
          id="profession"
          label="Profession"
          value={formData.profession}
          onChange={handleChange}
          placeholder="Enter your profession or job title"
        />

        {/* Location Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CountryDropdown />
          <CityTypeahead />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ValidatedInput
            id="district"
            label="District/State/Province"
            value={formData.district}
            onChange={handleChange}
            placeholder="Enter district or state"
          />
          <ValidatedInput
            id="postalCode"
            label="Postal Code"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="Enter postal code"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-center mt-8">
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
        </div>
      </form>
    </div>
  );
}
