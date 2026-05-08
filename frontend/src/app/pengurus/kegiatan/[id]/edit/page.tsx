'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import AppLayout from '@/layouts/app-layout';
import { useAuth } from '@/hooks/use-auth';
import { pengurusApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';

type OrgOption = { id: number; name: string };

export default function PengurusKegiatanEditPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  const breadcrumbs = [
    { title: 'Kegiatan', href: '/pengurus/kegiatan' },
    { title: 'Edit', href: `/pengurus/kegiatan/${id}/edit` },
  ];

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [organisasis, setOrganisasis] = useState<OrgOption[]>([]);

  const [data, setData] = useState({
    organisasi_id: '',
    judul: '',
    deskripsi: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    lokasi: '',
    status: 'draft' as 'draft' | 'published' | 'selesai',
  });

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.replace('/login'); return; }
    if (user?.role !== 'pengurus') { router.replace('/dashboard'); return; }

    pengurusApi.kegiatan
      .show(id)
      .then((res) => {
        const payload = res.data as any;
        const keg = payload?.kegiatan;
        const orgs = (payload?.organisasis || []) as OrgOption[];
        setOrganisasis(orgs);
        if (keg) {
          setData({
            organisasi_id: String(keg.organisasi_id ?? keg.organisasi?.id ?? ''),
            judul: keg.judul || '',
            deskripsi: keg.deskripsi || '',
            tanggal_mulai: (keg.tanggal_mulai || '').slice(0, 10),
            tanggal_selesai: (keg.tanggal_selesai || '').slice(0, 10),
            lokasi: keg.lokasi || '',
            status: (keg.status || 'draft') as any,
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
      await pengurusApi.kegiatan.update(id, {
        ...data,
        organisasi_id: Number(data.organisasi_id),
      });
      router.push('/pengurus/kegiatan');
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
            <h1 className="text-2xl font-bold">Edit Kegiatan</h1>
            <p className="text-sm text-muted-foreground">Perbarui kegiatan.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/pengurus/kegiatan">Kembali</Link>
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
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <textarea
                id="deskripsi"
                className="min-h-28 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                value={data.deskripsi}
                onChange={(e) => setData({ ...data, deskripsi: e.target.value })}
                required
              />
              <InputError message={errors.deskripsi} />
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="tanggal_mulai">Tanggal mulai</Label>
                <Input id="tanggal_mulai" type="date" value={data.tanggal_mulai} onChange={(e) => setData({ ...data, tanggal_mulai: e.target.value })} required />
                <InputError message={errors.tanggal_mulai} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tanggal_selesai">Tanggal selesai</Label>
                <Input id="tanggal_selesai" type="date" value={data.tanggal_selesai} onChange={(e) => setData({ ...data, tanggal_selesai: e.target.value })} required />
                <InputError message={errors.tanggal_selesai} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lokasi">Lokasi</Label>
              <Input id="lokasi" value={data.lokasi} onChange={(e) => setData({ ...data, lokasi: e.target.value })} required />
              <InputError message={errors.lokasi} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                value={data.status}
                onChange={(e) => setData({ ...data, status: e.target.value as any })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="selesai">Selesai</option>
              </select>
              <InputError message={errors.status} />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
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

