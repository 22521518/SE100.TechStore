import { TPermission } from 'src/types/permission.type';

export const OrderPermissionsList: TPermission[] = [
  {
    permission_name: 'order-create',
    description: 'Create order',
  },
  {
    permission_name: 'order-read',
    description: 'Read order',
  },
  {
    permission_name: 'order-update',
    description: 'Update order',
  },
  {
    permission_name: 'order-delete',
    description: 'Delete order',
  },
];
