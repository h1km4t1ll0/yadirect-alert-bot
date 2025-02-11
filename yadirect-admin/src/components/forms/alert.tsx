import {Card, Col, Form, Row, Space, TimePicker} from "antd";

import CustomSelect from "@components/custom/custom-select";
import dayjs from "dayjs";
import {CSSProperties} from "react";
const format = 'HH:mm';

const s: { [key: string]: CSSProperties } = {
  row: {
    marginBottom: 16,
    display: 'flex',
  },
  card: {
    height: '100%',
  },
};

const AlertForm = () => {
  return (
    <Space direction='vertical' size={5} style={{width: '100%'}}>
      <Row gutter={32} style={s.row}>
        <Col md={12} xs={24}>
          <Card style={s.card} title="">
            <Form.Item
              name="alertTime"
              label="Время уведомления"
              rules={[{ required: true, message: "Введите время уведомления" }]}
            >
              <TimePicker minuteStep={5} defaultValue={dayjs('00:00', format)} format={format} />
            </Form.Item>
          </Card>
        </Col>
        <Col md={12} xs={24}>
          <Card style={s.card} title="Связанные сущности">
            <CustomSelect
              label="Проекты"
              name="projects"
              mode="multiple"
              resource="projects"
              optionLabel="name"
            />

            <CustomSelect
              label="Чаты"
              name="chats"
              mode="multiple"
              resource="chats"
              optionLabel="name"
            />
          </Card>
        </Col>

      </Row>
    </Space>
  );
};

export default AlertForm;
