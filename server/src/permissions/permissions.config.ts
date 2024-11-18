import { TPermission } from 'src/types/permission.type';
import { AccountPermissionsList } from '../modules/accounts/account-permission.config';
import { AddressPermissionsList } from '../modules/addresses/address-permision.config';
import { CartPermissionsList } from '../modules/carts/cart-permission.config';
import { CategoryPermissionsList } from '../modules/categories/category-permission.config';
import { CustomerInboxPermissionsList } from '../modules/customer-inbox/customer-inbox-permission.config';
import { CustomerPermissionsList } from '../modules/customers/customer-permission.config';
import { ProductPermissionsList } from '../modules/products/product-permission.config';
import { RolePermissionsList } from '../modules/roles/role-permission.config';
import { ShipPermissionsList } from '../modules/ships/ship-permission.config';
import { StaffPermissionsList } from '../modules/staff/staff-permission.config';
import { SupplierPermissionsList } from '../modules/supplier/supplier-permission.config';
import { VoucherPermissionsList } from '../modules/vouchers/voucher-permission.config';
import { FeedbackPermissionsList } from '../modules/feedback/feedback-permission.config';
import { OrderPermissionsList } from '../modules/orders/order-permission.config';
import { ImportationPermissionsList } from '../modules/importations/importation-permission.config';
import { InboxPermissionsList } from '../modules/inbox/inbox-permission.config';

export const PermissionsList: TPermission[] = [
  ...AccountPermissionsList,
  ...AddressPermissionsList,
  ...CartPermissionsList,
  ...CategoryPermissionsList,
  ...CustomerInboxPermissionsList,
  ...CustomerPermissionsList,
  ...FeedbackPermissionsList,
  ...ImportationPermissionsList,
  ...InboxPermissionsList,
  ...OrderPermissionsList,
  ...ProductPermissionsList,
  ...RolePermissionsList,
  ...ShipPermissionsList,
  ...StaffPermissionsList,
  ...SupplierPermissionsList,
  ...VoucherPermissionsList,
  {
    permission_name: 'admin-permision',
    description: 'Admin permission',
  },
];

export const GlobalPermissionsList: TPermission[] = [
  ...[CategoryPermissionsList[1]], // Category read
  ...[FeedbackPermissionsList[1]], // Feedback read
  ...[ProductPermissionsList[1]], // Product read,
  ...[VoucherPermissionsList[1]], // Voucher read
];

export const CustomerDefaultPermissionsList: TPermission[] = [
  ...AddressPermissionsList,
  ...CartPermissionsList,
  ...CustomerPermissionsList,
  ...CustomerInboxPermissionsList,
  ...[
    FeedbackPermissionsList[0], // Feedback create
    FeedbackPermissionsList[2], // Feedback update
  ],
  ...[
    OrderPermissionsList[0], // Order create
    OrderPermissionsList[1], // Order read
    OrderPermissionsList[2], // Order update
  ],
  ...GlobalPermissionsList,
];

export const StaffDefaultPermissionsList: TPermission[] = [
  ...CustomerPermissionsList,
  ...ProductPermissionsList,
  ...OrderPermissionsList,
  ...CategoryPermissionsList,
  ...VoucherPermissionsList,
  ...InboxPermissionsList,
];

export const AdminPermissionsList: TPermission[] = PermissionsList;
