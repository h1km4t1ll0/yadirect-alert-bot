"use client";

import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import {Card, Col, Popover, Row, Space, Typography} from "antd";
import {projectQuery} from "@app/projects/query";
import {Project} from "@app/projects/types";
import {Alert} from "@app/alerts/types";
import Link from "next/link";
import {YandexDirectAccount} from "@app/yandex-direct-account/types";

export default function ProjectShow() {
  const {queryResult} = useShow<Project>({
    meta: projectQuery,
  });

  const {data, isLoading} = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading} title={`Аккаунт ${record?.name}`}>
      <Space direction='vertical' size={5} style={{ width: '100%' }}>
      <Row gutter={32}>
        <Col md={12} xs={24}>
          <Card title="">
            <Typography.Title level={5}>Название проекта</Typography.Title>
            <Typography.Text>{record?.name ?? 'Название проекта не задано'}</Typography.Text>
          </Card>
        </Col>
        <Col md={12} xs={24}>
          <Card title="Связанные сущности">
            <Space direction="vertical">
              <Space>
                <Typography.Text strong >Уведомления</Typography.Text>
                <Typography.Text>{record?.alerts?.length && record?.alerts?.length > 0 ? <Space direction="vertical">
                  {record.alerts.map((each: Alert) => (
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
                </Space> : 'Нет уведомлений'}</Typography.Text>
              </Space>
              <Space>
                <Typography.Text strong>Аккаунты Яндекс.Директ</Typography.Text>
                <Typography.Text>{record?.yandexDirectAccounts?.length && record?.yandexDirectAccounts?.length > 0 ? <Space direction="vertical">
                  {record.yandexDirectAccounts.map((each: YandexDirectAccount) => (
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
                </Space> : 'Нет аккаунтов'}</Typography.Text>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
    </Show>
  );
}
