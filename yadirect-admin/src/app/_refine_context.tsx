"use client";

import { DevtoolsProvider } from "@providers/devtools";
import { useNotificationProvider } from "@refinedev/antd";
import { type I18nProvider, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import React, { type PropsWithChildren } from "react";
import { ColorModeContextProvider } from "@contexts/color-mode";
import { dataProvider } from "@providers/data-provider";
import { useLocale, useTranslations } from "next-intl";
import { setUserLocale } from "@i18n";
import {AntdRegistry} from "@ant-design/nextjs-registry";
import {authProvider} from "@providers/auth-provider/auth-provider";
import {BellOutlined, CommentOutlined, QuestionCircleOutlined, UsergroupAddOutlined} from "@ant-design/icons";
import SupportLogo from "@components/layout/SupportIcon";

type Props = {
  themeMode?: string;
};

export const RefineContext = ({
  themeMode,
  children,
}: PropsWithChildren<Props>) => {
  const t = useTranslations();

  const i18nProvider: I18nProvider = {
    translate: (key: string, options: any) => t(key, options),
    getLocale: useLocale,
    changeLocale: setUserLocale,
  };

  return (
    <RefineKbarProvider>
      <AntdRegistry>
        <ColorModeContextProvider defaultMode={themeMode}>
          <DevtoolsProvider>
            <Refine
              routerProvider={routerProvider}
              authProvider={authProvider}
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider}
              i18nProvider={i18nProvider}
              resources={[
                {
                  name: 'projects',
                  list: '/projects',
                  create: '/projects/create',
                  edit: '/projects/edit/:id',
                  show: '/projects/show/:id',
                  meta: {
                    label: 'Проекты',
                  },
                },
                {
                  name: 'yandex-direct-accounts',
                  list: '/yandex-direct-account',
                  create: '/yandex-direct-account/create',
                  edit: '/yandex-direct-account/edit/:id',
                  show: '/yandex-direct-account/show/:id',
                  meta: {
                    label: 'Аккаунты',
                    icon: <UsergroupAddOutlined />,
                  },
                },
                {
                  name: 'chats',
                  list: '/chats',
                  create: '/chats/create',
                  edit: '/chats/edit/:id',
                  show: '/chats/show/:id',
                  meta: {
                    label: 'Чаты',
                    icon: <CommentOutlined/>,
                  },
                },
                {
                  name: 'alerts',
                  list: '/alerts',
                  create: '/alerts/create',
                  edit: '/alerts/edit/:id',
                  show: '/alerts/show/:id',
                  meta: {
                    label: 'Уведомления',
                    icon: <BellOutlined/>,
                  },
                },
                {
                  name: 'alertsуу',
                  list: '/alertууs',
                  create: '/aleууrts/create',
                  edit: '/alerууts/edit/:id',
                  show: '/alerууts/show/:id',
                  meta: {
                    label: 'Помощь',
                    icon: <QuestionCircleOutlined />,
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: "5dXQNc-LgkBeL-IkhHJz",
                disableTelemetry: true,
              }}
            >
              {children}
              <RefineKbar/>
            </Refine>
          </DevtoolsProvider>
        </ColorModeContextProvider>
      </AntdRegistry>
    </RefineKbarProvider>
  );
};
