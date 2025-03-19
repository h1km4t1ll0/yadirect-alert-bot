import {Button, Card, Col, Form, FormInstance, Input, Row, Space, message} from "antd";

import CustomSelect from "@components/custom/custom-select";
import {CSSProperties, FC, useCallback, useState} from "react";
import {API_URL} from "@utility/constants";
import {axiosInstance} from "@utility/axios-instance";

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
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const chatIdData = Form.useWatch('chatId', form);

  const sendTestMessage = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get(`${API_URL}/api/send-test-alert?chatId=${chatIdData}`);

      if (response.data.success) {
        messageApi.success('Уведомление отправлено!', 7);
      } else {
        messageApi.error(`Ошибка при отправке уведомления! ${response.data?.error ?? ''}`, 7);
      }
    } catch (e) {
      console.log(e);
      messageApi.error(`Произошла непредвиденная ошибка при отправке уведомления!`);
    }
    setLoading(false);
  }, [chatIdData]);

  return (
    <Space direction='vertical' size={5} style={{width: '100%'}}>
      {contextHolder}
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
            <Button
              type="primary"
              onClick={sendTestMessage}
              loading={loading}
              disabled={loading || !chatIdData}
            >
              Проверить работу уведомления
            </Button>
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
