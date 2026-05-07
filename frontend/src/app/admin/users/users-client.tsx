'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AppLayout from '@/layouts/app-layout';
import { useAuth } from '@/hooks/use-auth';
import { adminApi } from '@/lib/api';
import { Spinner } from '@/components/ui/spinner';

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'pengurus' | 'anggota';
  nim?: string | null;
  created_at: string;
};

type Paginated<T> = {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
};

const breadcrumbs = [{ title: 'Users', href: '/admin/users' }];

export default function AdminUsersClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  const page = useMemo(() => Number(searchParams.get('page') || '1'), [searchParams]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Paginated<UserRow> | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.replace('/login'); return; }
    if (user?.role !== 'admin') { router.replace('/dashboard'); return; }

    setLoading(true);
    adminApi.users
      .list({ per_page: 15, page })
      .then((res) => {
        const payload = res.data as any;
        setUsers(payload?.users as Paginated<UserRow>);
      })
      .finally(() => setLoading(false));
  }, [authLoading, isAuthenticated, user, router, page]);

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
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Semua User</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Diambil dari database via endpoint admin.</p>
          </div>
          <Link href="/admin" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
            Kembali ke dashboard
          </Link>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Nama</th>
                  <th className="py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Role</th>
                  <th className="py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">NIM</th>
                  <th className="py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Tanggal daftar</th>
                </tr>
              </thead>
              <tbody>
                {(users?.data || []).map((u) => (
                  <tr key={u.id} className="border-b border-zinc-100 dark:border-zinc-800">
                    <td className="py-3">
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-zinc-100">{u.name}</p>
                        <p className="text-xs text-zinc-500">{u.email}</p>
                      </div>
                    </td>
                    <td className="py-3 capitalize text-zinc-700 dark:text-zinc-300">{u.role}</td>
                    <td className="py-3 text-zinc-600 dark:text-zinc-400">{u.nim || '-'}</td>
                    <td className="py-3 text-zinc-600 dark:text-zinc-400">{new Date(u.created_at).toLocaleDateString('id-ID')}</td>
                  </tr>
                ))}
                {!users || users.data.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-zinc-400">
                      Belum ada user.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {users && users.last_page > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Halaman {users.current_page} dari {users.last_page} · Total {users.total}
              </p>
              <div className="flex gap-2">
                <Link
                  href={`/admin/users?page=${Math.max(1, users.current_page - 1)}`}
                  className={`rounded-md border px-3 py-1 text-sm ${users.current_page <= 1 ? 'pointer-events-none opacity-50' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                >
                  Prev
                </Link>
                <Link
                  href={`/admin/users?page=${Math.min(users.last_page, users.current_page + 1)}`}
                  className={`rounded-md border px-3 py-1 text-sm ${users.current_page >= users.last_page ? 'pointer-events-none opacity-50' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
                >
                  Next
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

