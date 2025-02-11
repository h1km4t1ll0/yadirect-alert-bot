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
  theme,
} from 'antd';
import React, { useContext } from 'react';

const { Text } = Typography;
const { useToken } = theme;

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
                                                                    sticky,
                                                                  }) => {
  const { token } = useToken();
  const { data: user } = useGetIdentity<IUser>();
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
        <Col>
          {(user?.email || user?.role.name) && (
            <div style={userStyles}>
              {user?.email && <Text strong>{user.email}</Text>}
              {user?.role && (
                <Text style={{ fontSize: '12px' }} strong>
                  ({user.role.name})
                </Text>
              )}
            </div>
            // {user?.avatar && <Avatar src={user?.avatar} alt={user?.name} />}
          )}
        </Col>
      </Row>
    </AntdLayout.Header>
  );
};
