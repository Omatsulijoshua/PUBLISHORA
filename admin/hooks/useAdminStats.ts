'use client';

import { useState, useEffect } from 'react';
import { AdminApiService } from '../services/adminApi';

export function useAdminStats() {
  const [health, setHealth] = useState<any>(null);
  const [financials, setFinancials] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const hData = await AdminApiService.getSystemHealth();
      const fData = await AdminApiService.getFinancials();
      setHealth(hData);
      setFinancials(fData);
      setLoading(false);
    }
    loadStats();
  }, []);

  return { health, financials, loading };
}
