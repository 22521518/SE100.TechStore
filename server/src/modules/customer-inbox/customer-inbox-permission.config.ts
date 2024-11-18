import { TPermission } from 'src/types/permission.type';

export const CustomerInboxPermissionsList: TPermission[] = [
  {
    permission_name: 'customer-inbox-create',
    description: 'Create customer-inbox',
  },
  {
    permission_name: 'customer-inbox-read',
    description: 'Read customer-inbox',
  },
  {
    permission_name: 'customer-inbox-update',
    description: 'Update customer-inbox',
  },
  {
    permission_name: 'customer-inbox-delete',
    description: 'Delete customer-inbox',
  },
];
