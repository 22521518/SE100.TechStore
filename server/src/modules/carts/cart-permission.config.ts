import { TPermission } from 'src/types/permission.type';

export const CartPermissionsList: TPermission[] = [
  {
    permission_name: 'cart-create',
    description: 'Create cart',
  },
  {
    permission_name: 'cart-read',
    description: 'Read cart',
  },
  {
    permission_name: 'cart-update',
    description: 'Update cart',
  },
  {
    permission_name: 'cart-delete',
    description: 'Delete cart',
  },
];
