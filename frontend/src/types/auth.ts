export type User = {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'pengurus' | 'anggota';
    avatar?: string;
    nim?: string;
    jurusan?: string;
    angkatan?: string;
    no_hp?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};

export type Flash = {
    success?: string;
    error?: string;
};
