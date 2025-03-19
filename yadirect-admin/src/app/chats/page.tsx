"use client";

import {
  CreateButton,
  DeleteButton,
  EditButton, FilterDropdown, getDefaultSortOrder,
  List,
  ShowButton, useSelect,
  useTable,
} from "@refinedev/antd";
import {type BaseRecord, getDefaultFilter} from "@refinedev/core";
import {Input, Popover, Select, Space, Table, Typography} from "antd";
import {Alert} from "@app/alerts/types";
import Link from "next/link";
import {chatQuery} from "@app/chats/query";
import {useCallback, useEffect, useState} from "react";
import {SearchOutlined} from "@ant-design/icons";
import dayjs from "dayjs";

export default function ChatList() {
  const [searchValue, setSearchValue] = useState<string>('');

  const { selectProps: alertSelectProps } =
    useSelect({
      optionLabel: "alertTime",
      optionValue: "id",
      resource: 'alerts',
      meta: {
        fields: ['id', 'alertTime']
      }
      // TODO: фильтровать по организации
      // filters: [
      //
      // ],
    });

  const { tableProps, filters, setFilters, sorters } = useTable<Alert[]>({
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

  useEffect(() => {
    setSearchValue(filters.filter((filter) => filter.operator === 'or')?.[0]?.value?.[0]?.value);
  }, []);

  const onSearch = useCallback((value: string) => {
    if (value) {
      setFilters([{
        operator: 'or',
        value: [
          { field: "name", operator: "contains", value },
          { field: "id", operator: "contains", value },
          { field: "chatId", operator: "contains", value },
        ]
      }, ...filters], "replace");
    } else {
      setFilters(filters.filter((filter) => filter.operator !== 'or'), "replace");
    }
  }, [filters, setFilters]);

  return (
    <List
      headerProps={{
        title: (
          <div style={{display: 'flex', alignItems: 'center'}}>
            <Typography.Title level={4} style={{margin: 0, marginRight: 16}}>
              Чаты
            </Typography.Title>
            <Input.Search
              placeholder="Поиск"
              onSearch={onSearch}
              style={{width: 300}}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              allowClear
              enterButton={<SearchOutlined/>}
            />
          </div>
        ),
        extra: (
          <Space size="middle">
            <CreateButton>Создать</CreateButton>
          </Space>
        ),
      }}
    >
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
          dataIndex="name"
          title={"Название чата"}
          sorter={{ multiple: 1 }}
          defaultSortOrder={getDefaultSortOrder('name', sorters)}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder={'Поиск'} />
            </FilterDropdown>
          )}
          defaultFilteredValue={
            getDefaultFilter('name', filters, 'contains')
          }
        />
        <Table.Column
          dataIndex="chatId"
          title={"ID чата в телеграм"}
          sorter={{ multiple: 2 }}
          defaultSortOrder={getDefaultSortOrder('chatId', sorters)}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder={'Поиск'} />
            </FilterDropdown>
          )}
          defaultFilteredValue={
            getDefaultFilter('chatId', filters, 'contains')
          }
        />
        <Table.Column
          dataIndex="alerts" title={"Уведомления"}
          render={(value) => (
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
          defaultFilteredValue={
            getDefaultFilter('alerts', filters, 'in')
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
                {...alertSelectProps}
                mode="multiple"
                style={{ width: "200px" }}
                placeholder="Выберите уведомление"
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
