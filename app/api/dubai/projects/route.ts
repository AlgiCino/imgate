import axios from 'axios';
import { NextResponse } from 'next/server';

/**
 * 🏙️ Unified Dubai Projects API
 * Aggregates live project data from Emaar, DAMAC, Sobha, and Nakheel routes.
 * Ensures consistent structure and automatic fallback in case any API fails.
 */

export const revalidate = 1800; // Cache results for 30 minutes

/**
 * اختيار أفضل رابط صورة متاح من المشروع
 */
function pickFirstImg(p: any): string {
  // prefer an explicitly provided image, otherwise return the app's svg fallback
  if (!p) return '/images/default-project.svg';
  const isValid = (url: string) => typeof url === 'string' && /\.(jpe?g|png|webp|jpeg|svg)$/i.test(url);

  const candidates = [
    p.image,
    ...(Array.isArray(p.images) ? p.images : []),
    ...(Array.isArray(p.gallery) ? p.gallery : []),
    p.imageUrl,
  ].filter(Boolean);

  const found = candidates.find(isValid);
  return found || '/images/default-project.svg';
}

export async function GET() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const sources = [
    { name: 'Emaar', url: `${base}/api/emaar/projects` },
    { name: 'DAMAC', url: `${base}/api/damac/projects` },
    { name: 'Sobha', url: `${base}/api/sobha/projects` },
    { name: 'Nakheel', url: `${base}/api/nakheel/projects` },
  ];

  try {
    const results = await Promise.allSettled(
      sources.map((s) => axios.get(s.url, { timeout: 10000 }))
    );

    const allProjects: any[] = [];

    for (let i = 0; i < results.length; i++) {
      const res = results[i];
      const developer = sources[i].name;

      if (res.status === 'fulfilled' && res.value?.data?.projects && Array.isArray(res.value.data.projects)) {
        const data = res.value.data.projects;

        for (const p of data) {
          allProjects.push({
            id: p.id ?? (p.title || p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            title: p.title || p.name || 'Untitled Project',
            developer,
            location: p.location || 'Dubai, UAE',
            link: p.link || p.url || '#',
            image: pickFirstImg(p),
            price: p.starting_price || p.price || p.priceMinAED || p.priceMaxAED || 'N/A',
          });
        }
      } else {
        console.warn(`⚠️ Failed to fetch ${developer} projects`, res);
      }
    }

    // فرز المشاريع حسب المطور ثم الاسم
    allProjects.sort((a, b) => {
      if (a.developer === b.developer) return a.title.localeCompare(b.title);
      return a.developer.localeCompare(b.developer);
    });

    return NextResponse.json({
      status: 'success',
      count: allProjects.length,
      projects: allProjects,
    });
  } catch (err: any) {
    console.error('❌ Unified API Error:', err?.message || err);
    return NextResponse.json(
      { status: 'error', message: 'Failed to load Dubai projects.' },
      { status: 500 }
    );
  }
}