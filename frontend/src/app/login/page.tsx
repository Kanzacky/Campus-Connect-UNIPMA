'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [apiError, setApiError] = useState('');

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setErrors({});
        setApiError('');
        setProcessing(true);

        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (err: unknown) {
            const errorObj = err as { data?: { message?: string, errors?: Record<string, string[]> } };
            if (errorObj?.data?.errors) {
                const validationErrors: Record<string, string> = {};
                for (const key in errorObj.data.errors) {
                    validationErrors[key] = errorObj.data.errors[key][0];
                }
                setErrors(validationErrors);
            } else {
                setApiError(errorObj?.data?.message || 'Email atau password salah.');
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
                            <span className="sr-only">Log in to your account</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">Log in to your account</h1>
                            <p className="text-center text-sm text-muted-foreground">
                                Enter your email and password below to log in
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
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={remember}
                                    onCheckedChange={(checked) => setRemember(checked === true)}
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember">Remember me</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing && <Spinner />}
                                Log in
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Don't have an account?{' '}
                            <Link href="/register" className="underline underline-offset-4 hover:text-primary" tabIndex={5}>
                                Sign up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
