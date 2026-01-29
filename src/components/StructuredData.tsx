import { useEffect } from 'react';

interface StructuredDataProps {
  type?: 'Organization' | 'WebSite' | 'RealEstateAgent' | 'ItemList';
  data?: Record<string, any>;
}

export function StructuredData({ type = 'WebSite', data }: StructuredDataProps) {
  useEffect(() => {
    const defaultData = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    };

    // Remove existing structured data script
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(defaultData);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.querySelector('script[type="application/ld+json"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, data]);

  return null;
}

export default StructuredData;
