"use client";

import {Show} from "@refinedev/antd";
import {useShow} from "@refinedev/core";
import {Card, Col, Popover, Row, Space, Typography} from "antd";
import {alertQuery} from "@app/alerts/query";
import {Alert} from "@app/alerts/types";
import {CSSProperties} from "react";
import dayjs from "dayjs";
import {Chat} from "@app/chats/types";
import Link from "next/link";
import {Project} from "@app/projects/types";

const s: { [key: string]: CSSProperties } = {
  row: {
    marginBottom: 16,
    display: 'flex',
  },
  card: {
    height: '100%',
  },
};

export default function AlertShow() {
  const {queryResult} = useShow<Alert>({
    meta: alertQuery,
  });
  const {data, isLoading} = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading} title={`Уведомление #${record?.id}`}>
      <Space direction='vertical' size={5} style={{width: '100%'}}>
        <Row gutter={32} style={s.row}>
          <Col md={12} xs={24}>
            <Card style={s.card} title='Общая информация'>
              <div>
                <Space>
                  <Typography.Text strong>Время уведомления:</Typography.Text>
                  <Typography.Text>
                    {record?.alertTime ?? '-'}
                  </Typography.Text>
                </Space>
              </div>
              <div>
                <Space>
                  <Typography.Text strong>Время создания:</Typography.Text>
                  <Typography.Text>
                    {record?.createdAt
                      ? dayjs(record?.createdAt).format('DD/MM/YYYY HH:MM')
                      : '-'}
                  </Typography.Text>
                </Space>
              </div>
            </Card>
          </Col>
          <Col md={12} xs={24}>
            <Card style={s.card} title='Связанные чаты'>
              <div>
                <Space direction="vertical">
                  {record?.chats.map((each: Chat) => (
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
                    </Popover>)) ?? '-'}
                </Space>
              </div>
            </Card>
          </Col>
        </Row>
        <Row gutter={32} style={s.row}>
          <Col md={12} xs={24}>
            <Card style={s.card} title='Связанные проекты'>
              <Space direction="vertical">
                {record?.projects.map((project: Project) => (
                  <Link
                    href={`/projects/show/${project.id}`}
                    target='_blank'
                  >
                    {project.name}
                  </Link>))}
              </Space>
            </Card>
          </Col>
        </Row>
      </Space>
    </Show>
  );
}
