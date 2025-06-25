"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Translations = {
  [key: string]: string;
};

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
};

// English translations
const en: Translations = {
  // Header
  "home": "Home",
  "for_business": "For Business",
  "sign_in": "Sign In",
  
  // Hero section
  "monitor_website_status": "Check Website Status",
  "across_indonesia": "Across Indonesia",
  "real_time_monitoring": "Real-time website monitoring for popular sites across major Indonesian cities",
  "check_from_multiple_locations": "Check website connectivity from multiple locations in Indonesia",
  "enter_website_url": "Enter website URL to check",
  "check_status": "Check Status",
  "website_status_monitor": "Website Status Monitor",
  "top_websites": "Top 5 Websites",
  "view_more": "View More",
  
  // Popular websites section
  "popular_website_status": "Popular Website Status",
  "monitor_connectivity": "Monitor connectivity of popular websites across major Indonesian cities",
  "indonesian_websites": "Indonesian Websites",
  "global_websites": "Global Websites",
  "view_all_websites": "View All Websites",
  "view_details": "View Details",
  "response_time": "Response Time",
  "all_locations_up": "All locations up",
  "all_locations_down": "All locations down",
  "locations_status": "{up} up, {down} down",
  "all_up": "All Up",
  "all_down": "All Down",
  "ups_downs": "{ups} ups, {downs} downs",
  "up_for_locations": "Up for {count} locations",
  "down_on_locations": "Down on {count} locations",
  "up_and_down": "Up for {up} and Down for {down} locations",
  "ups_downs_formatted": "{ups} up{ups_s}, {downs} down{downs_s}",
  "up": "up",
  "status_up": "Up",
  "status_down": "Down",
  "ups": "ups",
  "down": "down",
  "downs": "downs",
  
  // Navigation menu
  "beranda": "Home",
  "status": "Status",
  "statistik": "Statistics",
  "bantuan": "Help",
  
  // Footer
  "website_description": "Real-time website monitoring across Indonesia. Check connectivity status for popular websites or your own sites.",
  "powered_by_monika": "Powered by Monika",
  "monika_description": "Monika is an open source synthetic monitoring tool",
  "monika_developed_by": "Developed by Hyperjump",
  "contact_us": "Contact Us",
  "copyright": " {year} StatusWeb. All rights reserved.",
  "about_statusweb": "StatusWeb is a platform for monitoring website connectivity across Indonesia.",
  "about_monika": "Powered by Monika, an open source synthetic monitoring tool by Hyperjump.",
  
  // Detail page
  "online": "Online",
  "offline": "Offline",
  "last_checked": "Last checked",
  "ip_address": "IP address",
  "monitoring_locations": "Monitoring Locations",
  "loading": "Loading...",
  "checking_website": "Checking website status...",
  "checking_status": "Checking status",
  "this_may_take_a_moment": "This may take a moment",
  "monitoring_results_for": "Monitoring Results for",
  
  // Status detail page
  "status_for": "Status for",
  "checking_status_for": "Checking status for",
  "loading_status_please_wait": "Loading status, please wait...",
  "error_encountered": "Error Encountered",
  "error_invalid_url_param": "Invalid URL parameter",
  "error_fetching_status_generic": "Error fetching status",
  "overall_status": "Overall Status",
  "http_status": "HTTP Status",
  "checked_from": "Checked from",
  "vercel_region_prefix": "Server Location: ",
  "our_server_location_generic": "Our Server",
  "http_headers": "HTTP Headers",
  "need_multi_location_monitoring": "Need Multi-Location Monitoring?",
  "hyperjump_cta_description": "Get real-time monitoring from multiple global locations and Indonesian cities.",
  "monitor_with_hyperjump": "Contact Hyperjump",
  "url_input_placeholder": "Enter website URL, e.g: google.com",
  "check_status_button": "Check Status",
  "back_to_home": "Back to Home",
  
  // SEO Content
  "how_to_check_service_status": "How to Check Digital Service Status in Real-Time",
  "service_status_intro": "Monitoring the status of digital services like {website} is essential to ensure they are functioning properly. StatusWeb provides a reliable server status monitoring platform that allows you to know if a service is down or experiencing disruptions.",
  "why_monitor_heading": "Why is Service Status Monitoring Important?",
  "why_monitor_text": "When you rely on digital services for business or personal use, it's important to know immediately if there's a disruption. With StatusWeb, you can:",
  "monitor_feature_1": "Monitor service status from various locations in Indonesia",
  "monitor_feature_2": "View server response times to detect performance issues",
  "monitor_feature_3": "Get information about service availability history",
  "monitor_feature_4": "Check technical details like HTTP headers and IP addresses",
  "how_to_use_heading": "How to Use StatusWeb?",
  "how_to_use_text": "Simply enter the URL of the service you want to monitor on the home page, and StatusWeb will provide real-time information about the status of that service. You can also view the status from various locations in Indonesia to ensure the service is accessible throughout the country.",
  "monitor_conclusion": "Monitor {website} status directly with StatusWeb and know immediately if there are disruptions or performance issues.",
  
  // Business page
  "enterprise_monitoring": "Enterprise-Grade Monitoring Solutions",
  "take_monitoring_next_level": "Take your website monitoring to the next level with advanced features designed for businesses.",
  "contact_hyperjump": "Contact Hyperjump for Consultation",
  "advanced_features": "Advanced Monitoring Features",
  "multi_channel": "Multi-Channel Notifications",
  "multi_channel_desc": "Receive instant alerts through WhatsApp, Teams, Slack, Email, SMS, and more when your websites experience issues.",
  "synthetic_monitoring": "Synthetic Monitoring",
  "synthetic_monitoring_desc": "Simulate user interactions to test critical user flows and ensure your business processes work as expected.",
  "request_chaining": "Request Chaining",
  "request_chaining_desc": "Test complex user flows that require multiple sequential API calls, authentication steps, and data validation.",
  "custom_monitoring": "Custom Monitoring Configurations",
  "custom_monitoring_desc": "Monitor specific response times, status codes, or check for particular content in response bodies.",
  "advanced_analytics": "Advanced Analytics",
  "advanced_analytics_desc": "Gain deeper insights with comprehensive analytics, historical data, and customizable dashboards.",
  "private_deployment": "Private Deployment",
  "private_deployment_desc": "Deploy monitoring solutions on your own infrastructure for enhanced security and compliance requirements.",
  "powered_by_monika_business": "Powered by Monika",
  "monika_business_desc": "Our enterprise solutions are built on Monika, an open-source monitoring tool developed by Hyperjump. Monika provides powerful, flexible monitoring capabilities that can be customized to meet your specific business needs.",
  "github": "GitHub",
  "documentation": "Documentation",
  "ready_to_elevate": "Ready to Elevate Your Monitoring?",
  "contact_for_consultation": "Contact Hyperjump for a consultation to discuss your specific monitoring needs and how we can help you implement a robust monitoring solution.",
  "schedule_consultation": "Schedule a Consultation",
};

// Indonesian translations
const id: Translations = {
  // Header
  "home": "Beranda",
  "for_business": "Untuk Bisnis",
  "sign_in": "Masuk",
  
  // Hero section
  "monitor_website_status": "Cek Status Website",
  "across_indonesia": "Di Seluruh Indonesia",
  "real_time_monitoring": "Pemantauan website secara real-time untuk situs populer di berbagai kota besar Indonesia",
  "check_from_multiple_locations": "Periksa konektivitas website dari berbagai lokasi di Indonesia",
  "enter_website_url": "Masukkan URL website untuk diperiksa",
  "check_status": "Periksa Status",
  "website_status_monitor": "Monitor Status Website",
  "top_websites": "5 Website Teratas",
  "view_more": "Lihat Lebih Banyak",
  
  // Popular websites section
  "popular_website_status": "Status Website Populer",
  "monitor_connectivity": "Pantau status konektivitas website populer di berbagai kota besar Indonesia",
  "indonesian_websites": "Website Indonesia",
  "global_websites": "Website Global",
  "view_all_websites": "Lihat Semua Website",
  "view_details": "Lihat Detail",
  "response_time": "Waktu Respons",
  "all_locations_up": "Semua lokasi up",
  "all_locations_down": "Semua lokasi down",
  "locations_status": "{up} up, {down} down",
  "all_up": "Semua Up",
  "all_down": "Semua Down",
  "ups_downs": "{ups} up, {downs} down",
  "up": "up",
  "ups": "up",
  "down": "down",
  "downs": "down",
  "up_for_locations": "Up di {count} lokasi",
  "down_on_locations": "Down di {count} lokasi",
  "up_and_down": "Up di {up} dan Down di {down} lokasi",
  "status_up": "Up",
  "status_down": "Down",
  
  // Navigation menu
  "beranda": "Beranda",
  "status": "Status",
  "statistik": "Statistik",
  "bantuan": "Bantuan",
  
  // Footer
  "website_description": "Pemantauan website secara real-time di seluruh Indonesia. Periksa status konektivitas untuk website populer atau website Anda sendiri.",
  "powered_by_monika": "Didukung oleh Monika",
  "monika_description": "Monika adalah alat pemantauan sintetis open source",
  "monika_developed_by": "Dikembangkan oleh Hyperjump",
  "contact_us": "Hubungi Kami",
  "copyright": " {year} StatusWeb. Hak Cipta Dilindungi.",
  "about_statusweb": "StatusWeb adalah platform untuk memantau konektivitas website di seluruh Indonesia.",
  "about_monika": "Didukung oleh Monika, alat pemantauan sintetis open source dari Hyperjump.",
  
  // Detail page
  "online": "Online",
  "offline": "Offline",
  "last_checked": "Terakhir diperiksa",
  "ip_address": "Alamat IP",
  "monitoring_locations": "Lokasi Pemantauan",
  "loading": "Memuat...",
  "checking_website": "Memeriksa status website...",
  "checking_status": "Memeriksa status",
  "this_may_take_a_moment": "Ini mungkin memerlukan waktu sejenak",
  "monitoring_results_for": "Hasil Pemantauan untuk",
  
  // Status detail page
  "status_for": "Status untuk",
  "checking_status_for": "Memeriksa status untuk",
  "loading_status_please_wait": "Memuat status, harap tunggu...",
  "error_encountered": "Terjadi Kesalahan",
  "error_invalid_url_param": "Parameter URL tidak valid",
  "error_fetching_status_generic": "Terjadi kesalahan saat mengambil status",
  "overall_status": "Status Keseluruhan",
  "http_status": "Status HTTP",
  "checked_from": "Dicek dari",
  "vercel_region_prefix": "Lokasi Server: ",
  "our_server_location_generic": "Server Kami",
  "http_headers": "Header HTTP",
  "need_multi_location_monitoring": "Butuh Pemantauan dari Banyak Lokasi?",
  "hyperjump_cta_description": "Dapatkan pemantauan real-time dari berbagai lokasi global dan kota besar di Indonesia.",
  "monitor_with_hyperjump": "Hubungi Hyperjump",
  "url_input_placeholder": "Masukkan URL website, cth: google.com",
  "check_status_button": "Cek Status",
  "back_to_home": "Kembali ke Beranda",
  
  // SEO Content
  "how_to_check_service_status": "Cara Cek Status Layanan Digital Secara Real-Time",
  "service_status_intro": "Memantau status layanan digital seperti {website} sangat penting untuk memastikan bahwa layanan tersebut berfungsi dengan baik. StatusWeb menyediakan platform pemantauan status server terpercaya yang memungkinkan Anda mengetahui jika layanan sedang down atau mengalami gangguan.",
  "why_monitor_heading": "Mengapa Memantau Status Layanan Penting?",
  "why_monitor_text": "Ketika Anda bergantung pada layanan digital untuk bisnis atau penggunaan pribadi, penting untuk segera mengetahui jika terjadi gangguan. Dengan menggunakan StatusWeb, Anda dapat:",
  "monitor_feature_1": "Memantau status layanan dari berbagai lokasi di Indonesia",
  "monitor_feature_2": "Melihat waktu respons server untuk mendeteksi masalah kinerja",
  "monitor_feature_3": "Mendapatkan informasi tentang riwayat ketersediaan layanan",
  "monitor_feature_4": "Memeriksa detail teknis seperti header HTTP dan alamat IP",
  "how_to_use_heading": "Bagaimana Cara Menggunakan StatusWeb?",
  "how_to_use_text": "Cukup masukkan URL layanan yang ingin Anda pantau di halaman utama, dan StatusWeb akan memberikan informasi real-time tentang status layanan tersebut. Anda juga dapat melihat status dari berbagai lokasi di Indonesia untuk memastikan layanan dapat diakses dari seluruh negeri.",
  "monitor_conclusion": "Pantau status {website} secara langsung dengan StatusWeb dan ketahui segera jika terjadi gangguan atau masalah kinerja.",
  
  // Business page
  "enterprise_monitoring": "Solusi Pemantauan Kelas Enterprise",
  "take_monitoring_next_level": "Tingkatkan pemantauan website Anda ke level berikutnya dengan fitur canggih yang dirancang untuk bisnis.",
  "contact_hyperjump": "Hubungi Hyperjump untuk Konsultasi",
  "advanced_features": "Fitur Pemantauan Canggih",
  "multi_channel": "Notifikasi Multi-Channel",
  "multi_channel_desc": "Terima peringatan instan melalui WhatsApp, Teams, Slack, Email, SMS, dan lainnya ketika website Anda mengalami masalah.",
  "synthetic_monitoring": "Pemantauan Sintetis",
  "synthetic_monitoring_desc": "Simulasikan interaksi pengguna untuk menguji alur pengguna yang kritis dan memastikan proses bisnis Anda berjalan sesuai harapan.",
  "request_chaining": "Rantai Permintaan",
  "request_chaining_desc": "Uji alur pengguna yang kompleks yang memerlukan beberapa panggilan API berurutan, langkah otentikasi, dan validasi data.",
  "custom_monitoring": "Konfigurasi Pemantauan Kustom",
  "custom_monitoring_desc": "Pantau waktu respons tertentu, kode status, atau periksa konten tertentu dalam respons body.",
  "advanced_analytics": "Analitik Lanjutan",
  "advanced_analytics_desc": "Dapatkan wawasan lebih mendalam dengan analitik komprehensif, data historis, dan dasbor yang dapat disesuaikan.",
  "private_deployment": "Deployment Pribadi",
  "private_deployment_desc": "Deploy solusi pemantauan di infrastruktur Anda sendiri untuk keamanan dan kepatuhan yang lebih baik.",
  "powered_by_monika_business": "Didukung oleh Monika",
  "monika_business_desc": "Solusi enterprise kami dibangun di atas Monika, alat pemantauan open source yang dikembangkan oleh Hyperjump. Monika menyediakan kemampuan pemantauan yang kuat dan fleksibel yang dapat disesuaikan dengan kebutuhan bisnis Anda.",
  "github": "GitHub",
  "documentation": "Dokumentasi",
  "ready_to_elevate": "Siap Meningkatkan Pemantauan Anda?",
  "contact_for_consultation": "Hubungi Hyperjump untuk konsultasi guna membahas kebutuhan pemantauan spesifik Anda dan bagaimana kami dapat membantu Anda mengimplementasikan solusi pemantauan yang kuat.",
  "schedule_consultation": "Jadwalkan Konsultasi",
};

const translations: { [key: string]: Translations } = {
  en,
  id,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('id'); // Default to Indonesian

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
