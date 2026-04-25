import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs = [
    { title: 'Admin Dashboard', href: '/admin' },
    { title: 'Organisasi', href: '/admin/organisasi' },
    { title: 'Tambah', href: '/admin/organisasi/create' },
];

export default function OrganisasiCreate({ categories }: { categories: string[] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '', category: '', ketua: '', visi: '', misi: '', deskripsi: '', kontak: '', status: 'aktif' as string,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/organisasi');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Organisasi" />
            <div className="mx-auto max-w-3xl p-4 md:p-6">
                <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Tambah Organisasi Baru</h1>
                <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Nama Organisasi *</label>
                            <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100" />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Kategori *</label>
                            <select value={data.category} onChange={(e) => setData('category', e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
                                <option value="">Pilih Kategori</option>
                                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                                <option value="__new__">+ Kategori Baru</option>
                            </select>
                            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Ketua *</label>
                            <input type="text" value={data.ketua} onChange={(e) => setData('ketua', e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100" />
                            {errors.ketua && <p className="mt-1 text-xs text-red-500">{errors.ketua}</p>}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Kontak</label>
                            <input type="text" value={data.kontak} onChange={(e) => setData('kontak', e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100" />
                        </div>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Visi *</label>
                        <textarea rows={3} value={data.visi} onChange={(e) => setData('visi', e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100" />
                        {errors.visi && <p className="mt-1 text-xs text-red-500">{errors.visi}</p>}
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Misi *</label>
                        <textarea rows={4} value={data.misi} onChange={(e) => setData('misi', e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100" />
                        {errors.misi && <p className="mt-1 text-xs text-red-500">{errors.misi}</p>}
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Deskripsi</label>
                        <textarea rows={3} value={data.deskripsi} onChange={(e) => setData('deskripsi', e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100" />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Status *</label>
                        <select value={data.status} onChange={(e) => setData('status', e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
                            <option value="aktif">Aktif</option>
                            <option value="nonaktif">Nonaktif</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-end gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
                        <Link href="/admin/organisasi" className="rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">Batal</Link>
                        <button type="submit" disabled={processing} className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
