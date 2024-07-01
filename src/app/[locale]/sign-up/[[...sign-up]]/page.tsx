'use client';
import { SignIn } from '@clerk/nextjs';
import { useCurrentLocale } from '@/locales/client';
import { pages } from '@/lib/utils/routes';

export default function LoginPage() {
    const locale = useCurrentLocale();
    return <SignIn signUpUrl={`/${locale}/${pages.register}`} forceRedirectUrl={`/${locale}/${pages.home}`} />;
}
