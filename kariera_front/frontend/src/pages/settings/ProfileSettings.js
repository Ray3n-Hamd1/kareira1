// src/pages/settings/ProfileSettings.js
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function ProfileSettings() {
  const { user, updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingUserData, setFetchingUserData] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [debugInfo, setDebugInfo] = useState(null);

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

  // Debug function to inspect objects in depth
  const deepInspect = (obj, label = "Object Inspection") => {
    console.group(label);

    if (!obj) {
      console.log("Object is null or undefined");
      console.groupEnd();
      return;
    }

    console.log("Object type:", typeof obj);
    console.log("Full object:", obj);

    if (typeof obj === "object") {
      console.log("Keys:", Object.keys(obj));
      console.log("Values by key:");
      Object.entries(obj).forEach(([key, value]) => {
        console.log(`  ${key}:`, value, `(type: ${typeof value})`);
      });
    }

    console.groupEnd();
  };

  // This useEffect will run once to fetch the most up-to-date user data
  useEffect(() => {
    const fetchUserData = async () => {
      setFetchingUserData(true);
      console.group("🔍 PROFILE DATA DEBUGGING");
      console.log("🔄 Starting user data fetch process...");

      // Create an object to store all debugging information
      const debug = {
        contextUser: null,
        apiUser: null,
        mergedData: null,
        formDataBefore: { ...formData },
        formDataAfter: null,
        errors: [],
      };

      try {
        // First, check what's in the auth context
        console.log("👤 Checking user data in auth context...");
        if (user) {
          console.log("✅ User data found in auth context");
          deepInspect(user, "Auth Context User Data");
          debug.contextUser = { ...user };

          // Update form with context user data
          updateFormWithUserData(user, "auth context");
        } else {
          console.log("❌ No user data in auth context");
          debug.errors.push("No user data in auth context");
        }

        // Now, make a direct API call to fetch the latest data
        console.log("🔄 Fetching fresh user data from API...");
        const token = localStorage.getItem("token");
        console.log("🔑 Token available:", !!token);

        if (token) {
          try {
            const API_URL =
              process.env.REACT_APP_API_URL || "http://localhost:5000/api";
            console.log("🌐 API URL:", API_URL);

            const response = await axios.get(`${API_URL}/auth/me`, {
              headers: {
                "x-auth-token": token,
                Authorization: `Bearer ${token}`,
              },
            });

            console.log("✅ API response received:", response.status);
            deepInspect(response.data, "API Response Data");

            // Extract user data from response
            let apiUserData = null;
            if (response.data?.user) {
              apiUserData = response.data.user;
              console.log("📋 User data found in response.data.user");
            } else if (response.data) {
              apiUserData = response.data;
              console.log("📋 User data found directly in response.data");
            }

            debug.apiUser = apiUserData ? { ...apiUserData } : null;

            if (apiUserData) {
              // Update form with API user data
              updateFormWithUserData(apiUserData, "API");
            } else {
              console.log("❌ No user data found in API response");
              debug.errors.push("No user data found in API response");
            }
          } catch (error) {
            console.error("❌ Error fetching user data from API:", error);
            debug.errors.push(`API error: ${error.message}`);

            if (error.response) {
              console.log("📋 Error response status:", error.response.status);
              console.log("📋 Error response data:", error.response.data);
            }
          }
        } else {
          console.log("❌ No token available for API request");
          debug.errors.push("No authentication token available");
        }
      } catch (error) {
        console.error("❌ Unexpected error:", error);
        debug.errors.push(`Unexpected error: ${error.message}`);
      } finally {
        debug.formDataAfter = { ...formData };

        // Compare what was set in the form to what was in the user data
        console.group("🔍 Final Form Data Analysis");

        const userSource = debug.apiUser || debug.contextUser || {};
        const fieldMappings = [
          { form: "firstName", user: ["firstName", "first_name"] },
          { form: "lastName", user: ["lastName", "last_name"] },
          { form: "email", user: ["email"] },
          { form: "phone", user: ["phone", "phoneNumber", "mobile"] },
          {
            form: "profession",
            user: ["profession", "occupation", "jobTitle"],
          },
          { form: "city", user: ["city", "cityCountry", "location"] },
          { form: "district", user: ["district", "area", "region"] },
          { form: "postalCode", user: ["postalCode", "zipCode", "zip"] },
        ];

        // Check each form field against possible user fields
        for (const mapping of fieldMappings) {
          console.group(`Field: ${mapping.form}`);
          console.log(`Form value: "${formData[mapping.form]}"`);

          // Check each possible user field
          let foundInUser = false;
          for (const userField of mapping.user) {
            const userValue = userSource[userField];
            if (userValue !== undefined) {
              console.log(`User value (${userField}): "${userValue}"`);
              foundInUser = true;

              // Check if values match
              if (formData[mapping.form] !== userValue) {
                console.warn(
                  `⚠️ Value mismatch! Form has "${
                    formData[mapping.form]
                  }" but user has "${userValue}"`
                );
              }
            }
          }

          if (!foundInUser) {
            console.log("❌ No matching field found in user data");
          }

          console.groupEnd();
        }

        console.groupEnd();

        // Store all debug info
        setDebugInfo(debug);
        console.log("🔍 All debug information:", debug);
        console.log("🏁 User data fetch process completed");
        console.groupEnd();

        setFetchingUserData(false);
      }
    };

    fetchUserData();
  }, []);

  // Helper function to update form data with user data
  const updateFormWithUserData = (userData, source = "unknown") => {
    if (!userData) {
      console.log(`❌ No user data provided from ${source}`);
      return;
    }

    console.group(`📝 Updating form with data from ${source}`);
    console.log("📋 User data:", userData);

    // Extract name parts if the user only has a full name but no first/last name
    let firstName = userData.firstName || userData.first_name || "";
    let lastName = userData.lastName || userData.last_name || "";

    // If we have a name but no first/last name, split the name
    if (!firstName && !lastName && userData.name) {
      console.log(`📋 Splitting full name: "${userData.name}"`);
      const nameParts = userData.name.split(" ");
      firstName = nameParts[0] || "";
      lastName = nameParts.slice(1).join(" ") || "";
      console.log(
        `📋 Split result - First name: "${firstName}", Last name: "${lastName}"`
      );
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

    console.log("📝 Setting form data with values:", newFormData);

    // Log comparison between old and new values
    console.group("📊 Value Changes");
    for (const [key, newValue] of Object.entries(newFormData)) {
      const oldValue = formData[key] || "";
      if (oldValue !== newValue) {
        console.log(`Field "${key}": "${oldValue}" -> "${newValue}"`);
      } else if (newValue) {
        console.log(`Field "${key}": "${newValue}" (unchanged)`);
      } else {
        console.log(`Field "${key}": empty (unchanged)`);
      }
    }
    console.groupEnd();

    setFormData(newFormData);
    console.log("✅ Form data updated");
    console.groupEnd();
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    console.log(`🖊️ Field "${id}" changed to: "${value}"`);

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
      console.log("🖼️ Photo selected:", file);
      // You would typically upload this to your server or cloud storage
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    console.group("💾 Saving Profile Data");
    console.log("📝 Form data being submitted:", formData);

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

      console.log("📤 Sending profile update request:", profileData);

      // Update profile on backend
      if (updateUserProfile) {
        const result = await updateUserProfile(profileData);
        console.log("📥 Profile update response:", result);

        // Handle successful update
        if (result && result.success) {
          setMessage({
            type: "success",
            text: result.message || "Profile updated successfully!",
          });

          console.log("✅ Profile updated successfully");

          // Update form data with the newly saved values to ensure consistency
          if (result.user) {
            console.log("📝 Updating form with newly saved user data");
            deepInspect(result.user, "Updated User Data from API");
            updateFormWithUserData(result.user, "update response");
          } else {
            console.log(
              "⚠️ No user data in update response, using submitted data"
            );
            updateFormWithUserData({ ...profileData }, "submitted data");
          }
        } else {
          // Handle error from updateUserProfile
          console.error("❌ Profile update failed:", result?.error);
          setMessage({
            type: "error",
            text:
              result?.error || "Failed to update profile. Please try again.",
          });
        }
      } else {
        console.log(
          "⚠️ No updateUserProfile function available, using mock success"
        );
        // Mock success for demo when no updateUserProfile function exists
        setMessage({ type: "success", text: "Profile updated successfully!" });
      }
    } catch (error) {
      console.error("❌ Error updating profile:", error);

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
      console.log("🏁 Profile update process completed");
      console.groupEnd();
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

        {/* Debug Information */}
        {debugInfo && (
          <div className="mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-lg font-medium text-purple-400 mb-2">
              Debug Information
            </h3>
            <div
              className="text-xs text-gray-300 font-mono overflow-auto"
              style={{ maxHeight: "200px" }}
            >
              <p>
                Auth context user data:{" "}
                {debugInfo.contextUser ? "✅ Available" : "❌ Not available"}
              </p>
              <p>
                API user data:{" "}
                {debugInfo.apiUser ? "✅ Available" : "❌ Not available"}
              </p>

              {debugInfo.errors.length > 0 && (
                <div className="mt-2">
                  <p className="text-red-400">Errors detected:</p>
                  <ul className="list-disc pl-4 text-red-300">
                    {debugInfo.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-2">
                <p className="text-purple-300">Field values:</p>
                <table className="w-full text-left mt-1">
                  <thead>
                    <tr>
                      <th className="pr-4">Field</th>
                      <th className="pr-4">Form Value</th>
                      <th>From DB</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(formData).map(([field, value]) => {
                      // Find value in user data
                      const userObj =
                        debugInfo.apiUser || debugInfo.contextUser || {};
                      let dbValue = null;

                      // Check various field names
                      if (field === "firstName")
                        dbValue = userObj.firstName || userObj.first_name;
                      else if (field === "lastName")
                        dbValue = userObj.lastName || userObj.last_name;
                      else if (field === "phone")
                        dbValue =
                          userObj.phone ||
                          userObj.phoneNumber ||
                          userObj.mobile;
                      else if (field === "profession")
                        dbValue =
                          userObj.profession ||
                          userObj.occupation ||
                          userObj.jobTitle;
                      else if (field === "city")
                        dbValue =
                          userObj.city ||
                          userObj.cityCountry ||
                          userObj.location;
                      else if (field === "district")
                        dbValue =
                          userObj.district || userObj.area || userObj.region;
                      else if (field === "postalCode")
                        dbValue =
                          userObj.postalCode || userObj.zipCode || userObj.zip;
                      else dbValue = userObj[field];

                      return (
                        <tr key={field}>
                          <td className="pr-4">{field}</td>
                          <td className="pr-4">{value || "(empty)"}</td>
                          <td>{dbValue || "(not found)"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <button
                onClick={() => console.log("Full debug info:", debugInfo)}
                className="mt-4 px-2 py-1 bg-gray-700 text-xs text-white rounded hover:bg-gray-600 transition-colors"
              >
                Log full debug info to console
              </button>
            </div>
          </div>
        )}

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
