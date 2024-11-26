import { TPermission } from 'src/types/permission.type';

export const CustomerPermissionsList: TPermission[] = [
  {
    permission_name: 'customer-create',
    description: 'Create customer',
  },
  {
    permission_name: 'customer-read',
    description: 'Read customer',
  },
  {
    permission_name: 'customer-update',
    description: 'Update customer',
  },
  {
    permission_name: 'customer-delete',
    description: 'Delete customer',
  },
];
