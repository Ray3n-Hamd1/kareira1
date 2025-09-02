// src/services/cityDropdownService.js
class CityDropdownService {
  constructor() {
    this.citiesData = {};
    this.loadingPromises = {};
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
      () => this.fetchFromGeonames(countryCode),
      () => this.fetchFromCountriesNow(countryCode),
      () => this.fetchFromRestCountries(countryCode),
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

    throw new Error(`No city data sources available for ${countryCode}`);
  }

  // Geonames API (most comprehensive)
  async fetchFromGeonames(countryCode) {
    const username = process.env.REACT_APP_GEONAMES_USERNAME || "demo"; // You need to register
    const response = await fetch(
      `http://api.geonames.org/searchJSON?country=${countryCode}&featureClass=P&maxRows=1000&username=${username}&orderby=population`
    );

    if (!response.ok) throw new Error("Geonames API failed");

    const data = await response.json();
    return (
      data.geonames?.map((city) => ({
        name: city.name,
        population: city.population,
        admin: city.adminName1,
      })) || []
    );
  }

  // Countries Now API
  async fetchFromCountriesNow(countryCode) {
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
    return data.data?.map((name) => ({ name })) || [];
  }

  // REST Countries API (limited city data)
  async fetchFromRestCountries(countryCode) {
    // This API doesn't provide cities, so we'll use local data
    return this.getFallbackCities(countryCode);
  }

  sortAndFormatCities(cities) {
    // Remove duplicates and sort
    const uniqueCities = cities.reduce((acc, city) => {
      const key = city.name.toLowerCase();
      if (
        !acc[key] ||
        (city.population && city.population > (acc[key].population || 0))
      ) {
        acc[key] = city;
      }
      return acc;
    }, {});

    return Object.values(uniqueCities)
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

  // Comprehensive fallback city data
  getFallbackCities(countryCode) {
    const fallbackData = {
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
        "Austin",
        "Jacksonville",
        "Fort Worth",
        "Columbus",
        "Charlotte",
        "San Francisco",
        "Indianapolis",
        "Seattle",
        "Denver",
        "Washington",
        "Boston",
        "El Paso",
        "Nashville",
        "Detroit",
        "Oklahoma City",
        "Portland",
        "Las Vegas",
        "Memphis",
        "Louisville",
        "Baltimore",
        "Milwaukee",
        "Albuquerque",
        "Tucson",
        "Fresno",
        "Sacramento",
        "Kansas City",
        "Mesa",
        "Atlanta",
        "Omaha",
        "Colorado Springs",
        "Raleigh",
        "Miami",
        "Long Beach",
        "Virginia Beach",
        "Oakland",
        "Minneapolis",
        "Tampa",
        "Tulsa",
        "Arlington",
        "New Orleans",
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
        "London",
        "Victoria",
        "Halifax",
        "Oshawa",
        "Windsor",
        "Saskatoon",
        "St. Catharines",
        "Regina",
        "Sherbrooke",
        "Barrie",
        "Kelowna",
        "Abbotsford",
        "Kingston",
        "Trois-Rivières",
        "Guelph",
        "Cambridge",
        "Whitby",
        "Ajax",
        "Langley",
        "Saanich",
        "Terrebonne",
        "Milton",
        "St. John's",
        "Moncton",
        "Thunder Bay",
        "Dieppe",
        "Waterloo",
        "Cape Breton",
        "Red Deer",
        "Kamloops",
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
        "Leicester",
        "Coventry",
        "Bradford",
        "Belfast",
        "Nottingham",
        "Plymouth",
        "Southampton",
        "Reading",
        "Derby",
        "Dudley",
        "York",
        "Gloucester",
        "Exeter",
        "Bath",
        "Oxford",
        "Cambridge",
        "Brighton",
        "Newcastle",
        "Sunderland",
        "Portsmouth",
        "Swansea",
        "Dundee",
        "Aberdeen",
        "Stirling",
        "Inverness",
        "Perth",
        "Bangor",
        "Chester",
        "Worcester",
        "Canterbury",
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
        "Rennes",
        "Reims",
        "Saint-Étienne",
        "Toulon",
        "Le Havre",
        "Grenoble",
        "Dijon",
        "Angers",
        "Nîmes",
        "Villeurbanne",
        "Saint-Denis",
        "Le Mans",
        "Aix-en-Provence",
        "Clermont-Ferrand",
        "Brest",
        "Tours",
        "Limoges",
        "Amiens",
        "Perpignan",
        "Metz",
        "Besançon",
        "Orléans",
        "Rouen",
        "Mulhouse",
        "Caen",
        "Nancy",
        "Saint-Paul",
        "Roubaix",
        "Tourcoing",
        "Montreuil",
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
        "Bremen",
        "Dresden",
        "Hanover",
        "Nuremberg",
        "Duisburg",
        "Bochum",
        "Wuppertal",
        "Bielefeld",
        "Bonn",
        "Münster",
        "Mannheim",
        "Augsburg",
        "Wiesbaden",
        "Gelsenkirchen",
        "Mönchengladbach",
        "Braunschweig",
        "Chemnitz",
        "Kiel",
        "Aachen",
        "Halle",
        "Magdeburg",
        "Freiburg",
        "Krefeld",
        "Lübeck",
        "Mainz",
        "Erfurt",
        "Oberhausen",
        "Rostock",
        "Kassel",
        "Hagen",
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
        "Venice",
        "Verona",
        "Messina",
        "Padua",
        "Trieste",
        "Brescia",
        "Taranto",
        "Prato",
        "Parma",
        "Reggio Calabria",
        "Modena",
        "Reggio Emilia",
        "Perugia",
        "Livorno",
        "Ravenna",
        "Cagliari",
        "Foggia",
        "Rimini",
        "Salerno",
        "Ferrara",
        "Sassari",
        "Latina",
        "Giugliano",
        "Monza",
        "Syracuse",
        "Pescara",
        "Bergamo",
        "Forlì",
        "Trento",
        "Vicenza",
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
        "Alicante",
        "Córdoba",
        "Valladolid",
        "Vigo",
        "Gijón",
        "Hospitalet",
        "Vitoria",
        "A Coruña",
        "Elche",
        "Granada",
        "Oviedo",
        "Badalona",
        "Cartagena",
        "Terrassa",
        "Jerez",
        "Sabadell",
        "Móstoles",
        "Santa Cruz",
        "Pamplona",
        "Almería",
        "Alcalá de Henares",
        "Fuenlabrada",
        "Leganés",
        "Santander",
        "Burgos",
        "Castellón",
        "Alcorcón",
        "Albacete",
        "Getafe",
        "Salamanca",
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
        "Ben Arous",
        "Kasserine",
        "Médenine",
        "Nabeul",
        "Beja",
        "Jendouba",
        "Tataouine",
        "Le Kef",
        "Mahdia",
        "Siliana",
        "Manouba",
        "Zaghouan",
        "Tozeur",
        "Kebili",
        "Sidi Bouzid",
        "Hammam Sousse",
        "Msaken",
        "Moknine",
        "Menzel Bourguiba",
        "Zarzis",
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
        "Logan City",
        "Geelong",
        "Hobart",
        "Townsville",
        "Cairns",
        "Darwin",
        "Toowoomba",
        "Ballarat",
        "Bendigo",
        "Albury",
        "Launceston",
        "Mackay",
        "Rockhampton",
        "Bunbury",
        "Bundaberg",
        "Wagga Wagga",
        "Hervey Bay",
        "Mildura",
        "Shepparton",
        "Gladstone",
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
        "Lucknow",
        "Kanpur",
        "Nagpur",
        "Indore",
        "Thane",
        "Bhopal",
        "Visakhapatnam",
        "Pimpri",
        "Patna",
        "Vadodara",
        "Ghaziabad",
        "Ludhiana",
        "Agra",
        "Nashik",
        "Faridabad",
        "Meerut",
        "Rajkot",
        "Kalyan",
        "Vasai",
        "Varanasi",
        "Srinagar",
        "Aurangabad",
        "Dhanbad",
        "Amritsar",
        "Navi Mumbai",
        "Allahabad",
        "Ranchi",
        "Haora",
        "Coimbatore",
        "Jabalpur",
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
        "Belém",
        "Porto Alegre",
        "Guarulhos",
        "Campinas",
        "São Luís",
        "São Gonçalo",
        "Maceió",
        "Duque de Caxias",
        "Campo Grande",
        "Natal",
        "Teresina",
        "São Bernardo do Campo",
        "Nova Iguaçu",
        "João Pessoa",
        "Santo André",
        "São José dos Campos",
        "Jaboatão",
        "Osasco",
        "Ribeirão Preto",
        "Uberlândia",
      ],
      JP: [
        "Tokyo",
        "Yokohama",
        "Osaka",
        "Nagoya",
        "Sapporo",
        "Fukuoka",
        "Kobe",
        "Kyoto",
        "Kawasaki",
        "Saitama",
        "Hiroshima",
        "Sendai",
        "Kitakyushu",
        "Chiba",
        "Sakai",
        "Niigata",
        "Hamamatsu",
        "Shizuoka",
        "Sagamihara",
        "Okayama",
        "Kumamoto",
        "Kagoshima",
        "Hachioji",
        "Funabashi",
        "Nara",
        "Matsuyama",
        "Toyohashi",
        "Toyonaka",
        "Nagasaki",
        "Machida",
      ],
      CN: [
        "Shanghai",
        "Beijing",
        "Shenzhen",
        "Guangzhou",
        "Tianjin",
        "Chongqing",
        "Dongguan",
        "Chengdu",
        "Nanjing",
        "Wuhan",
        "Xi'an",
        "Hangzhou",
        "Foshan",
        "Shenyang",
        "Qingdao",
        "Jinan",
        "Harbin",
        "Zhengzhou",
        "Kunming",
        "Dalian",
        "Changchun",
        "Taiyuan",
        "Shijiazhuang",
        "Ürümqi",
        "Xuzhou",
        "Changsha",
        "Ningbo",
        "Hefei",
        "Suzhou",
        "Lanzhou",
      ],
      // Add more countries as needed...
    };

    const cities = fallbackData[countryCode] || [];
    return cities.map((name) => ({ name }));
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
