"use client";

import { DeleteButton, EditButton, List, ShowButton, useTable, } from "@refinedev/antd";
import { Popover, Space, Table, Typography } from "antd";
import { YandexDirectAccount } from "@app/yandex-direct-account/types";
import {Project, User} from "@app/projects/types";
import Link from "next/link";
import type {BaseRecord} from "@refinedev/core";
import {projectQuery} from "@app/projects/query";
import {Alert} from "@app/alerts/types";

export default function ProjectList() {
  const {tableProps} = useTable<Project[]>({
    syncWithLocation: true,
    sorters: {
      initial: [
        {
          field: 'id',
          order: 'desc',
        },
      ],
    },
    filters: {
      permanent: [],
    },
    meta: projectQuery,
  });

  return (
    <List>
      <Table
        {...tableProps} rowKey="id"
        scroll={{ x: 'max-content' }}
      >
        <Table.Column dataIndex="id" title={"ID"} fixed="left"/>
        <Table.Column dataIndex="name" title={"Название проекта"} fixed="left"/>
        <Table.Column
          dataIndex="alerts" title={"Уведомления"}
          render={(value, record, index) => (
            <Space direction="vertical">
              {value.map((each: Alert) => (
                <Popover
                  title={<Typography.Title level={5}>Информация об уведомлении</Typography.Title>}
                  content={
                    <Space direction="vertical">
                      <Space>
                        <Typography.Text strong>Время уведомления:</Typography.Text><Typography.Text>{each.alertTime}</Typography.Text>
                      </Space>
                    </Space>
                  }
                  key={each.id}
                >
                  <Link
                    href={`/alerts/show/${each.id}`}
                    target='_blank'
                  >
                    {each.alertTime}
                  </Link>
                </Popover>))}
            </Space>)
          }
        />
        <Table.Column
          dataIndex="yandexDirectAccounts" title={"Аккаунты Яндекс.Директ"}
          render={(value, record, index) => (
            <Space direction="vertical">
              {value.map((each: YandexDirectAccount) => (
                <Popover
                  title={<Typography.Title level={5}>Информация об аккаунте</Typography.Title>}
                  content={
                    <Space direction="vertical">
                      <Space>
                        <Typography.Text strong>Название аккаунта:</Typography.Text><Typography.Text>{each?.name}</Typography.Text>
                      </Space>
                      <Space>
                        <Typography.Text strong>ID аккаунта:</Typography.Text><Typography.Text>{each.id}</Typography.Text>
                      </Space>
                    </Space>
                  }
                  key={each.id}
                >
                  <Link
                    href={`/yandex-direct-account/show/${each.id}`}
                    target='_blank'
                  >
                    {each?.name ?? 'Название аккаунта не задано'}
                  </Link>
                </Popover>
              ))}
            </Space>
          )}
        />
        <Table.Column
          dataIndex="owner" title={"Владелец проекта"}
          render={(owner: User) => {
            if (!owner) {
              return '-';
            }
            return (
              <Popover
                title={<Typography.Title level={5}>Информация о пользователе</Typography.Title>}
                content={
                  <Space direction="vertical">
                    <Space>
                      <Typography.Text strong>Имя пользователя:</Typography.Text>
                      <Typography.Text>{owner?.username}</Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Email:</Typography.Text>
                      <Typography.Text>{owner?.email}</Typography.Text>
                    </Space>
                    <Space>
                      <Typography.Text strong>Роли:</Typography.Text>
                      <Typography.Text>{owner?.role.join(', ')}</Typography.Text>
                    </Space>
                  </Space>
                }
                trigger="hover"
                placement="right"
              >
                <Typography.Text style={{ color: '#1890ff', cursor: 'pointer' }}>
                  {owner?.username}
                </Typography.Text>
              </Popover>
            );
          }}
        />

        <Table.Column
          title={"Действия"}
          dataIndex="actions"
          fixed="right"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id}/>
              <ShowButton hideText size="small" recordItemId={record.id}/>
              <DeleteButton hideText size="small" recordItemId={record.id}/>
            </Space>
          )}
        />
      </Table>
    </List>
  );
}
