"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
// Define types
// Using imported Status type from mockData.ts

interface ResponseTimePoint {
  timestamp: Date;
  value: number;
}

// Using imported Website type from mockData.ts
import {
  fetchLiveStatusData,
  convertNeosenseToWebsites,
  getLiveStatusForWebsiteAndCity,
  getLiveResponseTimeForWebsiteAndCity,
  getLiveStatusSummaryForWebsite,
  getLiveHistoricalResponseTimeData,
  getLiveLocations,
  type NeosenseStatusData
} from "@/data/liveData";
import { useLanguage } from "@/context/LanguageContext";
import Footer from "@/components/Footer";



// Response time chart component - used in the JSX below
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ResponseTimeChart = ({ data, height = 40 }: { data: ResponseTimePoint[], height?: number }) => {
  // Find max value for scaling
  const maxValue = Math.max(...data.map(point => point.value), 500);
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  
  return (
    <div className="w-full relative" style={{ height: `${height}px` }}>
      <div className="flex h-full items-end">
        {data.map((point, index) => {
          const barHeight = (point.value / maxValue) * height;
          // Set bar color based on response time value
          let barColor = 'bg-green-500';
          if (point.value > 1000) {
            barColor = 'bg-red-500';
          } else if (point.value > 500) {
            barColor = 'bg-yellow-500';
          }
            
          return (
            <div 
              key={index} 
              className={`flex-1 mx-px ${barColor} rounded-t cursor-pointer hover:opacity-80 transition-opacity`}
              style={{ height: `${barHeight}px` }}
              onMouseEnter={() => setActiveTooltip(index)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              {activeTooltip === index && (
                <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs rounded py-1 px-2 left-0 right-0 mx-auto w-max shadow-lg z-10">
                  <div className="font-bold">{new Date(point.timestamp).toLocaleDateString()}</div>
                  <div>{new Date(point.timestamp).toLocaleTimeString()}</div>
                  <div className="font-bold">{point.value} ms</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function Home() {
  const [urlToCheck, setUrlToCheck] = useState("");
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [activeRegion] = useState("Indonesia");
  const [showAllWebsites] = useState(false);
  
  // Default Indonesian cities
  const defaultIndonesianCities = useMemo(() => ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Makassar'], []);

  // State untuk data live dari Neosense API
  const [liveData, setLiveData] = useState<NeosenseStatusData | null>(null);
  const [liveWebsites, setLiveWebsites] = useState<Website[]>([]);
  const [liveLocations, setLiveLocations] = useState<string[]>(defaultIndonesianCities);
  const [isLiveDataLoading, setIsLiveDataLoading] = useState(true);
  const [useLiveData, setUseLiveData] = useState(true); // Default ke true untuk selalu mencoba menggunakan data live
  const [apiError, setApiError] = useState<string | null>(null);

  // Set dark theme by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  
  // Fetch live data from Neosense API
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    async function fetchData() {
      setIsLiveDataLoading(true);
      setApiError(null); // Reset error state
      
      try {
        // Attempt to fetch data from Neosense status page
        const data = await fetchLiveStatusData();
        console.log('Received data from API:', data);
        
        if (data && data.data && data.data.probes && data.data.probes.length > 0) {
          // Successfully fetched live data
          setLiveData(data);
          const websites = convertNeosenseToWebsites(data);
          console.log('Converted websites:', websites);
          
          if (websites.length > 0) {
            setLiveWebsites(websites);
            const locations = getLiveLocations(data);
            setLiveLocations(locations.length > 0 ? locations : defaultIndonesianCities);
            console.log('Live data loaded successfully:', websites.length, 'websites');
            setUseLiveData(true); // Gunakan live data jika berhasil
          } else {
            console.warn('No valid websites found in the data');
            setApiError('Tidak ada website yang valid ditemukan dalam data');
            setUseLiveData(true); // Still use live data, but with empty website list
          }
        } else {
          // No valid data received
          console.warn('Received empty or invalid data from status page');
          setApiError('Data dari API tidak valid atau kosong');
          setUseLiveData(true); // Still use live data, but with empty data structure
        }
      } catch (error) {
        console.error('Error fetching live data:', error);
        setApiError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setUseLiveData(true); // Still use live data even if there's an error
      } finally {
        setIsLiveDataLoading(false);
      }
    }
    
    // Fetch data immediately and then every 60 seconds
    fetchData();
    
    // Set up interval to refresh data
    const intervalId = setInterval(fetchData, 60000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Track active city for each website separately
  const [, setActiveCities] = useState<{[key: number]: string}>({});
  
  // Initialize active cities for all websites
  useEffect(() => {
    const initialActiveCities: {[key: number]: string} = {};
    liveWebsites.forEach((website: Website) => {
      initialActiveCities[website.id] = defaultIndonesianCities[0] || 'Jakarta';
    });
    setActiveCities(initialActiveCities);
  }, [liveWebsites, defaultIndonesianCities]);
  
  // Handle city change for a specific website - used in event handlers
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _handleCityChange = (websiteId: number, city: string) => {
    setActiveCities(prev => ({
      ...prev,
      [websiteId]: city
    }));
  };

  // Define website type
  type Website = {
    id: number;
    name: string;
    url: string;
    description: string;
    category: string;
    logo: string;
    region: string;
  };
  
  // Use live data
  const websitesToUse = liveWebsites;
  const locationsToUse = liveLocations;
  
  // Status and response time functions
  const getStatusSummary = (websiteId: number) => getLiveStatusSummaryForWebsite(liveData, websiteId);
  // These functions are defined but will be used in future implementations
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _getStatus = (websiteId: number, city: string) => getLiveStatusForWebsiteAndCity(liveData, websiteId, city);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _getResponseTime = (websiteId: number, city: string) => getLiveResponseTimeForWebsiteAndCity(liveData, websiteId, city);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _getHistoricalData = (websiteId: number, city: string) => getLiveHistoricalResponseTimeData(liveData, websiteId, city);
  
  // Get top 6 websites from live data
  const topWebsites = websitesToUse.slice(0, 6);

  // Filter websites by region
  const filteredWebsites = websitesToUse.filter((website: Website) => website.region === activeRegion);
  
  // Display top websites by default, or all if showAllWebsites is true
  // This will be used in future implementations
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _displayedWebsites = showAllWebsites ? filteredWebsites : topWebsites.slice(0, 6);

  const handleCheckWebsite = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlToCheck.trim()) {
      const encodedUrl = encodeURIComponent(urlToCheck.trim());
      router.push(`/status/${encodedUrl}`);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-md flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white">LagiDown.id</h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link href="/pricing" className="text-gray-300 hover:text-green-500 transition-colors font-medium">
                <span className="hidden md:inline">{t('for_business')}</span>
              </Link>
              <button 
                onClick={toggleLanguage}
                className="text-gray-300 hover:text-green-500 transition-colors font-medium"
              >
                {language === 'id' ? 'EN' : 'ID'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              <span className="text-white">Cek Status Website & Layanan Digital di Indonesia</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">Pantau status website dan layanan digital favorit Anda secara real-time dari berbagai lokasi di Indonesia</p>
            
            <div className="bg-gray-800 p-6 rounded-md shadow-md mb-8 max-w-3xl mx-auto">
              <form onSubmit={handleCheckWebsite} className="flex w-full gap-4">
                <div className="flex-grow">
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={t('enter_website_url')}
                    value={urlToCheck}
                    onChange={(e) => setUrlToCheck(e.target.value)}
                    required
                  />
                </div>
                <div className="w-auto">
                  <button 
                    type="submit" 
                    className="w-12 h-full flex items-center justify-center bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-md hover:shadow-lg transition-all"
                    aria-label="Periksa Status"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="mt-16 px-4">
            <h2 className="text-2xl font-bold text-center mb-8 text-white">Layanan Populer yang Dipantau</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 max-w-6xl mx-auto">
              {topWebsites.map((website: Website) => {
                const summary = getStatusSummary(website.id);
                const totalLocations = locationsToUse.length;
                const statusDot = summary.down > 0 ? 'bg-red-500' : 'bg-green-500';
                
                // Determine status summary text
                let statusSummaryText = '';
                if (summary.up === totalLocations) {
                  statusSummaryText = t('up_for_locations').replace('{count}', totalLocations.toString());
                } else if (summary.down === totalLocations) {
                  statusSummaryText = t('down_on_locations').replace('{count}', totalLocations.toString());
                } else {
                  statusSummaryText = t('up_and_down')
                    .replace('{up}', summary.up.toString())
                    .replace('{down}', summary.down.toString());
                }
                
                return (
                  <Link href={`/monitoring/${encodeURIComponent(website.name)}`} key={website.id} className={`block bg-gray-800 rounded-lg shadow-lg overflow-hidden border ${summary.down > 0 ? 'border-red-500/30' : 'border-green-500/30'} hover:transform hover:scale-102 transition-all duration-200`}>
                    {/* Status indicator */}
                    <div className={`h-2 w-full ${summary.down > 0 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    
                    <div className="p-4">
                      <div className="flex flex-col items-center mb-3 text-center">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${statusDot} ${summary.down === 0 ? 'animate-pulse' : ''}`}></div>
                          <h3 className="font-bold text-white">{website.name}</h3>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${summary.down > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                          {summary.down > 0 ? t('status_down') : t('status_up')}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Websites Section */}
      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{t('popular_website_status')}</h2>
            <p className="text-gray-400">{t('monitor_connectivity')}</p>
            
            {/* Data source indicator */}
            <div className="inline-flex items-center mt-4 px-3 py-1 bg-gray-800 rounded-full">
              <div className={`w-2 h-2 rounded-full mr-2 ${isLiveDataLoading ? 'bg-yellow-500 animate-pulse' : (useLiveData ? 'bg-green-500' : 'bg-red-500')}`}></div>
              <span className="text-xs text-gray-300">
                {isLiveDataLoading ? 'Loading data...' : (useLiveData ? 'Live data from Neo Sense' : 'Using mock data (fallback)')}
              </span>
            </div>
            
            {/* Error message if API failed */}
            {apiError && (
              <div className="mt-2 px-4 py-2 bg-red-900/50 text-red-200 text-sm rounded-md max-w-md mx-auto">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-red-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium">Error mengambil data live:</p>
                    <p>{apiError}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Websites grid - simplified cards */}
          <div className="flex justify-center px-4 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-6xl">
              {websitesToUse.map((website) => {
              // Determine overall status (simplified)
              const statusSummary = getStatusSummary(website.id);
              const allLocationsHealthy = statusSummary.down === 0;
              const downLocations = statusSummary.down;
              
              return (
                <Link 
                  key={website.id} 
                  href={`/monitoring/${encodeURIComponent(website.name)}`}
                  className={`block bg-gray-800 rounded-lg shadow-lg overflow-hidden border ${allLocationsHealthy ? 'border-green-500/30' : 'border-red-500/30'} hover:transform hover:scale-102 transition-all duration-200`}
                >
                  {/* Status indicator */}
                  <div className={`h-2 w-full ${allLocationsHealthy ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  
                  {/* Website content */}
                  <div className="p-5">
                    {/* Website name with status dot */}
                    <div className="flex items-center mb-4">
                      <div className={`w-3 h-3 rounded-full mr-2.5 ${allLocationsHealthy ? 'bg-green-500' : 'bg-red-500'} ${allLocationsHealthy ? 'animate-pulse' : ''}`}></div>
                      <h3 className="text-lg font-bold text-white truncate">{website.name}</h3>
                    </div>
                    
                    {/* Status badge */}
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${allLocationsHealthy ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {allLocationsHealthy ? t('status_up') : t('status_down')}
                      </div>
                      
                      <div className="text-gray-400 hover:text-green-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
            </div>
          </div>
        </div>
      </section>

      {/* SEO Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Pantau Status Website dan Layanan Digital di Indonesia</h2>
            
            <div className="prose prose-sm prose-invert max-w-none text-gray-300">
              <p className="mb-4">
                LagiDown.id adalah platform pemantauan status website dan layanan digital terkemuka di Indonesia. Kami menyediakan informasi real-time tentang status dan kinerja berbagai layanan digital populer dari beberapa lokasi di Indonesia.
              </p>
              
              <p className="mb-4">
                Dengan LagiDown.id, Anda dapat dengan cepat mengecek apakah sebuah website sedang mengalami gangguan atau down, serta mendapatkan informasi tentang lokasi mana yang terdampak. Platform kami membantu pengguna dan bisnis untuk:
              </p>
              
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li>Memverifikasi apakah masalah akses ke suatu layanan berasal dari sisi pengguna atau dari layanan itu sendiri</li>
                <li>Mendapatkan informasi status dari berbagai lokasi di Indonesia untuk analisis yang lebih akurat</li>
                <li>Memantau layanan-layanan penting secara real-time</li>
                <li>Mengetahui riwayat gangguan dari layanan digital favorit</li>
              </ul>
              
              <p>
                LagiDown.id menggunakan teknologi pemantauan canggih yang dikembangkan oleh Hyperjump melalui proyek open source Monika. Dengan infrastruktur pemantauan yang tersebar di berbagai lokasi, kami memberikan data yang akurat dan terpercaya tentang status layanan digital di Indonesia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
