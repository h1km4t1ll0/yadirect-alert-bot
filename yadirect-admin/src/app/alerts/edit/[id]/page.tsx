'use client';

import React, { useCallback, useMemo } from 'react';
import { Form } from 'antd';

import { Edit, useForm } from '@refinedev/antd';

import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import dayjs from 'dayjs';

import AlertForm from "@components/forms/alert";
import {Alert} from "@app/alerts/types";
import {alertQuery} from "@app/alerts/query";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(advancedFormat);

const AlertEdit = () => {
  const { form, formProps, query, saveButtonProps, onFinish } = useForm<Alert>({
    meta: alertQuery,
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

    const projects = formProps.initialValues.projects.map(
      (item: { id: number }) => {
        return item.id;
      }
    );

    const chats = formProps.initialValues.chats.map(
      (item: { id: number }) => {
        return item.id;
      }
    );

    const alertTime = dayjs(formProps.initialValues.alertTime, 'HH:mm:ss');

    return {
      ...formProps.initialValues,
      alertTime,
      projects,
      chats,
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
        <AlertForm />
      </Form>
    </Edit>
  );
};

export default AlertEdit;
