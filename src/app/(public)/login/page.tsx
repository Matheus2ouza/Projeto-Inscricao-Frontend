import { LoginForm } from '@/features/auth/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login • Sistema de Inscrição',
};

export default function LoginPage() {
  return <LoginForm />;
}
