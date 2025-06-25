import { Metadata } from 'next';
import { siteConfig } from '@/app/metadata';

type Props = {
  params: { url: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Decode the URL parameter
  const decodedUrl = decodeURIComponent(params.url);
  
  return {
    title: `Status ${decodedUrl} - Cek Gangguan & Layanan Real-Time – ${siteConfig.name}`,
    description: `Pantau status layanan ${decodedUrl} secara langsung. Ketahui apakah ${decodedUrl} sedang down, error, atau mengalami gangguan hanya di ${siteConfig.name}.`,
    keywords: `cek status ${decodedUrl}, ${decodedUrl} down, gangguan ${decodedUrl}, pemantauan layanan, status server ${decodedUrl}, cek gangguan ${decodedUrl}`,
    openGraph: {
      title: `Status ${decodedUrl} - Cek Gangguan & Layanan Real-Time – ${siteConfig.name}`,
      description: `Pantau status layanan ${decodedUrl} secara langsung. Ketahui apakah ${decodedUrl} sedang down, error, atau mengalami gangguan hanya di ${siteConfig.name}.`,
      type: 'website' as const,
    },
    twitter: {
      title: `Status ${decodedUrl} - Cek Gangguan & Layanan Real-Time – ${siteConfig.name}`,
      description: `Pantau status layanan ${decodedUrl} secara langsung. Ketahui apakah ${decodedUrl} sedang down, error, atau mengalami gangguan hanya di ${siteConfig.name}.`,
      card: 'summary_large_image' as const,
    },
  };
}
