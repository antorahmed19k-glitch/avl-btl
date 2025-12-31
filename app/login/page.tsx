
import AuthClient from '@/components/Auth';
import { getSession } from '../actions';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect('/');

  return <AuthClient />;
}
