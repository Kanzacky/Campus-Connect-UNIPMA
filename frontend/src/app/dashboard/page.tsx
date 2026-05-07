'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';

export default function DashboardRedirect() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user) {
            if (user.role === 'admin') {
                router.push('/admin');
            } else if (user.role === 'pengurus') {
                router.push('/pengurus/dashboard');
            } else {
                router.push('/anggota/dashboard');
            }
        } else if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    return (
        <AppLayout>
            <div className="flex h-full min-h-[50vh] items-center justify-center">
                <Spinner className="h-8 w-8 text-zinc-400" />
            </div>
        </AppLayout>
    );
}
