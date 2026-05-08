'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import AppLayout from '@/layouts/app-layout';
import { useAuth } from '@/hooks/use-auth';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';

const breadcrumbsBase = [{ title: 'Organisasi', href: '/admin/organisasi' }];

export default function AdminOrganisasiEditPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  const [data, setData] = useState({
    name: '',
    category: '',
    ketua: '',
    visi: '',
    misi: '',
    deskripsi: '',
    kontak: '',
    status: 'aktif' as 'aktif' | 'nonaktif',
  });

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.replace('/login'); return; }
    if (user?.role !== 'admin') { router.replace('/dashboard'); return; }

    adminApi.organisasi
      .show(id)
      .then((res) => {
        const payload = res.data as any;
        const org = payload?.organisasi;
        if (org) {
          setData({
            name: org.name || '',
            category: org.category || '',
            ketua: org.ketua || '',
            visi: org.visi || '',
            misi: org.misi || '',
            deskripsi: org.deskripsi || '',
            kontak: org.kontak || '',
            status: (org.status || 'aktif') as 'aktif' | 'nonaktif',
          });
        }
      })
      .finally(() => setLoading(false));
  }, [authLoading, isAuthenticated, user, router, id]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});
    setApiError('');
    try {
      await adminApi.organisasi.update(id, data);
      router.push('/admin/organisasi');
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string; errors?: Record<string, string[]> } };
      if (errorObj?.data?.errors) {
        const validationErrors: Record<string, string> = {};
        for (const key in errorObj.data.errors) {
          validationErrors[key] = errorObj.data.errors[key][0];
        }
        setErrors(validationErrors);
      } else {
        setApiError(errorObj?.data?.message || 'Gagal menyimpan perubahan.');
      }
    } finally {
      setProcessing(false);
    }
  };

  const breadcrumbs = [...breadcrumbsBase, { title: 'Edit', href: `/admin/organisasi/${id}/edit` }];

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
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Edit Organisasi</h1>
            <p className="text-sm text-muted-foreground">Perbarui data UKM/Organisasi.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/organisasi">Kembali</Link>
          </Button>
        </div>

        <form onSubmit={submit} className="rounded-xl border bg-card p-6 shadow-sm">
          {apiError && <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{apiError}</div>}

          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama</Label>
              <Input id="name" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} required />
              <InputError message={errors.name} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Kategori</Label>
              <Input id="category" value={data.category} onChange={(e) => setData({ ...data, category: e.target.value })} required />
              <InputError message={errors.category} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ketua">Ketua</Label>
              <Input id="ketua" value={data.ketua} onChange={(e) => setData({ ...data, ketua: e.target.value })} required />
              <InputError message={errors.ketua} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="visi">Visi</Label>
              <textarea
                id="visi"
                className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                value={data.visi}
                onChange={(e) => setData({ ...data, visi: e.target.value })}
                required
              />
              <InputError message={errors.visi} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="misi">Misi</Label>
              <textarea
                id="misi"
                className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                value={data.misi}
                onChange={(e) => setData({ ...data, misi: e.target.value })}
                required
              />
              <InputError message={errors.misi} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="deskripsi">Deskripsi (opsional)</Label>
              <textarea
                id="deskripsi"
                className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                value={data.deskripsi}
                onChange={(e) => setData({ ...data, deskripsi: e.target.value })}
              />
              <InputError message={errors.deskripsi} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="kontak">Kontak (opsional)</Label>
              <Input id="kontak" value={data.kontak} onChange={(e) => setData({ ...data, kontak: e.target.value })} />
              <InputError message={errors.kontak} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                value={data.status}
                onChange={(e) => setData({ ...data, status: e.target.value as 'aktif' | 'nonaktif' })}
              >
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
              <InputError message={errors.status} />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button type="submit" disabled={processing}>
              {processing && <Spinner />}
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

