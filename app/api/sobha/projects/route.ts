import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import axios from 'axios';
import * as cheerio from 'cheerio';

// تمكين إعادة التحقق كل ساعة لمسار الراوت (يدعم Next.js Route Handlers)
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
  const fallbackPath = path.join(process.cwd(), 'data', 'sobha_projects_fallback.json');
  try {
    const raw = await fs.readFile(fallbackPath, 'utf-8');
    const parsed = JSON.parse(raw);

    // في بعض الأحيان قد يكون الملف ملف كائن يحتوي على مفتاح data
    const items: Project[] = Array.isArray(parsed) ? parsed : (parsed?.data ?? []);

    // ضمان الحقول الأساسية والتطبيع
    return items.map((p: any) => ({
      title: p.title ?? p.name ?? '',
      location: p.location ?? '',
      price: p.price ?? '',
      image: p.image ?? p.thumbnail ?? '',
      link: p.link ?? p.url ?? '',
      developer: p.developer ?? 'Sobha',
      id: p.id ?? undefined,
    }));
  } catch (error) {
    console.log('Fallback file not found or invalid, will try live scraping');
    return [];
  }
}

async function fetchLiveProjects(): Promise<Project[]> {
  try {
    const url = 'https://www.sobha.com/residential/';
    const { data } = await axios.get(url, { timeout: 15000 });
    const $ = cheerio.load(data);
    const projects: Project[] = [];

    $('section.in-focus .project, .city-list .project, .projects-grid .project, .project-list .project').each((_, el) => {
      const title = $(el).find('h3, h2').first().text().trim();
      const link = $(el).find('a').attr('href') || '';
      const image = $(el).find('img').attr('src') || '';
      if (title && link) {
        projects.push({
          title,
          location: '',
          price: '',
          image,
          link: link.startsWith('http') ? link : `https://www.sobha.com${link}`,
          developer: 'Sobha',
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
        const fallbackPath = path.join(process.cwd(), 'data', 'sobha_projects_fallback.json');
        await fs.writeFile(fallbackPath, JSON.stringify(live, null, 2));
      }
    }

    const headers = {
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=300',
    };

    return NextResponse.json(
      {
        status: 'success',
        count: projects.length,
        projects,
        data: projects,
        source,
      },
      { headers }
    );
  } catch (error) {
    console.error('Sobha projects route failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch Sobha projects',
        projects: [],
        data: [],
        count: 0,
      },
      { status: 500 }
    );
  }
}