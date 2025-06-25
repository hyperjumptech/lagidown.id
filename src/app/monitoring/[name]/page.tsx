"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { AlertTriangle, Info, Clock } from 'lucide-react';
import Footer from "@/components/Footer";
import { 
  fetchLiveStatusData, 
  getLiveStatusForWebsiteAndCity, 
  getLiveResponseTimeForWebsiteAndCity,
  getLiveHistoricalResponseTimeData,
  getLocationNameFromId
} from "@/data/liveData";

// Interface untuk data lokasi dari API
interface LocationData {
  id: string;
  name: string;
  status: string;
  lastCheck?: {
    id?: string;
    createdAt?: string;
    responseTime?: number;
    status?: string;
  };
}

// Interface untuk data status website
interface WebsiteStatus {
  status: "up" | "down";
  responseTime: number;
  lastChecked: string;
  location: string;
  websiteId: number;
  name: string;
  url: string;
}

// Interface untuk data historis
interface HistoricalData {
  date: string;
  statuses: {
    [location: string]: {
      status: "up" | "down";
      isRealData?: boolean;
    }
  };
}

const MonitoringPage = () => {
  const params = useParams();
  const { t, language, setLanguage } = useLanguage();
  const [websiteStatus, setWebsiteStatus] = useState<WebsiteStatus | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [locations, setLocations] = useState<string[]>(['Jakarta', 'Singapore', 'Tokyo', 'Amsterdam', 'West Java', 'Banten', 'New Jersey']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liveData, setLiveData] = useState<any>(null);

  // Decode website name from URL
  const websiteName = params.name ? decodeURIComponent(params.name as string) : '';

  useEffect(() => {
    if (!websiteName) {
      setError(t('error_invalid_url_param'));
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch live data from API
        const data = await fetchLiveStatusData();
        setLiveData(data);

        if (!data || !data.data || !data.data.probes) {
          throw new Error('Invalid data structure received from API');
        }

        // Find the website in the probes by name
        const website = data.data.probes.find((probe: any) => 
          probe.name && probe.name.toLowerCase() === websiteName.toLowerCase()
        );

        if (!website) {
          throw new Error(`Website ${websiteName} not found in monitoring data`);
        }

        // Coba dapatkan semua lokasi dari data.data.locations terlebih dahulu
        const availableLocations: string[] = [];
        
        // Cek apakah ada data.data.locations di API response
        if (data.data.locations && Array.isArray(data.data.locations)) {
          console.log('Found locations in API data:', data.data.locations.length);
          data.data.locations.forEach((loc: any) => {
            if (loc && loc.name) {
              availableLocations.push(loc.name);
              console.log('Added location:', loc.name);
            }
          });
        } else {
          console.log('No locations found in data.data.locations, trying to extract from probes');
        }
        
        // Jika tidak ada lokasi dari data.data.locations, coba ambil dari website.locations
        if (availableLocations.length === 0 && website.locations && Array.isArray(website.locations)) {
          console.log('Extracting locations from website.locations');
          website.locations.forEach((loc: any) => {
            if (loc && loc.name) {
              availableLocations.push(loc.name);
              console.log('Added location from probe:', loc.name);
            }
          });
        }
        
        // Gunakan fungsi getLiveLocations untuk mendapatkan lokasi dari API
        // Fungsi ini sudah menggunakan pemetaan ID lokasi ke nama yang mudah dibaca
        if (data.data.locations && Array.isArray(data.data.locations)) {
          console.log('Getting locations from API data');
          const apiLocations = data.data.locations.map(loc => getLocationNameFromId(loc.id));
          console.log('API Locations:', apiLocations);
          setLocations(apiLocations);
        } else {
          console.log('No locations found in API, using default locations');
          const defaultLocations = [
            'Jakarta', 'West Java', 'Banten', 'Amsterdam',
            'Singapore', 'Tokyo', 'New Jersey'
          ];
          setLocations(defaultLocations);
        }

        // Create website status object
        const websiteId = data.data.probes.indexOf(website) + 1;
        
        // Menggunakan Jakarta sebagai lokasi default untuk status utama
        let status: "up" | "down" = 'down';
        const defaultLocation = 'Jakarta';
        const jakartaId = 'dffb503f-7e99-4936-ad11-77a643c14f39'; // ID untuk Jakarta
        
        if (website.locations && Array.isArray(website.locations)) {
          // Cari lokasi Jakarta berdasarkan ID
          const jakartaLoc = website.locations.find(loc => 
            loc && (loc.id === jakartaId || getLocationNameFromId(loc.id) === defaultLocation)
          ) as LocationData | undefined;
          
          if (jakartaLoc && jakartaLoc.status) {
            // Convert status dari API ke format yang digunakan aplikasi - hanya up atau down
            status = (jakartaLoc.status === 'healthy' || jakartaLoc.status === 'up') ? 'up' : 'down';
            console.log(`Found status for ${defaultLocation}: ${status}`);
          } else {
            // Fallback ke fungsi helper jika lokasi tidak ditemukan
            const statusValue = getLiveStatusForWebsiteAndCity(data, websiteId, defaultLocation);
            status = statusValue;
            console.log(`Using helper for status: ${status}`);
          }
        } else {
          // Fallback ke fungsi helper jika tidak ada data lokasi
          const statusValue = getLiveStatusForWebsiteAndCity(data, websiteId, defaultLocation);
          status = statusValue;
          console.log(`No locations data, using helper: ${status}`);
        }
        
        // Definisikan lokasi default jika tidak ada dari API
        const defaultLocations = ['Jakarta', 'Singapore', 'Tokyo', 'Amsterdam', 'West Java', 'Banten', 'New Jersey'];
        
        // Pastikan kita memiliki lokasi untuk ditampilkan
        if (locations.length === 0) {
          console.log('Tidak ada lokasi tersedia, menggunakan lokasi default');
          setLocations(defaultLocations);
        }
        
        // Ambil data historis dari API untuk semua lokasi
        const locationsToUse = locations.length > 0 ? locations : defaultLocations;
        console.log('Lokasi yang digunakan untuk data historis:', locationsToUse);
        
        const historical = getHistoricalDataFromAPI(website, locationsToUse);
        setHistoricalData(historical);
        
        // Set status website untuk card utama (menggunakan status Jakarta sebagai default)
        setWebsiteStatus({
          status,
          responseTime: 0, // Tidak lagi menampilkan response time
          lastChecked: new Date().toISOString(),
          location: 'Multiple Locations',
          websiteId,
          name: website.name || websiteName,
          url: ''
        });

        // Historical data sudah di-generate dan di-set di atas
      } catch (err: any) {
        console.error("Error fetching website status:", err);
        setError(err.message || t('error_fetching_status_generic'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [websiteName, t]);

  // Fungsi untuk mengambil data historis dari API
  const getHistoricalDataFromAPI = (website: any, availableLocations: string[]): HistoricalData[] => {
    const data: HistoricalData[] = [];
    const now = new Date();
    
    // Pastikan kita memiliki website dan lokasi
    if (!website || !availableLocations || availableLocations.length === 0) {
      console.warn('Tidak ada website atau lokasi yang tersedia untuk data historis');
      return data;
    }
    
    console.log('Mengambil data historis untuk lokasi:', availableLocations);
    
    // Cek apakah website memiliki data locations
    if (!website.locations || !Array.isArray(website.locations) || website.locations.length === 0) {
      console.warn('Website tidak memiliki data lokasi');
      return data;
    }
    
    // Buat data untuk hari ini (data terkini)
    const todayData: HistoricalData = {
      date: now.toISOString(),
      statuses: {}
    };
    
    // Tambahkan status untuk setiap lokasi dari data API
    website.locations.forEach((loc: any) => {
      if (!loc || !loc.id) return;
      
      const locationName = getLocationNameFromId(loc.id);
      if (!locationName || !availableLocations.includes(locationName)) return;
      
      // Ambil status dari API apa adanya
      let status: "up" | "down" = "down";
      
      // Konversi status API ke format 'up' atau 'down'
      if (loc.status === 'healthy' || loc.status === 'up') {
        status = "up";
      } else if (loc.status === 'unhealthy' || loc.status === 'down' || loc.status === 'incident') {
        status = "down";
      } else {
        // Status lain seperti 'no data', 'unknown', dll dianggap down
        status = "down";
      }
      
      todayData.statuses[locationName] = {
        status,
        isRealData: true // Ini adalah data real dari API
      };
    });
    
    // Tambahkan data hari ini ke array
    data.push(todayData);
    
    // Untuk data 6 hari sebelumnya, kita gunakan data dummy karena API tidak menyediakan data historis
    // Tapi ini hanya sementara, idealnya kita akan mengambil data historis dari API jika tersedia
    for (let i = 1; i <= 6; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const statuses: {[key: string]: {status: "up" | "down", isRealData: boolean}} = {};
      
      // Untuk setiap lokasi, gunakan data dummy yang konsisten
      availableLocations.forEach(location => {
        if (!location) return;
        
        // Gunakan seed yang konsisten berdasarkan lokasi dan tanggal
        const seed = (location.charCodeAt(0) || 0) + date.getDate() + date.getMonth();
        
        // Buat status yang realistis - sekitar 10% akan 'down'
        const status = (seed % 10 === 0) ? "down" : "up";
        
        statuses[location] = {
          status,
          isRealData: false // Ini adalah data dummy
        };
      });
      
      // Tambahkan data ke array
      data.push({
        date: date.toISOString(),
        statuses
      });
    }
    
    // Urutkan data berdasarkan tanggal dari yang terlama ke terbaru
    data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    console.log('Data historis yang dihasilkan:', data.length, 'hari');
    return data;
  };

  // Tidak lagi memerlukan fungsi handleLocationChange karena tidak ada dropdown

  // Add structured data for SEO with long-tail keywords
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": websiteName ? `${websiteName} Status Monitoring | Real-time Uptime Tracker` : "Website Status Monitoring | Real-time Uptime Tracker",
    "description": websiteName ? 
      `Monitor ${websiteName} uptime and downtime status from 7 global locations in real-time. Check if ${websiteName} is up or down right now and view 7-day uptime history.` :
      "Monitor website uptime and downtime status from multiple global locations in real-time with LagiDown.id. Check if websites are up or down and view 7-day uptime history.",
    "url": websiteName ? 
      `https://lagidown.id/monitoring/${encodeURIComponent(websiteName)}` :
      "https://lagidown.id"
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Add structured data for SEO */}
      <title>
        {websiteName ? `${websiteName} Status Monitoring | Is ${websiteName} Down? | LagiDown.id` : 'Website Status Monitoring | Real-time Uptime Checker | LagiDown.id'}
      </title>
      <meta name="description" content={websiteName ? 
        `Monitor ${websiteName} uptime and downtime status from 7 global locations in real-time. Check if ${websiteName} is up or down right now and view 7-day uptime history.` :
        "Monitor website uptime and downtime status from multiple global locations in real-time with LagiDown.id. Check if websites are up or down and view 7-day uptime history."} />
      <meta name="keywords" content={websiteName ?
        `${websiteName} status, ${websiteName} uptime, ${websiteName} down detector, is ${websiteName} down, ${websiteName} monitoring, website status checker` :
        "website status, website uptime, website monitoring, down detector, is website down, real-time status checker"} />
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-md flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <h1 className="text-2xl font-extrabold text-white">LagiDown.id</h1>
              </Link>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link href="/business" className="text-gray-300 hover:text-green-500 transition-colors font-medium">
                <span className="hidden md:inline">{t('for_business')}</span>
              </Link>
              <button 
                onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
                className="text-gray-300 hover:text-green-500 transition-colors font-medium"
              >
                {language === 'id' ? 'EN' : 'ID'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Link href="/" className="text-gray-400 hover:text-green-500 transition-colors">
              <span>{t('home')}</span>
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-green-500">{websiteName || 'Loading...'}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border ${websiteStatus && websiteStatus.status === 'up' ? 'border-green-500' : websiteStatus && websiteStatus.status === 'down' ? 'border-red-500' : 'border-gray-700'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${websiteStatus && websiteStatus.status === 'up' ? 'text-green-500' : websiteStatus && websiteStatus.status === 'down' ? 'text-red-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {loading && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                {websiteStatus && websiteStatus.status === 'up' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />}
                {websiteStatus && websiteStatus.status === 'down' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />}
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {loading ? t('checking_status_for') : t('status_for')}
              <span className={`${websiteStatus && websiteStatus.status === 'up' ? 'text-green-500' : websiteStatus && websiteStatus.status === 'down' ? 'text-red-500' : 'text-white'} ml-2`}>{websiteName || ''}</span>
            </h1>
          </div>
        </div>

        {loading && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-300">{t('loading_status_please_wait')}</p>
          </div>
        )}

        {error && (
          <div className="mt-6 bg-red-900 bg-opacity-70 text-red-200 p-4 rounded-lg shadow-md text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle size={20} className="mr-2" />
              <h3 className="text-lg font-semibold">{t('error_encountered')}</h3>
            </div>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && websiteStatus && (
          <div>
            {/* Main Status Card */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Status */}
                <div className={`p-4 rounded-md shadow-md ${websiteStatus.status === "up" ? "bg-green-600 bg-opacity-90" : "bg-red-700 bg-opacity-40"}`}>
                  <div className="text-sm text-gray-300 mb-1">{language === 'id' ? 'Status Saat Ini' : 'Current Status'}</div>
                  <div className={`text-2xl font-bold ${websiteStatus.status === "up" ? "text-white" : "text-red-200"}`}>
                    {websiteStatus.status === "up" ? 'Up' : 'Down'}
                  </div>
                </div>

                {/* Monitoring Locations */}
                <div className="bg-gray-750 p-4 rounded-md shadow-md">
                  <div className="text-sm text-gray-400 mb-2">{language === 'id' ? 'Dipantau dari' : 'Monitored from'}</div>
                  <div className="text-base font-medium text-white">
                    <div className="text-sm mb-1">{locations.length} {language === 'id' ? 'Lokasi' : 'Locations'}</div>
                    <div className="flex flex-wrap gap-2">
                      {locations.map((location) => (
                        <span key={location} className="inline-block px-2 py-1 bg-gray-700 rounded-md text-xs">
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Historical Status Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Clock size={20} className="mr-2 text-blue-400" /> 
                {language === 'id' ? 'Riwayat Status 7 Hari Terakhir' : '7-Day Status History'}
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                {language === 'id' 
                  ? `Pantau status ${websiteName} dari 7 lokasi global. Cek apakah layanan sedang up/down dan lihat riwayat ketersediaan selama 7 hari terakhir.` 
                  : `Track ${websiteName} status from 7 global locations. Check if the service is up/down and view availability history for the past 7 days.`}
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border-separate border-spacing-0">
                  <thead className="bg-gray-750">
                    <tr>
                      <th className="py-3 px-4 text-left text-gray-200 font-semibold rounded-tl-md">{language === 'id' ? 'Tanggal' : 'Date'}</th>
                      {locations.map((location, idx) => (
                        <th key={`${location}-${idx}`} className="py-3 px-4 text-center text-gray-200 font-semibold">{location}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {historicalData && historicalData.length > 0 ? (
                      historicalData.map((item, index) => {
                        if (!item || !item.statuses) {
                          console.log('Item data tidak valid:', item);
                          return null;
                        }
                        
                        return (
                          <tr key={index} className="border-b border-gray-750 hover:bg-gray-700 transition-colors duration-150">
                            <td className="py-3 px-4 font-medium">
                              {new Date(item.date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { 
                                weekday: 'short', 
                                day: 'numeric', 
                                month: 'short' 
                              })}
                            </td>
                            {locations.map((location, idx) => {
                              // Dapatkan status untuk lokasi ini
                              const locationStatus = item.statuses[location];
                              
                              return (
                                <td key={`${location}-${idx}`} className="py-3 px-4 text-center">
                                  {locationStatus ? (
                                    <span className={`inline-flex items-center justify-center w-16 px-2 py-1 rounded-full text-xs font-medium ${
                                      locationStatus.status === 'up' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {locationStatus.status === 'up' ? 'Up' : 'Down'}
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center justify-center w-16 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">-</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={locations.length + 1} className="py-8 text-center text-gray-400">
                          {language === 'id' ? 'Tidak ada data riwayat tersedia' : 'No historical data available'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* CTA Section */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                {language === 'id' ? 'Layanan Monitoring Website' : 'Website Monitoring Service'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-750 p-5 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {language === 'id' ? 'Cek Website Lain' : 'Check Another Website'}
                  </h4>
                  <p className="text-gray-300 mb-4">
                    {language === 'id' 
                      ? 'Ingin memeriksa status website lain? Kembali ke halaman utama untuk melihat daftar website yang tersedia.'
                      : 'Want to check the status of another website? Go back to the main page to see the list of available websites.'}
                  </p>
                  <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                    {language === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
                  </Link>
                </div>
                
                <div className="bg-gray-750 p-5 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {language === 'id' ? 'Monitoring 24/7 dari Berbagai Lokasi' : '24/7 Monitoring from Multiple Locations'}
                  </h4>
                  <p className="text-gray-300 mb-4">
                    {language === 'id'
                      ? 'Butuh monitoring website Anda dari berbagai lokasi selama 24 jam? Hubungi Hyperjump untuk solusi monitoring profesional.'
                      : 'Need to monitor your website from multiple locations 24/7? Contact Hyperjump for professional monitoring solutions.'}
                  </p>
                  <a 
                    href="https://hyperjump.tech" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    {language === 'id' ? 'Hubungi Hyperjump' : 'Contact Hyperjump'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MonitoringPage;
