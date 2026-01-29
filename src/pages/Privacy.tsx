import SEO from '@/components/SEO';

export default function Privacy() {
  return (
    <>
      <SEO 
        title="Privacy Policy"
        description="Read Houses Adda's Privacy Policy. Learn how we collect, use, and protect your personal information on our real estate platform."
        url="/privacy"
      />
    <div className="min-h-screen bg-background">
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-2">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none mt-8">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
              <p className="text-muted-foreground mb-4">
                We collect information that you provide directly to us, including when you create an account, 
                search for properties, contact property owners, or communicate with us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">
                We use the information we collect to provide, maintain, and improve our services, 
                process transactions, send communications, and personalize your experience.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
              <p className="text-muted-foreground mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share 
                information with service providers who assist us in operating our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
              <p className="text-muted-foreground mb-4">
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Cookies</h2>
              <p className="text-muted-foreground mb-4">
                We use cookies to enhance your experience, analyze site usage, and assist in our marketing 
                efforts. You can control cookies through your browser settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                You have the right to access, update, or delete your personal information at any time. 
                Please contact us if you wish to exercise these rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy, please contact us at 
                <a href="mailto:info@housesadda.in" className="text-primary hover:underline"> info@housesadda.in</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
