import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Palette,
  Ruler,
  FileCheck,
  Sparkles,
  ArrowRight,
  Sofa,
  Lamp,
  Layers,
  LayoutGrid,
  Package,
  Loader2,
} from 'lucide-react';
import SEO from '@/components/SEO';
import { useServiceHighlights } from '@/hooks/useServiceHighlights';
import { getInteriorDesignGallery, type InteriorDesignGalleryImage } from '@/services/interiorDesignGalleryService';

const processSteps = [
  {
    step: 1,
    title: 'Consultation',
    description: 'Understand your vision, preferences, and budget for the perfect design.',
    icon: Palette,
  },
  {
    step: 2,
    title: 'Design Planning',
    description: 'Create detailed layouts, 3D visualizations, and material selections.',
    icon: Ruler,
  },
  {
    step: 3,
    title: 'Approval & Execution',
    description: 'Finalize designs and begin implementation with quality craftsmanship.',
    icon: FileCheck,
  },
  {
    step: 4,
    title: 'Handover',
    description: 'Complete walkthrough and handover of your beautifully designed space.',
    icon: Sparkles,
  },
];

const services = [
  { icon: Sofa, title: 'Residential Interiors', desc: 'Apartments, villas & homes' },
  { icon: LayoutGrid, title: 'Modular Kitchen Design', desc: 'Functional & stylish kitchens' },
  { icon: Layers, title: 'Wardrobe & Storage', desc: 'Smart storage solutions' },
  { icon: Lamp, title: 'Lighting Design', desc: 'Ambient & accent lighting' },
  { icon: Package, title: 'Furniture Curation', desc: 'Curated furniture selection' },
  { icon: Ruler, title: 'Space Planning', desc: 'Optimized layout design' },
];

export default function InteriorDesign() {
  const { highlights } = useServiceHighlights('interiorDesign');
  const [galleryImages, setGalleryImages] = useState<InteriorDesignGalleryImage[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  useEffect(() => {
    getInteriorDesignGallery()
      .then(setGalleryImages)
      .catch(() => setGalleryImages([]))
      .finally(() => setGalleryLoading(false));
  }, []);
  return (
    <>
      <SEO
        title="Interior Design | Houses Adda"
        description="Transform your space with professional interior design services from Houses Adda. Modern, functional, and stunning designs for apartments and villas."
        url="/services/interior-design"
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1A1A1A] via-[#2D2D2D] to-[#1A1A1A] text-white">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: "url('/independent-house-section-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50" />
          <div className="container-custom relative py-12 md:py-16 lg:py-20">
            <div className="max-w-3xl">
              <p className="text-[#E10600] text-sm font-semibold uppercase tracking-widest mb-4">
                Transform Your Space
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                Interior
                <span className="text-[#E10600]"> Design</span>
              </h1>
              <p className="text-lg md:text-xl text-white/85 leading-relaxed max-w-2xl">
                Create beautiful, functional spaces with our professional design services. From concept to completion, we bring your vision to life.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Highlights */}
        <section className="relative -mt-6 z-10">
          <div className="container-custom">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {highlights.map((h, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-lg border border-[#E5E5E5]">
                  <div className="text-2xl font-bold text-[#E10600] mb-1">{h.value}</div>
                  <div className="text-sm text-[#6B6B6B] font-medium">{h.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Overview & Services */}
        <section className="py-16 md:py-24">
          <div className="container-custom">
            <div className="max-w-3xl mb-12">
              <p className="text-[#E10600] text-sm font-semibold uppercase tracking-wider mb-3">
                Our Expertise
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-6">
                Design Services Overview
              </h2>
              <p className="text-[#6B6B6B] text-lg leading-relaxed">
                Our interior design team specializes in residential spaces—apartments, villas, and independent homes. We combine aesthetics with functionality to deliver spaces that reflect your personality while maximizing comfort.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((item) => (
                <div
                  key={item.title}
                  className="group p-6 rounded-2xl bg-[#F9F9F9] border border-[#E5E5E5] hover:bg-white hover:border-[#E10600]/20 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#E10600]/10 flex items-center justify-center mb-4 group-hover:bg-[#E10600] transition-colors">
                    <item.icon className="h-6 w-6 text-[#E10600] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-[#1A1A1A] text-lg mb-2">{item.title}</h3>
                  <p className="text-[#6B6B6B] text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-16 md:py-24">
          <div className="container-custom">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
              <div>
                <p className="text-[#E10600] text-sm font-semibold uppercase tracking-wider mb-2">
                  Our Work
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
                  Gallery Preview
                </h2>
              </div>
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 text-[#E10600] font-semibold hover:text-[#B11226] transition-colors"
              >
                View Full Gallery
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {galleryLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-10 w-10 animate-spin text-[#E10600]" />
              </div>
            ) : galleryImages.length === 0 ? (
              <p className="text-[#6B6B6B] py-8 text-center">Add images from Admin → Gallery → Interior Design Gallery.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((img, i) => (
                  <div
                    key={i}
                    className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#E5E5E5] group"
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.alt || 'Interior design'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Process */}
        <section className="py-16 md:py-24 bg-[#F9F9F9]">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-[#E10600] text-sm font-semibold uppercase tracking-wider mb-3">
                How We Work
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-4">
                Our Process
              </h2>
              <p className="text-[#6B6B6B]">
                From initial consultation to final handover, we guide you every step of the way.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map(({ step, title, description, icon: Icon }) => (
                <div key={step} className="relative">
                  <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5] hover:border-[#E10600]/20 hover:shadow-lg transition-all h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-[#E10600] text-white font-bold flex items-center justify-center shrink-0">
                        {step}
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-[#E10600]/10 flex items-center justify-center shrink-0">
                        <Icon className="h-6 w-6 text-[#E10600]" />
                      </div>
                    </div>
                    <h3 className="font-bold text-[#1A1A1A] text-lg mb-2">{title}</h3>
                    <p className="text-[#6B6B6B] text-sm leading-relaxed">{description}</p>
                  </div>
                  {step < 4 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-[#E5E5E5] -translate-y-1/2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
