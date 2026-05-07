'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, Building2, Calendar, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/layouts/app-layout';
import { adminApi } from '@/lib/api';
import { Spinner } from '@/components/ui/spinner';

interface Stats {
    totalUsers: number;
    totalAdmin: number;
    totalPengurus: number;
    totalAnggota: number;
    totalOrganisasi: number;
    organisasiAktif: number;
    totalKegiatan: number;
    kegiatanBulanIni: number;
    totalPengumuman: number;
    pendaftarBaru: number;
}

interface RecentUser {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

interface RecentKegiatan {
    id: number;
    judul: string;
    status: string;
    tanggal_mulai: string;
    organisasi?: { id: number; name: string };
}

type OrganisasiOverview = {
    id: number;
    name: string;
    category: string;
    status: 'aktif' | 'nonaktif';
    ketua: string;
    anggota_aktif_count: number;
    pendaftar_count: number;
    pendaftar: { id: number; name: string; email: string; nim?: string | null }[];
};

type UserSnapshot = {
    id: number;
    name: string;
    email: string;
    role: string;
    nim?: string | null;
    created_at: string;
};

const breadcrumbs = [{ title: 'Admin Dashboard', href: '/admin' }];

function StatCard({ title, value, icon: Icon, tone = 'primary', subtitle }: {
    title: string;
    value: number;
    icon: React.ElementType;
    tone?: 'primary' | 'amber' | 'neutral';
    subtitle?: string;
}) {
    const tones: Record<string, { text: string; iconWrap: string }> = {
        primary: { text: 'text-primary', iconWrap: 'bg-primary/10' },
        amber: { text: 'text-amber-700 dark:text-amber-400', iconWrap: 'bg-amber-400/15 dark:bg-amber-400/10' },
        neutral: { text: 'text-zinc-800 dark:text-zinc-100', iconWrap: 'bg-zinc-500/10' },
    };
    const t = tones[tone] ?? tones.primary;

    return (
        <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</p>
                    <p className={`mt-2 text-3xl font-bold ${t.text}`}>{value.toLocaleString('id-ID')}</p>
                    {subtitle && (
                        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">{subtitle}</p>
                    )}
                </div>
                <div className={`rounded-lg p-3 ${t.iconWrap}`}>
                    <Icon className={`h-6 w-6 ${t.text}`} />
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        draft: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
        published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        selesai: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        pengurus: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        anggota: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    };

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status] || styles.draft}`}>
            {status}
        </span>
    );
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [recentKegiatan, setRecentKegiatan] = useState<RecentKegiatan[]>([]);
    const [organisasiOverview, setOrganisasiOverview] = useState<OrganisasiOverview[]>([]);
    const [usersSnapshot, setUsersSnapshot] = useState<UserSnapshot[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        if (!authLoading && user && user.role !== 'admin') {
            router.push('/dashboard');
            return;
        }

        if (user && user.role === 'admin') {
            adminApi.dashboard().then((res) => {
                const data = res.data as any;
                if (data) {
                    setStats(data.stats);
                    setRecentUsers(data.recentUsers || []);
                    setRecentKegiatan(data.recentKegiatan || []);
                    setOrganisasiOverview(data.organisasiOverview || []);
                    setUsersSnapshot(data.usersSnapshot || []);
                }
                setLoading(false);
            }).catch(() => {
                router.push('/login');
            });
        }
    }, [user, authLoading, router]);

    if (authLoading || loading || !stats) return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full items-center justify-center p-6"><Spinner className="w-8 h-8"/></div>
        </AppLayout>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Total Pengguna" value={stats.totalUsers} icon={Users} tone="primary" subtitle={`${stats.totalAdmin} Admin · ${stats.totalPengurus} Pengurus · ${stats.totalAnggota} Anggota`} />
                    <StatCard title="Total Organisasi" value={stats.totalOrganisasi} icon={Building2} tone="neutral" subtitle={`${stats.organisasiAktif} aktif`} />
                    <StatCard title="Total Kegiatan" value={stats.totalKegiatan} icon={Calendar} tone="amber" subtitle={`${stats.kegiatanBulanIni} bulan ini`} />
                    <StatCard title="Pendaftar Baru" value={stats.pendaftarBaru} icon={UserPlus} tone="amber" subtitle="7 hari terakhir" />
                </div>

                {/* Organisasi + Pendaftar */}
                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">UKM & Organisasi</h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Pendaftar pending per organisasi (diambil dari database)</p>
                        </div>
                        <Link href="/admin/organisasi" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
                            Lihat semua →
                        </Link>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        {organisasiOverview.map((org) => (
                            <div key={org.id} className="rounded-xl border border-zinc-100 p-4 dark:border-zinc-800">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">{org.name}</p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{org.category}</p>
                                    </div>
                                    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium capitalize text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                        {org.status}
                                    </span>
                                </div>

                                <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                                    <div className="rounded-lg bg-emerald-50 p-2 dark:bg-emerald-900/20">
                                        <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{org.anggota_aktif_count ?? 0}</p>
                                        <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80">Anggota aktif</p>
                                    </div>
                                    <div className="rounded-lg bg-amber-50 p-2 dark:bg-amber-900/20">
                                        <p className="text-lg font-bold text-amber-700 dark:text-amber-400">{org.pendaftar_count ?? 0}</p>
                                        <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80">Pending</p>
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Pendaftar terbaru</p>
                                    <div className="mt-2 space-y-2">
                                        {(org.pendaftar || []).map((p) => (
                                            <div key={p.id} className="flex items-center justify-between rounded-lg border border-zinc-100 px-3 py-2 text-sm dark:border-zinc-800">
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-zinc-900 dark:text-zinc-100">{p.name}</p>
                                                    <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{p.nim || p.email}</p>
                                                </div>
                                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                    Pending
                                                </span>
                                            </div>
                                        ))}
                                        {(!org.pendaftar || org.pendaftar.length === 0) && (
                                            <p className="text-sm text-zinc-400">Tidak ada pendaftar pending.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {organisasiOverview.length === 0 && (
                            <div className="col-span-full rounded-xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                                Data organisasi belum ada. Pastikan database sudah di-seed.
                            </div>
                        )}
                    </div>
                </div>

                {/* Tables Grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Recent Users */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">User Terbaru</h3>
                            <Link href="/admin/users" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
                                Lihat semua →
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-zinc-200 dark:border-zinc-700">
                                        <th className="pb-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Nama</th>
                                        <th className="pb-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Role</th>
                                        <th className="pb-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Tanggal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentUsers.map((user) => (
                                        <tr key={user.id} className="border-b border-zinc-100 dark:border-zinc-800">
                                            <td className="py-3">
                                                <div>
                                                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{user.name}</p>
                                                    <p className="text-xs text-zinc-500">{user.email}</p>
                                                </div>
                                            </td>
                                            <td className="py-3"><StatusBadge status={user.role} /></td>
                                            <td className="py-3 text-zinc-500 dark:text-zinc-400">{new Date(user.created_at).toLocaleDateString('id-ID')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* All Users Snapshot */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Semua User (snapshot)</h3>
                            <Link href="/admin/users" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
                                Kelola user →
                            </Link>
                        </div>
                        <div className="space-y-2">
                            {usersSnapshot.map((u) => (
                                <div key={u.id} className="flex items-center justify-between rounded-lg border border-zinc-100 px-3 py-2 text-sm dark:border-zinc-800">
                                    <div className="min-w-0">
                                        <p className="truncate font-medium text-zinc-900 dark:text-zinc-100">{u.name}</p>
                                        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{u.nim || u.email}</p>
                                    </div>
                                    <StatusBadge status={u.role} />
                                </div>
                            ))}
                            {usersSnapshot.length === 0 && <p className="text-sm text-zinc-400">Belum ada user.</p>}
                        </div>
                    </div>

                    {/* Recent Kegiatan */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Kegiatan Terbaru</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-zinc-200 dark:border-zinc-700">
                                        <th className="pb-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Judul</th>
                                        <th className="pb-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Status</th>
                                        <th className="pb-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Tanggal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentKegiatan.map((k) => (
                                        <tr key={k.id} className="border-b border-zinc-100 dark:border-zinc-800">
                                            <td className="py-3">
                                                <div>
                                                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{k.judul}</p>
                                                    <p className="text-xs text-zinc-500">{k.organisasi?.name}</p>
                                                </div>
                                            </td>
                                            <td className="py-3"><StatusBadge status={k.status} /></td>
                                            <td className="py-3 text-zinc-500 dark:text-zinc-400">{new Date(k.tanggal_mulai).toLocaleDateString('id-ID')}</td>
                                        </tr>
                                    ))}
                                    {recentKegiatan.length === 0 && (
                                        <tr><td colSpan={3} className="py-6 text-center text-zinc-400">Belum ada kegiatan</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
