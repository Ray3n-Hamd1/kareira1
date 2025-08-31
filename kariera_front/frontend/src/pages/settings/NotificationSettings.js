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

  const ToggleSwitch = ({ isEnabled, onToggle, disabled = false }) => (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
        isEnabled ? "bg-purple-600" : "bg-gray-600"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isEnabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  const NotificationRow = ({
    title,
    description,
    emailEnabled,
    pushEnabled,
    settingKey,
  }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-700 last:border-b-0">
      <div className="flex-1">
        <h3 className="text-white font-medium">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
      <div className="flex items-center space-x-8">
        {/* Email Toggle - Only shown for email section */}
        {emailEnabled !== undefined && (
          <ToggleSwitch
            isEnabled={emailEnabled}
            onToggle={() => handleEmailToggle(settingKey)}
          />
        )}
        {/* Push Toggle - Only shown for push section */}
        {pushEnabled !== undefined && (
          <ToggleSwitch
            isEnabled={pushEnabled}
            onToggle={() => handlePushToggle(settingKey)}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900 rounded-lg p-8">
      <h2 className="text-2xl font-semibold text-white mb-2">Notifications</h2>
      <p className="text-gray-400 mb-8">
        Select the kinds of notifications you get about your activities
      </p>

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

      <div className="space-y-8">
        {/* Email notifications section */}
        <div>
          <h3 className="text-lg font-medium text-white mb-4">
            Email notifications
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Get emails to find out what's going on when you're not online
          </p>

          <div className="bg-gray-800 rounded-lg p-6">
            <NotificationRow
              title="New Jobs alerts"
              description="News about jobs that fit your preferences"
              emailEnabled={emailNotifications.newJobs}
              settingKey="newJobs"
            />
            <NotificationRow
              title="News and updates"
              description="News about products and feature updates"
              emailEnabled={emailNotifications.newsUpdates}
              settingKey="newsUpdates"
            />
            <NotificationRow
              title="Interview Schedule"
              description="Scheduled for Interview on Jobs"
              emailEnabled={emailNotifications.interviewSchedule}
              settingKey="interviewSchedule"
            />
            <NotificationRow
              title="Job rejection"
              description="Rejection on applied Jobs"
              emailEnabled={emailNotifications.jobRejection}
              settingKey="jobRejection"
            />
          </div>
        </div>

        {/* Push notifications section */}
        <div>
          <h3 className="text-lg font-medium text-white mb-4">
            Push notifications
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Get push notifications in app to find out what's going on when
            you're online
          </p>

          <div className="bg-gray-800 rounded-lg p-6">
            <NotificationRow
              title="New Jobs alerts"
              description="News about jobs that fit your preferences"
              pushEnabled={pushNotifications.newJobs}
              settingKey="newJobs"
            />
            <NotificationRow
              title="News and updates"
              description="News about products and feature updates"
              pushEnabled={pushNotifications.newsUpdates}
              settingKey="newsUpdates"
            />
            <NotificationRow
              title="Interview Schedule"
              description="Scheduled for Interview on Jobs"
              pushEnabled={pushNotifications.interviewSchedule}
              settingKey="interviewSchedule"
            />
            <NotificationRow
              title="Job rejection"
              description="Rejection on applied Jobs"
              pushEnabled={pushNotifications.jobRejection}
              settingKey="jobRejection"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleSaveSettings}
          disabled={isLoading}
          className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
