'use client';

import { useState, useEffect } from 'react';
import { AdminJournal } from '../types';
import { AdminApiService } from '../services/adminApi';

export function useJournals() {
  const [journals, setJournals] = useState<AdminJournal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJournals() {
      const data = await AdminApiService.getJournals();
      setJournals(data);
      setLoading(false);
    }
    loadJournals();
  }, []);

  const toggleJournalMode = (journalId: string) => {
    setJournals((prev) =>
      prev.map((j) =>
        j.id === journalId
          ? {
              ...j,
              mode:
                j.mode === 'PUBLISHING_MODE'
                  ? 'PREPARATION_MODE'
                  : 'PUBLISHING_MODE',
            }
          : j
      )
    );
  };

  return { journals, loading, toggleJournalMode };
}
