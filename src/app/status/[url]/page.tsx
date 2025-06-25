"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { useLanguage } from '@/context/LanguageContext'; 
import { AlertTriangle, Info } from 'lucide-react'; 
import Footer from "@/components/Footer";

// Interface for URL check results
interface CheckResult {
  status: "up" | "down";
  statusCode?: number;
  statusText?: string;
  responseTime: number;
  lastChecked: string;
  headers?: Record<string, string>; 
  error?: string; 
  requestedUrl?: string; 
  serverRegion?: string; 
  isInMockData?: boolean;
  websiteId?: number;
}

const CheckPage = () => {
  const params = useParams();
  const { t, language, setLanguage } = useLanguage();
  const [result, setResult] = useState<CheckResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Decode the URL from the parameters
  const encodedUrlFromParams = Array.isArray(params.url) ? params.url[0] : params.url;
  let originalDecodedUrl = '';
  if (encodedUrlFromParams) {
    try {
      originalDecodedUrl = decodeURIComponent(encodedUrlFromParams);
    } catch (e) {
      console.error("Error decoding URL from params:", e);
    }
  }

  useEffect(() => {
    if (!originalDecodedUrl) {
      setError(t('error_invalid_url_param'));
      setLoading(false);
      return;
    }

    const fetchStatus = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/check-status?url=${encodeURIComponent(originalDecodedUrl)}`);
        if (!response.ok) {
          const errorData = await response.json();
          const apiErrorMessage = errorData.error || `HTTP error! status: ${response.status}`;
          setError(apiErrorMessage);
          setResult({ 
            status: 'down', 
            responseTime: 0, 
            lastChecked: new Date().toISOString(), 
            error: apiErrorMessage, 
            requestedUrl: originalDecodedUrl,
            statusCode: response.status !== 200 ? response.status : undefined,
            statusText: response.statusText
          });
          return;
        }
        const data: CheckResult = await response.json();
        setResult(data);
        if (data.error) {
            setError(data.error);
        }
      } catch (err: unknown) {
        console.error("Fetch error:", err);
        const errorMessage = err instanceof Error ? err.message : t('error_fetching_status_generic');
        setError(errorMessage);
        setResult({ 
          status: 'down', 
          responseTime: 0, 
          lastChecked: new Date().toISOString(), 
          error: errorMessage, 
          requestedUrl: originalDecodedUrl,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [originalDecodedUrl, t]); // Added 't' to dependency array

  // Add structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": originalDecodedUrl ? `${originalDecodedUrl} Status Check` : "Website Status Check",
    "description": originalDecodedUrl ? 
      `Check if ${originalDecodedUrl} is up or down. Real-time website status monitoring.` :
      "Check if a website is up or down with StatusWeb.",
    "url": originalDecodedUrl ? 
      `https://statusweb.vercel.app/status/${encodeURIComponent(originalDecodedUrl)}` :
      "https://statusweb.vercel.app"
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Add structured data for SEO */}
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
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <h1 className="text-2xl font-extrabold text-white">StatusWeb</h1>
              </Link>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link href="/pricing" className="text-gray-300 hover:text-green-500 transition-colors font-medium">
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
            <span className="text-green-500">{originalDecodedUrl || 'Loading...'}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Icon can be dynamic based on loading/status later if needed */}
            <div className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border ${result && result.status === 'up' ? 'border-green-500' : result && result.status === 'down' ? 'border-red-500' : 'border-gray-700'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${result && result.status === 'up' ? 'text-green-500' : result && result.status === 'down' ? 'text-red-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {loading && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />} {/* Example loading icon */}
                {result && result.status === 'up' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />} {/* Checkmark */}
                {result && result.status === 'down' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />} {/* X mark */}
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {loading ? t('checking_status_for') : t('status_for')}
              <span className={`${result && result.status === 'up' ? 'text-green-500' : result && result.status === 'down' ? 'text-red-500' : 'text-white'} ml-2`}>{originalDecodedUrl || ''}</span>
            </h1>
          </div>
        </div>

        {loading && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-300">{t('loading_status_please_wait')}</p>
          </div>
        )}

        {error && !result?.error && (
          <div className="mt-6 bg-red-900 bg-opacity-70 text-red-200 p-4 rounded-lg shadow-md text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle size={20} className="mr-2" />
              <h3 className="text-lg font-semibold">{t('error_encountered')}</h3>
            </div>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && result && (
          <div>
            {/* Main Status Card */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Status */}
                <div className={`p-4 rounded-md shadow-md ${result.status === "up" ? "bg-green-700 bg-opacity-40" : "bg-red-700 bg-opacity-40"}`}>
                  <div className="text-sm text-gray-300 mb-1">{t('overall_status')}</div>
                  <div className={`text-2xl font-bold ${result.status === "up" ? "text-green-200" : "text-red-200"}`}>
                    {result.status === "up" ? t('online') : t('offline')}
                  </div>
                  {/* Always show status code and text if available, even for 'offline' if it's a server response */}
                  {result.statusCode && (
                    <div className="text-xs text-gray-300 mt-1">
                      {t('http_status')}: {result.statusCode} {result.statusText}
                    </div>
                  )}
                  {result.error && (
                    <div className="mt-2 text-sm text-red-300">
                      <p>{result.error}</p>
                    </div>
                  )}
                </div>

                {/* Response Time */}
                <div className="bg-gray-750 p-4 rounded-md shadow-md">
                  <div className="text-sm text-gray-400">{t('response_time')}</div>
                  <div className="text-2xl font-semibold text-white">
                    {result.responseTime} ms
                  </div>
                </div>
                
                {/* Checked From Location */}
                <div className="bg-gray-750 p-4 rounded-md shadow-md">
                  <div className="text-sm text-gray-400">{t('checked_from')}</div>
                  {/* Display Vercel server region */}
                  <div className="text-lg font-semibold text-white">
                    {result.serverRegion ? 
                      /* If we have a server region, display it with the prefix */
                      `${t('vercel_region_prefix')}${result.serverRegion.toUpperCase()}` : 
                      /* Otherwise display the generic location text */
                      t('our_server_location_generic')}
                  </div> 
                  <div className="text-xs text-gray-500">{new Date(result.lastChecked).toLocaleString(language, { dateStyle: 'medium', timeStyle: 'short'})}</div>
                </div>
              </div>
            </div>

            {/* Call to Action for Hyperjump */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-6 text-center">
              <h3 className="text-xl font-semibold mb-3 text-white">{t('need_multi_location_monitoring')}</h3>
              <p className="text-gray-400 mb-4">{t('hyperjump_cta_description')}</p>
              <a 
                href="https://hyperjump.tech" // Placeholder URL
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md shadow-md transition-colors duration-300"
              >
                {t('monitor_with_hyperjump')}
              </a>
            </div>

            {/* HTTP Headers - Industry Standard Display */}
            {result.headers && Object.keys(result.headers).length > 0 && !error && (
              <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Info size={20} className="mr-2 text-blue-400" /> 
                  {t('http_headers')}
                </h3>
                <div className="overflow-x-auto bg-gray-850 rounded-md">
                  <table className="min-w-full text-sm border-separate border-spacing-0">
                    <thead className="bg-gray-750 sticky top-0 z-10">
                      <tr>
                        <th className="py-3 px-4 text-left text-gray-200 font-semibold rounded-tl-md">Header</th>
                        <th className="py-3 px-4 text-left text-gray-200 font-semibold rounded-tr-md">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Group important headers first */}
                      {Object.entries(result.headers)
                        .sort(([keyA], [keyB]) => {
                          // Sort important headers to the top
                          const importantHeaders = ['content-type', 'server', 'cache-control', 'content-encoding', 'date', 'expires', 'last-modified'];
                          const indexA = importantHeaders.indexOf(keyA.toLowerCase());
                          const indexB = importantHeaders.indexOf(keyB.toLowerCase());
                          
                          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                          if (indexA !== -1) return -1;
                          if (indexB !== -1) return 1;
                          return keyA.localeCompare(keyB);
                        })
                        .map(([key, value]) => {
                          // Determine if this is a security header
                          const isSecurityHeader = ['content-security-policy', 'strict-transport-security', 'x-content-type-options', 'x-frame-options', 'x-xss-protection'].includes(key.toLowerCase());
                          
                          // Determine if this is a performance header
                          const isPerformanceHeader = ['cache-control', 'etag', 'expires', 'last-modified'].includes(key.toLowerCase());
                          
                          return (
                            <tr key={key} className={`border-b border-gray-750 hover:bg-gray-700 transition-colors duration-150 ${isSecurityHeader ? 'bg-gray-750 bg-opacity-50' : ''}`}>
                              <td className="py-2.5 px-4 font-medium break-all">
                                <span className={`${isSecurityHeader ? 'text-green-400' : isPerformanceHeader ? 'text-blue-400' : 'text-gray-300'}`}>
                                  {key}
                                </span>
                              </td>
                              <td className="py-2.5 px-4 text-gray-400 break-all">{value}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default CheckPage;
