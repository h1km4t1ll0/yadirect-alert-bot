"use client";

import {DeleteButton, EditButton, List, ShowButton, useTable,} from "@refinedev/antd";
import {type BaseRecord} from "@refinedev/core";
import {Popover, Space, Table, Typography} from "antd";
import {Alert} from "@app/alerts/types";
import {alertQuery} from "@app/alerts/query";
import Link from 'next/link';
import {Chat} from "@app/chats/types";
import {Project} from "@app/projects/types";

export default function AlertList() {
  const {tableProps, filters} = useTable<Alert[]>({
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
    meta: alertQuery,
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"}/>
        <Table.Column dataIndex="alertTime" title={"Время уведомления"}/>
        <Table.Column
          dataIndex="projects" title={"Проекты"}
          render={(value, record, index) => (
            <Space direction="vertical">
              {value.map((project: Project) => (
                <Link
                  href={`/projects/show/${project.id}`}
                  target='_blank'
                >
                  {project.name}
                </Link>))}
            </Space>)
          }
        />
        <Table.Column
          dataIndex="chats" title={"Чаты"}
          render={(value, record, index) => (
            <Space direction="vertical">
              {value.map((each: Chat) => (
                <Popover
                  title={<Typography.Title level={5}>Информация о чате</Typography.Title>}
                  content={
                    <Space direction="vertical">
                      <Space>
                        <Typography.Text strong>Название
                          чата:</Typography.Text><Typography.Text>{each.name}</Typography.Text>
                      </Space>
                      <Space>
                        <Typography.Text strong>ID
                          чата:</Typography.Text><Typography.Text>{each.chatId}</Typography.Text>
                      </Space>
                    </Space>
                  }
                  key={each.id}
                >
                  <Link
                    href={`/chats/show/${each.id}`}
                    target='_blank'
                  >
                    {each.name}
                  </Link>
                </Popover>))}
            </Space>)
          }
        />
        <Table.Column
          title={"Действия"}
          dataIndex="actions"
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
