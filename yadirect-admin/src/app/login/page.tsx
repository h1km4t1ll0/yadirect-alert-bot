import { AuthPage } from '@components/auth-page';
import { ThemedTitleV2 } from '@components/layout/title';
import { authProviderServer } from '@providers/auth-provider';

import { redirect } from 'next/navigation';

export default async function Login() {
  const data = await getData();

  if (data.authenticated) {
    redirect(data?.redirectTo || '/');
  }

  return (
    <AuthPage
      type='login'
      title={<ThemedTitleV2 collapsed={false} width={200} height={40} />}
    />
  );
}

async function getData() {
  const { authenticated, redirectTo, error } = await authProviderServer.check();

  return {
    authenticated,
    redirectTo,
    error,
  };
}
