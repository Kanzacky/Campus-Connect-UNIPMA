'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { adminApi } from '@/lib/api';
import type { DashboardStats } from '@/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<Record<string, unknown>[]>([]);
  const [recentKegiatan, setRecentKegiatan] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) { router.replace('/login'); return; }
    if (user?.role !== 'admin') { router.replace('/dashboard'); return; }

    adminApi.dashboard().then((res) => {
      if (res.data) {
        const data = res.data as {
          stats: DashboardStats;
          recentUsers: Record<string, unknown>[];
          recentKegiatan: Record<string, unknown>[];
        };
        setStats(data.stats);
        setRecentUsers(data.recentUsers);
        setRecentKegiatan(data.recentKegiatan);
      }
    }).catch(() => {});
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, color: 'bg-blue-500/10 text-blue-600' },
    { label: 'Admin', value: stats.totalAdmin, color: 'bg-purple-500/10 text-purple-600' },
    { label: 'Pengurus', value: stats.totalPengurus, color: 'bg-green-500/10 text-green-600' },
    { label: 'Anggota', value: stats.totalAnggota, color: 'bg-orange-500/10 text-orange-600' },
    { label: 'Organisasi', value: stats.totalOrganisasi, color: 'bg-teal-500/10 text-teal-600' },
    { label: 'Organisasi Aktif', value: stats.organisasiAktif, color: 'bg-emerald-500/10 text-emerald-600' },
    { label: 'Total Kegiatan', value: stats.totalKegiatan, color: 'bg-indigo-500/10 text-indigo-600' },
    { label: 'Kegiatan Bulan Ini', value: stats.kegiatanBulanIni, color: 'bg-pink-500/10 text-pink-600' },
    { label: 'Total Pengumuman', value: stats.totalPengumuman, color: 'bg-yellow-500/10 text-yellow-600' },
    { label: 'Pendaftar Baru (7 hari)', value: stats.pendaftarBaru, color: 'bg-red-500/10 text-red-600' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <h1 className="text-lg font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <button
              onClick={() => { localStorage.removeItem('token'); router.push('/login'); }}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="text-2xl font-bold">Overview</h2>

        {/* Stats Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {statCards.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold">User Terbaru</h3>
            <div className="mt-4 space-y-3">
              {recentUsers.map((u) => (
                <div key={u.id as number} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{u.name as string}</p>
                    <p className="text-muted-foreground">{u.email as string}</p>
                  </div>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{u.role as string}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold">Kegiatan Terbaru</h3>
            <div className="mt-4 space-y-3">
              {recentKegiatan.map((k) => (
                <div key={k.id as number} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{k.judul as string}</p>
                    <p className="text-muted-foreground">{(k.organisasi as { name: string })?.name}</p>
                  </div>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{k.status as string}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
