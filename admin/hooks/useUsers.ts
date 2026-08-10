'use client';

import { useState, useEffect } from 'react';
import { AdminUser } from '../types';
import { AdminApiService } from '../services/adminApi';

export function useUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      const data = await AdminApiService.getUsers();
      setUsers(data);
      setLoading(false);
    }
    loadUsers();
  }, []);

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' }
          : u
      )
    );
  };

  return { users, loading, toggleUserStatus };
}
