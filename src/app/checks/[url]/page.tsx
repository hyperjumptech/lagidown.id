"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  indonesianCities, 
  getStatusForUrl, 
  getResponseTimeForUrl, 
  getIpForUrl, 
  getMockWhoisData,
  popularWebsites,
  getHistoricalResponseTimeData,
  ResponseTimePoint
} from "@/data/mockData";
import { useLanguage } from "@/context/LanguageContext";
import Footer from "@/components/Footer";

// Interface for URL check results
interface CheckResult {
  status: "up" | "down";
  responseTime: number;
  lastChecked: string;
  ip: string;
  location: string;
  headers: Record<string, string>;
  whoisData: {
    registrar: string;
    createdDate: string;
    expiryDate: string;
    nameServers: string[];
  };
  isInMockData: boolean;
  websiteId?: number;
}

// Response time chart component
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

export default function CheckUrlPage() {
  const params = useParams();
  const { t, language, setLanguage } = useLanguage();
  const [urlToCheck, setUrlToCheck] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("Jakarta");

  useEffect(() => {
    if (params.url) {
      // Handle URL with or without dots
      const decodedUrl = decodeURIComponent(params.url as string);
      setUrlToCheck(decodedUrl);
      
      // Simulate API call with setTimeout
      setTimeout(() => {
        // Check if this is a website from our mock data
        const matchedWebsite = popularWebsites.find(w => w.url.replace(/\./g, '') === decodedUrl.replace(/\./g, ''));
        const defaultCity = "Jakarta";
        const status = getStatusForUrl(decodedUrl, defaultCity);
        const responseTime = getResponseTimeForUrl(decodedUrl, defaultCity);
        const ip = getIpForUrl(decodedUrl);
        const whoisData = getMockWhoisData(decodedUrl);
        
        // Mock HTTP headers
        const headers: Record<string, string> = {
          "Server": "nginx/1.18.0",
          "Content-Type": "text/html; charset=UTF-8",
          "Connection": "keep-alive",
          "Cache-Control": "max-age=0, private, must-revalidate"
        };
        
        const mockResult: CheckResult = {
          status: status as "up" | "down",
          responseTime: responseTime,
          lastChecked: new Date().toISOString(),
          ip: ip,
          location: "Jakarta, Indonesia",
          headers: headers,
          whoisData: whoisData,
          isInMockData: !!matchedWebsite,
          websiteId: matchedWebsite?.id
        };
        
        setResult(mockResult);
        setLoading(false);
      }, 1500);
    }
  }, [params.url]);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-md flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white">StatusWeb</h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link href="/business" className="text-gray-300 hover:text-green-500 transition-colors">
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

      <main className="container mx-auto py-8 px-4">
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gray-800 rounded-md flex items-center justify-center border border-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Website Status Check</h2>
          </div>
          <div className="bg-gray-800 rounded-md shadow-md p-4 border border-gray-700">
            <p className="text-gray-400 mb-2">results for:</p>
            <div className="flex items-center space-x-2 bg-gray-700 p-3 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="font-medium text-green-500">{urlToCheck}</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 bg-gray-800 rounded-md shadow-md p-10 border border-gray-700 max-w-md mx-auto">
            <div className="relative w-20 h-20">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-700 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-green-500 rounded-full animate-spin"></div>
            </div>
            <span className="mt-6 text-lg font-medium text-gray-300">{t('checking_status')}...</span>
            <p className="mt-2 text-sm text-gray-400">{t('this_may_take_a_moment')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status Card */}
            <div className="bg-gray-800 rounded-md shadow-md p-5 border border-gray-700 col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl text-white">Status Terkini untuk <span className="text-2xl font-extrabold text-green-400">{urlToCheck}</span></h3>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-center mb-4">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center ${result?.status === 'up' ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${result?.status === 'up' ? 'bg-green-500' : 'bg-red-500'}`}>
                      {result?.status === 'up' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="text-2xl font-bold mb-1 text-white">
                    {result?.status === 'up' ? t('online') : t('offline')}
                  </h4>
                  <p className="text-gray-400">{result?.responseTime} ms {t('response_time')}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded-md">
                  <span className="text-gray-300">{t('last_checked')}:</span>
                  <span className="font-medium text-white">{result?.lastChecked ? new Date(result.lastChecked).toLocaleString() : "-"}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-700 rounded-md">
                  <span className="text-gray-300">{t('ip_address')}:</span>
                  <span className="font-medium text-white">{result?.ip || "-"}</span>
                </div>
                {/* Server location removed as requested */}
              </div>
            </div>

            {/* Monitoring Locations */}
            <div className="bg-gray-800 rounded-md shadow-md p-5 border border-gray-700 col-span-1 lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">{t('monitoring_locations')}</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {indonesianCities.map((city) => {
                  // Get status and response time for this URL and city
                  const status = getStatusForUrl(urlToCheck, city);
                  const responseTime = getResponseTimeForUrl(urlToCheck, city);
                  
                  return (
                    <div key={city} className="bg-gray-700 p-4 rounded-md border border-gray-600 hover:border-gray-500 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-white">{city}</h4>
                        <div className={`w-3 h-3 rounded-full ${status === 'up' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">{status === 'up' ? 'online' : 'offline'}</span>
                        <span className="text-sm font-medium text-gray-300">{responseTime} ms</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* HTTP Headers */}
            <div className="bg-gray-800 rounded-md shadow-md p-5 border border-gray-700 col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">HTTP Headers</h3>
              </div>
              
              <div className="space-y-3">
                {result?.headers && Object.entries(result.headers).map(([key, value], index) => (
                  <div key={index} className="p-3 bg-gray-700 rounded-md">
                    <div className="text-sm text-gray-400 mb-1">{key}</div>
                    <div className="font-medium text-white break-words">{value}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Performance Graph (only for websites in mock data) */}
            {result?.isInMockData && result.websiteId && (
              <div className="bg-gray-800 rounded-md shadow-md p-5 border border-gray-700 col-span-1 lg:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Performance Graph</h3>
                </div>
                <div className="p-4 bg-gray-700 rounded-md">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white font-medium">Response Time Last 24 Hours</h4>
                    <div className="flex space-x-2">
                      {indonesianCities.map((city) => (
                        <button
                          key={city}
                          onClick={() => setSelectedLocation(city)}
                          className={`px-2 py-1 text-xs rounded-md transition-colors ${selectedLocation === city ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponseTimeChart 
                      data={getHistoricalResponseTimeData(result.websiteId, selectedLocation)} 
                      height={250}
                    />
                  </div>
                </div>
              </div>
            )}
            {!result?.isInMockData && (
              <div className="bg-gray-800 rounded-md shadow-md p-5 border border-gray-700 col-span-1 lg:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">One Time Check</h3>
                </div>
                <div className="p-4 bg-gray-700 rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-400 font-medium">
                      {t('one_time_check_description')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* WHOIS Information */}
            <div className="bg-gray-800 rounded-md shadow-md p-5 border border-gray-700 col-span-1 lg:col-span-3">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">WHOIS Information</h3>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-gray-700 rounded-md">
                  <div className="text-sm text-gray-400 mb-1">Registrar</div>
                  <div className="font-medium text-white">{result?.whoisData.registrar || "-"}</div>
                </div>
                <div className="p-3 bg-gray-700 rounded-md">
                  <div className="text-sm text-gray-400 mb-1">Created Date</div>
                  <div className="font-medium text-white">{result?.whoisData.createdDate || "-"}</div>
                </div>
                <div className="p-3 bg-gray-700 rounded-md">
                  <div className="text-sm text-gray-400 mb-1">Expiry Date</div>
                  <div className="font-medium text-white">{result?.whoisData.expiryDate || "-"}</div>
                </div>
                <div className="p-3 bg-gray-700 rounded-md">
                  <div className="text-sm text-gray-400 mb-1">Name Servers</div>
                  <ul className="space-y-1">
                    {result?.whoisData.nameServers.map((ns, index) => (
                      <li key={index} className="font-medium text-white flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        {ns}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link 
            href="/"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
          >
            Check Another Website
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
