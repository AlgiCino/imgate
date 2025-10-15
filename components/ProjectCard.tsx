'use client';
import { Check, Scale } from 'lucide-react';
import { useEffect, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

type Project = {
  id: string;
  developer: string;
  title: string;
  location: string;
  price: string;
  image: string;
  link: string;
  slug?: string;
  gallery?: string[];
  tags?: string[];
};

export default function ProjectCard({ p }: { p: Project }) {
  const [open, setOpen] = useState(false);
  const [isInComparison, setIsInComparison] = useState(false);
  const slides = (p.gallery || []).map((src) => ({ src }));

  // Check if project is in comparison
  useEffect(() => {
    const stored = localStorage.getItem('comparisonProjects');
    if (stored) {
      try {
        const projects = JSON.parse(stored);
        setIsInComparison(projects.some((proj: Project) => proj.id === p.id));
      } catch (e) {
        console.error('Failed to parse comparison projects:', e);
      }
    }
  }, [p.id]);

  const toggleComparison = () => {
    const stored = localStorage.getItem('comparisonProjects');
    let projects: Project[] = [];
    
    if (stored) {
      try {
        projects = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse comparison projects:', e);
      }
    }

    if (isInComparison) {
      // Remove from comparison
      projects = projects.filter((proj: Project) => proj.id !== p.id);
      setIsInComparison(false);
    } else {
      // Add to comparison (max 4)
      if (projects.length >= 4) {
        alert('Maximum 4 properties can be compared. Please remove one first.');
        return;
      }
      projects.push(p);
      setIsInComparison(true);
    }

    localStorage.setItem('comparisonProjects', JSON.stringify(projects));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('comparisonUpdated'));
  };

  return (
    <div className="group glass rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] border border-transparent hover:border-[#D4AF37]">
      <div className="relative h-56 md:h-64 overflow-hidden">
        <img
          src={p.image || '/images/default-project.svg'}
          alt={p.title}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/images/default-project.svg';
          }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
        />
        <div className="absolute top-3 left-3 chip">{p.developer}</div>
      </div>
      <div className="p-4 md:p-5">
        <h3 className="text-lg md:text-xl font-semibold tracking-tight">{p.title}</h3>
        <p className="text-white/70 text-sm mt-1">
          {p.location} • {p.price || 'Price on request'}
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {p.tags?.map((t) => (
            <span key={t} className="text-xs text-white/80 border border-white/10 rounded-full px-2 py-1">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <a
            href={p.link ?? `/projects/${p.slug ?? p.id}`}
            className="btn-ghost flex-1 text-center"
          >
            View Details
          </a>
          <button 
            onClick={toggleComparison}
            className={`${
              isInComparison 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-white/10 hover:bg-white/20'
            } text-white rounded-full px-4 py-3 transition-all duration-200 flex items-center justify-center`}
            title={isInComparison ? 'Remove from comparison' : 'Add to comparison'}
          >
            {isInComparison ? <Check size={18} /> : <Scale size={18} />}
          </button>
          {p.gallery && p.gallery.length > 0 && (
            <button 
              onClick={() => setOpen(true)} 
              className="bg-white/10 hover:bg-white/20 text-white rounded-full px-4 py-3 transition-colors"
              title="View gallery"
            >
              Gallery
            </button>
          )}
          {/* New button to add to board */}
          <button
            onClick={() => {
              const stored = localStorage.getItem('boardNotes');
              let notes: any[] = [];
              if (stored) {
                try {
                  notes = JSON.parse(stored);
                } catch (e) {
                  console.error('Failed to parse board notes:', e);
                }
              }
              // Check if already exists
              if (!notes.some((n) => n.projectId === p.id)) {
                notes.push({
                  projectId: p.id,
                  note: '',
                  tags: [],
                  createdAt: new Date().toISOString(),
                });
                localStorage.setItem('boardNotes', JSON.stringify(notes));
                window.dispatchEvent(new CustomEvent('boardUpdated'));
              }
            }}
            className="bg-white/10 hover:bg-white/20 text-white rounded-full px-4 py-3 transition-colors"
            title="Add to Board"
          >
            Board
          </button>
        </div>
      </div>
      <Lightbox open={open} close={() => setOpen(false)} slides={slides} />
    </div>
  );
}
