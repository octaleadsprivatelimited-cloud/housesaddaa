import { useState } from 'react';
import { X } from 'lucide-react';
import SEO from '@/components/SEO';
import { cn } from '@/lib/utils';

const galleryImages = [
  { id: '1', src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', alt: 'Luxury apartment living room' },
  { id: '2', src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', alt: 'Modern kitchen' },
  { id: '3', src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', alt: 'Spacious bedroom' },
  { id: '4', src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', alt: 'Contemporary villa exterior' },
  { id: '5', src: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800', alt: 'Premium bathroom' },
  { id: '6', src: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800', alt: 'Elegant dining area' },
  { id: '7', src: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800', alt: 'Apartment balcony view' },
  { id: '8', src: 'https://images.unsplash.com/photo-1600217979540-6b0c5d1e6f26?w=800', alt: 'Modern living space' },
  { id: '9', src: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800', alt: 'Interior design detail' },
  { id: '10', src: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800', alt: 'House exterior' },
  { id: '11', src: 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800', alt: 'Cozy interior' },
  { id: '12', src: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800', alt: 'Luxury home interior' },
];

export default function Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

  const openLightbox = (img: typeof galleryImages[0]) => {
    setSelectedImage(img);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
  };

  const goNext = () => {
    if (!selectedImage) return;
    const idx = galleryImages.findIndex((i) => i.id === selectedImage.id);
    const next = galleryImages[(idx + 1) % galleryImages.length];
    setSelectedImage(next);
  };

  const goPrev = () => {
    if (!selectedImage) return;
    const idx = galleryImages.findIndex((i) => i.id === selectedImage.id);
    const prev = galleryImages[(idx - 1 + galleryImages.length) % galleryImages.length];
    setSelectedImage(prev);
  };

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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {galleryImages.map((img) => (
              <button
                key={img.id}
                type="button"
                onClick={() => openLightbox(img)}
                className="aspect-square rounded-2xl overflow-hidden bg-[#E5E5E5] group focus:outline-none focus:ring-2 focus:ring-[#E10600] focus:ring-offset-2"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </button>
            ))}
          </div>
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
              src={selectedImage.src.replace('w=800', 'w=1200')}
              alt={selectedImage.alt}
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
