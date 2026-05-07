'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLayout from '@/layouts/app-layout';
import { useAuth } from '@/hooks/use-auth';
import { pengurusApi } from '@/lib/api';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type PengurusAnggota = {
  id: number;
  name: string;
  email: string;
  nim?: string;
  status?: string;
  organisasi?: { id: number; name: string };
};

const breadcrumbs = [{ title: 'Anggota', href: '/pengurus/anggota' }];

export default function PengurusAnggotaPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [items, setItems] = useState<PengurusAnggota[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (user?.role !== 'pengurus') {
      router.replace('/dashboard');
      return;
    }

    pengurusApi.anggota
      .list({ per_page: 50 })
      .then((res) => {
        const payload = res.data as any;
        const paginated = payload?.anggota as { data?: PengurusAnggota[] } | undefined;
        const list = Array.isArray(paginated?.data) ? paginated.data : [];
        setItems(list);
      })
      .finally(() => setLoading(false));
  }, [authLoading, isAuthenticated, user, router]);

  if (authLoading || loading) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <div className="flex min-h-[50vh] items-center justify-center p-6">
          <Spinner className="h-8 w-8 text-zinc-400" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="flex flex-col gap-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Anggota</h1>
          <Link href="/pengurus/dashboard" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
            Kembali ke dashboard
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((m) => (
            <Card key={m.id} className="py-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex flex-col gap-1">
                  <span className="line-clamp-1">{m.name}</span>
                  <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">{m.email}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="text-sm text-zinc-600 dark:text-zinc-300">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 dark:text-zinc-400">NIM</span>
                    <span className="font-medium">{m.nim || '-'}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-zinc-500 dark:text-zinc-400">Organisasi</span>
                    <span className="font-medium">{m.organisasi?.name || '-'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {items.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              Belum ada data anggota.
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

