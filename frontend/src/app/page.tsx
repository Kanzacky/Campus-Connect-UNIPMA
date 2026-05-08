'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { publicApi } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import type { Organisasi } from '@/types';

export default function Welcome() {
    const { isAuthenticated, user, isLoading } = useAuth();
    const [organisasis, setOrganisasis] = useState<Organisasi[]>([]);
    
    // Asumsi registrasi terbuka
    const canRegister = true;

    useEffect(() => {
        publicApi.organisasi
            .list({ per_page: 10 })
            .then((res: any) => {
                // Laravel resources wrap data in a 'data' key. 
                // If it's paginated, it's also in 'data'.
                if (res && res.data) {
                    setOrganisasis(res.data);
                }
            })
            .catch(() => {
                setOrganisasis([]);
            });
    }, []);

    // Centralized redirect (role-based) lives in `/dashboard`.
    // Landing page should not guess per-role paths (e.g. admin uses `/admin`).
    function getDashboardPath() {
        if (!user) return '/login';
        return '/dashboard';
    }

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 font-serif text-slate-900 selection:bg-[#002855] selection:text-white">
            {/* Clean, Minimalist Header */}
            <header className="sticky top-0 z-50 flex w-full items-center justify-between bg-[#002855] px-8 py-3 text-white shadow-md transition-all duration-300">
                <div className="group flex cursor-default items-center gap-6">
                    {/* UNIPMA Brand Logo */}
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center transition-transform duration-500">
                        <img
                            src="/rmvunipma.png"
                            alt="UNIPMA Logo"
                            className="absolute -left-2 h-20 w-20 max-w-none object-contain drop-shadow-md"
                        />
                    </div>
                    <div className="flex flex-col justify-center pl-2">
                        <span className="font-sans text-xl leading-none font-extrabold tracking-tight uppercase">
                            PGRI Madiun
                        </span>
                        <span className="mt-1 font-sans text-[11px] font-semibold tracking-[0.25em] text-amber-400 uppercase">
                            Universitas
                        </span>
                    </div>
                </div>

                <nav className="flex items-center gap-8 font-sans">
                    {/* Desktop Navigation Links */}
                    <div className="mr-6 hidden items-center gap-8 text-[11px] font-bold tracking-widest uppercase md:flex">
                        <a
                            href="#discover"
                            className="relative py-1 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-amber-400 after:transition-all hover:text-amber-400 hover:after:w-full"
                        >
                            Organisasi & UKM
                        </a>
                        <a
                            href="#news"
                            className="relative py-1 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-amber-400 after:transition-all hover:text-amber-400 hover:after:w-full"
                        >
                            Latest News
                        </a>
                        <a
                            href="#campus-life"
                            className="relative py-1 transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-amber-400 after:transition-all hover:text-amber-400 hover:after:w-full"
                        >
                            Campus Life
                        </a>
                    </div>

                    {isLoading ? (
                        <div className="h-8 w-20 animate-pulse bg-white/20 rounded"></div>
                    ) : isAuthenticated ? (
                        <Link
                            href={getDashboardPath()}
                            className="inline-flex items-center justify-center border-2 border-amber-400 bg-amber-400 px-6 py-2 text-[10px] font-bold tracking-widest text-[#002855] uppercase transition-all hover:bg-transparent hover:text-amber-400"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <div className="flex items-center gap-5">
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center text-[10px] font-extrabold tracking-widest uppercase transition-colors hover:text-amber-400"
                            >
                                Log in
                            </Link>
                            {canRegister && (
                                <Link
                                    href="/register"
                                    className="inline-flex items-center justify-center border-2 border-white bg-white px-6 py-2 text-[10px] font-bold tracking-widest text-[#002855] uppercase transition-all hover:bg-transparent hover:text-white"
                                >
                                    Register
                                </Link>
                            )}
                        </div>
                    )}
                </nav>
            </header>

            {/* Hero Section - Authority & Prestige */}
            <main className="flex flex-grow flex-col items-center">
                <section className="relative flex w-full items-center justify-center overflow-hidden border-b-[8px] border-amber-400 bg-[#002855] px-8 py-24 sm:py-36 lg:px-16">
                    {/* Elegant background elements */}
                    <div className="pointer-events-none absolute inset-0 opacity-10">
                        <div className="absolute -top-[50%] right-[5%] h-[1000px] w-[1000px] rounded-full border-[1px] border-white"></div>
                        <div className="absolute top-[20%] -right-[20%] h-[800px] w-[800px] rounded-full border-[1px] border-white"></div>
                        <div className="absolute right-[30%] -bottom-[20%] h-[600px] w-[600px] rounded-full border-[1px] border-white/40"></div>
                    </div>

                    <div className="relative z-10 mx-auto w-full max-w-[1400px]">
                        <div className="flex flex-col items-start px-2 lg:w-[65%]">
                            <h2 className="mb-6 flex items-center gap-4 font-sans text-[10px] font-bold tracking-[0.4em] text-amber-400 uppercase sm:text-xs">
                                Universitas PGRI Madiun
                            </h2>
                            <h1 className="mb-8 font-sans text-4xl leading-[1.05] font-extrabold tracking-tighter text-white uppercase md:text-6xl lg:text-[5rem]">
                                Kembangkan <br />
                                <span className="font-serif font-light tracking-normal text-amber-50 capitalize lowercase italic">
                                    potensi di
                                </span>{' '}
                                Organisasi.
                            </h1>
                            <p className="mb-12 max-w-xl pr-8 font-serif text-base leading-relaxed font-normal text-white/80 md:text-lg">
                                Masa depan bermula dari pengalaman di kampus. Kami menyediakan kemudahan bagi Anda untuk menggali bakat, membangun kepemimpinan, dan mendaftar ke beragam Unit Kegiatan Mahasiswa (UKM) serta Organisasi resmi secara langsung di satu portal terpusat.
                            </p>

                            <div className="flex flex-wrap items-center gap-8">
                                {!isAuthenticated && canRegister ? (
                                    <Link
                                        href="/register"
                                        className="inline-flex items-center justify-center bg-amber-400 px-10 py-5 font-sans text-[11px] font-bold tracking-[0.15em] text-[#002855] uppercase shadow-2xl transition-colors hover:bg-amber-300"
                                    >
                                        Buat Akun Anda
                                    </Link>
                                ) : null}
                                <a
                                    href="#discover"
                                    className="group inline-flex items-center justify-center font-sans text-[11px] font-bold tracking-[0.15em] text-white uppercase transition-colors hover:text-amber-400"
                                >
                                    Jelajahi UKM & Organisasi
                                    <span className="ml-3 transition-transform group-hover:translate-x-2">
                                        &rarr;
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Organizations/UKM Showcase Section */}
                <section
                    id="discover"
                    className="mx-auto w-full max-w-[1400px] px-6 py-24 md:px-12"
                >
                    <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div className="max-w-2xl">
                            <h3 className="mb-4 font-sans text-xs font-bold tracking-[0.3em] text-indigo-600 uppercase">
                                Organisasi & Unit Kegiatan Mahasiswa
                            </h3>
                            <h2 className="font-sans text-4xl leading-none font-extrabold tracking-tighter text-[#002855] uppercase md:text-6xl">
                                Explore UNIPMA <br />
                                Experience
                            </h2>
                        </div>
                        <div className="flex shrink-0 items-center">
                            <a
                                href="#"
                                className="border-b-2 border-amber-400 pb-1 font-sans text-[10px] font-bold tracking-widest text-[#002855] uppercase transition-colors hover:text-amber-500"
                            >
                                View All Organizations &rarr;
                            </a>
                        </div>
                    </div>

                    {/* Database Data Display */}
                    {organisasis && organisasis.length > 0 ? (
                        <div className="space-y-20">
                            {/* UKM Section */}
                            <div>
                                <div className="mb-10 flex items-center gap-4">
                                    <div className="h-[1px] flex-grow bg-slate-200"></div>
                                    <h3 className="font-sans text-[10px] font-bold tracking-[0.3em] text-amber-500 uppercase">
                                        Unit Kegiatan Mahasiswa (UKM)
                                    </h3>
                                    <div className="h-[1px] flex-grow bg-slate-200"></div>
                                </div>
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                    {organisasis
                                        .filter(org => !org.category.toLowerCase().includes('universitas') && !org.category.toLowerCase().includes('fakultas'))
                                        .slice(0, 3)
                                        .map((org) => (
                                            <div
                                                key={org.id}
                                                className="group relative top-0 flex h-full cursor-pointer flex-col border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-top-2 hover:shadow-2xl"
                                            >
                                                <div className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden bg-slate-100">
                                                    <div className="absolute inset-0 z-10 bg-[#002855]/5 transition-colors group-hover:bg-[#002855]/0"></div>
                                                    <span className="font-serif text-[10px] text-slate-400 italic uppercase tracking-widest">
                                                        {org.name}
                                                    </span>
                                                </div>

                                                <div className="flex flex-grow flex-col p-6">
                                                    <p className="mb-2 truncate font-sans text-[9px] font-bold tracking-widest text-amber-500 uppercase">
                                                        {org.category}
                                                    </p>
                                                    <h4 className="mb-4 line-clamp-1 font-sans text-lg leading-tight font-extrabold tracking-tight text-[#002855] uppercase transition-colors group-hover:text-blue-600">
                                                        {org.name}
                                                    </h4>
                                                    <p className="line-clamp-2 font-serif text-xs leading-relaxed text-slate-600 italic">
                                                        "{org.visi || 'Mewujudkan organisasi yang unggul dan inovatif.'}"
                                                    </p>
                                                    <div className="mt-6 flex items-center font-sans text-[9px] font-bold tracking-widest text-[#002855] uppercase">
                                                        Explore &rarr;
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Organisasi Section */}
                            <div>
                                <div className="mb-10 flex items-center gap-4">
                                    <div className="h-[1px] flex-grow bg-slate-200"></div>
                                    <h3 className="font-sans text-[10px] font-bold tracking-[0.3em] text-indigo-600 uppercase">
                                        Organisasi Mahasiswa
                                    </h3>
                                    <div className="h-[1px] flex-grow bg-slate-200"></div>
                                </div>
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                    {organisasis
                                        .filter(org => org.category.toLowerCase().includes('universitas') || org.category.toLowerCase().includes('fakultas'))
                                        .slice(0, 3)
                                        .map((org) => (
                                            <div
                                                key={org.id}
                                                className="group relative top-0 flex h-full cursor-pointer flex-col border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-top-2 hover:shadow-2xl"
                                            >
                                                <div className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden bg-[#002855]/5">
                                                    <div className="absolute inset-0 z-10 bg-[#002855]/5 transition-colors group-hover:bg-[#002855]/0"></div>
                                                    <span className="font-serif text-[10px] text-slate-400 italic uppercase tracking-widest">
                                                        {org.name}
                                                    </span>
                                                </div>

                                                <div className="flex flex-grow flex-col p-6">
                                                    <p className="mb-2 truncate font-sans text-[9px] font-bold tracking-widest text-indigo-600 uppercase">
                                                        {org.category}
                                                    </p>
                                                    <h4 className="mb-4 line-clamp-1 font-sans text-lg leading-tight font-extrabold tracking-tight text-[#002855] uppercase transition-colors group-hover:text-blue-600">
                                                        {org.name}
                                                    </h4>
                                                    <p className="line-clamp-2 font-serif text-xs leading-relaxed text-slate-600 italic">
                                                        "{org.visi || 'Mewujudkan sinergi dan kolaborasi antar mahasiswa.'}"
                                                    </p>
                                                    <div className="mt-6 flex items-center font-sans text-[9px] font-bold tracking-widest text-[#002855] uppercase">
                                                        Explore &rarr;
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full border-y border-slate-200 py-16 text-center">
                            <p className="font-serif text-lg text-slate-500 italic">
                                Belum ada data Organisasi / UKM yang terdaftar di database.
                            </p>
                        </div>
                    )}
                </section>

                {/* Latest News / Berita Terbaru Section */}
                <section id="news" className="w-full border-t border-slate-200 bg-white px-6 py-24 md:px-12">
                    <div className="mx-auto max-w-[1400px]">
                        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                            <div className="max-w-2xl">
                                <h3 className="mb-4 font-sans text-xs font-bold tracking-[0.3em] text-amber-500 uppercase">
                                    Informasi Terkini
                                </h3>
                                <h2 className="font-sans text-4xl leading-none font-extrabold tracking-tighter text-[#002855] uppercase md:text-6xl">
                                    Latest News & <br /> Announcements
                                </h2>
                            </div>
                            <div className="flex shrink-0 items-center">
                                <a href="#" className="border-b-2 border-amber-400 pb-1 font-sans text-[10px] font-bold tracking-widest text-[#002855] uppercase transition-colors hover:text-amber-500">
                                    Read All News &rarr;
                                </a>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                            <div className="group flex cursor-pointer flex-col">
                                <div className="relative mb-6 flex aspect-video w-full items-center justify-center overflow-hidden bg-slate-100">
                                    <div className="absolute inset-0 z-10 bg-[#002855]/10 transition-colors group-hover:bg-[#002855]/0"></div>
                                    <span className="font-serif text-sm text-slate-400 italic">Image Coming Soon</span>
                                </div>
                                <p className="mb-3 font-sans text-[10px] font-bold tracking-widest text-amber-500 uppercase">08 Apr 2026</p>
                                <h4 className="mb-4 font-sans text-xl leading-tight font-extrabold tracking-tight text-[#002855] uppercase transition-colors group-hover:text-amber-500">
                                    Pendaftaran Anggota Baru UKM Seni & Budaya Resmi Dibuka
                                </h4>
                                <p className="mb-6 font-serif text-sm leading-relaxed text-slate-600">
                                    Unit Kegiatan Mahasiswa (UKM) Kesenian UNIPMA kembali membuka pintu pendaftaran bagi mahasiswa berbakat...
                                </p>
                                <span className="mt-auto font-sans text-[10px] font-bold tracking-widest text-[#002855] uppercase">Read More &rarr;</span>
                            </div>
                            
                            {/* Berita 2 */}
                            <div className="group flex cursor-pointer flex-col">
                                <div className="relative mb-6 flex aspect-video w-full items-center justify-center overflow-hidden bg-slate-100">
                                    <div className="absolute inset-0 z-10 bg-[#002855]/10 transition-colors group-hover:bg-[#002855]/0"></div>
                                    <span className="font-serif text-sm text-slate-400 italic">Image Coming Soon</span>
                                </div>
                                <p className="mb-3 font-sans text-[10px] font-bold tracking-widest text-amber-500 uppercase">05 Apr 2026</p>
                                <h4 className="mb-4 font-sans text-xl leading-tight font-extrabold tracking-tight text-[#002855] uppercase transition-colors group-hover:text-amber-500">
                                    Rapat Kerja Ormawa Periode 2026/2027 Berjalan Sukses
                                </h4>
                                <p className="mb-6 font-serif text-sm leading-relaxed text-slate-600">
                                    Seluruh ketua organisasi mahasiswa di lingkungan kampus menghadiri sinkronisasi program kerja tahunan...
                                </p>
                                <span className="mt-auto font-sans text-[10px] font-bold tracking-widest text-[#002855] uppercase">Read More &rarr;</span>
                            </div>

                            {/* Berita 3 */}
                            <div className="group flex cursor-pointer flex-col">
                                <div className="relative mb-6 flex aspect-video w-full items-center justify-center overflow-hidden bg-slate-100">
                                    <div className="absolute inset-0 z-10 bg-[#002855]/10 transition-colors group-hover:bg-[#002855]/0"></div>
                                    <span className="font-serif text-sm text-slate-400 italic">Image Coming Soon</span>
                                </div>
                                <p className="mb-3 font-sans text-[10px] font-bold tracking-widest text-amber-500 uppercase">02 Apr 2026</p>
                                <h4 className="mb-4 font-sans text-xl leading-tight font-extrabold tracking-tight text-[#002855] uppercase transition-colors group-hover:text-amber-500">
                                    Workshop Mahasiswa: Sistem Administrasi Digital UNIPMA
                                </h4>
                                <p className="mb-6 font-serif text-sm leading-relaxed text-slate-600">
                                    Biro Kemahasiswaan akan menggelar sosialisasi penggunaan portal ConnectUKM untuk pelaporan kegiatan...
                                </p>
                                <span className="mt-auto font-sans text-[10px] font-bold tracking-widest text-[#002855] uppercase">Read More &rarr;</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Minimalist Data/Stats Section */}
                <section id="campus-life" className="w-full bg-amber-400 px-6 py-24 shadow-inner md:px-12">
                    <div className="mx-auto grid max-w-[1400px] gap-12 text-center lowercase md:grid-cols-3">
                        <div className="p-6">
                            <p className="mb-4 font-sans text-8xl font-extrabold tracking-tighter text-[#002855] drop-shadow-sm">50+</p>
                            <p className="font-sans text-xs font-bold tracking-[0.3em] text-[#002855]/80 uppercase">Organisasi & UKM</p>
                        </div>
                        <div className="p-6">
                            <p className="mb-4 font-sans text-8xl font-extrabold tracking-tighter text-[#002855] drop-shadow-sm">10k</p>
                            <p className="font-sans text-xs font-bold tracking-[0.3em] text-[#002855]/80 uppercase">Mahasiswa Aktif</p>
                        </div>
                        <div className="p-6">
                            <p className="mb-4 font-sans text-8xl font-extrabold tracking-tighter text-[#002855] drop-shadow-sm">1</p>
                            <p className="font-sans text-xs font-bold tracking-[0.3em] text-[#002855]/80 uppercase">Platform Terpadu</p>
                        </div>
                    </div>
                </section>

                {/* Final Call to Action (CTA) Banner */}
                <section className="flex w-full justify-center bg-white px-6 py-16 md:px-12">
                    <div className="relative w-full max-w-[1200px] overflow-hidden rounded-3xl bg-[#002855] p-12 text-center shadow-[0_20px_50px_-12px_rgba(0,40,85,0.4)] md:p-20">
                        <div className="pointer-events-none absolute -top-[50%] -left-[10%] h-[500px] w-[500px] rounded-full border-[2px] border-white/5"></div>
                        <div className="pointer-events-none absolute -right-[10%] -bottom-[50%] h-[400px] w-[400px] rounded-full border-[2px] border-amber-400/10"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <h3 className="mb-6 font-sans text-[10px] font-bold tracking-[0.4em] text-amber-400 uppercase md:text-xs">
                                Mulai Langkah Pertamamu
                            </h3>
                            <h2 className="mb-8 font-sans text-3xl leading-tight font-extrabold tracking-tighter text-white uppercase md:text-5xl">
                                Ready to Shape Your <br /> Future?
                            </h2>
                            <p className="mx-auto mb-12 max-w-2xl font-serif text-base leading-relaxed text-white/80 italic md:text-lg">
                                Bergabung bersama ribuan mahasiswa aktif lainnya. Kembangkan potensi, temukan passion, dan jadilah pemimpin masa depan Universitas PGRI Madiun.
                            </p>

                            <div className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
                                {isAuthenticated ? (
                                    <Link
                                        href={getDashboardPath()}
                                        className="inline-flex w-full items-center justify-center rounded-none bg-amber-400 px-10 py-5 font-sans text-xs font-bold tracking-widest text-[#002855] uppercase shadow-xl transition-colors hover:bg-amber-300 sm:w-auto"
                                    >
                                        Masuk ke Dashboard &rarr;
                                    </Link>
                                ) : (
                                    <>
                                        {canRegister && (
                                            <Link
                                                href="/register"
                                                className="inline-flex w-full items-center justify-center bg-amber-400 px-10 py-5 font-sans text-xs font-bold tracking-widest text-[#002855] uppercase shadow-lg transition-colors hover:bg-amber-300 sm:w-auto"
                                            >
                                                Daftar Sekarang
                                            </Link>
                                        )}
                                        <Link
                                            href="/login"
                                            className="inline-flex w-full items-center justify-center border-2 border-white/30 bg-transparent px-10 py-5 font-sans text-xs font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-[#002855] sm:w-auto"
                                        >
                                            Log In Portal
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Comprehensive Footer */}
            <footer className="mt-auto w-full bg-[#001f42] px-8 pt-16 pb-12 text-white lg:px-16">
                <div className="mx-auto max-w-[1400px]">
                    <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-4">
                        <div className="md:col-span-2">
                            <div className="mb-6 font-sans text-2xl font-extrabold tracking-tighter uppercase">
                                UNIVERSITAS PGRI <br /> MADIUN
                            </div>
                            <p className="max-w-md font-serif text-sm leading-relaxed text-white/50 italic">
                                Pusat informasi dan portal manajemen administrasi Unit Kegiatan Mahasiswa. Mewadahi aspirasi dan bakat secara terstruktur untuk generasi penerus bangsa.
                            </p>
                        </div>

                        <div className="font-sans">
                            <h4 className="mb-6 text-[10px] font-bold tracking-[0.3em] text-amber-400 uppercase">Explore</h4>
                            <ul className="space-y-3 text-xs font-bold tracking-widest text-white/70 uppercase">
                                <li><a href="#" className="transition-colors hover:text-white">Semua UKM</a></li>
                                <li><a href="#" className="transition-colors hover:text-white">Panduan Mahasiswa</a></li>
                                <li><a href="#" className="transition-colors hover:text-white">Jadwal Orientasi</a></li>
                                <li><a href="#" className="transition-colors hover:text-white">FAQ Administrasi</a></li>
                            </ul>
                        </div>

                        <div className="font-sans">
                            <h4 className="mb-6 text-[10px] font-bold tracking-[0.3em] text-amber-400 uppercase">Login Area</h4>
                            <ul className="space-y-3 text-xs font-bold tracking-widest text-white/70 uppercase">
                                <li><Link href="/login" className="transition-colors hover:text-white">Admin Portal</Link></li>
                                <li><Link href="/login" className="transition-colors hover:text-white">Pengurus Inti</Link></li>
                                <li><Link href="/login" className="transition-colors hover:text-white">Anggota Terdaftar</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 font-sans text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase md:flex-row">
                        <p>&copy; {new Date().getFullYear()} Universitas PGRI Madiun. All rights reserved.</p>
                        <div className="flex gap-8">
                            <a href="#" className="transition-colors hover:text-white">Privacy Policy</a>
                            <a href="#" className="transition-colors hover:text-white">Legal Notice</a>
                            <a href="#" className="transition-colors hover:text-white">Campus Map</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
