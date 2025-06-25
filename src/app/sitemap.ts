import { MetadataRoute } from 'next';
import { siteConfig } from './metadata';

// Function to get the current date in the format required for sitemaps
const getFormattedDate = () => {
  const date = new Date();
  return date.toISOString();
};

type ServiceType = {
  name: string;
  url: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  
  // Define static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: getFormattedDate(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/business`,
      lastModified: getFormattedDate(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ];

  // Try to fetch popular services for dynamic routes
  // This would typically come from your database or API
  let popularServices: ServiceType[] = [];
  
  try {
    // This is a placeholder - in a real implementation, you would fetch this data from your API
    // For example: const response = await fetch(`${baseUrl}/api/popular-services`);
    // popularServices = await response.json();
    
    // For demonstration, we'll add some example services
    popularServices = [
      { name: 'tokopedia', url: 'tokopedia.com' },
      { name: 'shopee', url: 'shopee.co.id' },
      { name: 'gojek', url: 'gojek.com' },
      { name: 'dana', url: 'dana.id' },
      { name: 'bca', url: 'bca.co.id' },
    ];
  } catch (error) {
    console.error('Failed to fetch popular services for sitemap:', error);
  }

  // Generate dynamic routes for popular services
  const dynamicRoutes = popularServices.flatMap((service) => [
    {
      url: `${baseUrl}/status/${encodeURIComponent(service.url)}`,
      lastModified: getFormattedDate(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/checks/${encodeURIComponent(service.url)}`,
      lastModified: getFormattedDate(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/monitoring/${encodeURIComponent(service.name)}`,
      lastModified: getFormattedDate(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
  ]);

  // Combine all routes
  return [...staticRoutes, ...dynamicRoutes];
}
