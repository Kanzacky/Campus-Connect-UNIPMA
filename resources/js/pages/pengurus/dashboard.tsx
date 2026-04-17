import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs = [
    {
        title: 'Pengurus Dashboard',
        href: '/pengurus/dashboard',
    },
];

export default function PengurusDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengurus Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border bg-white dark:bg-zinc-900 md:min-h-min p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Halaman Kosong Pengurus</h2>
                </div>
            </div>
        </AppLayout>
    );
}
