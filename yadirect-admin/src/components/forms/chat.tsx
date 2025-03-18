import {Button, Card, Col, Form, FormInstance, Input, Row, Space} from "antd";

import CustomSelect from "@components/custom/custom-select";
import {CSSProperties, FC, useCallback} from "react";
import axios from "axios";
import {API_URL} from "@utility/constants";
import {useNotification} from "@refinedev/core";

const s: { [key: string]: CSSProperties } = {
  row: {
    marginBottom: 16,
    display: 'flex',
  },
  card: {
    height: '100%',
  },
};

const ChatForm: FC<{ form: FormInstance }> = ({form}) => {
  form.getFieldsValue()

  const {open} = useNotification();

  const sendTestMessage = useCallback(
    async () => {
      const response = await axios.get(`${API_URL}/api/sync-with-google?chatId=${form.getFieldValue('chatId') ?? null}`);

      if (open) {
        if (response.status == 200) {
          open({
            type: "success",
            message: response.data.message
          })
        } else {
          open({
            type: "error",
            message: response.data.message
          })
        }
      }
    },
    [form]
  );

  return (
    <Space direction='vertical' size={5} style={{width: '100%'}}>
      <Row gutter={32} style={s.row}>
        <Col md={12} xs={24}>
          <Card style={s.card} title="">
            <Form.Item
              name="name"
              label="Название чата"
              rules={[{required: true, message: "Введите название чата"}]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              name="chatId"
              label="ID чата в телеграм"
              rules={[{required: true, message: "Введите ID чата в телеграм"}]}
            >
              <Input/>
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
      <Button type="primary" onClick={sendTestMessage}>
        Проверить
      </Button>
    </Space>
  );
};

export default ChatForm;
