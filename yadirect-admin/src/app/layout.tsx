import {Metadata} from "next";
import {cookies} from "next/headers";
import React, {Suspense} from "react";
import {NextIntlClientProvider} from "next-intl";
import {getLocale, getMessages} from "next-intl/server";

import {AntdRegistry} from "@ant-design/nextjs-registry";
import "@refinedev/antd/dist/reset.css";
import {RefineContext} from "./_refine_context";

export const metadata: Metadata = {
  title: 'WEBGIB',
  description: '',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
                                           children,
                                         }: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");

  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
    <body>
    <Suspense>
      <AntdRegistry>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <RefineContext themeMode={theme?.value}>{children}</RefineContext>
        </NextIntlClientProvider>
      </AntdRegistry>
    </Suspense>
    </body>
    </html>
  );
}
