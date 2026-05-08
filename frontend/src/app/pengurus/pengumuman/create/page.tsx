'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLayout from '@/layouts/app-layout';
import { useAuth } from '@/hooks/use-auth';
import { pengurusApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';

type OrgOption = { id: number; name: string };

const breadcrumbs = [
  { title: 'Pengumuman', href: '/pengurus/pengumuman' },
  { title: 'Tambah', href: '/pengurus/pengumuman/create' },
];

export default function PengurusPengumumanCreatePage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [organisasis, setOrganisasis] = useState<OrgOption[]>([]);

  const [data, setData] = useState({
    organisasi_id: '',
    judul: '',
    konten: '',
    is_pinned: false,
  });

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.replace('/login'); return; }
    if (user?.role !== 'pengurus') { router.replace('/dashboard'); return; }

    pengurusApi.pengumuman
      .list({ per_page: 1 })
      .then((res) => {
        const payload = res.data as any;
        const orgs = (payload?.organisasis || []) as OrgOption[];
        setOrganisasis(orgs);
        if (!data.organisasi_id && orgs[0]) {
          setData((p) => ({ ...p, organisasi_id: String(orgs[0].id) }));
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated, user, router]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});
    setApiError('');
    try {
      await pengurusApi.pengumuman.create({
        ...data,
        organisasi_id: Number(data.organisasi_id),
      });
      router.push('/pengurus/pengumuman');
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string; errors?: Record<string, string[]> } };
      if (errorObj?.data?.errors) {
        const validationErrors: Record<string, string> = {};
        for (const key in errorObj.data.errors) {
          validationErrors[key] = errorObj.data.errors[key][0];
        }
        setErrors(validationErrors);
      } else {
        setApiError(errorObj?.data?.message || 'Gagal menambah pengumuman.');
      }
    } finally {
      setProcessing(false);
    }
  };

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
            <h1 className="text-2xl font-bold">Tambah Pengumuman</h1>
            <p className="text-sm text-muted-foreground">Pengumuman untuk organisasi yang kamu kelola.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/pengurus/pengumuman">Kembali</Link>
          </Button>
        </div>

        <form onSubmit={submit} className="rounded-xl border bg-card p-6 shadow-sm">
          {apiError && <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{apiError}</div>}

          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="organisasi_id">Organisasi</Label>
              <select
                id="organisasi_id"
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                value={data.organisasi_id}
                onChange={(e) => setData({ ...data, organisasi_id: e.target.value })}
                required
              >
                {organisasis.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
              <InputError message={errors.organisasi_id} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="judul">Judul</Label>
              <Input id="judul" value={data.judul} onChange={(e) => setData({ ...data, judul: e.target.value })} required />
              <InputError message={errors.judul} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="konten">Konten</Label>
              <textarea
                id="konten"
                className="min-h-40 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                value={data.konten}
                onChange={(e) => setData({ ...data, konten: e.target.value })}
                required
              />
              <InputError message={errors.konten} />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={data.is_pinned}
                onChange={(e) => setData({ ...data, is_pinned: e.target.checked })}
              />
              <span>Pin pengumuman</span>
            </label>
            <InputError message={errors.is_pinned} />
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={processing}>
              {processing && <Spinner />}
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

