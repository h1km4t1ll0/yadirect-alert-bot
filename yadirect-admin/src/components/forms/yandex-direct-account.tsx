import {Button, Card, Col, Form, Input, InputNumber, Row, Space} from "antd";

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

const YandexDirectAccountForm = () => {
  return (
    <Space direction='vertical' size={5} style={{width: '100%'}}>
      <Row gutter={32} style={s.row}>
        <Col md={12} xs={24}>
          <Card style={s.card} title="Основная информация об аккаунте">
            <Form.Item
              name="name"
              label="Название аккаунта"
              rules={[{ required: true, message: "Введите название аккаунта" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="token"
              label="Токен Яндекс.Директ"
              rules={[{ required: true, message: "Введите токен Яндекс.Директ" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="monthlyBudget"
              label="Месячный бюджет"
              rules={[{ required: true, message: "Введите месячный бюджет" }]}
            >
              <InputNumber style={{minWidth: 180}}/>
            </Form.Item>
          </Card>
        </Col>
        <Col md={12} xs={24}>
          <Card style={s.card} title="Цели">
            <Form.List name="goals">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        rules={[{ required: true, message: 'Необходимо ввести имя цели' }]}
                        style={{ flex: 1 }}
                      >
                        <Input placeholder="Имя цели" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'goalId']}
                        rules={[{ required: true, message: 'Необходимо ввести ID цели' }]}
                        style={{ flex: 1 }}
                      >
                        <Input placeholder="ID цели" />
                      </Form.Item>
                      <Button type="link" onClick={() => remove(name)}>
                        Удалить
                      </Button>
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block>
                      Добавить цель
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>
        </Col>
      </Row>
      <Row gutter={32} style={s.row}>
        <Col md={12} xs={24}>
          <Card style={s.card} title="Проект">
            <CustomSelect
              label="Проект"
              name="projects"
              resource="projects"
              optionLabel="name"
            />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default YandexDirectAccountForm;
