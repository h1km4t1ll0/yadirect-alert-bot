"use client";

import { Create, useForm } from "@refinedev/antd";
import { Form } from "antd";
import {Alert} from "@app/alerts/types";
import YandexDirectAccountForm from "@components/forms/yandex-direct-account";

export default function YandexDirectAccountCreate() {
  const { formProps, saveButtonProps } = useForm<Alert>({});

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <YandexDirectAccountForm />
      </Form>
    </Create>
  );
}
