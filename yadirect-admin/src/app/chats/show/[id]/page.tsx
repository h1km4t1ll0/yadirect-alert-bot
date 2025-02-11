"use client";

import {Show} from "@refinedev/antd";
import {useShow} from "@refinedev/core";
import {Card, Col, Popover, Row, Space, Typography} from "antd";
import {CSSProperties} from "react";
import dayjs from "dayjs";
import {Chat} from "@app/chats/types";
import Link from "next/link";
import {chatQuery} from "@app/chats/query";
import {Alert} from "@app/alerts/types";

const s: { [key: string]: CSSProperties } = {
  row: {
    marginBottom: 16,
    display: 'flex',
  },
  card: {
    height: '100%',
  },
};

export default function ChatShow() {
  const {queryResult} = useShow<Chat>({
    meta: chatQuery,
  });
  const {data, isLoading} = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading} title={`Чат #${record?.chatId}`}>
      <Space direction='vertical' size={5} style={{width: '100%'}}>
        <Row gutter={32} style={s.row}>
          <Col md={12} xs={24}>
            <Card style={s.card} title='Общая информация'>
              <div>
                <Space>
                  <Typography.Text strong>Название чата:</Typography.Text>
                  <Typography.Text>
                    {record?.name ?? '-'}
                  </Typography.Text>
                </Space>
              </div>
              <div>
                <Space>
                  <Typography.Text strong>ID чата в телеграм:</Typography.Text>
                  <Typography.Text>
                    {record?.chatId ?? '-'}
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
            <Card style={s.card} title='Связанные уведомления'>
              <Space direction="vertical">
                {record?.alerts.map((each: Alert) => (
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
                  </Popover>)) ?? '-'}
              </Space>
            </Card>
          </Col>
        </Row>
      </Space>
    </Show>
  );
}
