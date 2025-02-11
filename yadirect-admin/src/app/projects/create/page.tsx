"use client";

import { Create, useForm } from "@refinedev/antd";
import { Form, } from "antd";
import {Project} from "@app/projects/types";
import ProjectForm from "@components/forms/project";

export default function ProjectCreate() {
  const { formProps, saveButtonProps } = useForm<Project>({});

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <ProjectForm />
      </Form>
    </Create>
  );
}
