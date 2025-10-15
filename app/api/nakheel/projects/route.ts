import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

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
  const fallbackPath = path.join(process.cwd(), 'data', 'nakheel_projects_fallback.json');
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
      developer: 'Nakheel',
      id: p.id ?? undefined,
    }));
  } catch {
    return [];
  }
}

async function fetchLiveProjects(): Promise<Project[]> {
  try {
    const html = await axios.get('https://www.nakheel.com/en/new-launches', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept':
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Referer': 'https://www.google.com/',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(html.data);
    const projects: Project[] = [];

    $('.project-card, .property-card, .card').each((_, el) => {
      const title = $(el).find('h3, .title, .name').first().text().trim();
      const location = $(el).find('.location, .area, p').first().text().trim() || 'Dubai, UAE';
      const priceText = $(el).find('.price, .starting-price').first().text().trim();
      const price = priceText || 'Price on request';
      const link = $(el).find('a').first().attr('href') || '';
      const image =
        $(el).find('img').first().attr('src') ||
        $(el).find('img').first().attr('data-src') ||
        '';

      if (title && title.length > 3) {
        projects.push({
          title,
          location,
          price,
          image: image.startsWith('http') ? image : image ? `https://www.nakheel.com${image}` : '',
          link: link.startsWith('http') ? link : link ? `https://www.nakheel.com${link}` : '#',
          developer: 'Nakheel',
        });
      }
    });

    return projects;
  } catch (err) {
    console.error('Live scraping failed:', err);
    return [];
  }
}

export async function GET() {
  let source = 'fallback';
  try {
    let projects = await readFallback();
    if (!projects.length) {
      const live = await fetchLiveProjects();
      if (live.length) {
        projects = live;
        source = 'scraped';
        const fallbackPath = path.join(process.cwd(), 'data', 'nakheel_projects_fallback.json');
        await fs.writeFile(fallbackPath, JSON.stringify(live, null, 2));
      }
    }

    const headers = {
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=300',
    };

    return NextResponse.json(
      {
        status: 'success',
        source,
        count: projects.length,
        projects,
        data: projects,
      },
      { headers }
    );
  } catch (error) {
    console.error('Nakheel projects route failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch Nakheel projects',
        projects: [],
        data: [],
        count: 0,
      },
      { status: 500 }
    );
  }
}