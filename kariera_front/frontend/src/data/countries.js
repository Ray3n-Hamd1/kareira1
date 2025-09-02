// src/data/countries.js
export const countries = [
  { code: "AF", name: "Afghanistan", flag: "🇦🇫" },
  { code: "AL", name: "Albania", flag: "🇦🇱" },
  { code: "DZ", name: "Algeria", flag: "🇩🇿" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "HR", name: "Croatia", flag: "🇭🇷" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰" },
  { code: "HU", name: "Hungary", flag: "🇭🇺" },
  { code: "IS", name: "Iceland", flag: "🇮🇸" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "IR", name: "Iran", flag: "🇮🇷" },
  { code: "IQ", name: "Iraq", flag: "🇮🇶" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "IL", name: "Israel", flag: "🇮🇱" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "JO", name: "Jordan", flag: "🇯🇴" },
  { code: "KZ", name: "Kazakhstan", flag: "🇰🇿" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼" },
  { code: "LB", name: "Lebanon", flag: "🇱🇧" },
  { code: "LY", name: "Libya", flag: "🇱🇾" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "MA", name: "Morocco", flag: "🇲🇦" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "PE", name: "Peru", flag: "🇵🇪" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "QA", name: "Qatar", flag: "🇶🇦" },
  { code: "RO", name: "Romania", flag: "🇷🇴" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "SK", name: "Slovakia", flag: "🇸🇰" },
  { code: "SI", name: "Slovenia", flag: "🇸🇮" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "TW", name: "Taiwan", flag: "🇹🇼" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "TN", name: "Tunisia", flag: "🇹🇳" },
  { code: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "YE", name: "Yemen", flag: "🇾🇪" },
];

// src/services/cityService.js
import axios from "axios";

class CityService {
  constructor() {
    // Using Geonames API (free tier available)
    this.geonamesUsername = "kariera_app"; // You need to register at geonames.org
    this.baseUrl = "http://api.geonames.org";

    // Backup: REST Countries API for cities
    this.restCountriesUrl = "https://restcountries.com/v3.1";

    // Cache to avoid repeated API calls
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // Get cities for a country with search functionality
  async getCities(countryCode, searchQuery = "", limit = 20) {
    const cacheKey = `${countryCode}-${searchQuery.toLowerCase()}`;

    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      // Method 1: Geonames API (most comprehensive)
      const cities = await this.getCitiesFromGeonames(
        countryCode,
        searchQuery,
        limit
      );

      // Cache the results
      this.cache.set(cacheKey, {
        data: cities,
        timestamp: Date.now(),
      });

      return cities;
    } catch (error) {
      console.error("Error fetching cities:", error);

      // Fallback to local data for major cities
      return this.getFallbackCities(countryCode, searchQuery);
    }
  }

  async getCitiesFromGeonames(countryCode, searchQuery, limit) {
    const params = {
      country: countryCode,
      featureClass: "P", // Places (cities, towns)
      maxRows: limit,
      type: "json",
      username: this.geonamesUsername,
      orderby: "population",
      cities: "cities15000", // Cities with population > 15,000
    };

    // Add search query if provided
    if (searchQuery && searchQuery.length >= 2) {
      params.name_startsWith = searchQuery;
    }

    const response = await axios.get(`${this.baseUrl}/searchJSON`, { params });

    if (response.data && response.data.geonames) {
      return response.data.geonames.map((city) => ({
        name: city.name,
        adminName: city.adminName1, // State/Province
        countryCode: city.countryCode,
        population: city.population,
        lat: parseFloat(city.lat),
        lng: parseFloat(city.lng),
        id: city.geonameId,
      }));
    }

    return [];
  }

  // Fallback cities for major countries (when API fails)
  getFallbackCities(countryCode, searchQuery) {
    const majorCities = {
      US: [
        "New York",
        "Los Angeles",
        "Chicago",
        "Houston",
        "Phoenix",
        "Philadelphia",
        "San Antonio",
        "San Diego",
        "Dallas",
        "San Jose",
      ],
      CA: [
        "Toronto",
        "Montreal",
        "Vancouver",
        "Calgary",
        "Edmonton",
        "Ottawa",
        "Winnipeg",
        "Quebec City",
        "Hamilton",
        "Kitchener",
      ],
      GB: [
        "London",
        "Birmingham",
        "Manchester",
        "Glasgow",
        "Liverpool",
        "Leeds",
        "Sheffield",
        "Edinburgh",
        "Bristol",
        "Cardiff",
      ],
      FR: [
        "Paris",
        "Marseille",
        "Lyon",
        "Toulouse",
        "Nice",
        "Nantes",
        "Montpellier",
        "Strasbourg",
        "Bordeaux",
        "Lille",
      ],
      DE: [
        "Berlin",
        "Hamburg",
        "Munich",
        "Cologne",
        "Frankfurt",
        "Stuttgart",
        "Düsseldorf",
        "Leipzig",
        "Dortmund",
        "Essen",
      ],
      IT: [
        "Rome",
        "Milan",
        "Naples",
        "Turin",
        "Palermo",
        "Genoa",
        "Bologna",
        "Florence",
        "Bari",
        "Catania",
      ],
      ES: [
        "Madrid",
        "Barcelona",
        "Valencia",
        "Seville",
        "Zaragoza",
        "Málaga",
        "Murcia",
        "Palma",
        "Las Palmas",
        "Bilbao",
      ],
      TN: [
        "Tunis",
        "Sfax",
        "Sousse",
        "Ettadhamen",
        "Kairouan",
        "Gabès",
        "Bizerte",
        "Ariana",
        "Gafsa",
        "Monastir",
      ],
      AU: [
        "Sydney",
        "Melbourne",
        "Brisbane",
        "Perth",
        "Adelaide",
        "Gold Coast",
        "Newcastle",
        "Canberra",
        "Central Coast",
        "Wollongong",
      ],
      IN: [
        "Mumbai",
        "Delhi",
        "Bangalore",
        "Hyderabad",
        "Chennai",
        "Kolkata",
        "Pune",
        "Ahmedabad",
        "Surat",
        "Jaipur",
      ],
      BR: [
        "São Paulo",
        "Rio de Janeiro",
        "Brasília",
        "Salvador",
        "Fortaleza",
        "Belo Horizonte",
        "Manaus",
        "Curitiba",
        "Recife",
        "Goiânia",
      ],
    };

    const cities = majorCities[countryCode] || [];

    if (searchQuery && searchQuery.length >= 1) {
      const filtered = cities.filter((city) =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return filtered.map((name) => ({ name, countryCode }));
    }

    return cities.map((name) => ({ name, countryCode }));
  }

  // Alternative method using REST Countries + Cities API
  async getCitiesAlternative(countryCode, searchQuery = "") {
    try {
      // This is a simpler approach using a different API
      // You can implement this as a backup
      const response = await axios.get(
        `https://countriesnow.space/api/v0.1/countries/cities`,
        {
          method: "POST",
          data: { country: this.getCountryName(countryCode) },
        }
      );

      if (response.data && response.data.data) {
        let cities = response.data.data;

        if (searchQuery) {
          cities = cities.filter((city) =>
            city.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        return cities.slice(0, 20).map((name) => ({ name, countryCode }));
      }
    } catch (error) {
      console.error("Alternative city API failed:", error);
    }

    return [];
  }

  // Helper to get country name from code
  getCountryName(code) {
    const countryMap = {
      US: "United States",
      GB: "United Kingdom",
      CA: "Canada",
      FR: "France",
      DE: "Germany",
      IT: "Italy",
      ES: "Spain",
      TN: "Tunisia",
      // Add more mappings as needed
    };

    return countryMap[code] || code;
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }
}

// Export singleton instance
export const cityService = new CityService();

// Note: To use Geonames API, you need to:
// 1. Register at http://www.geonames.org/login
// 2. Create a free account
// 3. Enable web services in your account
// 4. Replace 'kariera_app' with your username above
