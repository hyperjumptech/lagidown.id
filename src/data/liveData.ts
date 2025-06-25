import { Website, Status, ResponseTimePoint } from './mockData';

// Interface untuk data yang diterima dari Neosense API
export interface NeosenseStatusData {
  message: string;
  data: {
    id: string;
    name: string;
    probes: {
      id: string;
      name: string;
      type: string;
      url?: string;
      status: string;
      lastCheck?: {
        id: string;
        createdAt: string;
        responseTime?: number;
        status: string;
      };
      locations?: {
        id: string;
        name: string;
        status: string;
      }[];
    }[];
    locations?: {
      id: string;
      name: string;
    }[];
  };
}

// Fungsi untuk mengambil data live dari API
export async function fetchLiveStatusData(): Promise<NeosenseStatusData | null> {
  try {
    console.log('Fetching live status data from API...');
    const response = await fetch('/api/live-status', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store', // Disable caching to always get fresh data
      next: { revalidate: 0 }, // Ensure we're always getting fresh data
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch live status data: ${response.status} ${response.statusText}`);
    }
    
    // Check content type
    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.includes('application/json')) {
      console.warn(`Expected JSON response but got ${contentType}`);
    }
    
    const data = await response.json();
    console.log('Live status data received from API route');
    
    // Check if this is an error response with mock data
    if (data.isMockData) {
      console.warn('Received mock data fallback from API route. Error:', data.error);
      throw new Error(`API returned mock data fallback: ${data.error}`);
    }
    
    // Check if data has expected structure for new API format
    if (!data || !data.data || !data.data.probes || !Array.isArray(data.data.probes)) {
      console.warn('Received data does not have expected structure. Data structure:', 
        JSON.stringify(data).substring(0, 300) + '...');
      return null;
    }
    
    console.log('Valid data structure found with', data.data.probes.length, 'probes');
    
    // Log sample probe for debugging
    if (data.data.probes.length > 0) {
      const sampleProbe = data.data.probes[0];
      console.log('Sample probe:', 
        JSON.stringify(sampleProbe).substring(0, 200) + '...');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching live status data:', error);
    return null;
  }
}

// Fungsi untuk mengkonversi data Neosense ke format Website yang digunakan aplikasi
export function convertNeosenseToWebsites(data: NeosenseStatusData): Website[] {
  if (!data || !data.data || !data.data.probes || !Array.isArray(data.data.probes)) {
    console.log('Data tidak valid untuk konversi ke websites');
    return [];
  }
  
  console.log(`Ditemukan ${data.data.probes.length} probes di data`);
  console.log('Sample probe data:', JSON.stringify(data.data.probes[0]).substring(0, 500));
  
  // Accept all probes as websites regardless of type
  const httpProbes = data.data.probes.filter(probe => {
    if (!probe || typeof probe !== 'object') {
      console.log('Probe tidak valid:', probe);
      return false;
    }
    
    // Log probe details for debugging
    console.log(`Probe details: name=${probe.name || 'unnamed'}, type=${probe.type || 'unknown'}, url=${probe.url || 'none'}, status=${probe.status || 'unknown'}`);
    
    // Accept all probes that have a name
    return true;
  });
  
  console.log(`Setelah filter, tersisa ${httpProbes.length} probes HTTP dengan URL`);
  
  // Konversi ke format Website
  const websites = httpProbes.map((probe, index) => {
    // Extract domain from URL if available, or use name as fallback
    let url = 'unknown';
    const name = probe.name || `Website ${index + 1}`;
    
    // Try to extract URL from various fields
    if (probe.url) {
      url = probe.url;
      // Clean up URL if needed (remove http://, https://, trailing slashes)
      url = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    } else if (name.includes('.')) {
      // If name looks like a domain, use it as URL
      url = name;
    }
    
    const website: Website = {
      id: index + 1, // Gunakan index sebagai ID
      name: name,
      url: url,
      description: `Status monitoring for ${name}`,
      category: 'Live',
      logo: '',
      region: 'Indonesia'
    };
    console.log(`Converted website: ${website.name}, URL: ${website.url}`);
    return website;
  });
  
  // Jika tidak ada websites yang valid, kembalikan array kosong
  if (websites.length === 0) {
    console.log('Tidak ada website yang valid ditemukan setelah konversi');
  }
  
  return websites;
}

// Fungsi untuk mendapatkan status website dari lokasi tertentu
export function getLiveStatusForWebsiteAndCity(
  data: NeosenseStatusData | null,
  websiteId: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _city: string
): Status {
  if (!data || !data.data || !data.data.probes || !Array.isArray(data.data.probes)) {
    console.log(`getLiveStatusForWebsiteAndCity: Invalid data for websiteId ${websiteId}`);
    return 'down'; // Default ke 'down' jika data tidak tersedia
  }
  
  try {
    // Accept all probes
    const probes = data.data.probes.filter(probe => 
      probe && typeof probe === 'object'
    );
    
    if (websiteId <= 0 || websiteId > probes.length) {
      console.log(`getLiveStatusForWebsiteAndCity: Invalid websiteId ${websiteId}, max is ${probes.length}`);
      return 'down'; // Default ke 'down' jika ID tidak valid
    }
    
    const probe = probes[websiteId - 1];
    if (!probe) {
      console.log(`getLiveStatusForWebsiteAndCity: Invalid probe for websiteId ${websiteId}`);
      return 'down';
    }
    
    // If we have locations, check if any are down (ignoring 'no data' locations)
    if (probe.locations && Array.isArray(probe.locations) && probe.locations.length > 0) {
      let upCount = 0;
      let downCount = 0;
      let totalValidLocations = 0;
      
      for (const location of probe.locations) {
        if (location && typeof location === 'object' && typeof location.status === 'string') {
          // Only count locations with a valid status (not 'no data' or undefined)
          if (location.status === 'healthy' || location.status === 'up') {
            upCount++;
            totalValidLocations++;
          } else if (location.status === 'down' || location.status === 'unhealthy' || location.status === 'incident') {
            downCount++;
            totalValidLocations++;
          }
          // Ignore other statuses like 'no data', 'unknown', etc.
        }
      }
      
      // If we have any valid locations, determine status based on them
      if (totalValidLocations > 0) {
        // Use both upCount and downCount to determine status
        if (downCount > 0) return 'down';
        // Jika semua lokasi up, maka status up
        if (upCount === totalValidLocations) return 'up';
        // Jika ada yang tidak up dan tidak down, default ke up
        return 'up';
      }
    }
    
    // Check status field if it exists
    if (typeof probe.status === 'string') {
      // Status 'healthy' or 'up' considered as 'up', anything else is 'down'
      return (probe.status === 'healthy' || probe.status === 'up') ? 'up' : 'down';
    }
    
    // If no status field, check lastCheck if it exists
    if (probe.lastCheck && typeof probe.lastCheck === 'object' && typeof probe.lastCheck.status === 'string') {
      return (probe.lastCheck.status === 'healthy' || probe.lastCheck.status === 'up') ? 'up' : 'down';
    }
    
    // Default to 'up' if we can't determine status
    return 'up';
  } catch (error) {
    console.error(`Error in getLiveStatusForWebsiteAndCity for websiteId ${websiteId}:`, error);
    return 'down';
  }
}

// Fungsi untuk mendapatkan response time website dari lokasi tertentu
export function getLiveResponseTimeForWebsiteAndCity(
  data: NeosenseStatusData | null,
  websiteId: number,
  _city: string
): number {
  if (!data || !data.data || !data.data.probes || !Array.isArray(data.data.probes)) {
    console.log(`getLiveResponseTimeForWebsiteAndCity: Invalid data for websiteId ${websiteId}`);
    return 0; // Default ke 0 jika data tidak tersedia
  }
  
  try {
    // Filter probe HTTP yang memiliki URL
    const httpProbes = data.data.probes.filter(probe => 
      probe && typeof probe === 'object' && 
      typeof probe.type === 'string' && 
      probe.type.includes('http') && 
      probe.url
    );
    
    if (websiteId <= 0 || websiteId > httpProbes.length) {
      console.log(`getLiveResponseTimeForWebsiteAndCity: Invalid websiteId ${websiteId}, max is ${httpProbes.length}`);
      return 0; // Default ke 0 jika ID tidak valid
    }
    
    const probe = httpProbes[websiteId - 1];
    if (!probe) {
      console.log(`getLiveResponseTimeForWebsiteAndCity: Invalid probe for websiteId ${websiteId}`);
      return 0;
    }
    
    const normalizedCity = _city.toLowerCase();
    
    // Cari response time untuk kota yang diminta
    if (probe.locations && Array.isArray(probe.locations)) {
      for (const location of probe.locations) {
        if (location && typeof location === 'object' && 
            typeof location.name === 'string' && 
            location.name.toLowerCase() === normalizedCity) {
          // Jika ada lastCheck dengan responseTime, gunakan itu
          return 200; // Default response time karena API tidak menyediakan responseTime per lokasi
        }
      }
    }
    
    // Jika probe memiliki lastCheck dengan responseTime, gunakan itu
    if (probe.lastCheck && typeof probe.lastCheck === 'object' && 
        typeof probe.lastCheck.responseTime === 'number') {
      return probe.lastCheck.responseTime;
    }
    
    return 0; // Default ke 0 jika lokasi tidak ditemukan atau tidak ada response time
  } catch (error) {
    console.error(`Error in getLiveResponseTimeForWebsiteAndCity for websiteId ${websiteId}:`, error);
    return 0;
  }
}

// Fungsi untuk mendapatkan ringkasan status website di semua lokasi
export function getLiveStatusSummaryForWebsite(
  data: NeosenseStatusData | null,
  websiteId: number
) {
  if (!data || !data.data || !data.data.probes || !Array.isArray(data.data.probes)) {
    console.log(`Data tidak valid untuk website ID ${websiteId}`);
    return { up: 0, down: 0 }; // Default jika data tidak tersedia
  }
  
  try {
    // Accept all probes
    const probes = data.data.probes.filter(probe => 
      probe && typeof probe === 'object'
    );
    
    if (websiteId <= 0 || websiteId > probes.length) {
      console.log(`Website ID ${websiteId} tidak valid (total probes: ${probes.length})`);
      return { up: 0, down: 0 }; // Default jika ID tidak valid
    }
    
    const probe = probes[websiteId - 1];
    if (!probe) {
      console.log(`getLiveStatusSummaryForWebsite: Invalid probe for websiteId ${websiteId}`);
      return { up: 0, down: 0 };
    }
    
    console.log(`Checking status for probe: ${probe.name || 'unnamed'}`);
    
    // Check if the probe has locations
    if (probe.locations && Array.isArray(probe.locations) && probe.locations.length > 0) {
      let upCount = 0;
      let downCount = 0;
      let totalValidLocations = 0;
      
      // Count up and down locations, ignoring 'No data' locations
      for (const location of probe.locations) {
        if (location && typeof location === 'object') {
          // Only count locations that have a valid status (not 'no data' or undefined)
          if (typeof location.status === 'string') {
            totalValidLocations++;
            
            if (location.status === 'healthy' || location.status === 'up') {
              upCount++;
            } else if (location.status === 'down' || location.status === 'unhealthy' || location.status === 'incident') {
              downCount++;
            }
            // Ignore other statuses like 'no data', 'unknown', etc.
          }
        }
      }
      
      // If we found locations with valid status, return the counts
      if (totalValidLocations > 0) {
        console.log(`Website ID ${websiteId}: ${upCount} up, ${downCount} down, ${probe.locations.length - totalValidLocations} no data`);
        return { up: upCount, down: downCount };
      }
    }
    
    // If no locations with status found, check the probe's overall status
    let isUp = false;
    
    // Check status field if it exists
    if (typeof probe.status === 'string') {
      isUp = probe.status === 'healthy' || probe.status === 'up';
    }
    // If no status field, check lastCheck if it exists
    else if (probe.lastCheck && typeof probe.lastCheck === 'object' && typeof probe.lastCheck.status === 'string') {
      isUp = probe.lastCheck.status === 'healthy' || probe.lastCheck.status === 'up';
    }
    // Default to up if we can't determine status
    else {
      isUp = true;
    }
    
    // Return 1 location as up or down based on the overall status
    return isUp ? { up: 1, down: 0 } : { up: 0, down: 1 };
  } catch (error) {
    console.error(`Error in getLiveStatusSummaryForWebsite for websiteId ${websiteId}:`, error);
    return { up: 0, down: 0 };
  }
}

// Fungsi untuk menghasilkan data historis response time (dummy untuk saat ini)
export function getLiveHistoricalResponseTimeData(
  data: NeosenseStatusData | null,
  websiteId: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _city: string
): ResponseTimePoint[] {
  try {
    // Periksa apakah data valid
    if (!data || !data.data || !data.data.probes || !Array.isArray(data.data.probes)) {
      console.log(`getLiveHistoricalResponseTimeData: Invalid data for websiteId ${websiteId}`);
      return generateDummyHistoricalData(); // Gunakan data dummy jika data tidak valid
    }
    
    // Filter probe HTTP yang memiliki URL
    const httpProbes = data.data.probes.filter(probe => 
      probe && typeof probe === 'object' && 
      typeof probe.type === 'string' && 
      probe.type.includes('http') && 
      probe.url
    );
    
    if (websiteId <= 0 || websiteId > httpProbes.length) {
      console.log(`getLiveHistoricalResponseTimeData: Invalid websiteId ${websiteId}, max is ${httpProbes.length}`);
      return generateDummyHistoricalData(); // Gunakan data dummy jika ID tidak valid
    }
    
    // Untuk saat ini, kita tetap menggunakan data dummy karena API Neosense tidak menyediakan data historis
    // Di masa depan, ini bisa diganti dengan data sebenarnya jika tersedia
    return generateDummyHistoricalData();
  } catch (error) {
    console.error(`Error in getLiveHistoricalResponseTimeData for websiteId ${websiteId}:`, error);
    return generateDummyHistoricalData();
  }
}

// Helper function untuk menghasilkan data historis dummy
function generateDummyHistoricalData(): ResponseTimePoint[] {
  const now = new Date();
  const points: ResponseTimePoint[] = [];
  
  // Generate 24 data points (1 per jam untuk 24 jam terakhir)
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(now.getTime() - (23 - i) * 3600000); // 3600000 ms = 1 jam
    
    // Generate random response time between 50-1000ms
    // Dengan probabilitas kecil untuk response time yang sangat tinggi (simulasi spike)
    let value;
    if (Math.random() < 0.05) {
      value = Math.floor(Math.random() * 1000) + 1000; // 1000-2000ms (spike)
    } else {
      value = Math.floor(Math.random() * 450) + 50; // 50-500ms (normal)
    }
    
    points.push({
      timestamp: timestamp,
      value
    });
  }
  
  return points;
}

// Mapping dari location ID ke nama lokasi yang lebih mudah dibaca
const locationIdMap: Record<string, string> = {
  'dffb503f-7e99-4936-ad11-77a643c14f39': 'Jakarta',
  'bf402e8f-acbd-46f2-ba60-8eaa4436da85': 'West Java',
  '9cee8179-f82f-44bc-82f8-42f8734231c5': 'Banten',
  'c429cae3-eae3-4929-81be-b6c914d101ff': 'Tokyo',
  'f3f9ecad-8eb2-49e6-be3f-cb006c002b05': 'Amsterdam',
  'd0f8596c-6572-4ebc-8ba3-fd65338ba04a': 'Singapore',
  '581e2a5a-2979-4c6c-a3a5-5364590a00e5': 'New Jersey'
};

// Fungsi untuk mendapatkan nama lokasi dari ID
export function getLocationNameFromId(locationId: string): string {
  return locationIdMap[locationId] || locationId;
}

// Fungsi untuk mendapatkan lokasi yang tersedia dari data
export function getLiveLocations(data: NeosenseStatusData | null): string[] {
  if (!data || !data.data) {
    return ['Jakarta', 'West Java', 'Banten', 'Tokyo', 'Amsterdam', 'Singapore', 'New Jersey']; // Default locations
  }
  
  try {
    // Cek apakah ada data locations di API response
    if (data.data.locations && Array.isArray(data.data.locations)) {
      const locations = data.data.locations.map(loc => getLocationNameFromId(loc.id));
      if (locations.length > 0) {
        return locations;
      }
    }
    
    // Jika tidak ada data locations, coba ambil dari probe locations
    const locationSet = new Set<string>();
    
    // Ambil semua lokasi dari semua probe
    if (data.data.probes && Array.isArray(data.data.probes)) {
      for (const probe of data.data.probes) {
        if (probe.locations && Array.isArray(probe.locations)) {
          for (const location of probe.locations) {
            if (location && typeof location === 'object') {
              const locationName = getLocationNameFromId(location.id);
              locationSet.add(locationName);
            }
          }
        }
      }
    }
    
    // Jika tidak ada lokasi yang ditemukan, gunakan lokasi default
    if (locationSet.size === 0) {
      return ['Jakarta', 'West Java', 'Banten', 'Tokyo', 'Amsterdam', 'Singapore', 'New Jersey'];
    }
    
    return Array.from(locationSet);
  } catch (error) {
    console.error('Error in getLiveLocations:', error);
    return ['Jakarta', 'West Java', 'Banten', 'Tokyo', 'Amsterdam', 'Singapore', 'New Jersey']; // Default locations on error
  }
}
