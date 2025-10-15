import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export const revalidate = 3600;

interface Project {
  title: string;
  location: string;
  price: string;
  image: string;
  link: string;
  developer: string;
  id?: string | number;
}

async function readFallback(): Promise<Project[]> {
  const fallbackPath = path.join(process.cwd(), 'data', 'emaar_projects_fallback.json');
  try {
    const raw = await fs.readFile(fallbackPath, 'utf-8');
    const parsed = JSON.parse(raw);
    const items: Project[] = Array.isArray(parsed) ? parsed : parsed.projects ?? [];
    return items.map((p: any) => ({
      title: p.title ?? p.name ?? '',
      location: p.location ?? 'Dubai, UAE',
      price: p.price ?? p.starting_price ?? 'Price on request',
      image: p.image ?? '',
      link: p.link ?? '',
      developer: 'Emaar',
      id: p.id ?? undefined,
    }));
  } catch {
    return [];
  }
}

async function fetchLiveProjects(): Promise<Project[]> {
  try {
    const html = await axios.get('https://properties.emaar.com/en/?currency=AED&type=project', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(html.data);
    const projects: Project[] = [];

    $('a[href*="/properties/"]').each((_, el) => {
      const title = $(el).text().trim();
      const link = $(el).attr('href') || '#';
      const location = $(el).closest('.project-card').find('.location').text().trim() || 'Dubai, UAE';
      const image =
        $(el).find('img').attr('src') ||
        $(el).prev('img').attr('src') ||
        '';
      if (title && title.length > 5) {
        projects.push({
          title,
          location,
          price: 'Price on request',
          image: image.startsWith('http') ? image : image ? `https://properties.emaar.com${image}` : '',
          link: link.startsWith('http') ? link : `https://properties.emaar.com${link}`,
          developer: 'Emaar',
        });
      }
    });

    return projects;
  } catch (error) {
    console.error('Live scraping failed:', error);
    return [];
  }
}

export async function GET() {
  let source = 'fallback';
  try {
    // 1️⃣ جرب API الرسمي أولاً
    const apiKey = process.env.EMAAR_API_KEY;
    const apiBase = process.env.EMAAR_API_BASE || 'https://apidev.emaar.com';
    try {
      if (apiKey) {
        const res = await axios.get(`${apiBase}/etenantsales/dailysales`, {
          headers: { Authorization: `Bearer ${apiKey}` },
          timeout: 10000,
        });
        if (res.status === 200 && Array.isArray(res.data?.projects) && res.data.projects.length) {
          return NextResponse.json({
            status: 'success',
            source: 'api',
            count: res.data.projects.length,
            projects: res.data.projects,
            data: res.data.projects,
          });
        }
      }
    } catch (err) {
      console.warn('Emaar API unavailable, switching to scraping...');
    }

    // 2️⃣ fallback أو scraping
    let projects = await readFallback();
    if (!projects.length) {
      const live = await fetchLiveProjects();
      if (live.length) {
        projects = live;
        source = 'scraped';
        const fallbackPath = path.join(process.cwd(), 'data', 'emaar_projects_fallback.json');
        await fs.writeFile(fallbackPath, JSON.stringify(live, null, 2));
      }
    }

    const headers = { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=300' };
    return NextResponse.json(
      { status: 'success', source, count: projects.length, projects, data: projects },
      { headers }
    );
  } catch (error) {
    console.error('Emaar projects route failed:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch Emaar projects', projects: [], data: [], count: 0 },
      { status: 500 }
    );
  }
}