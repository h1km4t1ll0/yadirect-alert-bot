"use client";

import { Edit, useForm } from "@refinedev/antd";
import { Form } from "antd";
import React, { useMemo } from "react";
import { Project } from "@app/projects/types";
import ProjectForm from "@components/forms/project";
import { projectQuery } from "@app/projects/query";

export default function ProjectEdit() {
  const { form, formProps, query, saveButtonProps } = useForm<Project>({
    meta: projectQuery,
  });

  const initialValues = useMemo(() => {
    if (
      !formProps.initialValues
    ) {
      return formProps.initialValues;
    }

    const yandexDirectAccounts = formProps.initialValues?.yandexDirectAccounts?.map(
      (item: { id: number }) => {
        return item.id;
      }
    ) ?? [];

    const alerts = formProps.initialValues?.alerts?.map(
      (item: { id: number }) => {
        return item.id;
      }
    ) ?? [];

    return {
      ...formProps.initialValues,
      alerts,
      yandexDirectAccounts,
    };
  }, [formProps.initialValues]);

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={query?.isLoading}>
      <Form
        {...formProps}
        initialValues={initialValues}
        form={form}
        layout="vertical"
      >
        <ProjectForm />
      </Form>
    </Edit>
  );
}
