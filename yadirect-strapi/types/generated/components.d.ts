import type { Schema, Attribute } from '@strapi/strapi';

export interface YadirectComponentsGoal extends Schema.Component {
  collectionName: 'components_yadirect_components_goals';
  info: {
    displayName: 'Goal';
  };
  attributes: {
    name: Attribute.String;
    goalId: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'yadirect-components.goal': YadirectComponentsGoal;
    }
  }
}
