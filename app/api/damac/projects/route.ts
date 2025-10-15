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
  const fallbackPath = path.join(process.cwd(), 'data', 'damac_projects_fallback.json');
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
      developer: 'DAMAC',
      id: p.id ?? undefined,
    }));
  } catch {
    return [];
  }
}

async function fetchLiveProjects(): Promise<Project[]> {
  try {
    const html = await axios.get('https://www.damacproperties.com/en/projects/', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept':
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Referer': 'https://www.google.com/',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(html.data);
    const projects: Project[] = [];

    $('.project-card, .property-card, .card, .project-item, [data-project]').each((_, el) => {
      const title =
        $(el).find('h3, .title, .name, .project-title').first().text().trim() ||
        $(el).find('a').attr('title') ||
        '';
      const location =
        $(el).find('.location, .area, .city, p').first().text().trim() || 'Dubai, UAE';
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
          image: image.startsWith('http')
            ? image
            : image
            ? `https://www.damacproperties.com${image}`
            : '',
          link: link.startsWith('http')
            ? link
            : link
            ? `https://www.damacproperties.com${link}`
            : '#',
          developer: 'DAMAC',
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
        const fallbackPath = path.join(process.cwd(), 'data', 'damac_projects_fallback.json');
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
    console.error('DAMAC projects route failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch DAMAC projects',
        projects: [],
        data: [],
        count: 0,
      },
      { status: 500 }
    );
  }
}