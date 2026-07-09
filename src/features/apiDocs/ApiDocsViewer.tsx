'use client';

import { useEffect, useRef } from 'react';

export function ApiDocsViewer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;

    import('swagger-ui-dist').then(({ SwaggerUIBundle, SwaggerUIStandalonePreset }) => {
      if (disposed || !containerRef.current) return;
      SwaggerUIBundle({
        domNode: containerRef.current,
        url: '/api/openapi',
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        layout: 'StandaloneLayout',
      });
    });

    return () => {
      disposed = true;
    };
  }, []);

  return <div ref={containerRef} />;
}
