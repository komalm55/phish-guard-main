export interface ApiStatus {
  name: string;
  status: 'online' | 'error' | 'missing' | 'testing';
  message?: string;
}

export async function testApiConnections(): Promise<ApiStatus[]> {
  try {
    const response = await fetch('/api/test-api-connections');
    if (response.ok) {
      const data = await response.json() as { results: ApiStatus[] };
      return data.results;
    }
    return [{ name: 'API Server', status: 'error', message: `HTTP Error ${response.status}` }];
  } catch (e: any) {
    console.error('Vercel API test-api-connections failed:', e);
    return [
      { name: 'API Server', status: 'error', message: e.message || 'Failed to reach Vercel serverless functions. Is the project deployed?' }
    ];
  }
}
