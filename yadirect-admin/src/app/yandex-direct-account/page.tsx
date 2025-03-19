"use client";

import {
  CreateButton,
  DeleteButton,
  EditButton, FilterDropdown,
  getDefaultSortOrder,
  List,
  ShowButton, useSelect,
  useTable,
} from "@refinedev/antd";
import {Button, Input, InputNumber, Popover, Select, Space, Table, Typography} from "antd";
import {Goal, YandexDirectAccount} from "@app/yandex-direct-account/types";
import {yandexDirectAccountQuery} from "@app/yandex-direct-account/query";
import {CSSProperties, useCallback, useEffect, useState} from "react";
import Link from "next/link";
import {BaseRecord, getDefaultFilter} from "@refinedev/core";
import {SearchOutlined} from "@ant-design/icons";
import dayjs from "dayjs";

function formatNumber(number: number, delimiter: string = ' ') {
  let numberStr = Math.floor(number).toString();
  let reversedNumberStr = numberStr.split('').reverse().join('');
  let parts = [];
  for (let i = 0; i < reversedNumberStr.length; i += 3) {
    parts.push(reversedNumberStr.slice(i, i + 3));
  }
  return parts.join(delimiter).split('').reverse().join('');
}

export default function YandexDirectAccountList() {
  const [style, setStyle] = useState<{[index: number]: CSSProperties}>({});
  const [buttonText, setButtonText] = useState<{[index: number]: string}>({});
  const [searchValue, setSearchValue] = useState<string>('');

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

  const {tableProps, filters, setFilters, sorters} = useTable<YandexDirectAccount[]>({
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
    meta: yandexDirectAccountQuery,
  });

  const onSearch = useCallback((value: string) => {
    if (value) {
      setFilters([{
        operator: 'or',
        value: [
          { field: "name", operator: "contains", value },
          { field: "id", operator: "contains", value },
          { field: "project.name", operator: "contains", value },
          { field: "goals.name", operator: "contains", value },
        ]
      }, ...filters], "replace");
    } else {
      setFilters(filters.filter((filter) => filter.operator !== 'or'), "replace");
    }
  }, [filters, setFilters]);

  useEffect(() => {
    setSearchValue(filters.filter((filter) => filter.operator === 'or')?.[0]?.value?.[0]?.value);
  }, []);

  return (
    <List
      headerProps={{
        title: (
          <div style={{display: 'flex', alignItems: 'center'}}>
            <Typography.Title level={4} style={{margin: 0, marginRight: 16}}>
              Аккаунты Яндекс.Директ
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
          sorter={{ multiple: 4 }}
          defaultSortOrder={getDefaultSortOrder('createdAt', sorters)}
          render={(value) => dayjs(value).format('DD.MM.YYYY HH:MM')}
        />
        <Table.Column
          title={"Название аккаунта"}
          dataIndex="name"
          fixed="left"
          sorter={{ multiple: 5 }}
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
          dataIndex="alertBalanceAmount" title={"Порог для уведомления"}
          render={(value, _, __) => {
            if (!value || value == 0) {
              return '0₽'
            }
            return `${formatNumber(value)}₽`
          }}
          sorter={{ multiple: 3 }}
          defaultSortOrder={getDefaultSortOrder('alertBalanceAmount', sorters)}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <InputNumber style={{width: 180}} placeholder={'Поиск'} />
            </FilterDropdown>
          )}
          defaultFilteredValue={
            getDefaultFilter('alertBalanceAmount', filters, 'eq')
          }
        />
        <Table.Column
          dataIndex="project" title={"Проект"}
          render={(value) => {
            if (value) {
              return (
                <Link
                  href={`/projects/show/${value.id}`}
                  target='_blank'
                >
                  {value.name}
                </Link>
              );
            }
            return '-';
          }}
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
          dataIndex="goals"
          title={"Цели"}
          render={(value: Goal[]) => (
            <Popover
              content={
                <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                  <Table
                    pagination={false}
                    columns={[
                      {
                        title: 'Название цели',
                        dataIndex: 'name',
                        key: 'name',
                        render: (text: string) => <Typography.Text>{text}</Typography.Text>,
                      },
                      {
                        title: 'ID цели',
                        dataIndex: 'goalId',
                        key: 'goalId',
                        render: (text: string) => <Typography.Text>{text}</Typography.Text>,
                      },
                    ]}
                    dataSource={value.map(goal => ({ key: goal.goalId, ...goal }))}
                  />
                </div>
              }
              title="Список целей"
              trigger="click"
              placement="bottom"
            >
              <a href="#" style={{ color: '#1890ff', cursor: 'pointer' }}>Посмотреть</a>
            </Popover>
          )}
        />
        <Table.Column
          dataIndex="monthlyBudget" title={"Месячный бюджет"}
          render={(value, _, __) => {
            if (!value || value == 0) {
              return '0₽'
            }
            return `${formatNumber(value)}₽`
          }}
          sorter={{ multiple: 2 }}
          defaultSortOrder={getDefaultSortOrder('monthlyBudget', sorters)}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <InputNumber style={{width: 180}} placeholder={'Поиск'} />
            </FilterDropdown>
          )}
          defaultFilteredValue={
            getDefaultFilter('monthlyBudget', filters, 'eq')
          }
        />
        <Table.Column
          dataIndex="monthlyExpenseSumm" title={"Сумма расходов"}
          render={(value, record, _) => {
            if (!record?.monthlyBudget || record.monthlyBudget === 0) {
              return '0₽';
            }

            return `${formatNumber(value)}₽ (${((record.monthlyExpenseSumm / record.monthlyBudget) * 100).toFixed(0)}%)`;
          }}
          sorter={{ multiple: 1 }}
          defaultSortOrder={getDefaultSortOrder('monthlyExpenseSumm', sorters)}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <InputNumber style={{width: 180}} placeholder={'Поиск'} />
            </FilterDropdown>
          )}
          defaultFilteredValue={
            getDefaultFilter('monthlyExpenseSumm', filters, 'eq')
          }
        />
        <Table.Column
          dataIndex="token" title={"Токен Яндекс.Директ"}
          render={(value, record, index) => {
            if (!buttonText[index]) {
              setButtonText({...buttonText, [index]: 'Показать'});
              setStyle({
                ...style,
                [index]: {
                  userSelect: 'none',
                  filter: 'blur(8px)',
                }
              });
            }
            return (
              <Space direction="horizontal">
                <div style={style[index]}>{value}</div>
                <Button type="primary" style={{width: 90}} onClick={() => {
                  if (buttonText[index] === 'Показать') {
                    setButtonText({...buttonText, [index]: 'Скрыть'});
                    setStyle({
                      ...style,
                      [index]: {
                        filter: 'none',
                      }
                    });
                  } else {
                    setButtonText({...buttonText, [index]: 'Показать'});
                    setStyle({
                      ...style,
                      [index]: {
                        userSelect: 'none',
                        filter: 'blur(8px)',
                      }
                    });
                  }
                }}>{buttonText[index]}</Button>
              </Space>
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
