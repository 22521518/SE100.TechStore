import { AuthPage } from '@components/auth-page';
import LoginPage from '@components/auth-page/login-page';
import { authProviderServer } from '@providers/auth-provider';
import { redirect } from 'next/navigation';

export default async function Login() {
  const data = await getData();

  if (data.authenticated) {
    redirect(data?.redirectTo || '/');
  }

  // return <AuthPage type="login" />;
  return <LoginPage />;
}

async function getData() {
  const { authenticated, redirectTo, error } = await authProviderServer.check();

  return {
    authenticated,
    redirectTo,
    error
  };
}
