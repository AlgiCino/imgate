'use client';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import FavoriteButton from '@/components/FavoriteButton';
import { Scale } from 'lucide-react';

// تعريف نوع البيانات للمشروع
interface Project {
  id: string;
  title: string;
  developer: string;
  location: string;
  link: string;
  image: string;
  images?: string[];
  price: string;
  description?: string;
  features?: string[];
  tags?: string[];
  map_url?: string;
  contact_info?: {
    phone?: string;
    email?: string;
    whatsapp?: string;
  };
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/dubai/projects`, {
          cache: 'no-store',
        });

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();
        const foundProject = data.projects?.find(
          (p: Project) =>
            p.id?.toString() === params.id ||
            p.title?.toLowerCase().replace(/\s+/g, '-') === params.id
        );

        setProject(foundProject || null);
      } catch (error) {
        console.error('Failed to fetch project:', error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-gold mx-auto mb-4"></div>
          <p className="text-white/60">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  // Prepare gallery images with proper error handling
  const galleryImages = project.images && project.images.length > 0 
    ? project.images.filter((_, index) => !imageErrors.has(index))
    : project.image 
    ? [project.image] 
    : [];

  const lightboxSlides = galleryImages.map((src) => ({ src }));

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center">
        {project.image && (
          <div className="absolute inset-0">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{project.title}</h1>
          <p className="text-xl md:text-2xl text-brand-gold font-medium mb-2">{project.price}</p>
          <p className="text-lg text-white/80 mb-6">{project.location}</p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <span className="bg-brand-gold text-black px-4 py-2 rounded-full font-medium">
              {project.developer}
            </span>
            {project.tags?.map((tag, index) => (
              <span key={index} className="bg-white/10 text-white px-4 py-2 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          {/* Action Buttons */}
          <div className="flex justify-center gap-3">
            <FavoriteButton projectId={project.id} size="lg" showLabel />
            <button
              onClick={() => {
                const stored = localStorage.getItem('comparisonProjects');
                let projects = [];
                try {
                  projects = stored ? JSON.parse(stored) : [];
                } catch (e) {
                  projects = [];
                }
                if (projects.length >= 4) {
                  alert('Maximum 4 properties can be compared');
                  return;
                }
                if (projects.find((p: any) => p.id === project.id)) {
                  alert('This property is already in comparison');
                  return;
                }
                projects.push(project);
                localStorage.setItem('comparisonProjects', JSON.stringify(projects));
                window.dispatchEvent(new CustomEvent('comparisonUpdated'));
                alert('Added to comparison!');
              }}
              className="bg-white/10 hover:bg-white/20 text-white rounded-full px-6 py-3 font-medium transition-colors flex items-center gap-2"
            >
              <Scale size={20} />
              <span>Add to Compare</span>
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8 md:space-y-12">
              {/* Image Carousel Gallery */}
              {galleryImages.length > 0 && (
                <div className="mb-8 md:mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Gallery</h2>
                  
                  {/* Main Featured Image */}
                  <div className="relative mb-4 rounded-2xl overflow-hidden group cursor-pointer"
                       onClick={() => openLightbox(0)}>
                    <div className="relative h-[300px] sm:h-[400px] md:h-[500px]">
                      {!imageErrors.has(0) ? (
                        <Image
                          src={galleryImages[0]}
                          alt={`${project.title} - Main Image`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          priority
                          onError={() => handleImageError(0)}
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                          <p className="text-white/40">Image unavailable</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      <div className="absolute bottom-4 right-4 glass-strong rounded-full px-4 py-2 text-sm">
                        Click to view full gallery
                      </div>
                    </div>
                  </div>

                  {/* Thumbnail Grid */}
                  {galleryImages.length > 1 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 md:gap-3">
                      {galleryImages.slice(1, 9).map((img, index) => (
                        <div
                          key={index + 1}
                          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                          onClick={() => openLightbox(index + 1)}
                        >
                          {!imageErrors.has(index + 1) ? (
                            <Image
                              src={img}
                              alt={`${project.title} - Thumbnail ${index + 2}`}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                              sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw"
                              onError={() => handleImageError(index + 1)}
                            />
                          ) : (
                            <div className="w-full h-full bg-white/5 flex items-center justify-center">
                              <span className="text-xs text-white/40">N/A</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                          {index === 7 && galleryImages.length > 9 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-white font-semibold">+{galleryImages.length - 9}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              {project.description && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">About This Project</h2>
                  <p className="text-white/80 leading-relaxed">{project.description}</p>
                </div>
              )}

              {/* Features */}
              {project.features && project.features.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Features & Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-brand-gold rounded-full" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Info */}
              <div className="glass-strong rounded-2xl p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-bold mb-4">Quick Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-white/60">Developer:</span>
                    <p className="font-medium">{project.developer}</p>
                  </div>
                  <div>
                    <span className="text-white/60">Location:</span>
                    <p className="font-medium">{project.location}</p>
                  </div>
                  <div>
                    <span className="text-white/60">Starting Price:</span>
                    <p className="font-medium text-brand-gold">{project.price}</p>
                  </div>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="glass-strong rounded-2xl p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-bold mb-4">Contact & Inquire</h3>
                <div className="space-y-3">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold w-full text-center block"
                  >
                    View on Developer Site
                  </a>

                  {project.contact_info?.whatsapp && (
                    <a
                      href={`https://wa.me/${project.contact_info.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost w-full text-center block"
                    >
                      WhatsApp Inquiry
                    </a>
                  )}

                  {project.contact_info?.phone && (
                    <a
                      href={`tel:${project.contact_info.phone}`}
                      className="btn-ghost w-full text-center block"
                    >
                      Call Now
                    </a>
                  )}
                </div>
              </div>

              {/* Map */}
              {project.map_url && (
                <div className="glass-strong rounded-2xl p-5 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold mb-4">Location</h3>
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <iframe
                      src={project.map_url}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${project.title} location map`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox for Full Gallery View */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxSlides}
        index={lightboxIndex}
        plugins={[Thumbnails, Zoom]}
        thumbnails={{
          position: 'bottom',
          width: 120,
          height: 80,
          border: 1,
          borderRadius: 4,
          padding: 0,
          gap: 16,
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
        }}
      />
    </div>
  );
}
