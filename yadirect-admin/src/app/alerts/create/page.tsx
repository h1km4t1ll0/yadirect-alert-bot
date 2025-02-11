"use client";

import { Create, useForm } from "@refinedev/antd";
import { Form } from "antd";
import AlertForm from "@components/forms/alert";
import {useCallback} from "react";
import dayjs from "dayjs";
import {Alert} from "@app/alerts/types";

export default function AlertCreate() {
  const { formProps, saveButtonProps, onFinish } = useForm<Alert>({});

  const handleFinish = useCallback(async (value: any) => {
    await onFinish({
      ...value,
      alertTime: dayjs(value.alertTime).format('HH:mm:ss.SSS'),
    });
  }, [onFinish]);

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} onFinish={handleFinish} layout="vertical">
        <AlertForm />
      </Form>
    </Create>
  );
}
