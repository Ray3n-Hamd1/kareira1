// src/components/CityDropdown.js - SCROLLABLE CITY DROPDOWN
import React, { useState, useEffect } from "react";
import { cityDropdownService } from "../services/cityDropdownService";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Load cities when country changes
  useEffect(() => {
    if (!countryCode) {
      setCities([]);
      return;
    }

    const loadCities = async () => {
      setLoading(true);
      try {
        // Check cache first
        const cachedCities = cityDropdownService.getCachedCities(countryCode);
        if (cachedCities.length > 0) {
          setCities(cachedCities);
          setLoading(false);
          return;
        }

        // Load from API
        const cityList = await cityDropdownService.getCitiesForDropdown(
          countryCode
        );
        setCities(cityList);
      } catch (error) {
        console.error("Error loading cities:", error);
        setCities(cityDropdownService.getFallbackCities(countryCode));
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, [countryCode]);

  // Filter cities based on search term
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (cityName) => {
    onChange(cityName);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    setSearchTerm(inputValue);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    if (cities.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay closing to allow click on dropdown items
    setTimeout(() => {
      setIsOpen(false);
      setSearchTerm("");
    }, 200);
  };

  // For pure dropdown without search (commented alternative)
  const PureDropdownVersion = () => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || loading || !countryCode}
      className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
        error ? "border-red-500" : "border-gray-700"
      } ${
        disabled || loading ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      <option value="">
        {loading
          ? "Loading cities..."
          : countryCode
          ? "Select a city"
          : "Select country first"}
      </option>
      {cities.map((city, index) => (
        <option key={index} value={city.name}>
          {city.name}
          {city.population && ` (${city.population.toLocaleString()})`}
          {city.admin && ` - ${city.admin}`}
        </option>
      ))}
    </select>
  );

  // Searchable dropdown version
  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={value}
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

      {/* Dropdown List */}
      {isOpen && !loading && countryCode && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {filteredCities.length > 0 ? (
            <>
              {/* Quick Stats */}
              <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
                {filteredCities.length}{" "}
                {filteredCities.length === 1 ? "city" : "cities"} found
                {searchTerm && ` matching "${searchTerm}"`}
              </div>

              {/* City List */}
              <div className="max-h-64 overflow-y-auto">
                {filteredCities.slice(0, 100).map((city, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelect(city.name)}
                    className="px-4 py-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0 transition-colors duration-150"
                  >
                    <div className="text-white font-medium">{city.name}</div>
                    {(city.admin || city.population) && (
                      <div className="text-sm text-gray-400 mt-1">
                        {city.admin && <span>{city.admin}</span>}
                        {city.admin && city.population && <span> • </span>}
                        {city.population && (
                          <span>
                            Population: {city.population.toLocaleString()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredCities.length > 100 && (
                <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-700 text-center">
                  Showing first 100 results. Type to search for more specific
                  cities.
                </div>
              )}
            </>
          ) : (
            <div className="px-4 py-8 text-center text-gray-400">
              <div className="text-lg mb-2">🏙️</div>
              <div>No cities found</div>
              {searchTerm && (
                <div className="text-xs mt-1">Try a different search term</div>
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
            <div>Loading cities for your country...</div>
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
      {!countryCode && (
        <div className="mt-1 text-sm text-gray-500">
          Please select a country first to load cities
        </div>
      )}

      {countryCode && !loading && cities.length > 0 && (
        <div className="mt-1 text-sm text-gray-500">
          {cities.length} cities available • Type to search or click to browse
        </div>
      )}
    </div>
  );
};

export default CityDropdown;
