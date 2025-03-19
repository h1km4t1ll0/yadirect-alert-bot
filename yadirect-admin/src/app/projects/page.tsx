"use client";

import {
  CreateButton,
  DeleteButton,
  EditButton,
  FilterDropdown, getDefaultSortOrder,
  List,
  ShowButton,
  useSelect,
  useTable,
} from "@refinedev/antd";

import {Input, Popover, Select, Space, Table, Typography} from "antd";
import { YandexDirectAccount } from "@app/yandex-direct-account/types";
import {Project} from "@app/projects/types";
import Link from "next/link";
import type {BaseRecord} from "@refinedev/core";
import  {getDefaultFilter} from "@refinedev/core";
import {projectQuery} from "@app/projects/query";
import {Alert} from "@app/alerts/types";
import {SearchOutlined} from "@ant-design/icons";
import {useCallback, useEffect, useState} from "react";
import dayjs from "dayjs";

export default function ProjectList() {
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

  const { selectProps: yadirectAccountSelectProps } =
    useSelect({
      optionLabel: "name",
      optionValue: "id",
      resource: 'yandex-direct-accounts',
      meta: {
        fields: ['id', 'name']
      }
      // TODO: фильтровать по организации
      // filters: [
      //
      // ],
    });

  const {tableProps, setFilters, filters, sorters } = useTable<Project[]>({
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
      initial: [
        {
          field: 'name',
          operator: 'contains',
          value: '',
        },
        {
          field: 'alerts',
          operator: 'in',
          value: [],
        },
      ],
      // TODO: дописать фильтрацию по организации
      permanent: [],
    },
    meta: projectQuery,
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
          { field: "yandexDirectAccounts.name", operator: "contains", value },
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
              Проекты
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
      <Table
        {...tableProps} rowKey="id"
        scroll={{ x: 'max-content' }}
      >
        <Table.Column
          dataIndex="id"
          title={"ID"}
          fixed="left"
          sorter
          defaultSortOrder={getDefaultSortOrder('id', sorters)}
        />
        <Table.Column
          dataIndex="createdAt"
          title={"Дата создания"}
          sorter={{ multiple: 2 }}
          defaultSortOrder={getDefaultSortOrder('createdAt', sorters)}
          render={(value) => dayjs(value).format('DD.MM.YYYY HH:MM')}
        />
        <Table.Column
          dataIndex="name"
          title={"Название проекта"}
          fixed="left"
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
          dataIndex="yandexDirectAccounts" title={"Аккаунты Яндекс.Директ"}
          render={(value) => (
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
          defaultFilteredValue={
            getDefaultFilter('yandexDirectAccounts', filters, 'in')
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
                {...yadirectAccountSelectProps}
                mode="multiple"
                style={{ width: "200px" }}
                placeholder="Выберите аккаунты"
              />
            </FilterDropdown>
          )}
        />
        {/*<Table.Column*/}
        {/*  dataIndex="owner" title={"Владелец проекта"}*/}
        {/*  render={(owner: User) => {*/}
        {/*    if (!owner) {*/}
        {/*      return '-';*/}
        {/*    }*/}
        {/*    return (*/}
        {/*      <Popover*/}
        {/*        title={<Typography.Title level={5}>Информация о пользователе</Typography.Title>}*/}
        {/*        content={*/}
        {/*          <Space direction="vertical">*/}
        {/*            <Space>*/}
        {/*              <Typography.Text strong>Имя пользователя:</Typography.Text>*/}
        {/*              <Typography.Text>{owner?.username}</Typography.Text>*/}
        {/*            </Space>*/}
        {/*            <Space>*/}
        {/*              <Typography.Text strong>Email:</Typography.Text>*/}
        {/*              <Typography.Text>{owner?.email}</Typography.Text>*/}
        {/*            </Space>*/}
        {/*            <Space>*/}
        {/*              <Typography.Text strong>Роли:</Typography.Text>*/}
        {/*              <Typography.Text>{owner?.role.join(', ')}</Typography.Text>*/}
        {/*            </Space>*/}
        {/*          </Space>*/}
        {/*        }*/}
        {/*        trigger="hover"*/}
        {/*        placement="right"*/}
        {/*      >*/}
        {/*        <Typography.Text style={{ color: '#1890ff', cursor: 'pointer' }}>*/}
        {/*          {owner?.username}*/}
        {/*        </Typography.Text>*/}
        {/*      </Popover>*/}
        {/*    );*/}
        {/*  }}*/}
        {/*/>*/}
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
