"use client";

import { Create, useForm } from "@refinedev/antd";
import { Form } from "antd";
import {useCallback} from "react";
import dayjs from "dayjs";
import {Alert} from "@app/alerts/types";
import ChatForm from "@components/forms/chat";

export default function ChatCreate() {
  const { form, formProps, saveButtonProps, onFinish } = useForm<Alert>({});

  const handleFinish = useCallback(async (value: any) => {
    await onFinish({
      ...value,
      alertTime: dayjs(value.alertTime).format('HH:mm:ss.SSS'),
    });
  }, [onFinish]);

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} form={form} onFinish={handleFinish} layout="vertical">
        <ChatForm form={form} />
      </Form>
    </Create>
  );
}
