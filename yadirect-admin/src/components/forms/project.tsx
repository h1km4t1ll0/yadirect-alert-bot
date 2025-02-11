import {Card, Col, Form, Input, Row, Space} from "antd";

import CustomSelect from "@components/custom/custom-select";
import {CSSProperties} from "react";

const s: { [key: string]: CSSProperties } = {
  row: {
    marginBottom: 16,
    display: 'flex',
  },
  card: {
    height: '100%'
  },
};

const ProjectForm = () => {
  return (
    <Space direction='vertical' size={5} style={{width: '100%'}}>
      <Row gutter={32} style={s.row}>
        <Col md={12} xs={24}>
          <Card style={s.card} title="">
            <Form.Item
              name="name"
              label="Название проекта"
              rules={[{ required: true, message: "Введите название проекта" }]}
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
            <CustomSelect
              label="Аккаунты Яндекс.Директ"
              name="yandexDirectAccounts"
              mode="multiple"
              resource="yandex-direct-accounts"
              optionLabel="name"
            />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default ProjectForm;
