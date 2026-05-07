export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'pengurus' | 'anggota';
  nim?: string;
  jurusan?: string;
  angkatan?: string;
  no_hp?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface Organisasi {
  id: number;
  name: string;
  category: string;
  ketua: string;
  visi: string;
  misi: string;
  deskripsi?: string;
  logo?: string;
  kontak?: string;
  status: 'aktif' | 'nonaktif';
  anggota_aktif_count?: number;
  kegiatans?: Kegiatan[];
  pengumumans?: Pengumuman[];
  created_at: string;
  updated_at: string;
}

export interface Kegiatan {
  id: number;
  judul: string;
  deskripsi: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  lokasi: string;
  status: 'draft' | 'published' | 'selesai';
  organisasi?: { id: number; name: string };
  creator?: { id: number; name: string };
  created_at: string;
  updated_at: string;
}

export interface Pengumuman {
  id: number;
  judul: string;
  konten: string;
  is_pinned: boolean;
  organisasi?: { id: number; name: string } | null;
  creator?: { id: number; name: string };
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalAdmin: number;
  totalPengurus: number;
  totalAnggota: number;
  totalOrganisasi: number;
  organisasiAktif: number;
  totalKegiatan: number;
  kegiatanBulanIni: number;
  totalPengumuman: number;
  pendaftarBaru: number;
}

export * from './ui';
export * from './navigation';
export * from './auth';
