import { TPermission } from 'src/types/permission.type';

export const ProductPermissionsList: TPermission[] = [
  {
    permission_name: 'product-create',
    description: 'Create product',
  },
  {
    permission_name: 'product-read',
    description: 'Read product',
  },
  {
    permission_name: 'product-update',
    description: 'Update product',
  },
  {
    permission_name: 'product-delete',
    description: 'Delete product',
  },
];
