'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLayout from '@/layouts/app-layout';
import { useAuth } from '@/hooks/use-auth';
import { adminApi } from '@/lib/api';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Organisasi, PaginatedResponse } from '@/types';

const breadcrumbs = [{ title: 'Organisasi', href: '/admin/organisasi' }];

export default function AdminOrganisasiPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [items, setItems] = useState<Organisasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (user?.role !== 'admin') {
      router.replace('/dashboard');
      return;
    }

    adminApi.organisasi
      .list({ per_page: 50 })
      .then((res) => {
        const payload = res.data as any;
        const paginated = payload?.organisasis as PaginatedResponse<Organisasi> | undefined;
        const list = Array.isArray(paginated?.data) ? paginated.data : [];
        setItems(list);
      })
      .finally(() => setLoading(false));
  }, [authLoading, isAuthenticated, user, router]);

  async function handleDelete(id: number) {
    if (busyId) return;
    const ok = window.confirm('Hapus organisasi ini?');
    if (!ok) return;
    try {
      setBusyId(id);
      await adminApi.organisasi.destroy(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } finally {
      setBusyId(null);
    }
  }

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
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Organisasi</h1>
          <div className="flex items-center gap-2">
            <Button asChild variant="default">
              <Link href="/admin/organisasi/create">Tambah Organisasi</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin">Kembali</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((org) => (
            <Card key={org.id} className="py-0">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-start justify-between gap-3">
                  <span className="line-clamp-2">{org.name}</span>
                  <Badge variant={org.status === 'aktif' ? 'secondary' : 'outline'} className="capitalize">
                    {org.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="text-sm text-zinc-600 dark:text-zinc-300">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 dark:text-zinc-400">Kategori</span>
                    <span className="font-medium">{org.category}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-zinc-500 dark:text-zinc-400">Ketua</span>
                    <span className="font-medium">{org.ketua}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/organisasi/${org.id}/edit`}>Edit</Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={busyId === org.id}
                    onClick={() => handleDelete(org.id)}
                  >
                    {busyId === org.id ? 'Menghapus…' : 'Hapus'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {items.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              Belum ada data organisasi.
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

