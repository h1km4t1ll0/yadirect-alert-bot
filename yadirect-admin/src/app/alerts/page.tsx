"use client";

import {
  DeleteButton,
  EditButton,
  FilterDropdown,
  getDefaultSortOrder,
  List,
  ShowButton,
  useSelect,
  useTable,
} from "@refinedev/antd";
import {type BaseRecord, getDefaultFilter} from "@refinedev/core";
import {Popover, Select, Space, Table, Typography} from "antd";
import {Alert} from "@app/alerts/types";
import {alertQuery} from "@app/alerts/query";
import Link from 'next/link';
import {Chat} from "@app/chats/types";
import {Project} from "@app/projects/types";
import dayjs from "dayjs";

export default function AlertList() {
  const { tableProps, filters, sorters } = useTable<Alert[]>({
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

  const { selectProps: projectSelectProps } =
    useSelect({
      optionLabel: "name",
      optionValue: "id",
      resource: 'projects',
      meta: {
        fields: ['id', 'name']
      }
      // TODO: фильтровать по организации
      // filters: [
      //
      // ],
    });

  const { selectProps: chatSelectProps } =
    useSelect({
      optionLabel: "name",
      optionValue: "id",
      resource: 'chats',
      meta: {
        fields: ['id', 'name']
      }
      // TODO: фильтровать по организации
      // filters: [
      //
      // ],
    });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="id"
          title="ID"
          fixed="left"
          sorter
          defaultSortOrder={getDefaultSortOrder('id', sorters)}
        />
        <Table.Column
          dataIndex="createdAt"
          title={"Дата создания"}
          sorter={{ multiple: 4 }}
          defaultSortOrder={getDefaultSortOrder('createdAt', sorters)}
          render={(value) => dayjs(value).format('DD.MM.YYYY HH:MM')}
        />
        <Table.Column
          dataIndex="alertTime"
          title={"Время уведомления"}
          sorter={{ multiple: 1 }}
          defaultSortOrder={getDefaultSortOrder('name', sorters)}
        />
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
          defaultFilteredValue={
            getDefaultFilter('project', filters, 'in')
          }
          filterDropdown={(props) => (
            <FilterDropdown
              {...props}
              mapValue={(key) => {
                if (key === undefined) return []
                return key;
              }}
            >
              <Select
                {...projectSelectProps}
                mode="multiple"
                style={{ width: "200px" }}
                placeholder="Выберите проект"
              />
            </FilterDropdown>
          )}
        />
        <Table.Column
          dataIndex="chats" title={"Чаты"}
          render={(value) => (
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
          defaultFilteredValue={
            getDefaultFilter('chats', filters, 'in')
          }
          filterDropdown={(props) => (
            <FilterDropdown
              {...props}
              mapValue={(key) => {
                if (key === undefined) return []
                return key;
              }}
            >
              <Select
                {...chatSelectProps}
                mode="multiple"
                style={{ width: "200px" }}
                placeholder="Выберите чат"
              />
            </FilterDropdown>
          )}
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
