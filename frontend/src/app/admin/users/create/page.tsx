'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLayout from '@/layouts/app-layout';
import { useAuth } from '@/hooks/use-auth';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';

const breadcrumbs = [
  { title: 'Users', href: '/admin/users' },
  { title: 'Tambah', href: '/admin/users/create' },
];

export default function AdminUserCreatePage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  const [data, setData] = useState({
    name: '',
    email: '',
    role: 'anggota' as 'admin' | 'pengurus' | 'anggota',
    nim: '',
    jurusan: '',
    angkatan: '',
    no_hp: '',
    password: '',
    password_confirmation: '',
  });

  if (!authLoading && (!isAuthenticated || user?.role !== 'admin')) {
    router.replace(!isAuthenticated ? '/login' : '/dashboard');
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});
    setApiError('');
    try {
      await adminApi.users.create(data as any);
      router.push('/admin/users');
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string; errors?: Record<string, string[]> } };
      if (errorObj?.data?.errors) {
        const validationErrors: Record<string, string> = {};
        for (const key in errorObj.data.errors) {
          validationErrors[key] = errorObj.data.errors[key][0];
        }
        setErrors(validationErrors);
      } else {
        setApiError(errorObj?.data?.message || 'Gagal menambah user.');
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Tambah User</h1>
            <p className="text-sm text-muted-foreground">Buat akun user baru.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/users">Kembali</Link>
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
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} required />
              <InputError message={errors.email} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                value={data.role}
                onChange={(e) => setData({ ...data, role: e.target.value as any })}
              >
                <option value="admin">Admin</option>
                <option value="pengurus">Pengurus</option>
                <option value="anggota">Anggota</option>
              </select>
              <InputError message={errors.role} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="nim">NIM (opsional)</Label>
                <Input id="nim" value={data.nim} onChange={(e) => setData({ ...data, nim: e.target.value })} />
                <InputError message={errors.nim} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="no_hp">No HP (opsional)</Label>
                <Input id="no_hp" value={data.no_hp} onChange={(e) => setData({ ...data, no_hp: e.target.value })} />
                <InputError message={errors.no_hp} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="jurusan">Jurusan (opsional)</Label>
                <Input id="jurusan" value={data.jurusan} onChange={(e) => setData({ ...data, jurusan: e.target.value })} />
                <InputError message={errors.jurusan} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="angkatan">Angkatan (opsional)</Label>
                <Input id="angkatan" value={data.angkatan} onChange={(e) => setData({ ...data, angkatan: e.target.value })} />
                <InputError message={errors.angkatan} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} required />
                <InputError message={errors.password} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                <Input id="password_confirmation" type="password" value={data.password_confirmation} onChange={(e) => setData({ ...data, password_confirmation: e.target.value })} required />
                <InputError message={errors.password_confirmation} />
              </div>
            </div>
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

