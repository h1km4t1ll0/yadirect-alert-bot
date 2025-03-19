'use client';

import { ColorModeContext } from '@contexts/color-mode';
import type { RefineThemedLayoutV2HeaderProps } from '@refinedev/antd';
import { useGetIdentity } from '@refinedev/core';
import { IUser } from '@utility/roles';
import {
  Layout as AntdLayout,
  Col,
  Row,
  Switch,
  Typography,
  theme, Button, Popover, Input, Form, Modal, Space, Divider,
} from 'antd';
import React, {useContext, useMemo, useState} from 'react';
import {axiosInstance} from "@utility/axios-instance";
import {API_URL} from "@utility/constants";

const { Text } = Typography;
const { useToken } = theme;

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
                                                                    sticky,
                                                                  }) => {
  const { token } = useToken();
  const { data: user } = useGetIdentity<IUser>({
    queryOptions: {
      meta: {
        fields: ['id', 'email', 'fullname']
      }
    }}
  );
  console.log(user, 'user')
  const { mode, setMode } = useContext(ColorModeContext);

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '0px 24px',
    height: '64px',
  };

  const userStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '64px',
  };

  if (sticky) {
    headerStyles.position = 'sticky';
    headerStyles.top = 0;
    headerStyles.zIndex = 2;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();


  // Function to open the modal
  const showEditModal = () => {
    form.setFieldsValue(user); // Pre-fill form with user data
    setIsModalOpen(true);
  };

  // Function to handle form submission
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const response = await axiosInstance.put(`${API_URL}/api/users/${user?.id}`, values);
      console.log("Success:", response.data);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };


  const popoverContent = useMemo(() => (
    <div style={{ maxWidth: 350 }}>
      <Row gutter={[2, 4]} align="middle">
        <Col span={11}><Text strong>📧 Почта:</Text></Col>
        <Col span={13}><Text>{user?.email || "-"}</Text></Col>

        <Col span={11}><Text strong>👤 Имя:</Text></Col>
        <Col span={13}><Text>{user?.fullname || "-"}</Text></Col>

        <Col span={11}><Text strong>🏢 Организация:</Text></Col>
        <Col span={13}><Text>{user?.organization?.name || "-"}</Text></Col>
      </Row>

      <Divider style={{ margin: "6px 0" }} />

      <Button type="primary" size="small" block onClick={showEditModal}>
        ✏️ Редактировать
      </Button>
    </div>
  ), [user]);

  return (
    <AntdLayout.Header style={headerStyles}>
      <Row gutter={16}>
        <Col>
          <Switch
            checkedChildren='🌛'
            unCheckedChildren='🔆'
            onChange={() => setMode(mode === 'light' ? 'dark' : 'light')}
            defaultChecked={mode === 'dark'}
          />
        </Col>
        <Popover content={popoverContent} title="Аккаунт" trigger="hover" placement="topRight">
          <Col>
            {(user?.email || user?.role.name) && (
              <div style={userStyles}>
                {user?.email && <Text strong>{user.email}</Text>}
              </div>
              // {user?.avatar && <Avatar src={user?.avatar} alt={user?.name} />}
            )}
          </Col>
        </Popover>
        <Modal
          title="Edit User"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={handleSave}
          okText="Save"
          cancelText="Cancel"
        >
          <Form form={form} layout="vertical">
            <Form.Item name="fullname" label="Имя" rules={[{ required: true, message: 'Имя обязательное поле' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Эл. почта" rules={[{ type: 'email', required: true, message: 'Введите валидную почту' }]}>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Row>
    </AntdLayout.Header>
  );
};
