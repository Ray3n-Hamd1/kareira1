import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function ProfileSettings() {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profession: "",
    district: "",
    city: "",
    postalCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    // Load user data into form
    // ...
  }, [user]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Place the new handleSubmit function here
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Prepare data for backend
      const profileData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        profession: formData.profession,
        district: formData.district,
        city: formData.city,
        postalCode: formData.postalCode,
      };

      // Update profile on backend
      const result = await updateUserProfile(profileData);

      if (result.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to update profile. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Profile Information</h2>

      {message.text && (
        <div
          className={`mb-6 p-3 rounded-lg ${
            message.type === "success"
              ? "bg-green-900/50 border border-green-500 text-green-200"
              : "bg-red-900/50 border border-red-500 text-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
                {formData.firstName.charAt(0)}
                {formData.lastName.charAt(0)}
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs"
              >
                +
              </button>
            </div>
            <button
              type="button"
              className="ml-4 text-purple-400 hover:text-purple-300 text-sm"
            >
              Change Photo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="profession"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Profession
          </label>
          <input
            id="profession"
            type="text"
            value={formData.profession}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label
              htmlFor="district"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              District
            </label>
            <input
              id="district"
              type="text"
              value={formData.district}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              City
            </label>
            <input
              id="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div>
            <label
              htmlFor="postalCode"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Postal code
            </label>
            <input
              id="postalCode"
              type="text"
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
