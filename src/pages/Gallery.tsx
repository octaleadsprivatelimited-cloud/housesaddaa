import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import SEO from '@/components/SEO';
import { cn } from '@/lib/utils';
import { getGalleryVideos } from '@/services/galleryVideoService';
import { getGallerySectionVideos } from '@/services/gallerySectionVideoService';
import { getMainGalleryImages } from '@/services/mainGalleryService';
import type { MainGalleryImage } from '@/services/mainGalleryService';
import { GalleryVideo } from '@/types/property';
import type { GallerySectionVideo } from '@/services/gallerySectionVideoService';

export default function Gallery() {
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [mainSectionVideos, setMainSectionVideos] = useState<GallerySectionVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [galleryImages, setGalleryImages] = useState<MainGalleryImage[]>([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([getGalleryVideos(), getGallerySectionVideos('main')])
      .then(([siteVideos, mainVideos]) => {
        setVideos(siteVideos);
        setMainSectionVideos(mainVideos);
      })
      .catch(() => { setVideos([]); setMainSectionVideos([]); })
      .finally(() => setVideosLoading(false));
  }, []);

  useEffect(() => {
    getMainGalleryImages()
      .then(setGalleryImages)
      .catch(() => setGalleryImages([]))
      .finally(() => setImagesLoading(false));
  }, []);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedIndex(null);
  };

  const goNext = () => {
    if (selectedIndex === null || galleryImages.length === 0) return;
    setSelectedIndex((selectedIndex + 1) % galleryImages.length);
  };

  const goPrev = () => {
    if (selectedIndex === null || galleryImages.length === 0) return;
    setSelectedIndex((selectedIndex - 1 + galleryImages.length) % galleryImages.length);
  };

  const selectedImage = selectedIndex !== null ? galleryImages[selectedIndex] : null;

  return (
    <>
      <SEO
        title="Gallery | Houses Adda"
        description="Explore our gallery of premium properties, interiors, and real estate projects. Find inspiration for your dream home."
        url="/gallery"
      />
      <div className="min-h-screen bg-[#F9F9F9]">
        <div className="container-custom py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">Gallery</h1>
            <p className="text-xl text-[#6B6B6B] max-w-2xl mx-auto">
              Explore our collection of premium properties and interior designs.
            </p>
          </div>

          {/* YouTube Videos - from admin */}
          {videosLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#E10600]" />
            </div>
          ) : (videos.length > 0 || mainSectionVideos.length > 0) ? (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Videos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <div key={video.id} className="rounded-2xl overflow-hidden bg-white shadow-sm border border-[#EEE]">
                    <div className="aspect-video bg-[#1a1a1a] relative">
                      <iframe
                        title={video.title}
                        src={`https://www.youtube.com/embed/${video.videoId}`}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-[#1A1A1A]">{video.title}</h3>
                    </div>
                  </div>
                ))}
                {mainSectionVideos.map((video) => (
                  <div key={video.id} className="rounded-2xl overflow-hidden bg-white shadow-sm border border-[#EEE]">
                    <div className="aspect-video bg-[#1a1a1a] relative">
                      <iframe
                        title={video.title}
                        src={`https://www.youtube.com/embed/${video.videoId}`}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-[#1A1A1A]">{video.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Photos</h2>
          {imagesLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#E10600]" />
            </div>
          ) : galleryImages.length === 0 ? (
            <p className="text-[#6B6B6B] py-8 text-center">No photos yet. Add images from Admin → Gallery → Main Gallery Photos.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {galleryImages.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => openLightbox(index)}
                  className="aspect-square rounded-2xl overflow-hidden bg-[#E5E5E5] group focus:outline-none focus:ring-2 focus:ring-[#E10600] focus:ring-offset-2"
                >
                  <img
                    src={img.imageUrl}
                    alt={img.alt || 'Gallery'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 transition-opacity duration-300',
          lightboxOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeLightbox}
      >
        <button
          type="button"
          onClick={closeLightbox}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
        {selectedImage && (
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.imageUrl.includes('w=') ? selectedImage.imageUrl.replace(/w=\d+/, 'w=1200') : selectedImage.imageUrl}
              alt={selectedImage.alt || 'Gallery'}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
              {selectedImage.alt}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
