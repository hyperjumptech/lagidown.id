import { NextResponse } from 'next/server';

// Endpoint untuk mengambil data status live dari Neosense
export async function GET() {
  try {
    // Ambil password dari environment variable
    const password = process.env.STATUS_PAGE_KEY;
    if (!password) {
      throw new Error('STATUS_PAGE_KEY is not defined in environment variables');
    }
    
    const statusPageId = process.env.STATUS_PAGE_ID;
    if (!statusPageId) {
      throw new Error('STATUS_PAGE_ID is not defined in environment variables');
    }
    
    console.log(`Fetching data from Neosense API with status page ID: ${statusPageId}`);
    const neosenseEndpoint = `https://console.neosense.id/api/v1/status-pages/public/${statusPageId}?timeframe=30`;
    
    // Buat request ke endpoint API Neosense dengan header yang benar
    const response = await fetch(neosenseEndpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Status-Page': statusPageId,
        'X-Status-Page-Secret': password,
      },
      cache: 'no-store', // Disable cache to always get fresh data
      next: { revalidate: 0 }, // Disable Next.js cache
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data from Neosense API: ${response.status} ${response.statusText}`);
    }
    
    // Check content type to ensure we're getting JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Expected JSON response but got ${contentType}`);
    }
    
    // Parse data JSON dari response
    const data = await response.json();
    
    // Log data untuk debugging
    console.log('Received data from Neosense API:', JSON.stringify(data).substring(0, 200) + '...');
    
    // Periksa struktur data
    if (data && data.data && data.data.probes) {
      console.log('Data structure is valid. Found', data.data.probes.length, 'probes');
      
      // Log beberapa probe untuk debugging
      if (data.data.probes.length > 0) {
        console.log('Sample probe:', JSON.stringify(data.data.probes[0], null, 2));
      }
    } else {
      console.warn('Invalid data structure received from Neosense API');
      throw new Error('Invalid data structure received from Neosense API');
    }
    
    // Return data ke client dengan no-cache headers
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
  } catch (error: unknown) {
    console.error('Error fetching live status data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Fallback to mock data structure
    const mockData = {
      websites: [
        {
          id: '1',
          name: 'Example Website',
          url: 'example.com',
          status: {
            'Jakarta': {
              status: 'up',
              responseTime: 200,
              lastChecked: new Date().toISOString(),
            }
          }
        }
      ],
      locations: ['Jakarta'],
      error: errorMessage,
      isMockData: true
    };
    
    return NextResponse.json(mockData, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      } 
    });
  }
}
