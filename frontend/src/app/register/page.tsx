'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';

export default function RegisterPage() {
    const router = useRouter();
    const { refreshUser } = useAuth();
    
    const [data, setData] = useState({
        name: '',
        email: '',
        role: 'anggota',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [apiError, setApiError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setApiError('');

        try {
            const res = await authApi.register(data);

            if (res.success && res.data) {
                // Set token
                localStorage.setItem('token', res.data.token);
                await refreshUser();
                router.push('/dashboard');
            }
        } catch (err: unknown) {
            const errorObj = err as { data?: { message?: string, errors?: Record<string, string[]> } };
            if (errorObj?.data?.errors) {
                const validationErrors: Record<string, string> = {};
                for (const key in errorObj.data.errors) {
                    validationErrors[key] = errorObj.data.errors[key][0];
                }
                setErrors(validationErrors);
            } else {
                setApiError(errorObj?.data?.message || 'Terjadi kesalahan saat pendaftaran.');
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10 font-sans">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link href="/" className="flex flex-col items-center gap-2 font-medium">
                            <div className="mb-1 flex items-center justify-center rounded-md">
                                <img
                                    src="/rmvunipma.png"
                                    alt="UNIPMA Logo"
                                    className="h-16 w-16 object-contain"
                                />
                            </div>
                            <span className="sr-only">Create an account</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">Create an account</h1>
                            <p className="text-center text-sm text-muted-foreground">
                                Enter your details below to create your account
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="flex flex-col gap-6">
                        <div className="grid gap-6">
                            {apiError && (
                                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                                    {apiError}
                                </div>
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={data.name}
                                    onChange={handleChange}
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    placeholder="Full name"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={data.email}
                                    onChange={handleChange}
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="role">Role / Jabatan</Label>
                                <Select 
                                    name="role" 
                                    onValueChange={(val) => setData({...data, role: val})}
                                    defaultValue={data.role}
                                >
                                    <SelectTrigger id="role" tabIndex={3}>
                                        <SelectValue placeholder="Pilih Peran Anda" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin Aplikasi</SelectItem>
                                        <SelectItem value="pengurus">Pengurus UKM</SelectItem>
                                        <SelectItem value="anggota">Anggota UKM</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.role} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    value={data.password}
                                    onChange={handleChange}
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm password
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={handleChange}
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    placeholder="Confirm password"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={6}
                                disabled={processing}
                            >
                                {processing && <Spinner />}
                                Create account
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link href="/login" className="underline underline-offset-4 hover:text-primary" tabIndex={7}>
                                Log in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
