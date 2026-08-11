'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Activity,
  DollarSign,
  ShieldCheck,
  Settings,
  Shield,
  Cpu,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Users & Roles', href: '/users', icon: Users },
  { name: 'Journals & Press', href: '/journals', icon: BookOpen },
  { name: 'Submissions Queue', href: '/submissions', icon: FileText },
  { name: 'AI Key Router', href: '/ai-router', icon: Cpu },
  { name: 'System Health', href: '/health', icon: Activity },
  { name: 'APC Financials', href: '/finance', icon: DollarSign },
  { name: 'Compliance & Audits', href: '/compliance', icon: ShieldCheck },
  { name: 'Platform Settings', href: '/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 glass-panel border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0 z-40 bg-slate-900 text-slate-100">
      {/* Admin Brand */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-blue-600 text-white font-bold">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-serif font-bold text-base text-white tracking-wide">
            PUBLISHORA
          </h1>
          <span className="text-[10px] font-mono text-blue-400 block font-semibold uppercase tracking-wider">
            Super-Admin Console
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium transition-all',
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              )}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Admin User Footer */}
      <div className="p-4 border-t border-slate-800 font-mono text-xs">
        <div className="p-3 rounded-xl bg-slate-800/50 space-y-1">
          <div className="text-white font-bold text-[11px]">Dr. Marcus Thorne</div>
          <div className="text-slate-400 text-[10px]">Super Administrator</div>
          <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
            Root System Access
          </span>
        </div>
      </div>
    </aside>
  );
}
