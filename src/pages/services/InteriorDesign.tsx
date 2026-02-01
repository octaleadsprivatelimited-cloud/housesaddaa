import { Link } from 'react-router-dom';
import { Palette, Ruler, FileCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';

const processSteps = [
  {
    step: 1,
    title: 'Consultation',
    desc: 'Understand your vision, preferences, and budget for the perfect design.',
    icon: Palette,
  },
  {
    step: 2,
    title: 'Design Planning',
    desc: 'Create detailed layouts, 3D visualizations, and material selections.',
    icon: Ruler,
  },
  {
    step: 3,
    title: 'Approval & Execution',
    desc: 'Finalize designs and begin implementation with quality craftsmanship.',
    icon: FileCheck,
  },
  {
    step: 4,
    title: 'Handover',
    desc: 'Complete walkthrough and handover of your beautifully designed space.',
    icon: Sparkles,
  },
];

export default function InteriorDesign() {
  return (
    <>
      <SEO
        title="Interior Design | Houses Adda"
        description="Transform your space with professional interior design services from Houses Adda. Modern, functional, and stunning designs for apartments and villas."
        url="/services/interior-design"
      />
      <div className="min-h-screen bg-[#F9F9F9]">
        {/* Hero */}
        <div className="bg-white border-b border-[#E5E5E5]">
          <div className="container-custom py-16 md:py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">Interior Design</h1>
              <p className="text-xl text-[#6B6B6B]">
                Create beautiful, functional spaces with our professional interior design services. From concept to completion, we bring your vision to life.
              </p>
            </div>
          </div>
        </div>

        <div className="container-custom py-16">
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Design Services Overview</h2>
            <p className="text-[#6B6B6B] mb-8 max-w-3xl leading-relaxed">
              Our interior design team specializes in residential spaces—apartments, villas, and independent homes. We combine aesthetics with functionality to deliver spaces that reflect your personality while maximizing comfort and usability.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {['Residential Interiors', 'Modular Kitchen Design', 'Wardrobe & Storage Solutions', 'Lighting Design', 'Furniture Curation', 'Space Planning'].map((service) => (
                <div key={service} className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E5E5]">
                  <span className="text-[#1A1A1A] font-semibold">{service}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8">Our Process</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map(({ step, title, desc, icon: Icon }) => (
                <div key={step} className="relative">
                  <div className="w-12 h-12 rounded-xl bg-[#FADADD] flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-[#E10600]" />
                  </div>
                  <span className="text-sm font-semibold text-[#E10600] mb-2 block">Step {step}</span>
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">{title}</h3>
                  <p className="text-[#6B6B6B] text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Gallery preview */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Gallery Preview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                '1600596542815-ffad4c1539a9',
                '1600607687939-ce8a6c25118c',
                '1600566753190-17f0baa2a6c3',
                '1600585154340-be6161a56a0c',
              ].map((id, i) => (
                <div key={id} className="aspect-square rounded-2xl bg-[#E5E5E5] overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-${id}?w=400&auto=format`}
                    alt={`Interior design ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <Button asChild variant="outline" className="mt-6 border-[#E10600] text-[#E10600] hover:bg-[#FADADD]">
              <Link to="/gallery">View Full Gallery</Link>
            </Button>
          </section>

          <div className="bg-white rounded-2xl p-8 md:p-12 text-center border border-[#E5E5E5] shadow-sm">
            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">Ready to Transform Your Space?</h3>
            <p className="text-[#6B6B6B] mb-6 max-w-xl mx-auto">
              Get in touch with our design team for a consultation. We'll help you create a space you'll love.
            </p>
            <Button asChild className="bg-[#E10600] hover:bg-[#B11226]">
              <Link to="/contact">Schedule Consultation</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
