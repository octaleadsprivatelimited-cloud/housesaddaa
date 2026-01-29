import SEO from '@/components/SEO';

export default function Terms() {
  return (
    <>
      <SEO 
        title="Terms of Service"
        description="Read Houses Adda's Terms of Service. Understand the terms and conditions for using our real estate platform and services."
        url="/terms"
      />
    <div className="min-h-screen bg-background">
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground mb-2">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none mt-8">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-4">
                By accessing and using Houses Adda, you accept and agree to be bound by the terms and 
                provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
              <p className="text-muted-foreground mb-4">
                Permission is granted to temporarily access the materials on Houses Adda's website 
                for personal, non-commercial transitory viewing only.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Property Listings</h2>
              <p className="text-muted-foreground mb-4">
                Houses Adda provides a platform for property listings. We do not guarantee the accuracy, 
                completeness, or reliability of any property information. Users should verify all 
                information independently.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
              <p className="text-muted-foreground mb-4">
                Users are responsible for maintaining the confidentiality of their account information 
                and for all activities that occur under their account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
              <p className="text-muted-foreground mb-4">
                Houses Adda shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use of or inability to use the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please contact us at 
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
