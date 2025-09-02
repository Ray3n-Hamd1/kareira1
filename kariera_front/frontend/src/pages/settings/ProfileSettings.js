// src/pages/settings/ProfileSettings.js
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function ProfileSettings() {
  const { user, updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingUserData, setFetchingUserData] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Initialize form data with empty values
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profession: "",
    city: "",
    district: "",
    postalCode: "",
  });

  // This useEffect will run once to fetch the most up-to-date user data
  useEffect(() => {
    const fetchUserData = async () => {
      setFetchingUserData(true);

      try {
        // First, check what's in the auth context
        if (user) {
          // Update form with context user data
          updateFormWithUserData(user, "auth context");
        }

        // Now, make a direct API call to fetch the latest data
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

            // Extract user data from response
            let apiUserData = null;
            if (response.data?.user) {
              apiUserData = response.data.user;
            } else if (response.data) {
              apiUserData = response.data;
            }

            if (apiUserData) {
              // Update form with API user data
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
  }, []);

  // Helper function to update form data with user data
  const updateFormWithUserData = (userData, source = "unknown") => {
    if (!userData) {
      return;
    }

    // Extract name parts if the user only has a full name but no first/last name
    let firstName = userData.firstName || userData.first_name || "";
    let lastName = userData.lastName || userData.last_name || "";

    // If we have a name but no first/last name, split the name
    if (!firstName && !lastName && userData.name) {
      const nameParts = userData.name.split(" ");
      firstName = nameParts[0] || "";
      lastName = nameParts.slice(1).join(" ") || "";
    }

    // Check for different possible field names in the backend response
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

    const newFormData = {
      firstName,
      lastName,
      email: userData.email || "",
      phone,
      profession,
      city,
      district,
      postalCode,
    };

    setFormData(newFormData);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Clear messages when user starts typing
    if (message.text) {
      setMessage({ type: "", text: "" });
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle photo upload logic here
      // You would typically upload this to your server or cloud storage
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Prepare data for backend
      const profileData = {
        name: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        profession: formData.profession,
        district: formData.district,
        city: formData.city,
        postalCode: formData.postalCode,
      };

      // Update profile on backend
      if (updateUserProfile) {
        const result = await updateUserProfile(profileData);

        // Handle successful update
        if (result && result.success) {
          setMessage({
            type: "success",
            text: result.message || "Profile updated successfully!",
          });

          // Update form data with the newly saved values to ensure consistency
          if (result.user) {
            updateFormWithUserData(result.user, "update response");
          } else {
            updateFormWithUserData({ ...profileData }, "submitted data");
          }
        } else {
          // Handle error from updateUserProfile
          setMessage({
            type: "error",
            text:
              result?.error || "Failed to update profile. Please try again.",
          });
        }
      } else {
        // Mock success for demo when no updateUserProfile function exists
        setMessage({ type: "success", text: "Profile updated successfully!" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);

      // Handle different error formats
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

      setMessage({
        type: "error",
        text: errorMessage,
      });
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

  // Show loading indicator while fetching user data
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
            </div>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        {/* Phone Number */}
        <div className="mb-6">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Profession */}
        <div className="mb-6">
          <label
            htmlFor="profession"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Profession
          </label>
          <input
            id="profession"
            type="text"
            value={formData.profession}
            onChange={handleChange}
            placeholder="Enter your profession"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Location Fields */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              City-country
            </label>
            <input
              id="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city and country"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="district"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              District
            </label>
            <input
              id="district"
              type="text"
              value={formData.district}
              onChange={handleChange}
              placeholder="Enter district"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="postalCode"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Postal code
            </label>
            <input
              id="postalCode"
              type="text"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Enter postal code"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center">
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
