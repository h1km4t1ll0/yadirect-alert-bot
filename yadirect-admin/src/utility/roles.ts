export enum Roles {
  Public = 'Public',
  CONTENT_MANAGER_ROLE = 'ContentManager',
  SUPER_CONTENT_MANAGER_ROLE = 'SuperContentManager',
}

export const getRoleName = (role?: Roles): string => {
  switch (role) {
    case Roles.Public:
      return 'Public';
    case Roles.CONTENT_MANAGER_ROLE:
      return 'Content manager';
    case Roles.SUPER_CONTENT_MANAGER_ROLE:
      return 'Super content manager';

    default:
      return '';
  }
};

const set = (...roles: Roles[]) => new Set<Roles | undefined>(roles);

export const RoleFunctions = Object.freeze({
  ManageContent: set(Roles.SUPER_CONTENT_MANAGER_ROLE),
  Managers: set(Roles.CONTENT_MANAGER_ROLE),
  GuestContent: set(Roles.Public),
});

export type IUser = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  fullname: string;
  organization?: {
    name: string;
  };
  role: {
    id: number;
    name: Roles;
  };
};
