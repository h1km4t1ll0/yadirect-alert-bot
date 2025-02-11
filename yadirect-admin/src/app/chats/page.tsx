"use client";

import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import {Popover, Space, Table, Typography} from "antd";
import {Alert} from "@app/alerts/types";
import Link from "next/link";
import {chatQuery} from "@app/chats/query";

export default function ChatList() {
  const { tableProps } = useTable<Alert[]>({
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
    meta: chatQuery,
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"}/>
        <Table.Column dataIndex="name" title={"Название чата"}/>
        <Table.Column dataIndex="chatId" title={"ID чата в телеграм"}/>
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
