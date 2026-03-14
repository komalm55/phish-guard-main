import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ApiStatus {
  name: string;
  status: 'online' | 'error' | 'missing' | 'testing';
  message?: string;
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const VIRUSTOTAL_KEY = process.env.VIRUSTOTAL_KEY || '';
  const GOOGLE_SAFE_BROWSING_KEY = process.env.GOOGLE_SAFE_BROWSING_KEY || '';
  const PHISHTANK_KEY = process.env.PHISHTANK_KEY || '';
  const IPQUALITYSCORE_KEY = process.env.IPQUALITYSCORE_KEY || '';
  const CLOUDMERSIVE_KEY = process.env.CLOUDMERSIVE_KEY || '';
  const URLHAUS_KEY = process.env.URLHAUS_KEY || '';

  const results: ApiStatus[] = [];
  const testUrl = 'http://example.com';

  // 1. VirusTotal
  if (VIRUSTOTAL_KEY) {
    try {
      const encodedId = Buffer.from(testUrl).toString('base64').replace(/=/g, '');
      const r = await fetch(`https://www.virustotal.com/api/v3/urls/${encodedId}`, {
        method: 'GET', headers: { 'x-apikey': VIRUSTOTAL_KEY, 'Accept': 'application/json' },
      });
      results.push({ name: 'VirusTotal', status: r.ok || r.status === 404 ? 'online' : 'error', message: r.ok || r.status === 404 ? 'Connected API' : `HTTP Error ${r.status}` });
    } catch (e: any) { results.push({ name: 'VirusTotal', status: 'error', message: e.message }); }
  } else { results.push({ name: 'VirusTotal', status: 'missing', message: 'API Key not configured in Vercel env' }); }

  // 2. Google Safe Browsing
  if (GOOGLE_SAFE_BROWSING_KEY) {
    try {
      const payload = { client: { clientId: 'phishguard', clientVersion: '1.0.0' }, threatInfo: { threatTypes: ['MALWARE'], platformTypes: ['ANY_PLATFORM'], threatEntryTypes: ['URL'], threatEntries: [{ url: testUrl }] } };
      const r = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GOOGLE_SAFE_BROWSING_KEY}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      results.push({ name: 'Google Safe Browsing', status: r.ok ? 'online' : 'error', message: r.ok ? 'Connected API' : `HTTP Error ${r.status}` });
    } catch (e: any) { results.push({ name: 'Google Safe Browsing', status: 'error', message: e.message }); }
  } else { results.push({ name: 'Google Safe Browsing', status: 'missing', message: 'API Key not configured in Vercel env' }); }

  // 3. PhishTank
  if (PHISHTANK_KEY && PHISHTANK_KEY !== 'your_phishtank_key_here') {
    try {
      const r = await fetch('https://checkurl.phishtank.com/checkurl/', {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ url: testUrl, format: 'json', app_key: PHISHTANK_KEY }).toString(),
      });
      results.push({ name: 'PhishTank', status: r.ok ? 'online' : 'error', message: r.ok ? 'Connected API' : `HTTP Error ${r.status}` });
    } catch (e: any) { results.push({ name: 'PhishTank', status: 'error', message: e.message }); }
  } else { results.push({ name: 'PhishTank', status: 'missing', message: 'API Key not configured in Vercel env' }); }

  // 4. IPQualityScore
  if (IPQUALITYSCORE_KEY) {
    try {
      const r = await fetch(`https://www.ipqualityscore.com/api/json/url/${IPQUALITYSCORE_KEY}/${encodeURIComponent(testUrl)}`);
      results.push({ name: 'IPQualityScore', status: r.ok ? 'online' : 'error', message: r.ok ? 'Connected API' : `HTTP Error ${r.status}` });
    } catch (e: any) { results.push({ name: 'IPQualityScore', status: 'error', message: e.message }); }
  } else { results.push({ name: 'IPQualityScore', status: 'missing', message: 'API Key not configured in Vercel env' }); }

  // 5. Cloudmersive
  if (CLOUDMERSIVE_KEY && CLOUDMERSIVE_KEY !== 'your_cloudmersive_key_here') {
    try {
      const r = await fetch('https://api.cloudmersive.com/virus/scan/website', {
        method: 'POST', headers: { 'Apikey': CLOUDMERSIVE_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ Url: testUrl }),
      });
      results.push({ name: 'Cloudmersive', status: r.ok ? 'online' : 'error', message: r.ok ? 'Connected API' : `HTTP Error ${r.status}` });
    } catch (e: any) { results.push({ name: 'Cloudmersive', status: 'error', message: e.message }); }
  } else { results.push({ name: 'Cloudmersive', status: 'missing', message: 'API Key not configured in Vercel env' }); }

  // 6. URLhaus
  if (URLHAUS_KEY) {
    try {
      const r = await fetch('https://urlhaus-api.abuse.ch/v1/url/', {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ url: testUrl }).toString(),
      });
      results.push({ name: 'URLhaus', status: r.ok ? 'online' : 'error', message: r.ok ? 'Connected API' : `HTTP Error ${r.status}` });
    } catch (e: any) { results.push({ name: 'URLhaus', status: 'error', message: e.message }); }
  } else { results.push({ name: 'URLhaus', status: 'missing', message: 'API Key not configured in Vercel env' }); }

  return res.json({ results });
}
