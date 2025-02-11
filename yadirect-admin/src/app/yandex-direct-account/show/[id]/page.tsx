"use client";

import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Button, Card, Col, Row, Space, Table, Typography } from "antd";
import { CSSProperties, useState } from "react";
import Link from "next/link";
import { yandexDirectAccountQuery } from "@app/yandex-direct-account/query";
import { YandexDirectAccount } from "@app/yandex-direct-account/types";

const s: { [key: string]: CSSProperties } = {
  row: {
    marginBottom: 16,
    display: 'flex',
  },
  card: {
    height: '100%',
  },
};

export default function YandexDirectAccountShow() {
  const {queryResult} = useShow<YandexDirectAccount>({
    meta: yandexDirectAccountQuery,
  });
  const {data, isLoading} = queryResult;

  const [style, setStyle] = useState<CSSProperties>({
    userSelect: 'none',
    filter: 'blur(8px)',
  });
  const [buttonText, setButtonText] = useState<string>('Показать');

  const record = data?.data;

  return (
    <Show isLoading={isLoading} title={`Аккаунт ${record?.name}`}>
      <Space direction='vertical' size={5} style={{ width: '100%' }}>
        <Row gutter={32}>
          <Col md={12} xs={24}>
            <Card title="Основная информация об аккаунте">
              <Space direction="vertical">
                <Space>
                  <Typography.Text strong>Название аккаунта:</Typography.Text>
                  <Typography.Text>{record?.name ?? 'Имя аккаунта не задано'}</Typography.Text>
                </Space>
                <Space>
                  <Typography.Text strong>Месячный бюджет:</Typography.Text>
                  <Typography.Text>{record?.monthlyBudget}</Typography.Text>
                </Space>
                <Space>
                  <Typography.Text strong>Токен Яндекс.Директ:</Typography.Text>
                  <Space direction="horizontal">
                    <div style={style}>{record?.token ?? 'Токен не задан'}</div>
                    <Button type="primary" size="small" style={{width: 90}} onClick={() => {
                      if (buttonText === 'Показать') {
                        setButtonText('Скрыть');
                        setStyle({
                          filter: 'none',
                        });
                      } else {
                        setButtonText('Показать');
                        setStyle({
                          userSelect: 'none',
                          filter: 'blur(8px)',
                        });
                      }
                    }}>{buttonText}</Button>
                  </Space>
                </Space>
              </Space>
            </Card>
          </Col>
          <Col md={12} xs={24}>
            <Card title="Цели">
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
                dataSource={record?.goals?.map(goal => ({ key: goal.goalId, ...goal }))}
              />
              {record?.goals?.length === 0 && <p>Нет целей для отображения.</p>}
            </Card>
          </Col>
        </Row>
        <Row gutter={32}>
          <Col md={12} xs={24}>
            <Card style={s.card} title='Связанный проект'>
              <Space direction="vertical">
                {record?.project ? (
                  <Link
                    href={`/projects/show/${record?.project.id}`}
                    target='_blank'
                  >
                    {record?.project.name}
                  </Link>
                ) : 'Проект не задан'}
              </Space>
            </Card>
          </Col>
        </Row>
      </Space>
    </Show>
  );
}
