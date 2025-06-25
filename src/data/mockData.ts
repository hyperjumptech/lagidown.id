// Types
export type Website = {
  id: number;
  name: string;
  url: string;
  description: string;
  category: string;
  logo: string;
  region: string;
};

export type ResponseTimePoint = {
  timestamp: Date;
  value: number;
};

export type Status = "up" | "down";

export const statusTypes = {
  up: { label: "Up", color: "bg-green-500" },
  down: { label: "Down", color: "bg-red-500" }
};

// Popular websites data
export const popularWebsites = [
  {
    id: 1,
    name: "Tokopedia",
    url: "tokopedia.com",
    description: "Indonesia's largest online marketplace",
    category: "E-commerce",
    logo: "",
    region: "Indonesia"
  },
  {
    id: 2,
    name: "Gojek",
    url: "gojek.com",
    description: "Super app for transportation, food delivery, and payments",
    category: "Transportation",
    logo: "",
    region: "Indonesia"
  },
  {
    id: 3,
    name: "Shopee",
    url: "shopee.co.id",
    description: "Leading e-commerce platform in Southeast Asia",
    category: "E-commerce",
    logo: "",
    region: "Indonesia"
  },
  {
    id: 4,
    name: "Detik",
    url: "detik.com",
    description: "Popular Indonesian news portal",
    category: "News",
    logo: "",
    region: "Indonesia"
  },
  {
    id: 5,
    name: "Kompas",
    url: "kompas.com",
    description: "Indonesia's national newspaper online",
    category: "News",
    logo: "",
    region: "Indonesia"
  },
  {
    id: 6,
    name: "Bukalapak",
    url: "bukalapak.com",
    description: "E-commerce platform for small and medium businesses",
    category: "E-commerce",
    logo: "",
    region: "Indonesia"
  },
  {
    id: 7,
    name: "Traveloka",
    url: "traveloka.com",
    description: "Travel booking platform for flights and hotels",
    category: "Travel",
    logo: "",
    region: "Indonesia"
  },
  {
    id: 8,
    name: "Blibli",
    url: "blibli.com",
    description: "Online shopping mall with wide product selection",
    category: "E-commerce",
    logo: "",
    region: "Indonesia"
  },
  {
    id: 9,
    name: "Google",
    url: "google.com",
    description: "World's most popular search engine",
    category: "Search",
    logo: "",
    region: "Global"
  },
  {
    id: 10,
    name: "Facebook",
    url: "facebook.com",
    description: "Largest social media platform",
    category: "Social Media",
    logo: "",
    region: "Global"
  },
  {
    id: 11,
    name: "YouTube",
    url: "youtube.com",
    description: "Video sharing platform",
    category: "Entertainment",
    logo: "",
    region: "Global"
  },
  {
    id: 12,
    name: "Twitter",
    url: "twitter.com",
    description: "Social networking service for news and short messages",
    category: "Social Media",
    logo: "",
    region: "Global"
  },
  {
    id: 13,
    name: "Instagram",
    url: "instagram.com",
    description: "Photo and video sharing social network",
    category: "Social Media",
    logo: "",
    region: "Global"
  },
  {
    id: 14,
    name: "LinkedIn",
    url: "linkedin.com",
    description: "Professional networking platform",
    category: "Social Media",
    logo: "",
    region: "Global"
  },
  {
    id: 15,
    name: "Netflix",
    url: "netflix.com",
    description: "Streaming service for movies and TV shows",
    category: "Entertainment",
    logo: "",
    region: "Global"
  },
  {
    id: 16,
    name: "Amazon",
    url: "amazon.com",
    description: "Global e-commerce and cloud computing company",
    category: "E-commerce",
    logo: "",
    region: "Global"
  },
  {
    id: 17,
    name: "Tiket.com",
    url: "tiket.com",
    description: "Online travel agent for flights, hotels, and attractions",
    category: "Travel",
    logo: "",
    region: "Indonesia"
  },
  {
    id: 18,
    name: "Lazada",
    url: "lazada.co.id",
    description: "E-commerce platform with wide product selection",
    category: "E-commerce",
    logo: "",
    region: "Indonesia"
  },
  {
    id: 19,
    name: "Biznet",
    url: "biznet.co.id",
    description: "Internet service provider with fiber optic network",
    category: "Internet Provider",
    logo: "",
    region: "Indonesia"
  },
  {
    id: 20,
    name: "Indihome",
    url: "indihome.co.id",
    description: "Internet, TV, and phone service provider by Telkom Indonesia",
    category: "Internet Provider",
    logo: "",
    region: "Indonesia"
  },
  {
    id: 21,
    name: "WhatsApp",
    url: "whatsapp.com",
    description: "Messaging app for text, voice, and video communication",
    category: "Communication",
    logo: "",
    region: "Global"
  },
  {
    id: 22,
    name: "XL Axiata",
    url: "xl.co.id",
    description: "Mobile telecommunications service provider",
    category: "Telecommunications",
    logo: "",
    region: "Indonesia"
  },
  {
    id: 23,
    name: "IM3 Ooredoo",
    url: "im3ooredoo.com",
    description: "Mobile telecommunications service provider by Indosat",
    category: "Telecommunications",
    logo: "",
    region: "Indonesia"
  },
  {
    id: 24,
    name: "MyRepublic",
    url: "myrepublic.co.id",
    description: "Internet service provider with fiber optic network",
    category: "Internet Provider",
    logo: "",
    region: "Indonesia"
  }
];

// Indonesian cities for monitoring
export const indonesianCities = ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Makassar', 'Semarang', 'Palembang', 'Denpasar'];

// Get a placeholder image for websites without logos
export const getPlaceholderLogo = (websiteName: string): string => {
  // Create a color based on the first character of the website name
  const charCode = websiteName.charCodeAt(0) % 360;
  const bgColor = `hsl(${charCode}, 70%, 60%)`;
  const letter = websiteName.charAt(0).toUpperCase();

  // Create a data URL for a colored circle with the first letter
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='${encodeURIComponent(bgColor)}'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='50' fill='white' text-anchor='middle' dominant-baseline='central'%3E${letter}%3C/text%3E%3C/svg%3E`;
};

// Simple hash function for deterministic results
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Deterministically get status for a website in a specific city
export const getWebsiteStatusForCity = (website: Website, city: string): Status => {
  // Hash the website URL and city to get a consistent result
  const hash = hashString(`${website.url}-${city}`);
  const dayHash = hashString(`${website.url}-${city}-${new Date().getDate()}`);
  
  // Different websites have different reliability patterns
  switch(website.url) {
    case 'google.com':
      // Google is almost always up (99.9% uptime)
      return (hash % 1000 < 998) ? "up" : "down";
      
    case 'tokopedia.com':
      // Tokopedia is very reliable (99% uptime)
      return (hash % 100 < 99) ? "up" : "down";
      
    case 'shopee.co.id':
      // Shopee is mostly reliable but has occasional issues in certain cities
      if (city === 'Makassar' && dayHash % 10 < 3) {
        // Makassar has some issues today
        return "down";
      }
      return (hash % 100 < 95) ? "up" : "down";
      
    case 'bukalapak.com':
      // Bukalapak has frequent issues
      if (city === 'Jakarta' || city === 'Bandung') {
        // More issues in major cities
        return (hash % 10 < 7) ? "up" : "down";
      }
      return (hash % 10 < 8) ? "up" : "down";
      
    case 'blibli.com':
      // Blibli has serious issues in specific cities today
      if (city === 'Jakarta' && dayHash % 10 < 8) {
        return "down"; // Jakarta is having issues today
      } else if (city === 'Surabaya' && dayHash % 10 < 5) {
        return "down"; // Surabaya has some issues
      }
      return (hash % 100 < 90) ? "up" : "down";
      
    case 'twitter.com':
      // Twitter is having a bad day today in Indonesia
      if (dayHash % 10 < 6) {
        // 60% chance of being down today across all cities
        return "down";
      }
      return (hash % 10 < 8) ? "up" : "down";
      
    default:
      // For other websites, create patterns based on city
      const cityIndex = indonesianCities.indexOf(city);
      
      // Some cities have better connectivity than others
      if (cityIndex < 3) { // Jakarta, Surabaya, Bandung have better connectivity
        return (hash % 10 < 9) ? "up" : "down";
      } else if (cityIndex >= indonesianCities.length - 2) { // Makassar, Manado have worse connectivity
        return (hash % 10 < 7) ? "up" : "down";
      } else {
        return (hash % 10 < 8) ? "up" : "down";
      }
  }
};

// Get status for a website and city
export function getStatusForWebsiteAndCity(websiteId: number, city: string): Status {
  // Get the website
  const website = popularWebsites.find(w => w.id === websiteId);
  if (!website) return 'up';
  
  // Get the historical data and use the most recent data point to determine status
  const historicalData = getHistoricalResponseTimeData(websiteId, city);
  
  // If we have historical data, use the most recent point to determine status
  if (historicalData.length > 0) {
    // Sort by timestamp to ensure we get the most recent
    const sortedData = [...historicalData].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    // Use the most recent data point
    const mostRecent = sortedData[0];
    
    // If response time is very high (> 1000ms), consider it down
    return mostRecent.value > 1000 ? 'down' : 'up';
  }
  
  // Fallback to the old method if no historical data
  return getWebsiteStatusForCity(website, city);
}

// Get response time for a website and city
export function getResponseTimeForWebsiteAndCity(websiteId: number, city: string): number {
  // Get the website URL
  const website = popularWebsites.find(w => w.id === websiteId);
  if (!website) return 200; // Default fast response
  
  // Get the historical data and use the most recent data point
  const historicalData = getHistoricalResponseTimeData(websiteId, city);
  
  // If we have historical data, use the most recent point
  if (historicalData.length > 0) {
    // Sort by timestamp to ensure we get the most recent
    const sortedData = [...historicalData].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    // Return the most recent response time
    return sortedData[0].value;
  }
  
  // Fallback to the old method if no historical data
  // First get the status to ensure response time is consistent with status
  const status = getStatusForWebsiteAndCity(websiteId, city);
  
  // Create a deterministic but realistic response time based on status
  const hash = hashString(`${website.url}-${city}`);
  
  if (status === "up") {
    // Fast response times between 80ms and 350ms for UP status
    // Most sites will be around 150-250ms which is realistic
    const base = 80 + (hash % 20) * 5;
    const variation = hash % 150;
    return base + variation;
  } else {
    // Down status - very high response times or timeout values
    // Between 2000ms and 5000ms (simulating timeout)
    return 2000 + (hash % 3000);
  }
}

// Get status summary for a website across all cities
export function getStatusSummaryForWebsite(websiteId: number) {
  const summary = {
    up: 0,
    down: 0
  };
  
  indonesianCities.forEach(city => {
    const status = getStatusForWebsiteAndCity(websiteId, city);
    summary[status]++;
  });
  
  return summary;
}

// Generate 24 hours of historical response time data for a website and city
export function getHistoricalResponseTimeData(websiteId: number, city: string): ResponseTimePoint[] {
  // Get the website for consistent hashing
  const website = popularWebsites.find(w => w.id === websiteId);
  if (!website) {
    // Default data if website not found
    return generateDefaultResponseTimeData();
  }
  
  const data: ResponseTimePoint[] = [];
  const now = new Date();
  
  // Create a pattern based on the website and city
  const websitePattern = getWebsitePattern(website.url);
  
  // Generate 24 data points (hourly for a day)
  for (let i = 0; i < 24; i++) {
    const hourTimestamp = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
    const hour = hourTimestamp.getHours();
    
    // Determine if this hour has an outage based on website pattern
    const hourHash = hashString(`${website.url}-${city}-${hourTimestamp.getDate()}-${hour}`);
    const isDown = isHourDown(website.url, city, hourTimestamp, websitePattern, hourHash);
    
    // Generate response time based on status
    const responseTime = generateResponseTime(website.url, city, hour, isDown, hourHash);
    
    data.push({
      timestamp: hourTimestamp,
      value: responseTime
    });
  }
  
  return data;
}

// Determine website pattern type
function getWebsitePattern(websiteUrl: string): string {
  switch(websiteUrl) {
    case 'google.com':
      return 'ultra-reliable'; // Almost always up with very consistent response times
    case 'tokopedia.com':
      return 'very-reliable'; // Very reliable with slight variations
    case 'twitter.com':
      return 'currently-degraded'; // Having issues today
    case 'blibli.com':
      return 'location-specific-issues'; // Issues in specific locations
    case 'bukalapak.com':
      return 'frequent-issues'; // Regular short outages
    default:
      return 'normal'; // Standard pattern
  }
}

// Determine if a specific hour is down
function isHourDown(websiteUrl: string, city: string, timestamp: Date, pattern: string, hash: number): boolean {
  const hour = timestamp.getHours();
  
  switch(pattern) {
    case 'ultra-reliable':
      return hash % 1000 < 2; // 0.2% chance of being down
      
    case 'very-reliable':
      return hash % 200 < 3; // 1.5% chance of being down
      
    case 'currently-degraded':
      // Higher chance of being down during business hours
      if (hour >= 9 && hour <= 17) {
        return hash % 10 < 6; // 60% chance during business hours
      }
      return hash % 10 < 3; // 30% chance outside business hours
      
    case 'location-specific-issues':
      // Issues in specific cities
      if ((city === 'Jakarta' || city === 'Surabaya') && hash % 10 < 7) {
        return true; // 70% chance of being down in these cities
      }
      return hash % 20 < 2; // 10% chance elsewhere
      
    case 'frequent-issues':
      // Regular short outages throughout the day
      if (hour % 4 === 0 && hash % 10 < 7) { // Every 4 hours with 70% chance
        return true;
      }
      return hash % 20 < 3; // 15% chance otherwise
      
    default: // normal pattern
      // More likely to have issues during peak hours
      if ((hour >= 8 && hour <= 10) || (hour >= 19 && hour <= 21)) {
        return hash % 20 < 3; // 15% chance during peak hours
      }
      return hash % 30 < 2; // ~7% chance otherwise
  }
}

// Generate response time based on status and pattern
function generateResponseTime(websiteUrl: string, city: string, hour: number, isDown: boolean, hash: number): number {
  if (isDown) {
    // Down status - high response times (2000-5000ms)
    return 2000 + (hash % 3000);
  }
  
  // Up status - generate realistic response times
  // Base response time depends on website and city
  let baseResponseTime = 100;
  
  switch(websiteUrl) {
    case 'google.com':
      baseResponseTime = 80 + (hash % 30); // 80-110ms
      break;
    case 'tokopedia.com':
      baseResponseTime = 100 + (hash % 50); // 100-150ms
      break;
    default:
      baseResponseTime = 120 + (hash % 80); // 120-200ms
  }
  
  // Add variation based on time of day
  // Websites are typically slower during peak hours
  if ((hour >= 8 && hour <= 10) || (hour >= 19 && hour <= 21)) {
    baseResponseTime += 50 + (hash % 50); // Add 50-100ms during peak hours
  }
  
  // Add slight random variation
  const variation = hash % 30;
  
  return baseResponseTime + variation;
}

// Generate default response time data if website not found
function generateDefaultResponseTimeData(): ResponseTimePoint[] {
  const data: ResponseTimePoint[] = [];
  const now = new Date();
  
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
    // Random value between 100 and 300ms
    const value = 100 + Math.floor(Math.random() * 200);
    data.push({ timestamp, value });
  }
  
  return data;
}

// Get status for a specific URL
export function getStatusForUrl(url: string, city: string): Status {
  // Try to find a matching website in our database
  const website = popularWebsites.find(w => w.url.replace(/\./g, '') === url.replace(/\./g, ''));
  
  if (website) {
    // If we have this website in our database, use the existing status function
    return getStatusForWebsiteAndCity(website.id, city);
  }
  
  // For new websites, generate a deterministic status based on URL and city
  const hash = hashString(`${url}-${city}`);
  if (hash % 100 < 80) {
    return 'up';
  } else {
    return 'down';
  }
}

export function getResponseTimeForUrl(url: string, city: string): number {
  // Try to find a matching website in our database
  const website = popularWebsites.find(w => w.url.replace(/\./g, '') === url.replace(/\./g, ''));
  
  if (website) {
    // If we have this website in our database, use the existing response time function
    return getResponseTimeForWebsiteAndCity(website.id, city);
  }
  
  // For new websites, generate a deterministic response time based on URL and city
  const hash = hashString(`${url}-${city}`);
  const baseResponseTime = 100 + (hash % 10) * 100;
  const variation = (hash % 100) * 5;
  
  // If status is down, return higher response time
  const status = getStatusForUrl(url, city);
  if (status === "down") {
    return baseResponseTime + variation + 2000;
  }
  
  return baseResponseTime + variation;
}

export function getIpForUrl(url: string): string {
  // Generate a deterministic IP address based on URL
  const hash = hashString(url);
  
  // Generate IPv4 address
  const octet1 = 100 + (hash % 100);
  const octet2 = 100 + ((hash >> 8) % 100);
  const octet3 = 100 + ((hash >> 16) % 100);
  const octet4 = 100 + ((hash >> 24) % 100);
  
  return `${octet1}.${octet2}.${octet3}.${octet4}`;
}

export function getMockWhoisData(url: string) {
  const hash = hashString(url);
  
  // Generate some mock registrars
  const registrars = [
    "GoDaddy.com, LLC",
    "Namecheap, Inc.",
    "Network Solutions, LLC",
    "Google Domains",
    "Hostinger",
    "DomainCom, Inc."
  ];
  
  // Generate creation date (1-10 years ago)
  const createdYearsAgo = 1 + (hash % 10);
  const createdDate = new Date();
  createdDate.setFullYear(createdDate.getFullYear() - createdYearsAgo);
  
  // Generate expiry date (1-3 years in future)
  const expiryYearsAhead = 1 + (hash % 3);
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + expiryYearsAhead);
  
  // Generate name servers
  const nameServerPrefixes = ["ns1", "ns2", "dns1", "dns2", "ns01", "ns02"];
  const nameServerDomains = [".google.com", ".cloudflare.com", ".hostinger.com", ".domaincontrol.com", ".namecheap.com"];
  
  const nameServers = [];
  const numNameServers = 2 + (hash % 3); // 2-4 name servers
  
  for (let i = 0; i < numNameServers; i++) {
    const prefix = nameServerPrefixes[i % nameServerPrefixes.length];
    const domain = nameServerDomains[(hash + i) % nameServerDomains.length];
    nameServers.push(`${prefix}${domain}`);
  }
  
  return {
    registrar: registrars[hash % registrars.length],
    createdDate: formatDate(createdDate),
    expiryDate: formatDate(expiryDate),
    nameServers: nameServers
  };
}

// Format date as YYYY-MM-DD
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}
