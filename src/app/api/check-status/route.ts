import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const urlToFetch = searchParams.get('url');

  // Attempt to get the Vercel server region from headers
  // Try multiple Vercel headers to determine the region
  const vercelRegionFromHeader = request.headers.get('x-vercel-deployment-region');
  const vercelProxyRegion = request.headers.get('x-vercel-proxy-region');
  // Removed unused variable: vercelForwardedFor
  const vercelIpCity = request.headers.get('x-vercel-ip-city');
  const vercelIpCountry = request.headers.get('x-vercel-ip-country');
  
  // For debugging in Vercel logs (uncomment if needed)
  // console.log('Vercel Headers:', {
  //   'x-vercel-deployment-region': vercelRegionFromHeader,
  //   'x-vercel-proxy-region': vercelProxyRegion,
  //   'x-forwarded-for': vercelForwardedFor,
  //   'x-vercel-ip-city': vercelIpCity,
  //   'x-vercel-ip-country': vercelIpCountry
  // });

  // Determine server region with fallbacks
  let serverRegion = '';
  
  if (vercelRegionFromHeader) {
    // Use the official deployment region if available
    serverRegion = vercelRegionFromHeader;
  } else if (vercelProxyRegion) {
    // Use proxy region as fallback
    serverRegion = vercelProxyRegion;
  } else if (vercelIpCity && vercelIpCountry) {
    // Use city and country if available
    serverRegion = `${vercelIpCity}, ${vercelIpCountry}`;
  } else if (vercelIpCity) {
    // Use just city if available
    serverRegion = vercelIpCity;
  } else if (vercelIpCountry) {
    // Use just country if available
    serverRegion = vercelIpCountry;
  } else {
    // If no region info available, use empty string
    // We'll handle the fallback text in the frontend
    serverRegion = '';
  }

  if (!urlToFetch) {
    return NextResponse.json({ error: 'URL parameter is required', serverRegion }, { status: 400 });
  }

  let decodedUrl;
  try {
    decodedUrl = decodeURIComponent(urlToFetch);
    // Basic check if it's likely a domain or IP, then prepend https if no scheme
    if (!decodedUrl.match(/^[a-zA-Z]+:\/\//)) { // if no scheme like http://, ftp://
      if (decodedUrl.match(/^([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,}$/) || decodedUrl.match(/^(\d{1,3}\.){3}\d{1,3}$/)) {
        decodedUrl = 'https://' + decodedUrl;
      } else {
        // If a different scheme is present (e.g. ftp://), it's not a http/https URL we can check
        return NextResponse.json({ error: 'Invalid URL scheme. Only http and https are supported.', serverRegion }, { status: 400 });
      }
    }
    // Ensure it's a valid URL structure after potential modifications
    new URL(decodedUrl); 
  } catch { // Removed '_error' as it's not used
    return NextResponse.json({ error: 'Invalid or malformed URL provided', serverRegion }, { status: 400 });
  }

  const startTime = Date.now();
  let responseTime = 0;

  // Use AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

  try {
    const response = await fetch(decodedUrl, {
      method: 'HEAD', // Using HEAD request for efficiency
      redirect: 'follow', // Automatically follow redirects
      signal: controller.signal, // Pass the abort signal to fetch
    });

    clearTimeout(timeoutId); // Clear the timeout if fetch completes/fails before timeout

    responseTime = Date.now() - startTime;

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const status = response.ok ? 'up' : 'down';

    return NextResponse.json({
      status,
      statusCode: response.status,
      statusText: response.statusText,
      responseTime,
      headers,
      lastChecked: new Date().toISOString(),
      requestedUrl: decodedUrl,
      serverRegion, // Add server region to success response
    });

  } catch (error: unknown) { // Changed 'any' to 'unknown'
    clearTimeout(timeoutId);
    responseTime = Date.now() - startTime;
    let errorMessage = 'Failed to fetch';
    const statusCode: number | undefined = undefined; // Changed to const, ensure it's not reassigned later or revert to let if needed

    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out after 15 seconds.';
        // statusCode remains undefined or you can set a specific code for timeout e.g. 504
      } else if (typeof error === 'object' && error !== null && 'cause' in error) {
        const cause = (error as { cause?: { code?: string } }).cause;
        if (cause && typeof cause === 'object' && 'code' in cause) {
          const errorCode = cause.code;
          if (errorCode === 'ENOTFOUND' || errorCode === 'EAI_AGAIN') {
            errorMessage = `DNS resolution failed for ${decodedUrl}. Host not found.`;
          } else {
            errorMessage = `Network error: ${errorCode}`;
          }
        }
      } else if (errorMessage.toLowerCase().includes('invalid url')) {
        // This case might be redundant if URL validation above is robust
        errorMessage = `Invalid URL format: ${decodedUrl}`;
        // statusCode could be 400
      }
    }

    return NextResponse.json({
      status: 'down',
      statusCode: statusCode, 
      statusText: 'Error',
      responseTime,
      error: errorMessage,
      details: error instanceof Error ? error.message : 'No additional details', // Safer access to message
      lastChecked: new Date().toISOString(),
      requestedUrl: decodedUrl,
      serverRegion, // Add server region to error response
    }, { status: 500 }); // Use 500 for server-side errors during fetch
  }
}
