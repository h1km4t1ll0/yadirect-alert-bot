'use client';

import React, { useCallback, useMemo } from 'react';
import { Form } from 'antd';

import { Edit, useForm } from '@refinedev/antd';

import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import dayjs from 'dayjs';

import {Alert} from "@app/alerts/types";
import YandexDirectAccountForm from "@components/forms/yandex-direct-account";
import {yandexDirectAccountQuery} from "@app/yandex-direct-account/query";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(advancedFormat);

const YandexDirectAccountEdit = () => {
  const { form, formProps, query, saveButtonProps, onFinish } = useForm<Alert>({
    meta: yandexDirectAccountQuery,
  });

  const handleFinish = useCallback(async (value: any) => {
    await onFinish({
      ...value,
      alertTime: dayjs(value.alertTime).format('HH:mm:ss.SSS'),
    });
  }, [onFinish]);

  const initialValues = useMemo(() => {
    if (
      !formProps.initialValues
    ) {
      return formProps.initialValues;
    }

    return {
      ...formProps.initialValues,
      project: formProps.initialValues.project?.id ?? null,
    };
  }, [formProps.initialValues]);

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={query?.isLoading}>
      <Form
        {...formProps}
        initialValues={initialValues}
        onFinish={handleFinish}
        form={form}
        layout="vertical"
      >
        <YandexDirectAccountForm />
      </Form>
    </Edit>
  );
};

export default YandexDirectAccountEdit;
