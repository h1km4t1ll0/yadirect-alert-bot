import { Card, Col, Form, Input, Row, Space } from "antd";

import CustomSelect from "@components/custom/custom-select";
import {CSSProperties} from "react";

const s: { [key: string]: CSSProperties } = {
  row: {
    marginBottom: 16,
    display: 'flex',
  },
  card: {
    height: '100%',
  },
};

const ChatForm = () => {
  return (
    <Space direction='vertical' size={5} style={{width: '100%'}}>
      <Row gutter={32} style={s.row}>
        <Col md={12} xs={24}>
          <Card style={s.card} title="">
            <Form.Item
              name="name"
              label="Название чата"
              rules={[{ required: true, message: "Введите название чата" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="chatId"
              label="ID чата в телеграм"
              rules={[{ required: true, message: "Введите ID чата в телеграм" }]}
            >
              <Input />
            </Form.Item>
          </Card>
        </Col>
        <Col md={12} xs={24}>
          <Card style={s.card} title="Связанные сущности">
            <CustomSelect
              label="Уведомления"
              name="alerts"
              mode="multiple"
              resource="alerts"
              optionLabel="alertTime"
            />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default ChatForm;
