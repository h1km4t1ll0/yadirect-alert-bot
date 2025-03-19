import { Button, Card, Col, Collapse, CollapseProps, Form, Input, InputNumber, Row, Space } from "antd";

import CustomSelect from "@components/custom/custom-select";
import { CSSProperties, useCallback } from "react";
import { UpOutlined } from "@ant-design/icons";

const s: { [key: string]: CSSProperties } = {
  row: {
    marginBottom: 16,
    display: 'flex',
  },
  card: {
    height: '100%',
  },
  upOutlinedStyle: {
    color: '#aa2ef3',
  },
  downOutlinedStyles: {
    color: '#aa2ef3',
  },
  collapseStyles: {
    backgroundColor: 'transparent',
    border: `1px solid #aa2ef3`,
    marginBottom: 36,
  },
};

const collapseItems: CollapseProps['items'] = [
  {
    id: '1',
    label: (<p style={{ color: '#aa2ef3', textAlign: 'start', height: 10, marginBottom: 0 }}>Инструкция по получению токена</p>),
    children: (
      <div style={{ fontSize: '16px', color: '#333' }}>
        <ol>
          <li>
            <strong>Перейдите по ссылке</strong>
            <p>
              Нажмите на следующую <a
              href="https://oauth.yandex.ru/authorize?response_type=token&client_id=c95760dfb277445395cb14d33d33ca31"
              target="_blank" style={{color: '#aa2ef3'}}>ссылку</a> для перехода на страницу авторизации Яндекса.
            </p>
            <p>После перехода откроется страница, на которой будет предложено авторизоваться в Яндексе.</p>
          </li>
          <li>
            <strong>Получите токен</strong>
            <p>
              После успешной авторизации вы будете перенаправлены на страницу, где вам будет
              показан <strong>токен</strong>.
            </p>
            <p>
              Скопируйте этот токен и вставьте в поле выше.
            </p>
          </li>
        </ol>
        <p style={{color: '#aa2ef3'}}>
          Если возникнут вопросы или трудности, обратитесь к службе поддержки.
        </p>
      </div>
    )
  },
];

const YandexDirectAccountForm = () => {

  const expandIconHandler: CollapseProps['expandIcon'] = useCallback(({ isActive }: { isActive?: boolean }) => (
    <UpOutlined style={s.upOutlinedStyle} rotate={isActive ? 0 : 180} />
  ), []);

  return (
    <Space direction='vertical' size={5} style={{width: '100%'}}>
      <Row gutter={32} style={s.row}>
        <Col md={12} xs={24}>
          <Card style={s.card} title="Основная информация об аккаунте">
            <Form.Item
              name="name"
              label="Название аккаунта"
              rules={[{required: true, message: "Введите название аккаунта"}]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              name="token"
              label="Токен Яндекс.Директ"
              rules={[{required: true, message: "Введите токен Яндекс.Директ"}]}
            >
              <Input/>
            </Form.Item>
            <Collapse
              style={s.collapseStyles}
              expandIconPosition="end"
              ghost
              items={collapseItems}
              expandIcon={expandIconHandler}
            />
            <Form.Item
              name="monthlyBudget"
              label="Месячный бюджет"
              rules={[{required: true, message: "Введите месячный бюджет"}]}
            >
              <InputNumber style={{minWidth: 180}}/>
            </Form.Item>
          </Card>
        </Col>
        <Col md={12} xs={24}>
          <Card style={s.card} title="Цели">
            <Form.List name="goals">
              {(fields, {add, remove}) => (
                <>
                  {fields.map(({key, name, ...restField}) => (
                    <Space key={key} style={{display: 'flex', marginBottom: 8}} align="baseline">
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
              name="project"
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
