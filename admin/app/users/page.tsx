'use client';

import React from 'react';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useUsers } from '../../hooks/useUsers';
import { AdminUser } from '../../types';
import { Users, UserPlus, Shield, Mail, Globe } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export default function UsersPage() {
  const { users, loading, toggleUserStatus } = useUsers();

  const columns = [
    {
      header: 'User Name & Email',
      cell: (user: AdminUser) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            {user.fullName}
          </div>
          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
            <Mail className="w-3 h-3 text-blue-500" /> {user.email}
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      cell: (user: AdminUser) => (
        <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-500 font-bold border border-blue-500/20">
          {user.role}
        </span>
      ),
    },
    {
      header: 'Institution & Country',
      cell: (user: AdminUser) => (
        <div className="font-mono text-xs">
          <div className="text-slate-800 dark:text-slate-200">{user.institution || 'Independent'}</div>
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Globe className="w-3 h-3 text-emerald-500" /> Country Code: {user.country}
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (user: AdminUser) => <StatusBadge status={user.status} />,
    },
    {
      header: 'Actions',
      cell: (user: AdminUser) => (
        <button
          onClick={() => toggleUserStatus(user.id)}
          className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
        >
          {user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" /> Global User & Role Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
            Manage author accounts, editor permissions, reviewer privileges, and institutional super-admins.
          </p>
        </div>
        <button className="px-4 py-2.5 rounded-xl text-xs font-mono font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Provision Admin User
        </button>
      </div>

      <DataTable columns={columns} data={users} />
    </div>
  );
}
