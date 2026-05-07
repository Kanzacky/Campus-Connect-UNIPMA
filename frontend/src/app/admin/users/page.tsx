import { Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';
import AdminUsersClient from './users-client';

export default function AdminUsersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center p-6">
          <Spinner className="h-8 w-8 text-zinc-400" />
        </div>
      }
    >
      <AdminUsersClient />
    </Suspense>
  );
}

