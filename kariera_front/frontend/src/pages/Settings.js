// src/pages/Settings.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SettingsLayout from "../components/SettingsLayout";
import ProfileSettings from "./settings/ProfileSettings";
import SecuritySettings from "./settings/SecuritySettings";
import NotificationSettings from "./settings/NotificationSettings";
import ChangePassword from "./settings/ChangePassword";
import ErrorBoundary from "../components/ErrorBoundary";

export default function Settings() {
  return (
    <ErrorBoundary>
      <SettingsLayout>
        <Routes>
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="security" element={<SecuritySettings />} />
          <Route path="security/change-password" element={<ChangePassword />} />
          <Route path="notification" element={<NotificationSettings />} />
          <Route path="*" element={<Navigate to="/settings/profile" replace />} />
        </Routes>
      </SettingsLayout>
    </ErrorBoundary>
  );
}