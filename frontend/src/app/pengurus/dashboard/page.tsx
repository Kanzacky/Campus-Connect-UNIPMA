'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Building2, Calendar, Clock, UserPlus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { pengurusApi } from '@/lib/api';
import { Spinner } from '@/components/ui/spinner';

interface Organisasi { id: number; name: string; category: string; anggota_aktif_count: number; pendaftar_count: number; kegiatans_count: number; pengumumans_count: number; }
interface Kegiatan { id: number; judul: string; tanggal_mulai: string; organisasi?: { name: string }; }
interface Pendaftar { id: number; name: string; email: string; nim: string; organisasi: string; }
interface PendaftarByOrganisasi { organisasi_id: number; organisasi: string; category: string; pendaftar_count: number; pendaftar: { id: number; name: string; email: string; nim?: string }[]; }

const breadcrumbs = [{ title: 'Pengurus Dashboard', href: '/pengurus/dashboard' }];

export default function PengurusDashboard() {
    const [organisasis, setOrganisasis] = useState<Organisasi[]>([]);
    const [kegiatanMendatang, setKegiatanMendatang] = useState<Kegiatan[]>([]);
    const [pendaftarBaru, setPendaftarBaru] = useState<Pendaftar[]>([]);
    const [pendaftarByOrganisasi, setPendaftarByOrganisasi] = useState<PendaftarByOrganisasi[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        if (!authLoading && user && user.role !== 'pengurus') {
            router.push('/dashboard');
            return;
        }

        if (user) {
            pengurusApi.dashboard().then((res) => {
                const data = res.data as any;
                if (data) {
                    setOrganisasis(data.organisasis || []);
                    setKegiatanMendatang(data.kegiatanMendatang || []);
                    setPendaftarBaru(data.pendaftarBaru || []);
                    setPendaftarByOrganisasi(data.pendaftarByOrganisasi || []);
                }
                setLoading(false);
            }).catch(() => {
                router.push('/login');
            });
        }
    }, [user, authLoading, router]);

    if (authLoading || loading) return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full items-center justify-center p-6"><Spinner className="w-8 h-8"/></div>
        </AppLayout>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-6 p-4 md:p-6">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Dashboard Pengurus</h1>

                {/* Organisasi Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {organisasis.map((org) => (
                        <div key={org.id} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-primary/10 p-2.5"><Building2 className="h-5 w-5 text-primary" /></div>
                                <div><h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{org.name}</h3><p className="text-xs text-zinc-500">{org.category}</p></div>
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                                <div><p className="text-lg font-bold text-primary">{org.anggota_aktif_count}</p><p className="text-xs text-zinc-500">Anggota</p></div>
                                <div><p className="text-lg font-bold text-amber-700 dark:text-amber-400">{org.pendaftar_count}</p><p className="text-xs text-zinc-500">Pendaftar</p></div>
                                <div><p className="text-lg font-bold text-primary">{org.kegiatans_count}</p><p className="text-xs text-zinc-500">Kegiatan</p></div>
                            </div>
                        </div>
                    ))}
                    {organisasis.length === 0 && <div className="col-span-full rounded-xl border border-zinc-200 bg-white p-12 text-center text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900">Anda belum terdaftar sebagai pengurus di organisasi manapun.</div>}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Kegiatan Mendatang */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100"><Calendar className="h-5 w-5 text-primary" /> Kegiatan Mendatang</h3>
                        <div className="space-y-3">
                            {kegiatanMendatang.map((k) => (
                                <div key={k.id} className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3 dark:border-zinc-800">
                                    <Clock className="h-4 w-4 text-zinc-400" />
                                    <div><p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{k.judul}</p><p className="text-xs text-zinc-500">{k.organisasi?.name} · {new Date(k.tanggal_mulai).toLocaleDateString('id-ID')}</p></div>
                                </div>
                            ))}
                            {kegiatanMendatang.length === 0 && <p className="text-sm text-zinc-400">Tidak ada kegiatan mendatang</p>}
                        </div>
                    </div>

                    {/* Pendaftar Baru */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100"><UserPlus className="h-5 w-5 text-amber-500" /> Pendaftar Baru</h3>
                        <div className="space-y-3">
                            {pendaftarBaru.map((p, i) => (
                                <div key={i} className="flex items-center justify-between rounded-lg border border-zinc-100 p-3 dark:border-zinc-800">
                                    <div><p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{p.name}</p><p className="text-xs text-zinc-500">{p.nim} · {p.organisasi}</p></div>
                                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Pending</span>
                                </div>
                            ))}
                            {pendaftarBaru.length === 0 && <p className="text-sm text-zinc-400">Tidak ada pendaftar baru</p>}
                        </div>
                    </div>
                </div>

                {/* Pendaftar per Organisasi */}
                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Pendaftar per Organisasi</h3>
                    <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">Daftar pendaftar pending untuk setiap UKM/Organisasi yang kamu kelola.</p>

                    <div className="grid gap-4 lg:grid-cols-3">
                        {pendaftarByOrganisasi.map((org) => (
                            <div key={org.organisasi_id} className="rounded-xl border border-zinc-100 p-4 dark:border-zinc-800">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">{org.organisasi}</p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{org.category}</p>
                                    </div>
                                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                        {org.pendaftar_count} pending
                                    </span>
                                </div>

                                <div className="mt-3 space-y-2">
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
                        ))}

                        {pendaftarByOrganisasi.length === 0 && (
                            <div className="col-span-full rounded-xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                                Tidak ada organisasi yang kamu kelola atau tidak ada pendaftar pending.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
