// src/components/CityDropdown.js - BULLETPROOF VERSION WITH ALL POSSIBLE FIXES
import React, { useState, useEffect, useCallback, useRef } from "react";
import { cityDropdownService } from "../services/cityService";

const CityDropdown = ({
  countryCode,
  value,
  onChange,
  disabled = false,
  required = false,
  className = "",
  error = "",
}) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const isSelecting = useRef(false);

  // Debug logging
  const debugLog = (message, data) => {
    console.log(`[CityDropdown] ${message}`, data || "");
  };

  // Load cities when country changes
  useEffect(() => {
    debugLog("Country changed", countryCode);

    if (!countryCode) {
      setCities([]);
      setSearchTerm("");
      setIsOpen(false);
      return;
    }

    const loadCities = async () => {
      setLoading(true);
      debugLog("Loading cities for", countryCode);

      try {
        // Check cache first
        const cachedCities = cityDropdownService.getCachedCities(countryCode);
        if (cachedCities.length > 0) {
          debugLog("Using cached cities", cachedCities.length);
          setCities(cachedCities);
          setLoading(false);
          return;
        }

        // Load from API
        const cityList = await cityDropdownService.getCitiesForDropdown(
          countryCode
        );
        debugLog("Loaded cities from API", cityList.length);
        setCities(cityList);
      } catch (error) {
        console.error("Error loading cities:", error);
        const fallbackCities =
          cityDropdownService.getFallbackCities(countryCode);
        debugLog("Using fallback cities", fallbackCities.length);
        setCities(fallbackCities);
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, [countryCode]);

  // Filter cities based on search
  const filteredCities = React.useMemo(() => {
    if (!cities.length) return [];

    if (!searchTerm) {
      return cities.slice(0, 100); // Limit for performance
    }

    const filtered = cities.filter(
      (city) =>
        city &&
        city.name &&
        city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    debugLog("Filtered cities", filtered.length);
    return filtered.slice(0, 100);
  }, [cities, searchTerm]);

  // Handle city selection
  const handleCitySelect = useCallback(
    (cityName) => {
      debugLog("handleCitySelect called", cityName);

      if (!cityName) {
        debugLog("No city name provided");
        return;
      }

      isSelecting.current = true;

      try {
        // Call parent onChange
        debugLog("Calling onChange with", cityName);
        onChange(cityName);

        // Update internal state
        setSearchTerm("");
        setIsOpen(false);
        setIsFocused(false);

        // Update input value directly as backup
        if (inputRef.current) {
          inputRef.current.value = cityName;
          debugLog("Updated input value directly", cityName);
        }

        debugLog("City selection completed successfully");
      } catch (error) {
        console.error("Error in handleCitySelect:", error);
      }

      setTimeout(() => {
        isSelecting.current = false;
      }, 100);
    },
    [onChange]
  );

  // Handle input changes
  const handleInputChange = useCallback(
    (e) => {
      if (isSelecting.current) {
        debugLog("Ignoring input change during selection");
        return;
      }

      const newValue = e.target.value;
      debugLog("Input changed", newValue);

      setSearchTerm(newValue);
      setIsOpen(true);

      // Only call onChange if clearing the input
      if (newValue === "") {
        onChange("");
      }
    },
    [onChange]
  );

  // Handle input focus
  const handleInputFocus = useCallback(() => {
    debugLog("Input focused");
    setIsFocused(true);

    if (cities.length > 0 && countryCode && !disabled) {
      setIsOpen(true);
    }
  }, [cities.length, countryCode, disabled]);

  // Handle input blur
  const handleInputBlur = useCallback((e) => {
    debugLog("Input blur");

    // Check if we're clicking on the dropdown
    if (dropdownRef.current && dropdownRef.current.contains(e.relatedTarget)) {
      debugLog("Blur ignored - clicking on dropdown");
      return;
    }

    setTimeout(() => {
      if (!isSelecting.current) {
        setIsFocused(false);
        setIsOpen(false);
        setSearchTerm("");
      }
    }, 200);
  }, []);

  // Handle dropdown click
  const handleDropdownMouseDown = useCallback((e) => {
    // Prevent blur when clicking dropdown
    e.preventDefault();
  }, []);

  // Get display value
  const getDisplayValue = () => {
    if (isFocused && searchTerm) {
      return searchTerm;
    }
    return value || "";
  };

  debugLog("Render state", {
    value,
    searchTerm,
    isFocused,
    isOpen,
    citiesCount: cities.length,
    filteredCount: filteredCities.length,
  });

  return (
    <div className="relative">
      {/* Input Field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={getDisplayValue()}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={
            loading
              ? "Loading cities..."
              : countryCode
              ? "Select or type city name..."
              : "Select country first"
          }
          disabled={disabled || loading || !countryCode}
          className={`w-full px-4 py-3 pr-10 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            error ? "border-red-500" : "border-gray-700"
          } ${
            disabled || loading ? "opacity-50 cursor-not-allowed" : ""
          } ${className}`}
        />

        {/* Dropdown Arrow */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-500"></div>
          ) : (
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && !loading && countryCode && (
        <div
          ref={dropdownRef}
          onMouseDown={handleDropdownMouseDown}
          className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-80 overflow-hidden"
        >
          {filteredCities.length > 0 ? (
            <>
              {/* City List */}
              <div className="max-h-64 overflow-y-auto">
                {filteredCities.map((city, index) => (
                  <div
                    key={`${countryCode}-${city.name}-${index}`}
                    className="px-4 py-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0 transition-colors duration-150 select-none"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      debugLog("City clicked", city.name);
                      handleCitySelect(city.name);
                    }}
                    onMouseDown={(e) => {
                      // Prevent input blur
                      e.preventDefault();
                    }}
                  >
                    <div className="text-white font-medium">{city.name}</div>
                    {(city.admin || city.population) && (
                      <div className="text-sm text-gray-400 mt-1">
                        {city.admin && <span>{city.admin}</span>}
                        {city.admin && city.population && <span> • </span>}
                        {city.population && (
                          <span>Pop: {city.population.toLocaleString()}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="px-4 py-8 text-center text-gray-400">
              <div className="text-2xl mb-2">🏙️</div>
              <div className="font-medium">No cities found</div>
              {searchTerm && (
                <div className="text-xs mt-1 text-gray-500">
                  Try searching for "{searchTerm.slice(0, -1)}" or a different
                  term
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && countryCode && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
          <div className="px-4 py-8 text-center text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto mb-3"></div>
            <div className="font-medium">Loading cities...</div>
            <div className="text-xs mt-1">This may take a moment</div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-1 text-sm text-red-400 flex items-center">
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
        </div>
      )}

      {/* Helper Text */}
      {!countryCode && !error && (
        <div className="mt-1 text-sm text-gray-500">
          Please select a country first
        </div>
      )}

      {countryCode && !loading && cities.length > 0 && !error && (
        <div className="mt-1 text-sm text-gray-500">
          Click to browse or type to search
        </div>
      )}
    </div>
  );
};

export default CityDropdown;
