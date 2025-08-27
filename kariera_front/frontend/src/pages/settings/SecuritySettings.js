// src/pages/settings/SecuritySettings.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function SecuritySettings() {
  const { user } = useAuth();
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);
  
  const handleToggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    // In a real implementation, you would call an API to enable/disable 2FA
  };
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Security</h2>
      <p className="text-gray-400 mb-6">Manage and enhance the security of your account</p>
      
      <div className="space-y-6">
        <div className="border-b border-gray-800 pb-6">
          <Link 
            to="/settings/security/change-password" 
            className="flex items-center justify-between p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
          >
            <div>
              <h3 className="font-medium text-white">Change Password</h3>
              <p className="text-sm text-gray-400">Change your password regularly to keep your account secure</p>
            </div>
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div className="border-b border-gray-800 pb-6">
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
            <div>
              <h3 className="font-medium text-white">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-400">Add an extra layer of protection by enabling 2FA</p>
            </div>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
              <input 
                type="checkbox"
                className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
                checked={twoFactorEnabled}
                onChange={handleToggleTwoFactor}
              />
              <span className={`absolute left-0 top-0 right-0 bottom-0 rounded-full transition-colors ${twoFactorEnabled ? 'bg-purple-600' : 'bg-gray-700'}`}></span>
              <span className={`absolute w-4 h-4 bg-white rounded-full transition-transform transform ${twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'} top-1`}></span>
            </div>
          </div>
        </div>
        
        <div className="border-b border-gray-800 pb-6">
          <Link 
            to="/settings/security/login-activity" 
            className="flex items-center justify-between p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
          >
            <div>
              <h3 className="font-medium text-white">Login Activity</h3>
              <p className="text-sm text-gray-400">Monitor your login history to ensure your account is being accessed only by you</p>
            </div>
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div>
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors cursor-pointer">
            <div>
              <h3 className="font-medium text-red-400">Delete Account</h3>
              <p className="text-sm text-gray-400">Deleting your account is irreversible, and all associated data</p>
            </div>
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}