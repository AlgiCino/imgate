'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Project {
  id: string;
  title: string;
  developer: string;
  location: string;
  price: string;
  image: string;
  link?: string;
  type?: string;
  status?: string;
}

export default function ComparisonTool() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const ids = searchParams.get('ids');
    if (ids) {
      fetchComparisonProjects(ids.split(','));
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchComparisonProjects = async (projectIds: string[]) => {
    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectIds }),
      });

      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Failed to fetch comparison:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeProject = (projectId: string) => {
    const updatedProjects = projects.filter((p) => p.id !== projectId);
    setProjects(updatedProjects);
    
    if (updatedProjects.length === 0) {
      router.push('/');
    } else {
      const newIds = updatedProjects.map((p) => p.id).join(',');
      router.push(`/compare?ids=${newIds}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-gold mx-auto mb-4"></div>
          <p className="text-white/60">Loading comparison...</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <h2 className="text-2xl font-bold mb-4">No Properties Selected</h2>
          <p className="text-white/70 mb-6">
            Please select properties from the main page to compare them.
          </p>
          <button onClick={() => router.push('/')} className="btn-gold">
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-white/70 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <h1 className="text-3xl md:text-5xl font-bold mb-8">Compare Properties</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="glass rounded-2xl overflow-hidden relative">
              <button
                onClick={() => removeProject(project.id)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <X size={16} />
              </button>

              <div className="relative h-56">
                <Image
                  src={project.image || '/images/default-project.svg'}
                  alt={project.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/default-project.svg';
                  }}
                />
                <div className="absolute bottom-3 left-3 chip">{project.developer}</div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Location:</span>
                    <span>{project.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Price:</span>
                    <span className="text-brand-gold">{project.price}</span>
                  </div>
                  {project.type && (
                    <div className="flex justify-between">
                      <span className="text-white/70">Type:</span>
                      <span>{project.type}</span>
                    </div>
                  )}
                  {project.status && (
                    <div className="flex justify-between">
                      <span className="text-white/70">Status:</span>
                      <span>{project.status}</span>
                    </div>
                  )}
                </div>

                <a
                  href={`/projects/${project.id}`}
                  className="btn-gold w-full text-center mt-4 block"
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
