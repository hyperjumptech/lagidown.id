import { Metadata } from 'next';
import { siteConfig } from '@/app/metadata';
import { popularWebsites } from '@/data/mockData';

type Props = {
  params: { url: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Decode the URL parameter
  const decodedUrl = decodeURIComponent(params.url);
  
  // Format URL for display
  const displayUrl = decodedUrl.includes('.') ? decodedUrl : `${decodedUrl}.com`;
  
  // Check if this is a website from our mock data to get more specific info
  const matchedWebsite = popularWebsites.find(w => 
    w.url.replace(/\./g, '') === decodedUrl.replace(/\./g, '') || 
    w.url === decodedUrl
  );
  
  const description = matchedWebsite 
    ? `Pantau status layanan ${displayUrl} secara langsung. ${matchedWebsite.description}. Ketahui apakah ${displayUrl} sedang down, error, atau mengalami gangguan hanya di ${siteConfig.name}.`
    : `Pantau status layanan ${displayUrl} secara langsung. Ketahui apakah ${displayUrl} sedang down, error, atau mengalami gangguan hanya di ${siteConfig.name}.`;
  
  const category = matchedWebsite?.category || '';
  
  return {
    title: `Status ${displayUrl} - Cek Gangguan & Layanan Real-Time – ${siteConfig.name}`,
    description: description,
    keywords: `cek status ${displayUrl}, ${displayUrl} down, gangguan ${displayUrl}, pemantauan layanan, status server ${displayUrl}, cek gangguan ${displayUrl}, ${category}`,
    openGraph: {
      title: `Status ${displayUrl} - Cek Gangguan & Layanan Real-Time – ${siteConfig.name}`,
      description: description,
      type: 'website' as const,
    },
    twitter: {
      title: `Status ${displayUrl} - Cek Gangguan & Layanan Real-Time – ${siteConfig.name}`,
      description: description,
      card: 'summary_large_image' as const,
    },
  };
}
