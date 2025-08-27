// src/pages/settings/NotificationSettings.js
import React, { useState } from "react";

export default function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState({
    newJobs: true,
    newsUpdates: true,
    interviewSchedule: true,
    jobRejection: true,
  });

  const [pushNotifications, setPushNotifications] = useState({
    newJobs: true,
    newsUpdates: true,
    interviewSchedule: true,
    jobRejection: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleEmailToggle = (setting) => {
    setEmailNotifications((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handlePushToggle = (setting) => {
    setPushNotifications((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Here you would call your API to save the notification settings
      // await api.put('/user/notifications', {
      //   emailNotifications,
      //   pushNotifications
      // });

      // For now, just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setMessage({
        type: "success",
        text: "Notification settings updated successfully!",
      });
    } catch (error) {
      console.error("Error saving notification settings:", error);
      setMessage({
        type: "error",
        text: "Failed to update notification settings. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Notifications</h2>
      <p className="text-gray-400 mb-6">
        Select the kinds of notifications you get about your activities
      </p>

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

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Email notifications</h3>
        <p className="text-sm text-gray-400 mb-4">
          Get emails to find out what's going on when you're not online
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white">
                New Jobs alerts
              </h4>
              <p className="text-xs text-gray-400">
                News about jobs that fit your preferences
              </p>
            </div>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
              <input
                type="checkbox"
                className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
                checked={emailNotifications.newJobs}
                onChange={() => handleEmailToggle("newJobs")}
              />
              <span
                className={`absolute left-0 top-0 right-0 bottom-0 rounded-full transition-colors ${
                  emailNotifications.newJobs ? "bg-purple-600" : "bg-gray-700"
                }`}
              ></span>
              <span
                className={`absolute w-4 h-4 bg-white rounded-full transition-transform transform ${
                  emailNotifications.newJobs ? "translate-x-6" : "translate-x-1"
                } top-1`}
              ></span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white">
                News and updates
              </h4>
              <p className="text-xs text-gray-400">
                News about products and feature updates
              </p>
            </div>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
              <input
                type="checkbox"
                className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
                checked={emailNotifications.newsUpdates}
                onChange={() => handleEmailToggle("newsUpdates")}
              />
              <span
                className={`absolute left-0 top-0 right-0 bottom-0 rounded-full transition-colors ${
                  emailNotifications.newsUpdates
                    ? "bg-purple-600"
                    : "bg-gray-700"
                }`}
              ></span>
              <span
                className={`absolute w-4 h-4 bg-white rounded-full transition-transform transform ${
                  emailNotifications.newsUpdates
                    ? "translate-x-6"
                    : "translate-x-1"
                } top-1`}
              ></span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white">
                Interview Schedule
              </h4>
              <p className="text-xs text-gray-400">
                Scheduled for interview on jobs
              </p>
            </div>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
              <input
                type="checkbox"
                className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
                checked={emailNotifications.interviewSchedule}
                onChange={() => handleEmailToggle("interviewSchedule")}
              />
              <span
                className={`absolute left-0 top-0 right-0 bottom-0 rounded-full transition-colors ${
                  emailNotifications.interviewSchedule
                    ? "bg-purple-600"
                    : "bg-gray-700"
                }`}
              ></span>
              <span
                className={`absolute w-4 h-4 bg-white rounded-full transition-transform transform ${
                  emailNotifications.interviewSchedule
                    ? "translate-x-6"
                    : "translate-x-1"
                } top-1`}
              ></span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white">Job rejection</h4>
              <p className="text-xs text-gray-400">Rejection on applied jobs</p>
            </div>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
              <input
                type="checkbox"
                className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
                checked={emailNotifications.jobRejection}
                onChange={() => handleEmailToggle("jobRejection")}
              />
              <span
                className={`absolute left-0 top-0 right-0 bottom-0 rounded-full transition-colors ${
                  emailNotifications.jobRejection
                    ? "bg-purple-600"
                    : "bg-gray-700"
                }`}
              ></span>
              <span
                className={`absolute w-4 h-4 bg-white rounded-full transition-transform transform ${
                  emailNotifications.jobRejection
                    ? "translate-x-6"
                    : "translate-x-1"
                } top-1`}
              ></span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Push notifications</h3>
        <p className="text-sm text-gray-400 mb-4">
          Get push notifications to app to find out what's going on when you're
          online
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white">
                New Jobs alerts
              </h4>
              <p className="text-xs text-gray-400">
                News about jobs that fit your preferences
              </p>
            </div>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
              <input
                type="checkbox"
                className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
                checked={pushNotifications.newJobs}
                onChange={() => handlePushToggle("newJobs")}
              />
              <span
                className={`absolute left-0 top-0 right-0 bottom-0 rounded-full transition-colors ${
                  pushNotifications.newJobs ? "bg-purple-600" : "bg-gray-700"
                }`}
              ></span>
              <span
                className={`absolute w-4 h-4 bg-white rounded-full transition-transform transform ${
                  pushNotifications.newJobs ? "translate-x-6" : "translate-x-1"
                } top-1`}
              ></span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white">
                News and updates
              </h4>
              <p className="text-xs text-gray-400">
                News about products and feature updates
              </p>
            </div>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
              <input
                type="checkbox"
                className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
                checked={pushNotifications.newsUpdates}
                onChange={() => handlePushToggle("newsUpdates")}
              />
              <span
                className={`absolute left-0 top-0 right-0 bottom-0 rounded-full transition-colors ${
                  pushNotifications.newsUpdates
                    ? "bg-purple-600"
                    : "bg-gray-700"
                }`}
              ></span>
              <span
                className={`absolute w-4 h-4 bg-white rounded-full transition-transform transform ${
                  pushNotifications.newsUpdates
                    ? "translate-x-6"
                    : "translate-x-1"
                } top-1`}
              ></span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white">
                Interview Schedule
              </h4>
              <p className="text-xs text-gray-400">
                Scheduled for interview on jobs
              </p>
            </div>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
              <input
                type="checkbox"
                className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
                checked={pushNotifications.interviewSchedule}
                onChange={() => handlePushToggle("interviewSchedule")}
              />
              <span
                className={`absolute left-0 top-0 right-0 bottom-0 rounded-full transition-colors ${
                  pushNotifications.interviewSchedule
                    ? "bg-purple-600"
                    : "bg-gray-700"
                }`}
              ></span>
              <span
                className={`absolute w-4 h-4 bg-white rounded-full transition-transform transform ${
                  pushNotifications.interviewSchedule
                    ? "translate-x-6"
                    : "translate-x-1"
                } top-1`}
              ></span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white">Job rejection</h4>
              <p className="text-xs text-gray-400">Rejection on applied jobs</p>
            </div>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
              <input
                type="checkbox"
                className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
                checked={pushNotifications.jobRejection}
                onChange={() => handlePushToggle("jobRejection")}
              />
              <span
                className={`absolute left-0 top-0 right-0 bottom-0 rounded-full transition-colors ${
                  pushNotifications.jobRejection
                    ? "bg-purple-600"
                    : "bg-gray-700"
                }`}
              ></span>
              <span
                className={`absolute w-4 h-4 bg-white rounded-full transition-transform transform ${
                  pushNotifications.jobRejection
                    ? "translate-x-6"
                    : "translate-x-1"
                } top-1`}
              ></span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleSaveSettings}
          disabled={isLoading}
          className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
