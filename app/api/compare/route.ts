import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { projectIds } = await request.json();

    if (!projectIds || !Array.isArray(projectIds) || projectIds.length === 0) {
      return NextResponse.json(
        { error: 'Project IDs are required' },
        { status: 400 }
      );
    }

    if (projectIds.length > 4) {
      return NextResponse.json(
        { error: 'Maximum 4 properties can be compared at once' },
        { status: 400 }
      );
    }

    // Fetch projects from the Dubai API
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/dubai/projects`,
      { cache: 'no-store' }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      );
    }

    const data = await res.json();
    const allProjects = data.projects || [];

    // Filter projects based on provided IDs
    const comparisonProjects = allProjects.filter((project: any) =>
      projectIds.includes(project.id) || 
      projectIds.includes(project.title?.toLowerCase().replace(/\s+/g, '-'))
    );

    if (comparisonProjects.length === 0) {
      return NextResponse.json(
        { error: 'No matching projects found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      projects: comparisonProjects,
      count: comparisonProjects.length,
    });
  } catch (error) {
    console.error('Comparison API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ids = searchParams.get('ids');

  if (!ids) {
    return NextResponse.json(
      { error: 'Project IDs are required as query parameter' },
      { status: 400 }
    );
  }

  const projectIds = ids.split(',').filter(Boolean);

  if (projectIds.length === 0) {
    return NextResponse.json(
      { error: 'At least one project ID is required' },
      { status: 400 }
    );
  }

  if (projectIds.length > 4) {
    return NextResponse.json(
      { error: 'Maximum 4 properties can be compared at once' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/dubai/projects`,
      { cache: 'no-store' }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch projects' },
        { status: 500 }
      );
    }

    const data = await res.json();
    const allProjects = data.projects || [];

    const comparisonProjects = allProjects.filter((project: any) =>
      projectIds.includes(project.id) || 
      projectIds.includes(project.title?.toLowerCase().replace(/\s+/g, '-'))
    );

    if (comparisonProjects.length === 0) {
      return NextResponse.json(
        { error: 'No matching projects found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      projects: comparisonProjects,
      count: comparisonProjects.length,
    });
  } catch (error) {
    console.error('Comparison API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
