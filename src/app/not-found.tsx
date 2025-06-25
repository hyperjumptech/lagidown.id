"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import Footer from "@/components/Footer";

export default function NotFound() {
  const [urlToCheck, setUrlToCheck] = useState("");
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  
  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  const handleCheckWebsite = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlToCheck.trim()) {
      const encodedUrl = encodeURIComponent(urlToCheck.trim());
      router.push(`/status/${encodedUrl}`);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-md flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white">LagiDown.id</h1>
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link href="/business" className="text-gray-300 hover:text-green-500 transition-colors font-medium">
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

      {/* 404 Content */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="text-9xl font-extrabold text-green-500 mb-4">404</div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                <span className="text-white">
                  {language === 'id' ? 'Halaman Tidak Ditemukan' : 'Page Not Found'}
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                {language === 'id' 
                  ? 'Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.'
                  : 'Sorry, the page you are looking for cannot be found or has been moved.'}
              </p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-md shadow-md mb-8 max-w-3xl mx-auto">
              <h2 className="text-xl font-bold mb-4 text-white">
                {language === 'id' ? 'Cek Status Website' : 'Check Website Status'}
              </h2>
              <form onSubmit={handleCheckWebsite} className="flex w-full gap-4">
                <div className="flex-grow">
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={language === 'id' ? 'Masukkan URL website untuk diperiksa' : 'Enter website URL to check'}
                    value={urlToCheck}
                    onChange={(e) => setUrlToCheck(e.target.value)}
                    required
                  />
                </div>
                <div className="w-auto">
                  <button 
                    type="submit" 
                    className="w-12 h-full flex items-center justify-center bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-md hover:shadow-lg transition-all"
                    aria-label={language === 'id' ? 'Periksa Status' : 'Check Status'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            <div className="flex justify-center space-x-4">
              <Link 
                href="/" 
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-md hover:shadow-lg transition-all"
              >
                {language === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
              </Link>
              <Link 
                href="/status" 
                className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-md hover:shadow-lg transition-all"
              >
                {language === 'id' ? 'Lihat Semua Layanan' : 'View All Services'}
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </main>
  );
}
