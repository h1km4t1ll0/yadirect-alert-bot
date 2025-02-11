"use client";

import {DeleteButton, EditButton, List, ShowButton, useTable,} from "@refinedev/antd";
import {Button, Popover, Space, Table, Typography} from "antd";
import {Goal, YandexDirectAccount} from "@app/yandex-direct-account/types";
import {yandexDirectAccountQuery} from "@app/yandex-direct-account/query";
import {CSSProperties, useState} from "react";
import Link from "next/link";
import type {BaseRecord} from "@refinedev/core";

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
  const {tableProps, filters} = useTable<YandexDirectAccount[]>({
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
    meta: yandexDirectAccountQuery,
  });

  const [style, setStyle] = useState<{[index: number]: CSSProperties}>({});
  const [buttonText, setButtonText] = useState<{[index: number]: string}>({});

  return (
    <List>
      <Table
        {...tableProps} rowKey="id"
        scroll={{ x: 'max-content' }}
      >
        <Table.Column dataIndex="id" title={"ID"} fixed="left"/>
        <Table.Column dataIndex="name" title={"Название аккаунта"} fixed="left"/>
        <Table.Column
          dataIndex="alertBalanceAmount" title={"Порог для уведомления"}
          render={(value, _, __) => {
            if (!value || value == 0) {
              return '0₽'
            }
            return `${formatNumber(value)}₽`
          }}
        />
        <Table.Column
          dataIndex="project" title={"Проект"}
          render={(value, record, index) => {
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
        />
        <Table.Column
          dataIndex="goals" title={"Цели"}
          render={(value: Goal[], record, index) => (
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
        />
        <Table.Column
          dataIndex="monthlyExpenseSumm" title={"Сумма расходов"}
          render={(value, record, _) => {
            if (!record?.monthlyBudget || record.monthlyBudget === 0) {
              return '0₽';
            }

            return `${formatNumber(value)}₽ (${((record.monthlyExpenseSumm / record.monthlyBudget) * 100).toFixed(0)}%)`;
          }}
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
