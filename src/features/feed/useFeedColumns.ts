'use client';

import { useState, useEffect } from 'react';

export function useFeedColumns(): number {
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    function update() {
      setColumns(window.innerWidth < 480 ? 2 : 3);
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return columns;
}
