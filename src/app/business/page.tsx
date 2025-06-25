"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Footer from '@/components/Footer';

export default function BusinessPage() {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-900">
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
              <Link href="/business" className="text-green-500 hover:text-green-400 transition-colors">
                <span className="hidden md:inline">For Business</span>
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

      {/* Hero Section */}
      <section className="bg-gray-900 py-16 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('enterprise_monitoring')}
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {t('take_monitoring_next_level')}
            </p>
            <div className="flex justify-center">
              <a 
                href="https://hyperjump.tech/contact" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors shadow-lg"
              >
                {t('contact_hyperjump')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">{t('advanced_features')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-500 transition-colors">
              <div className="w-12 h-12 bg-green-900/30 rounded-md flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('multi_channel')}</h3>
              <p className="text-gray-300">
                {t('multi_channel_desc')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-500 transition-colors">
              <div className="w-12 h-12 bg-green-900/30 rounded-md flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('synthetic_monitoring')}</h3>
              <p className="text-gray-300">
                {t('synthetic_monitoring_desc')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-500 transition-colors">
              <div className="w-12 h-12 bg-green-900/30 rounded-md flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('request_chaining')}</h3>
              <p className="text-gray-300">
                {t('request_chaining_desc')}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-500 transition-colors">
              <div className="w-12 h-12 bg-green-900/30 rounded-md flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('custom_monitoring')}</h3>
              <p className="text-gray-300">
                {t('custom_monitoring_desc')}
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-500 transition-colors">
              <div className="w-12 h-12 bg-green-900/30 rounded-md flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('advanced_analytics')}</h3>
              <p className="text-gray-300">
                {t('advanced_analytics_desc')}
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-500 transition-colors">
              <div className="w-12 h-12 bg-green-900/30 rounded-md flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{t('private_deployment')}</h3>
              <p className="text-gray-300">
                {t('private_deployment_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">{t('ready_to_elevate')}</h2>
            <p className="text-xl text-gray-300 mb-8">
              {t('contact_for_consultation')}
            </p>
            <a 
              href="https://hyperjump.tech/contact" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors shadow-lg inline-block"
            >
              {t('schedule_consultation')}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
