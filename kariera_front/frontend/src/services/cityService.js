// src/services/cityService.js - IMPROVED WITH BETTER APIs
class CityDropdownService {
  constructor() {
    this.citiesData = {};
    this.loadingPromises = {};
    this.googleMapsLoaded = false;
  }

  // Get all cities for a country as a dropdown list
  async getCitiesForDropdown(countryCode) {
    // Return cached data if available
    if (this.citiesData[countryCode]) {
      return this.citiesData[countryCode];
    }

    // Return existing promise if already loading
    if (this.loadingPromises[countryCode]) {
      return this.loadingPromises[countryCode];
    }

    // Start loading cities
    this.loadingPromises[countryCode] = this.loadCitiesData(countryCode);

    try {
      const cities = await this.loadingPromises[countryCode];
      this.citiesData[countryCode] = cities;
      delete this.loadingPromises[countryCode];
      return cities;
    } catch (error) {
      delete this.loadingPromises[countryCode];
      throw error;
    }
  }

  async loadCitiesData(countryCode) {
    try {
      // Try multiple APIs for comprehensive city data
      const cities = await this.fetchFromMultipleSources(countryCode);
      return this.sortAndFormatCities(cities);
    } catch (error) {
      console.error(`Error loading cities for ${countryCode}:`, error);
      return this.getFallbackCities(countryCode);
    }
  }

  async fetchFromMultipleSources(countryCode) {
    const sources = [
      () => this.fetchFromRestCountries(countryCode),
      () => this.fetchFromCountriesNow(countryCode),
      () => this.fetchFromWorldCities(countryCode),
      () => this.fetchFromGooglePlaces(countryCode), // If API key is provided
    ];

    for (const source of sources) {
      try {
        const cities = await source();
        if (cities && cities.length > 0) {
          return cities;
        }
      } catch (error) {
        console.warn(`City source failed for ${countryCode}:`, error.message);
        continue;
      }
    }

    // If all APIs fail, return fallback data
    console.log(`Using fallback cities for ${countryCode}`);
    return this.getFallbackCities(countryCode);
  }

  // REST Countries API + World Cities API
  async fetchFromRestCountries(countryCode) {
    try {
      // First get country info
      const response = await fetch(
        `https://restcountries.com/v3.1/alpha/${countryCode}?fields=name`
      );

      if (!response.ok) throw new Error("REST Countries API failed");

      const [countryData] = await response.json();
      const countryName = countryData.name.common;

      // Then get cities from World Cities API
      return await this.fetchWorldCities(countryName, countryCode);
    } catch (error) {
      throw new Error(`REST Countries failed: ${error.message}`);
    }
  }

  // World Cities API (free, no API key needed)
  async fetchWorldCities(countryName, countryCode) {
    try {
      const response = await fetch(
        `https://api.api-ninjas.com/v1/city?country=${countryName}&limit=100`,
        {
          headers: {
            "X-Api-Key": process.env.REACT_APP_API_NINJAS_KEY || "demo", // Free tier available
          },
        }
      );

      if (response.ok) {
        const cities = await response.json();
        return cities.map((city) => ({
          name: city.name,
          population: city.population,
          admin: city.state || city.region,
        }));
      }

      throw new Error("API Ninjas failed");
    } catch (error) {
      // If API Ninjas fails, use fallback
      throw error;
    }
  }

  // Countries Now API (completely free)
  async fetchFromCountriesNow(countryCode) {
    try {
      const countryName = this.getCountryName(countryCode);
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/cities",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: countryName }),
        }
      );

      if (!response.ok) throw new Error("Countries Now API failed");

      const data = await response.json();

      if (data.error) {
        throw new Error(data.msg || "Countries Now API error");
      }

      return (
        data.data?.map((name) => ({
          name: name.trim(),
          population: null,
          admin: null,
        })) || []
      );
    } catch (error) {
      throw new Error(`Countries Now failed: ${error.message}`);
    }
  }

  // World Cities Database (alternative free source)
  async fetchFromWorldCities(countryCode) {
    try {
      // This uses a public cities database
      const response = await fetch(
        `https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv`
      );

      if (!response.ok) throw new Error("World Cities DB failed");

      // This is just an example - you'd need to find a proper cities API
      // For now, return fallback
      throw new Error("World Cities DB not implemented");
    } catch (error) {
      throw error;
    }
  }

  // Google Places API (if API key is provided)
  async fetchFromGooglePlaces(countryCode) {
    const apiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      throw new Error("Google Places API key not provided");
    }

    try {
      // Load Google Maps API if not already loaded
      if (!window.google && !this.googleMapsLoaded) {
        await this.loadGoogleMapsAPI(apiKey);
      }

      if (!window.google) {
        throw new Error("Google Maps API not available");
      }

      // Use Google Places API to get cities
      return new Promise((resolve, reject) => {
        const service = new window.google.maps.places.PlacesService(
          document.createElement("div")
        );

        const countryName = this.getCountryName(countryCode);

        const request = {
          query: `cities in ${countryName}`,
          type: "locality",
        };

        service.textSearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            const cities = results.slice(0, 50).map((place) => ({
              name: place.name,
              population: null,
              admin: place.formatted_address?.split(",")[1]?.trim(),
            }));
            resolve(cities);
          } else {
            reject(new Error(`Google Places API failed: ${status}`));
          }
        });
      });
    } catch (error) {
      throw new Error(`Google Places failed: ${error.message}`);
    }
  }

  // Load Google Maps API dynamically
  loadGoogleMapsAPI(apiKey) {
    return new Promise((resolve, reject) => {
      if (this.googleMapsLoaded) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.googleMapsLoaded = true;
        resolve();
      };

      script.onerror = () => {
        reject(new Error("Failed to load Google Maps API"));
      };

      document.head.appendChild(script);
    });
  }

  sortAndFormatCities(cities) {
    // Remove duplicates and sort
    const uniqueCities = cities.reduce((acc, city) => {
      const key = city.name.toLowerCase().trim();
      if (
        !acc[key] ||
        (city.population && city.population > (acc[key].population || 0))
      ) {
        acc[key] = {
          ...city,
          name: city.name.trim(), // Clean up name
        };
      }
      return acc;
    }, {});

    return Object.values(uniqueCities)
      .filter((city) => city.name && city.name.length > 0) // Remove empty names
      .sort((a, b) => {
        // Sort by population (if available), then alphabetically
        if (a.population && b.population) {
          return b.population - a.population;
        }
        return a.name.localeCompare(b.name);
      })
      .slice(0, 500); // Limit to 500 cities for performance
  }

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
      AU: "Australia",
      IN: "India",
      JP: "Japan",
      CN: "China",
      BR: "Brazil",
      MX: "Mexico",
      AR: "Argentina",
      RU: "Russia",
      ZA: "South Africa",
      EG: "Egypt",
      NG: "Nigeria",
      KE: "Kenya",
      MA: "Morocco",
      DZ: "Algeria",
      SA: "Saudi Arabia",
      AE: "United Arab Emirates",
      TR: "Turkey",
      GR: "Greece",
      PT: "Portugal",
      NL: "Netherlands",
      BE: "Belgium",
      CH: "Switzerland",
      AT: "Austria",
      SE: "Sweden",
      NO: "Norway",
      DK: "Denmark",
      FI: "Finland",
      PL: "Poland",
      CZ: "Czech Republic",
      HU: "Hungary",
      RO: "Romania",
      BG: "Bulgaria",
      HR: "Croatia",
      SK: "Slovakia",
      SI: "Slovenia",
      IE: "Ireland",
      LT: "Lithuania",
      LV: "Latvia",
      EE: "Estonia",
    };
    return countryMap[code] || code;
  }

  // Comprehensive fallback city data (most reliable)
  getFallbackCities(countryCode) {
    const fallbackData = {
      US: [
        { name: "New York", population: 8175133 },
        { name: "Los Angeles", population: 3792621 },
        { name: "Chicago", population: 2695598 },
        { name: "Houston", population: 2099451 },
        { name: "Phoenix", population: 1445632 },
        { name: "Philadelphia", population: 1526006 },
        { name: "San Antonio", population: 1327407 },
        { name: "San Diego", population: 1307402 },
        { name: "Dallas", population: 1197816 },
        { name: "San Jose", population: 945942 },
        { name: "Austin", population: 790390 },
        { name: "Jacksonville", population: 821784 },
        { name: "Fort Worth", population: 741206 },
        { name: "Columbus", population: 787033 },
        { name: "Charlotte", population: 731424 },
        { name: "San Francisco", population: 805235 },
        { name: "Indianapolis", population: 829718 },
        { name: "Seattle", population: 608660 },
        { name: "Denver", population: 600158 },
        { name: "Washington", population: 601723 },
      ],
      CA: [
        { name: "Toronto", population: 2930000 },
        { name: "Montreal", population: 1704694 },
        { name: "Vancouver", population: 631486 },
        { name: "Calgary", population: 1239220 },
        { name: "Edmonton", population: 972223 },
        { name: "Ottawa", population: 994837 },
        { name: "Winnipeg", population: 749534 },
        { name: "Quebec City", population: 531902 },
        { name: "Hamilton", population: 536917 },
        { name: "Kitchener", population: 233222 },
      ],
      GB: [
        { name: "London", population: 8982000 },
        { name: "Birmingham", population: 1141816 },
        { name: "Manchester", population: 547000 },
        { name: "Glasgow", population: 635130 },
        { name: "Liverpool", population: 498042 },
        { name: "Leeds", population: 789194 },
        { name: "Sheffield", population: 685368 },
        { name: "Edinburgh", population: 488050 },
        { name: "Bristol", population: 467099 },
        { name: "Cardiff", population: 364248 },
      ],
      FR: [
        { name: "Paris", population: 2161000 },
        { name: "Marseille", population: 861635 },
        { name: "Lyon", population: 515695 },
        { name: "Toulouse", population: 471941 },
        { name: "Nice", population: 342522 },
        { name: "Nantes", population: 309346 },
        { name: "Montpellier", population: 285121 },
        { name: "Strasbourg", population: 280966 },
        { name: "Bordeaux", population: 254436 },
        { name: "Lille", population: 232787 },
      ],
      DE: [
        { name: "Berlin", population: 3669491 },
        { name: "Hamburg", population: 1899160 },
        { name: "Munich", population: 1471508 },
        { name: "Cologne", population: 1085664 },
        { name: "Frankfurt", population: 753056 },
        { name: "Stuttgart", population: 634830 },
        { name: "Düsseldorf", population: 619294 },
        { name: "Leipzig", population: 593145 },
        { name: "Dortmund", population: 588250 },
        { name: "Essen", population: 582760 },
      ],
      TN: [
        { name: "Tunis", population: 638845 },
        { name: "Sfax", population: 330440 },
        { name: "Sousse", population: 271428 },
        { name: "Ettadhamen", population: 142953 },
        { name: "Kairouan", population: 139070 },
        { name: "Gabès", population: 130271 },
        { name: "Bizerte", population: 142966 },
        { name: "Ariana", population: 114486 },
        { name: "Gafsa", population: 111170 },
        { name: "Monastir", population: 104535 },
      ],
      // Add more countries as needed...
    };

    const cities = fallbackData[countryCode] || [];
    return cities.map((city) => ({
      name: city.name,
      population: city.population || null,
      admin: null,
    }));
  }

  // Clear cache
  clearCache() {
    this.citiesData = {};
  }

  // Get cached cities (synchronous)
  getCachedCities(countryCode) {
    return this.citiesData[countryCode] || [];
  }
}

// Export singleton instance
export const cityDropdownService = new CityDropdownService();
