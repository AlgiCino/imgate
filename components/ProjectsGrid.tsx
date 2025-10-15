'use client';
import { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';

interface Project {
  id: string;
  title: string;
  developer: string;
  location: string;
  price: string;
  image: string;
  link: string;
}

export default function ProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/dubai/projects');
        if (res.ok) {
          const data = await res.json();
          setProjects(data.projects || []);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-black/90">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-gold mx-auto mb-4"></div>
          <p className="text-white/60">Loading projects...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-black/90">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="heading text-center mb-12">Featured Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.slice(0, 8).map((project) => (
            <ProjectCard key={project.id} p={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
