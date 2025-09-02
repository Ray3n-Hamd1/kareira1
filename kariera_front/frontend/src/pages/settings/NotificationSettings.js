import React, { useState, useEffect } from "react";
import axios from "axios";

export default function NotificationSettings() {
  // Initialize state with all properties, including marketing and weeklyDigest
  const [emailNotifications, setEmailNotifications] = useState({
    newJobs: true,
    newsUpdates: true,
    interviewSchedule: true,
    jobRejection: true,
    marketing: false,
    weeklyDigest: false,
  });

  const [pushNotifications, setPushNotifications] = useState({
    newJobs: true,
    newsUpdates: true,
    interviewSchedule: true,
    jobRejection: true,
    marketing: false,
    weeklyDigest: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  // Load notification settings on component mount
  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/notifications/settings`, {
        headers: { "x-auth-token": token },
      });

      if (response.data.success) {
        setEmailNotifications(
          response.data.emailNotifications || {
            newJobs: true,
            newsUpdates: true,
            interviewSchedule: true,
            jobRejection: true,
            marketing: false,
            weeklyDigest: false,
          }
        );
        setPushNotifications(
          response.data.pushNotifications || {
            newJobs: true,
            newsUpdates: true,
            interviewSchedule: true,
            jobRejection: true,
            marketing: false,
            weeklyDigest: false,
          }
        );
      }
    } catch (error) {
      console.error("Error loading notification settings:", error);
    } finally {
      setInitialLoading(false);
    }
  };

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
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/notifications/settings`,
        {
          emailNotifications,
          pushNotifications,
        },
        {
          headers: { "x-auth-token": token },
        }
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text:
            response.data.message ||
            "Notification settings updated successfully!",
        });

        // Update state with server response
        setEmailNotifications(response.data.emailNotifications);
        setPushNotifications(response.data.pushNotifications);
      }
    } catch (error) {
      console.error("Error saving notification settings:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to update notification settings. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ToggleSwitch = ({ isEnabled, onToggle, disabled = false }) => (
    <button
      onClick={onToggle}
      disabled={disabled || initialLoading}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
        isEnabled ? "bg-purple-600" : "bg-gray-600"
      } ${disabled || initialLoading ? "opacity-50 cursor-not-allowed" : ""}`}
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
        {emailEnabled !== undefined && (
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Email</span>
            <ToggleSwitch
              isEnabled={emailEnabled}
              onToggle={() => handleEmailToggle(settingKey)}
            />
          </div>
        )}
        {pushEnabled !== undefined && (
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">Push</span>
            <ToggleSwitch
              isEnabled={pushEnabled}
              onToggle={() => handlePushToggle(settingKey)}
            />
          </div>
        )}
      </div>
    </div>
  );

  if (initialLoading) {
    return (
      <div className="bg-gray-900 rounded-lg p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-8">
      <h2 className="text-2xl font-semibold text-white mb-2">Notifications</h2>
      <p className="text-gray-400 mb-8">
        Select the kinds of notifications you get about your activities
      </p>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg border transition-all duration-300 ${
            message.type === "success"
              ? "bg-green-900 border-green-700 text-green-300"
              : "bg-red-900 border-red-700 text-red-300"
          }`}
        >
          <div className="flex items-center">
            {message.type === "success" ? (
              <svg
                className="w-5 h-5 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Main Notification Settings */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white">
              Job Search Notifications
            </h3>
            <div className="flex items-center space-x-8">
              <span className="text-sm font-medium text-gray-400">Email</span>
              <span className="text-sm font-medium text-gray-400">Push</span>
            </div>
          </div>

          <div className="space-y-1">
            <NotificationRow
              title="New Job Alerts"
              description="Get notified when new jobs matching your preferences are available"
              emailEnabled={emailNotifications.newJobs}
              pushEnabled={pushNotifications.newJobs}
              settingKey="newJobs"
            />
            <NotificationRow
              title="Interview Scheduled"
              description="Receive notifications when interviews are scheduled for your applications"
              emailEnabled={emailNotifications.interviewSchedule}
              pushEnabled={pushNotifications.interviewSchedule}
              settingKey="interviewSchedule"
            />
            <NotificationRow
              title="Application Updates"
              description="Get updates on your job application status and responses"
              emailEnabled={emailNotifications.jobRejection}
              pushEnabled={pushNotifications.jobRejection}
              settingKey="jobRejection"
            />
            <NotificationRow
              title="News and Updates"
              description="Stay informed about platform updates and new features"
              emailEnabled={emailNotifications.newsUpdates}
              pushEnabled={pushNotifications.newsUpdates}
              settingKey="newsUpdates"
            />
          </div>
        </div>

        {/* Marketing and Digest Settings */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-6">
            Additional Preferences
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex-1">
                <h4 className="text-white font-medium">Weekly Job Digest</h4>
                <p className="text-gray-400 text-sm mt-1">
                  Receive a weekly summary of new jobs and your application
                  activity
                </p>
              </div>
              <div className="flex items-center space-x-8 ml-4">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-1 font-medium">
                    Email
                  </span>
                  <ToggleSwitch
                    isEnabled={emailNotifications.weeklyDigest}
                    onToggle={() => handleEmailToggle("weeklyDigest")}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-1 font-medium">
                    Push
                  </span>
                  <ToggleSwitch
                    isEnabled={pushNotifications.weeklyDigest}
                    onToggle={() => handlePushToggle("weeklyDigest")}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex-1">
                <h4 className="text-white font-medium">
                  Marketing Communications
                </h4>
                <p className="text-gray-400 text-sm mt-1">
                  Receive promotional emails about career tips, special offers,
                  and events
                </p>
              </div>
              <div className="flex items-center space-x-8 ml-4">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-1 font-medium">
                    Email
                  </span>
                  <ToggleSwitch
                    isEnabled={emailNotifications.marketing}
                    onToggle={() => handleEmailToggle("marketing")}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-1 font-medium">
                    Push
                  </span>
                  <ToggleSwitch
                    isEnabled={pushNotifications.marketing}
                    onToggle={() => handlePushToggle("marketing")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Delivery Info */}
        <div className="bg-gray-800 rounded-lg p-6 border-l-4 border-purple-500">
          <h3 className="text-lg font-medium text-white mb-3">
            <svg
              className="w-5 h-5 inline mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            Delivery Information
          </h3>
          <div className="text-gray-400 text-sm space-y-2">
            <p>
              • <strong>Email notifications</strong> will be sent to your
              registered email address
            </p>
            <p>
              • <strong>Push notifications</strong> work when you're logged into
              the web app
            </p>
            <p>
              • Important notifications (like interviews) cannot be completely
              disabled for your safety
            </p>
            <p>
              • You can unsubscribe from marketing emails at any time using the
              link in the emails
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleSaveSettings}
          disabled={isLoading}
          className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
              <span>Saving Changes...</span>
            </div>
          ) : (
            <>
              <svg
                className="w-5 h-5 inline mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
              </svg>
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={() => {
            setEmailNotifications({
              newJobs: true,
              newsUpdates: true,
              interviewSchedule: true,
              jobRejection: true,
              marketing: false,
              weeklyDigest: true,
            });
            setPushNotifications({
              newJobs: true,
              newsUpdates: false,
              interviewSchedule: true,
              jobRejection: true,
              marketing: false,
              weeklyDigest: false,
            });
            setMessage({ type: "", text: "" });
          }}
          className="text-sm text-purple-400 hover:text-purple-300 underline"
        >
          Reset to Recommended
        </button>
        <span className="text-gray-500">•</span>
        <button
          onClick={() => {
            const allOff = {
              newJobs: false,
              newsUpdates: false,
              interviewSchedule: true, // Keep important ones on
              jobRejection: false,
              marketing: false,
              weeklyDigest: false,
            };
            setEmailNotifications(allOff);
            setPushNotifications(allOff);
            setMessage({ type: "", text: "" });
          }}
          className="text-sm text-gray-400 hover:text-gray-300 underline"
        >
          Turn Off Most Notifications
        </button>
      </div>
    </div>
  );
}
