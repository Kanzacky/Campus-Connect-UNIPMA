import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs = [
    {
        title: 'Admin Dashboard',
        href: '/admin',
    },
];

export default function AdminDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border bg-white dark:bg-zinc-900 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Total Pengguna</h3>
                        <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">1,234</p>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border bg-white dark:bg-zinc-900 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Total UKM & Organisasi</h3>
                        <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">25</p>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border bg-white dark:bg-zinc-900 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Pendaftar Baru</h3>
                        <p className="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-400">42</p>
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border bg-white dark:bg-zinc-900 md:min-h-min p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Selamat Datang, Admin!</h2>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Ini adalah halaman khusus Administrator. Dari sini Anda dapat mengelola seluruh data UKM, Organisasi, dan Pengguna dalam aplikasi.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
