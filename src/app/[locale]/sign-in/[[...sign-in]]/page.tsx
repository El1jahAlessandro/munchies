'use client';
import { SignUp } from '@clerk/nextjs';
import { pages } from '@/lib/utils/routes';
import { useCurrentLocale } from '@/locales/client';

export default function RegisterPage() {
    const locale = useCurrentLocale();
    return <SignUp signInUrl={`/${locale}/${pages.login}`} />;
}
